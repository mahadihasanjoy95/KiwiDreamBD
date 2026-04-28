package com.kiwi.dream.plan.service.serviceImpl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kiwi.dream.auth.entity.User;
import com.kiwi.dream.auth.repository.UserRepository;
import com.kiwi.dream.plan.dto.request.*;
import com.kiwi.dream.plan.dto.response.*;
import com.kiwi.dream.plan.entity.*;
import com.kiwi.dream.plan.enums.PlanAccessRole;
import com.kiwi.dream.plan.enums.PlanStatus;
import com.kiwi.dream.plan.exception.DuplicatePlanException;
import com.kiwi.dream.plan.exception.PlanItemNotFoundException;
import com.kiwi.dream.plan.exception.PlanNotFoundException;
import com.kiwi.dream.plan.exception.PlanOwnershipException;
import com.kiwi.dream.plan.mapper.PlanMapper;
import com.kiwi.dream.plan.repository.*;
import com.kiwi.dream.plan.service.UserPlanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserPlanServiceImpl implements UserPlanService {

    private final PlanRepository planRepository;
    private final PlanUserRepository planUserRepository;
    private final MonthlyLivingItemRepository monthlyItemRepository;
    private final MovingCostItemRepository movingItemRepository;
    private final ChecklistItemRepository checklistItemRepository;
    private final LivingFundRepository livingFundRepository;
    private final PlanArchiveRepository planArchiveRepository;
    private final UserRepository userRepository;
    private final PlanMapper planMapper;
    private final MasterPlanServiceImpl masterPlanService; // reuses affordability engine
    private final ObjectMapper objectMapper;

    // ── Plan-level ────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<PlanSummaryResponseDto> listMyPlans(String userId, String status) {
        List<String> planIds = planUserRepository.findPlanIdsByUserId(userId);
        if (planIds.isEmpty()) return List.of();

        // Load all user plans in a single IN query — avoids N per-plan findByIdAndDeletedFalse calls
        List<Plan> plans = planRepository.findAllById(planIds).stream()
                .filter(p -> !p.isDeleted() && !p.isMasterPlan())
                .filter(p -> status == null
                        || (p.getStatus() != null && p.getStatus().name().equalsIgnoreCase(status)))
                .toList();

        // Delegate to batch builder — 4 queries total for any number of plans
        return masterPlanService.buildSummariesBatch(plans);
    }

    @Override
    @Transactional(readOnly = true)
    public PlanResponseDto getMyPlan(String userId, String planId) {
        Plan plan = loadAndVerifyOwnership(planId, userId);
        return masterPlanService.buildFullResponse(plan);
    }

    @Override
    @Transactional(readOnly = true)
    public PlanResponseDto getPlanByCombo(String userId, String cityId, String planningProfileId) {
        return planRepository.findActiveUserPlanByCombo(userId, cityId, planningProfileId)
                .map(masterPlanService::buildFullResponse)
                .orElse(null);
    }

    @Override
    @Transactional
    public PlanResponseDto createFromMaster(String userId, CreateUserPlanFromMasterRequestDto dto) {
        // Load master plan — must be published
        Plan master = planRepository.findByIdAndDeletedFalse(dto.masterPlanId())
                .filter(p -> p.isMasterPlan() && p.isPublished())
                .orElseThrow(() -> new PlanNotFoundException(dto.masterPlanId()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Prevent duplicate: same user + same city + same profile
        planRepository.findActiveUserPlanByCombo(userId, master.getCity().getId(), master.getPlanningProfile().getId())
                .ifPresent(existing -> {
                    throw new DuplicatePlanException(
                            master.getCity().getNameEn(),
                            master.getPlanningProfile().getNameEn());
                });

        // 1. Create new user plan
        Plan userPlan = new Plan();
        userPlan.setCountry(master.getCountry());
        userPlan.setCity(master.getCity());
        userPlan.setPlanningProfile(master.getPlanningProfile());
        userPlan.setDisplayPlanName(
                (dto.displayPlanName() != null && !dto.displayPlanName().isBlank())
                        ? dto.displayPlanName()
                        : master.getDisplayPlanName());
        userPlan.setMasterPlan(false);
        userPlan.setPublished(false);
        userPlan.setStatus(PlanStatus.ACTIVE);
        userPlan.setOverviewEn(master.getOverviewEn());
        userPlan.setOverviewBn(master.getOverviewBn());
        userPlan.setDeleted(false);
        userPlan.setMasterPlanId(master.getId()); // plain String — no FK, safe for admin delete
        Plan savedPlan = planRepository.save(userPlan);

        // 2. Create plan-user ownership row
        PlanUser planUser = new PlanUser();
        planUser.setPlan(savedPlan);
        planUser.setUser(user);
        planUser.setAccessRole(PlanAccessRole.OWNER);
        planUserRepository.save(planUser);

        // 3. Deep-copy monthly items
        List<MonthlyLivingItem> masterMonthly = monthlyItemRepository.findByPlanIdOrderByDisplayOrderAsc(master.getId());
        List<MonthlyLivingItem> copiedMonthly = masterMonthly.stream().map(src -> {
            MonthlyLivingItem copy = new MonthlyLivingItem();
            copy.setPlan(savedPlan);
            copy.setCustomName(src.getNameEn());   // user plan uses customName
            copy.setCustomNote(src.getNoteEn());
            copy.setEstimatedAmountNzd(src.getEstimatedAmountNzd());
            copy.setCustom(false);
            copy.setDisplayOrder(src.getDisplayOrder());
            return copy;
        }).toList();
        monthlyItemRepository.saveAll(copiedMonthly);

        // 4. Deep-copy moving cost items
        List<MovingCostItem> masterMoving = movingItemRepository.findByPlanIdOrderByDisplayOrderAsc(master.getId());
        List<MovingCostItem> copiedMoving = masterMoving.stream().map(src -> {
            MovingCostItem copy = new MovingCostItem();
            copy.setPlan(savedPlan);
            copy.setCustomItemName(src.getItemNameEn());
            copy.setCustomNote(src.getNoteEn());
            copy.setEstimatedAmountNzd(src.getEstimatedAmountNzd());
            copy.setCustom(false);
            copy.setDisplayOrder(src.getDisplayOrder());
            return copy;
        }).toList();
        movingItemRepository.saveAll(copiedMoving);

        // 5. Deep-copy checklist items
        List<ChecklistItem> masterChecklist = checklistItemRepository.findByPlanIdOrderByCategoryAscDisplayOrderAsc(master.getId());
        List<ChecklistItem> copiedChecklist = masterChecklist.stream().map(src -> {
            ChecklistItem copy = new ChecklistItem();
            copy.setPlan(savedPlan);
            copy.setCategory(src.getCategory());
            copy.setCustomItemText(src.getItemTextEn());
            copy.setCustomNote(src.getNoteEn());
            copy.setQuantity(src.getQuantity());
            copy.setDone(false);
            copy.setCompletedAt(null);
            copy.setCustom(false);
            copy.setDisplayOrder(src.getDisplayOrder());
            return copy;
        }).toList();
        checklistItemRepository.saveAll(copiedChecklist);

        // 6. Deep-copy living fund
        livingFundRepository.findByPlanId(master.getId()).ifPresent(src -> {
            LivingFund copy = new LivingFund();
            copy.setPlan(savedPlan);
            copy.setMinimumAmountNzd(src.getMinimumAmountNzd());
            copy.setRecommendedAmountNzd(src.getRecommendedAmountNzd());
            copy.setExplanationEn(src.getExplanationEn());
            copy.setExplanationBn(src.getExplanationBn());
            copy.setDisclaimerEn(src.getDisclaimerEn());
            copy.setDisclaimerBn(src.getDisclaimerBn());
            copy.setUserSavedAmountBdt(java.math.BigDecimal.ZERO);
            livingFundRepository.save(copy);
        });

        log.info("User plan created from master {}: newPlanId={}", master.getId(), savedPlan.getId());
        return masterPlanService.buildFullResponse(savedPlan);
    }

    @Override
    @Transactional
    public PlanResponseDto updatePlan(String userId, String planId, UpdatePlanRequestDto dto) {
        Plan plan = loadAndVerifyOwnership(planId, userId);
        if (dto.displayPlanName() != null) plan.setDisplayPlanName(dto.displayPlanName());
        return masterPlanService.buildFullResponse(planRepository.save(plan));
    }

    @Override
    @Transactional
    public void archivePlan(String userId, String planId) {
        Plan plan = loadAndVerifyOwnership(planId, userId);
        User user = userRepository.findById(userId).orElseThrow();

        // Serialize snapshot
        PlanResponseDto snapshot = masterPlanService.buildFullResponse(plan);
        String json;
        try {
            json = objectMapper.writeValueAsString(snapshot);
        } catch (JsonProcessingException ex) {
            log.error("Failed to serialize plan snapshot for archive: {}", ex.getMessage());
            json = "{\"error\":\"snapshot serialization failed\"}";
        }

        PlanArchive archive = new PlanArchive();
        archive.setPlanId(planId);
        archive.setDisplayPlanName(plan.getDisplayPlanName());
        archive.setUser(user);
        archive.setSnapshotJson(json);
        archive.setArchivedAt(Instant.now());
        planArchiveRepository.save(archive);

        plan.setStatus(PlanStatus.ARCHIVED);
        plan.setDeleted(true);
        planRepository.save(plan);
        log.info("Plan archived: {} by user {}", planId, userId);
    }

    @Override
    @Transactional
    public void deletePlan(String userId, String planId) {
        Plan plan = loadAndVerifyOwnership(planId, userId);
        monthlyItemRepository.deleteAllByPlanId(planId);
        movingItemRepository.deleteAllByPlanId(planId);
        checklistItemRepository.deleteAllByPlanId(planId);
        livingFundRepository.deleteByPlanId(planId);
        planUserRepository.deleteByPlanId(planId);
        planRepository.delete(plan);
        log.info("User plan hard-deleted: {} by user {}", planId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlanArchiveResponseDto> listArchives(String userId) {
        return planArchiveRepository.findByUserIdOrderByArchivedAtDesc(userId)
                .stream().map(planMapper::toArchiveDto).toList();
    }

    // ── Monthly items ─────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<MonthlyItemResponseDto> getMonthlyItems(String userId, String planId) {
        loadAndVerifyOwnership(planId, userId);
        return monthlyItemRepository.findByPlanIdOrderByDisplayOrderAsc(planId)
                .stream().map(planMapper::toMonthlyItemDto).toList();
    }

    @Override
    @Transactional
    public MonthlyItemResponseDto addMonthlyItem(String userId, String planId, UpdateMonthlyItemRequestDto dto) {
        Plan plan = loadAndVerifyOwnership(planId, userId);
        MonthlyLivingItem item = new MonthlyLivingItem();
        item.setPlan(plan);
        item.setCustomName(dto.customName() != null ? dto.customName() : dto.nameEn());
        item.setEstimatedAmountNzd(dto.estimatedAmountNzd());
        item.setCustomNote(dto.customNote());
        item.setCustom(true);
        item.setDisplayOrder(dto.displayOrder() != null ? dto.displayOrder() : 0);
        return planMapper.toMonthlyItemDto(monthlyItemRepository.save(item));
    }

    @Override
    @Transactional
    public MonthlyItemResponseDto updateMonthlyItem(String userId, String planId, String itemId, UpdateMonthlyItemRequestDto dto) {
        loadAndVerifyOwnership(planId, userId);
        MonthlyLivingItem item = monthlyItemRepository.findByIdAndPlanId(itemId, planId)
                .orElseThrow(() -> new PlanItemNotFoundException(itemId));
        if (dto.customName() != null)          item.setCustomName(dto.customName());
        if (dto.estimatedAmountNzd() != null)  item.setEstimatedAmountNzd(dto.estimatedAmountNzd());
        if (dto.customNote() != null)          item.setCustomNote(dto.customNote());
        if (dto.displayOrder() != null)        item.setDisplayOrder(dto.displayOrder());
        return planMapper.toMonthlyItemDto(monthlyItemRepository.save(item));
    }

    @Override
    @Transactional
    public void deleteMonthlyItem(String userId, String planId, String itemId) {
        loadAndVerifyOwnership(planId, userId);
        MonthlyLivingItem item = monthlyItemRepository.findByIdAndPlanId(itemId, planId)
                .orElseThrow(() -> new PlanItemNotFoundException(itemId));
        monthlyItemRepository.delete(item);
    }

    // ── Moving cost items ─────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<MovingItemResponseDto> getMovingItems(String userId, String planId) {
        loadAndVerifyOwnership(planId, userId);
        return movingItemRepository.findByPlanIdOrderByDisplayOrderAsc(planId)
                .stream().map(planMapper::toMovingItemDto).toList();
    }

    @Override
    @Transactional
    public MovingItemResponseDto addMovingItem(String userId, String planId, UpdateMovingItemRequestDto dto) {
        Plan plan = loadAndVerifyOwnership(planId, userId);
        MovingCostItem item = new MovingCostItem();
        item.setPlan(plan);
        item.setCustomItemName(dto.customItemName() != null ? dto.customItemName() : dto.itemNameEn());
        item.setEstimatedAmountNzd(dto.estimatedAmountNzd());
        item.setCustomNote(dto.customNote());
        item.setCustom(true);
        item.setDisplayOrder(dto.displayOrder() != null ? dto.displayOrder() : 0);
        return planMapper.toMovingItemDto(movingItemRepository.save(item));
    }

    @Override
    @Transactional
    public MovingItemResponseDto updateMovingItem(String userId, String planId, String itemId, UpdateMovingItemRequestDto dto) {
        loadAndVerifyOwnership(planId, userId);
        MovingCostItem item = movingItemRepository.findByIdAndPlanId(itemId, planId)
                .orElseThrow(() -> new PlanItemNotFoundException(itemId));
        if (dto.customItemName() != null)      item.setCustomItemName(dto.customItemName());
        if (dto.estimatedAmountNzd() != null)  item.setEstimatedAmountNzd(dto.estimatedAmountNzd());
        if (dto.customNote() != null)          item.setCustomNote(dto.customNote());
        if (dto.displayOrder() != null)        item.setDisplayOrder(dto.displayOrder());
        return planMapper.toMovingItemDto(movingItemRepository.save(item));
    }

    @Override
    @Transactional
    public void deleteMovingItem(String userId, String planId, String itemId) {
        loadAndVerifyOwnership(planId, userId);
        MovingCostItem item = movingItemRepository.findByIdAndPlanId(itemId, planId)
                .orElseThrow(() -> new PlanItemNotFoundException(itemId));
        movingItemRepository.delete(item);
    }

    // ── Checklist items ───────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<ChecklistItemResponseDto> getChecklistItems(String userId, String planId) {
        loadAndVerifyOwnership(planId, userId);
        return checklistItemRepository.findByPlanIdOrderByCategoryAscDisplayOrderAsc(planId)
                .stream().map(planMapper::toChecklistItemDto).toList();
    }

    @Override
    @Transactional
    public ChecklistItemResponseDto addChecklistItem(String userId, String planId, UpdateChecklistItemRequestDto dto) {
        Plan plan = loadAndVerifyOwnership(planId, userId);
        ChecklistItem item = new ChecklistItem();
        item.setPlan(plan);
        item.setCategory(dto.category() != null ? dto.category() : com.kiwi.dream.plan.enums.ChecklistCategory.CUSTOM);
        item.setCustomItemText(dto.customItemText() != null ? dto.customItemText() : dto.itemTextEn());
        item.setCustomNote(dto.customNote());
        item.setQuantity(dto.quantity() != null ? dto.quantity() : 1);
        item.setCustom(true);
        item.setDisplayOrder(dto.displayOrder() != null ? dto.displayOrder() : 0);
        return planMapper.toChecklistItemDto(checklistItemRepository.save(item));
    }

    @Override
    @Transactional
    public ChecklistItemResponseDto updateChecklistItem(String userId, String planId, String itemId, UpdateChecklistItemRequestDto dto) {
        loadAndVerifyOwnership(planId, userId);
        ChecklistItem item = checklistItemRepository.findByIdAndPlanId(itemId, planId)
                .orElseThrow(() -> new PlanItemNotFoundException(itemId));
        if (dto.category() != null)         item.setCategory(dto.category());
        if (dto.customItemText() != null)   item.setCustomItemText(dto.customItemText());
        if (dto.customNote() != null)       item.setCustomNote(dto.customNote());
        if (dto.quantity() != null)         item.setQuantity(dto.quantity());
        if (dto.displayOrder() != null)     item.setDisplayOrder(dto.displayOrder());
        return planMapper.toChecklistItemDto(checklistItemRepository.save(item));
    }

    @Override
    @Transactional
    public void deleteChecklistItem(String userId, String planId, String itemId) {
        loadAndVerifyOwnership(planId, userId);
        ChecklistItem item = checklistItemRepository.findByIdAndPlanId(itemId, planId)
                .orElseThrow(() -> new PlanItemNotFoundException(itemId));
        checklistItemRepository.delete(item);
    }

    @Override
    @Transactional
    public ChecklistItemResponseDto toggleChecklistItem(String userId, String planId, String itemId) {
        loadAndVerifyOwnership(planId, userId);
        ChecklistItem item = checklistItemRepository.findByIdAndPlanId(itemId, planId)
                .orElseThrow(() -> new PlanItemNotFoundException(itemId));
        item.setDone(!item.isDone());
        item.setCompletedAt(item.isDone() ? Instant.now() : null);
        return planMapper.toChecklistItemDto(checklistItemRepository.save(item));
    }

    // ── Living fund ───────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public LivingFundResponseDto getLivingFund(String userId, String planId) {
        loadAndVerifyOwnership(planId, userId);
        LivingFund fund = livingFundRepository.findByPlanId(planId).orElseGet(LivingFund::new);
        List<MonthlyLivingItem> items = monthlyItemRepository.findByPlanIdOrderByDisplayOrderAsc(planId);
        return masterPlanService.buildLivingFundResponse(fund, items);
    }

    @Override
    @Transactional
    public LivingFundResponseDto upsertLivingFund(String userId, String planId, UpsertLivingFundRequestDto dto) {
        Plan plan = loadAndVerifyOwnership(planId, userId);
        LivingFund fund = livingFundRepository.findByPlanId(planId).orElseGet(() -> {
            LivingFund f = new LivingFund();
            f.setPlan(plan);
            return f;
        });
        // Applicant-only fields on user plans
        if (dto.userSavedAmountBdt() != null)            fund.setUserSavedAmountBdt(dto.userSavedAmountBdt());
        if (dto.userMonthlyContributionBdt() != null)    fund.setUserMonthlyContributionBdt(dto.userMonthlyContributionBdt());
        if (dto.userTargetDate() != null)                fund.setUserTargetDate(dto.userTargetDate());
        if (dto.userNotes() != null)                     fund.setUserNotes(dto.userNotes());
        LivingFund saved = livingFundRepository.save(fund);
        List<MonthlyLivingItem> items = monthlyItemRepository.findByPlanIdOrderByDisplayOrderAsc(planId);
        return masterPlanService.buildLivingFundResponse(saved, items);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private Plan loadAndVerifyOwnership(String planId, String userId) {
        Plan plan = planRepository.findByIdAndDeletedFalse(planId)
                .orElseThrow(() -> new PlanNotFoundException(planId));
        if (!planUserRepository.existsByPlanIdAndUserId(planId, userId)) {
            throw new PlanOwnershipException(planId); // always 403, never 404
        }
        return plan;
    }
}
