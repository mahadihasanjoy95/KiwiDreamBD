package com.kiwi.dream.plan.service.serviceImpl;

import com.kiwi.dream.city.entity.City;
import com.kiwi.dream.city.exception.CityNotFoundException;
import com.kiwi.dream.city.repository.CityRepository;
import com.kiwi.dream.country.entity.Country;
import com.kiwi.dream.country.exception.CountryNotFoundException;
import com.kiwi.dream.country.repository.CountryRepository;
import com.kiwi.dream.exchangerate.service.ExchangeRateService;
import com.kiwi.dream.plan.dto.request.*;
import com.kiwi.dream.plan.dto.response.*;
import com.kiwi.dream.plan.entity.*;
import com.kiwi.dream.plan.enums.AffordabilityStatus;
import com.kiwi.dream.plan.enums.PlanStatus;
import com.kiwi.dream.plan.exception.MasterPlanComboAlreadyExistsException;
import com.kiwi.dream.plan.exception.PlanItemNotFoundException;
import com.kiwi.dream.plan.exception.PlanNotFoundException;
import com.kiwi.dream.plan.mapper.PlanMapper;
import com.kiwi.dream.plan.repository.*;
import com.kiwi.dream.plan.service.MasterPlanService;
import com.kiwi.dream.profile.entity.PlanningProfile;
import com.kiwi.dream.profile.exception.PlanningProfileNotFoundException;
import com.kiwi.dream.profile.repository.PlanningProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MasterPlanServiceImpl implements MasterPlanService {

    private final PlanRepository planRepository;
    private final CountryRepository countryRepository;
    private final CityRepository cityRepository;
    private final PlanningProfileRepository planningProfileRepository;
    private final MonthlyLivingItemRepository monthlyItemRepository;
    private final MovingCostItemRepository movingItemRepository;
    private final ChecklistItemRepository checklistItemRepository;
    private final LivingFundRepository livingFundRepository;
    private final PlanMapper planMapper;
    private final ExchangeRateService exchangeRateService;

    // ── Public ────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<PlanSummaryResponseDto> listPublished() {
        List<Plan> plans = planRepository
                .findByMasterPlanTrueAndPublishedTrueAndDeletedFalseOrderByDisplayPlanNameAsc();
        return buildSummariesBatch(plans);
    }

    @Override
    @Transactional(readOnly = true)
    public PlanResponseDto getById(String planId) {
        Plan plan = planRepository.findByIdAndDeletedFalse(planId)
                .filter(Plan::isMasterPlan)
                .orElseThrow(() -> new PlanNotFoundException(planId));
        return buildFullResponse(plan);
    }

    @Override
    @Transactional(readOnly = true)
    public PlanResponseDto getByCombo(String countryId, String cityId, String planningProfileId) {
        return planRepository
                .findByCountryIdAndCityIdAndPlanningProfileIdAndMasterPlanTrueAndDeletedFalse(
                        countryId, cityId, planningProfileId)
                .filter(Plan::isPublished)
                .map(this::buildFullResponse)
                .orElse(null);
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<PlanSummaryResponseDto> listAll() {
        List<Plan> plans = planRepository
                .findByMasterPlanTrueAndDeletedFalseOrderByDisplayPlanNameAsc();
        return buildSummariesBatch(plans);
    }

    @Override
    @Transactional
    public PlanResponseDto create(CreateMasterPlanRequestDto dto) {
        Country country = countryRepository.findById(dto.countryId())
                .orElseThrow(() -> new CountryNotFoundException(dto.countryId()));
        City city = cityRepository.findById(dto.cityId())
                .orElseThrow(() -> new CityNotFoundException(dto.cityId()));
        PlanningProfile profile = planningProfileRepository.findById(dto.planningProfileId())
                .orElseThrow(() -> new PlanningProfileNotFoundException(dto.planningProfileId()));

        // Enforce uniqueness: one master plan per country+city+profile
        planRepository.findByCountryIdAndCityIdAndPlanningProfileIdAndMasterPlanTrueAndDeletedFalse(
                dto.countryId(), dto.cityId(), dto.planningProfileId())
                .ifPresent(existing -> {
                    throw new MasterPlanComboAlreadyExistsException(city.getCode(), profile.getCode());
                });

        Plan plan = new Plan();
        plan.setCountry(country);
        plan.setCity(city);
        plan.setPlanningProfile(profile);
        plan.setDisplayPlanName(dto.displayPlanName());
        plan.setMasterPlan(true);
        plan.setPublished(false);
        plan.setOverviewEn(dto.overviewEn());
        plan.setOverviewBn(dto.overviewBn());
        plan.setDeleted(false);

        Plan saved = planRepository.save(plan);
        log.info("Master plan created: {} ({})", saved.getDisplayPlanName(), saved.getId());
        return buildFullResponse(saved);
    }

    @Override
    @Transactional
    public PlanResponseDto update(String planId, UpdatePlanRequestDto dto) {
        Plan plan = loadMasterOrThrow(planId);
        if (dto.displayPlanName() != null) plan.setDisplayPlanName(dto.displayPlanName());
        if (dto.overviewEn() != null) plan.setOverviewEn(dto.overviewEn());
        if (dto.overviewBn() != null) plan.setOverviewBn(dto.overviewBn());
        return buildFullResponse(planRepository.save(plan));
    }

    @Override
    @Transactional
    public PlanResponseDto publish(String planId) {
        Plan plan = loadMasterOrThrow(planId);
        plan.setPublished(true);
        return buildFullResponse(planRepository.save(plan));
    }

    @Override
    @Transactional
    public PlanResponseDto unpublish(String planId) {
        Plan plan = loadMasterOrThrow(planId);
        plan.setPublished(false);
        return buildFullResponse(planRepository.save(plan));
    }

    @Override
    @Transactional
    public void delete(String planId) {
        Plan plan = loadMasterOrThrow(planId);
        monthlyItemRepository.deleteAllByPlanId(planId);
        movingItemRepository.deleteAllByPlanId(planId);
        checklistItemRepository.deleteAllByPlanId(planId);
        livingFundRepository.deleteByPlanId(planId);
        planRepository.delete(plan);
        log.info("Master plan hard-deleted: {}", planId);
    }

    // ── Monthly items ─────────────────────────────────────────────────────────

    @Override
    @Transactional
    public MonthlyItemResponseDto addMonthlyItem(String planId, CreateMonthlyItemRequestDto dto) {
        Plan plan = loadMasterOrThrow(planId);
        MonthlyLivingItem item = new MonthlyLivingItem();
        item.setPlan(plan);
        item.setNameEn(dto.nameEn());
        item.setNameBn(dto.nameBn());
        item.setEstimatedAmountNzd(dto.estimatedAmountNzd());
        item.setNoteEn(dto.noteEn());
        item.setNoteBn(dto.noteBn());
        item.setDisplayOrder(dto.displayOrder() != null ? dto.displayOrder() : 0);
        return planMapper.toMonthlyItemDto(monthlyItemRepository.save(item));
    }

    @Override
    @Transactional
    public MonthlyItemResponseDto updateMonthlyItem(String planId, String itemId, UpdateMonthlyItemRequestDto dto) {
        loadMasterOrThrow(planId);
        MonthlyLivingItem item = monthlyItemRepository.findByIdAndPlanId(itemId, planId)
                .orElseThrow(() -> new PlanItemNotFoundException(itemId));
        if (dto.nameEn() != null)              item.setNameEn(dto.nameEn());
        if (dto.nameBn() != null)              item.setNameBn(dto.nameBn());
        if (dto.estimatedAmountNzd() != null)  item.setEstimatedAmountNzd(dto.estimatedAmountNzd());
        if (dto.noteEn() != null)              item.setNoteEn(dto.noteEn());
        if (dto.noteBn() != null)              item.setNoteBn(dto.noteBn());
        if (dto.displayOrder() != null)        item.setDisplayOrder(dto.displayOrder());
        return planMapper.toMonthlyItemDto(monthlyItemRepository.save(item));
    }

    @Override
    @Transactional
    public void deleteMonthlyItem(String planId, String itemId) {
        loadMasterOrThrow(planId);
        MonthlyLivingItem item = monthlyItemRepository.findByIdAndPlanId(itemId, planId)
                .orElseThrow(() -> new PlanItemNotFoundException(itemId));
        monthlyItemRepository.delete(item);
    }

    @Override
    @Transactional
    public List<MonthlyItemResponseDto> bulkReplaceMonthlyItems(String planId, BulkMonthlyItemRequestDto dto) {
        loadMasterOrThrow(planId);
        monthlyItemRepository.deleteAllByPlanId(planId);
        Plan plan = planRepository.findByIdAndDeletedFalse(planId).orElseThrow(() -> new PlanNotFoundException(planId));
        AtomicInteger order = new AtomicInteger(0);
        List<MonthlyLivingItem> items = dto.items().stream().map(d -> {
            MonthlyLivingItem item = new MonthlyLivingItem();
            item.setPlan(plan);
            item.setNameEn(d.nameEn());
            item.setNameBn(d.nameBn());
            item.setEstimatedAmountNzd(d.estimatedAmountNzd());
            item.setNoteEn(d.noteEn());
            item.setNoteBn(d.noteBn());
            item.setDisplayOrder(d.displayOrder() != null ? d.displayOrder() : order.getAndIncrement());
            return item;
        }).toList();
        return monthlyItemRepository.saveAll(items).stream().map(planMapper::toMonthlyItemDto).toList();
    }

    // ── Moving cost items ─────────────────────────────────────────────────────

    @Override
    @Transactional
    public MovingItemResponseDto addMovingItem(String planId, CreateMovingItemRequestDto dto) {
        Plan plan = loadMasterOrThrow(planId);
        MovingCostItem item = new MovingCostItem();
        item.setPlan(plan);
        item.setItemNameEn(dto.itemNameEn());
        item.setItemNameBn(dto.itemNameBn());
        item.setEstimatedAmountNzd(dto.estimatedAmountNzd());
        item.setNoteEn(dto.noteEn());
        item.setNoteBn(dto.noteBn());
        item.setDisplayOrder(dto.displayOrder() != null ? dto.displayOrder() : 0);
        return planMapper.toMovingItemDto(movingItemRepository.save(item));
    }

    @Override
    @Transactional
    public MovingItemResponseDto updateMovingItem(String planId, String itemId, UpdateMovingItemRequestDto dto) {
        loadMasterOrThrow(planId);
        MovingCostItem item = movingItemRepository.findByIdAndPlanId(itemId, planId)
                .orElseThrow(() -> new PlanItemNotFoundException(itemId));
        if (dto.itemNameEn() != null)          item.setItemNameEn(dto.itemNameEn());
        if (dto.itemNameBn() != null)          item.setItemNameBn(dto.itemNameBn());
        if (dto.estimatedAmountNzd() != null)  item.setEstimatedAmountNzd(dto.estimatedAmountNzd());
        if (dto.noteEn() != null)              item.setNoteEn(dto.noteEn());
        if (dto.noteBn() != null)              item.setNoteBn(dto.noteBn());
        if (dto.displayOrder() != null)        item.setDisplayOrder(dto.displayOrder());
        return planMapper.toMovingItemDto(movingItemRepository.save(item));
    }

    @Override
    @Transactional
    public void deleteMovingItem(String planId, String itemId) {
        loadMasterOrThrow(planId);
        MovingCostItem item = movingItemRepository.findByIdAndPlanId(itemId, planId)
                .orElseThrow(() -> new PlanItemNotFoundException(itemId));
        movingItemRepository.delete(item);
    }

    @Override
    @Transactional
    public List<MovingItemResponseDto> bulkReplaceMovingItems(String planId, BulkMovingItemRequestDto dto) {
        loadMasterOrThrow(planId);
        movingItemRepository.deleteAllByPlanId(planId);
        Plan plan = planRepository.findByIdAndDeletedFalse(planId).orElseThrow(() -> new PlanNotFoundException(planId));
        AtomicInteger order = new AtomicInteger(0);
        List<MovingCostItem> items = dto.items().stream().map(d -> {
            MovingCostItem item = new MovingCostItem();
            item.setPlan(plan);
            item.setItemNameEn(d.itemNameEn());
            item.setItemNameBn(d.itemNameBn());
            item.setEstimatedAmountNzd(d.estimatedAmountNzd());
            item.setNoteEn(d.noteEn());
            item.setNoteBn(d.noteBn());
            item.setDisplayOrder(d.displayOrder() != null ? d.displayOrder() : order.getAndIncrement());
            return item;
        }).toList();
        return movingItemRepository.saveAll(items).stream().map(planMapper::toMovingItemDto).toList();
    }

    // ── Checklist items ───────────────────────────────────────────────────────

    @Override
    @Transactional
    public ChecklistItemResponseDto addChecklistItem(String planId, CreateChecklistItemRequestDto dto) {
        Plan plan = loadMasterOrThrow(planId);
        ChecklistItem item = new ChecklistItem();
        item.setPlan(plan);
        item.setCategory(dto.category());
        item.setItemTextEn(dto.itemTextEn());
        item.setItemTextBn(dto.itemTextBn());
        item.setNoteEn(dto.noteEn());
        item.setNoteBn(dto.noteBn());
        item.setQuantity(dto.quantity() != null ? dto.quantity() : 1);
        item.setDisplayOrder(dto.displayOrder() != null ? dto.displayOrder() : 0);
        return planMapper.toChecklistItemDto(checklistItemRepository.save(item));
    }

    @Override
    @Transactional
    public ChecklistItemResponseDto updateChecklistItem(String planId, String itemId, UpdateChecklistItemRequestDto dto) {
        loadMasterOrThrow(planId);
        ChecklistItem item = checklistItemRepository.findByIdAndPlanId(itemId, planId)
                .orElseThrow(() -> new PlanItemNotFoundException(itemId));
        if (dto.category() != null)     item.setCategory(dto.category());
        if (dto.itemTextEn() != null)   item.setItemTextEn(dto.itemTextEn());
        if (dto.itemTextBn() != null)   item.setItemTextBn(dto.itemTextBn());
        if (dto.noteEn() != null)       item.setNoteEn(dto.noteEn());
        if (dto.noteBn() != null)       item.setNoteBn(dto.noteBn());
        if (dto.quantity() != null)     item.setQuantity(dto.quantity());
        if (dto.displayOrder() != null) item.setDisplayOrder(dto.displayOrder());
        return planMapper.toChecklistItemDto(checklistItemRepository.save(item));
    }

    @Override
    @Transactional
    public void deleteChecklistItem(String planId, String itemId) {
        loadMasterOrThrow(planId);
        ChecklistItem item = checklistItemRepository.findByIdAndPlanId(itemId, planId)
                .orElseThrow(() -> new PlanItemNotFoundException(itemId));
        checklistItemRepository.delete(item);
    }

    @Override
    @Transactional
    public List<ChecklistItemResponseDto> bulkReplaceChecklistItems(String planId, BulkChecklistItemRequestDto dto) {
        loadMasterOrThrow(planId);
        checklistItemRepository.deleteAllByPlanId(planId);
        Plan plan = planRepository.findByIdAndDeletedFalse(planId).orElseThrow(() -> new PlanNotFoundException(planId));
        AtomicInteger order = new AtomicInteger(0);
        List<ChecklistItem> items = dto.items().stream().map(d -> {
            ChecklistItem item = new ChecklistItem();
            item.setPlan(plan);
            item.setCategory(d.category());
            item.setItemTextEn(d.itemTextEn());
            item.setItemTextBn(d.itemTextBn());
            item.setNoteEn(d.noteEn());
            item.setNoteBn(d.noteBn());
            item.setQuantity(d.quantity() != null ? d.quantity() : 1);
            item.setDisplayOrder(d.displayOrder() != null ? d.displayOrder() : order.getAndIncrement());
            return item;
        }).toList();
        return checklistItemRepository.saveAll(items).stream().map(planMapper::toChecklistItemDto).toList();
    }

    // ── Living fund ───────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public LivingFundResponseDto getLivingFund(String planId) {
        loadMasterOrThrow(planId);
        LivingFund fund = livingFundRepository.findByPlanId(planId).orElseGet(LivingFund::new);
        List<MonthlyLivingItem> items = monthlyItemRepository.findByPlanIdOrderByDisplayOrderAsc(planId);
        return buildLivingFundResponse(fund, items);
    }

    @Override
    @Transactional
    public LivingFundResponseDto upsertLivingFund(String planId, UpsertLivingFundRequestDto dto) {
        Plan plan = loadMasterOrThrow(planId);
        LivingFund fund = livingFundRepository.findByPlanId(planId).orElseGet(() -> {
            LivingFund f = new LivingFund();
            f.setPlan(plan);
            return f;
        });
        if (dto.minimumAmountNzd() != null)         fund.setMinimumAmountNzd(dto.minimumAmountNzd());
        if (dto.recommendedAmountNzd() != null)     fund.setRecommendedAmountNzd(dto.recommendedAmountNzd());
        if (dto.explanationEn() != null)            fund.setExplanationEn(dto.explanationEn());
        if (dto.explanationBn() != null)            fund.setExplanationBn(dto.explanationBn());
        if (dto.disclaimerEn() != null)             fund.setDisclaimerEn(dto.disclaimerEn());
        if (dto.disclaimerBn() != null)             fund.setDisclaimerBn(dto.disclaimerBn());
        LivingFund saved = livingFundRepository.save(fund);
        List<MonthlyLivingItem> items = monthlyItemRepository.findByPlanIdOrderByDisplayOrderAsc(planId);
        return buildLivingFundResponse(saved, items);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private Plan loadMasterOrThrow(String planId) {
        return planRepository.findByIdAndDeletedFalse(planId)
                .filter(Plan::isMasterPlan)
                .orElseThrow(() -> new PlanNotFoundException(planId));
    }

    PlanResponseDto buildFullResponse(Plan plan) {
        List<MonthlyLivingItem> monthlyItems   = monthlyItemRepository.findByPlanIdOrderByDisplayOrderAsc(plan.getId());
        List<MovingCostItem>    movingItems     = movingItemRepository.findByPlanIdOrderByDisplayOrderAsc(plan.getId());
        List<ChecklistItem>     checklistItems  = checklistItemRepository.findByPlanIdOrderByCategoryAscDisplayOrderAsc(plan.getId());
        LivingFund              fund            = livingFundRepository.findByPlanId(plan.getId()).orElseGet(LivingFund::new);

        BigDecimal monthlyTotal = sum(monthlyItems.stream().map(MonthlyLivingItem::getEstimatedAmountNzd).toList());
        BigDecimal movingTotal  = sum(movingItems.stream().map(MovingCostItem::getEstimatedAmountNzd).toList());
        LivingFundResponseDto fundDto = buildLivingFundResponse(fund, monthlyItems);

        return new PlanResponseDto(
                plan.getId(), plan.getDisplayPlanName(),
                plan.getCountry().getId(), plan.getCountry().getNameEn(),
                plan.getCity().getId(), plan.getCity().getNameEn(), plan.getCity().getNameBn(),
                plan.getPlanningProfile().getId(), plan.getPlanningProfile().getCode(), plan.getPlanningProfile().getNameEn(),
                plan.isMasterPlan(), plan.isPublished(), plan.getStatus(),
                plan.getOverviewEn(), plan.getOverviewBn(),
                monthlyItems.stream().map(planMapper::toMonthlyItemDto).toList(),
                movingItems.stream().map(planMapper::toMovingItemDto).toList(),
                checklistItems.stream().map(planMapper::toChecklistItemDto).toList(),
                fundDto,
                monthlyTotal, movingTotal,
                fundDto != null ? fundDto.affordabilityStatus() : AffordabilityStatus.INSUFFICIENT_DATA,
                fundDto != null ? fundDto.survivalMonths() : BigDecimal.ZERO,
                fundDto != null ? fundDto.readinessScore() : 0,
                fundDto != null ? fundDto.smartWarnings() : Collections.emptyList(),
                plan.getCreatedAt(), plan.getUpdatedAt()
        );
    }

    /**
     * Batch summary builder — <strong>always fires exactly 4 queries regardless of list size</strong>:
     * <ol>
     *   <li>SUM monthly items grouped by planId</li>
     *   <li>SUM moving cost items grouped by planId</li>
     *   <li>All living funds for the plan IDs</li>
     *   <li>Exchange rate BDT→NZD (fetched once, reused for every plan)</li>
     * </ol>
     * Replaces the old {@code toSummary(Plan)} that fired 3 queries per plan.
     */
    List<PlanSummaryResponseDto> buildSummariesBatch(List<Plan> plans) {
        if (plans.isEmpty()) return Collections.emptyList();

        List<String> planIds = plans.stream().map(Plan::getId).toList();

        // Query 1 — monthly totals
        Map<String, BigDecimal> monthlyTotals = monthlyItemRepository.sumByPlanIds(planIds)
                .stream()
                .collect(Collectors.toMap(
                        row -> (String)  row[0],
                        row -> (BigDecimal) row[1]
                ));

        // Query 2 — moving cost totals
        Map<String, BigDecimal> movingTotals = movingItemRepository.sumByPlanIds(planIds)
                .stream()
                .collect(Collectors.toMap(
                        row -> (String)  row[0],
                        row -> (BigDecimal) row[1]
                ));

        // Query 3 — living funds
        Map<String, LivingFund> fundByPlanId = livingFundRepository.findByPlanIdIn(planIds)
                .stream()
                .collect(Collectors.toMap(
                        lf -> lf.getPlan().getId(),
                        lf -> lf
                ));

        // Query 4 — exchange rate (once for the whole batch)
        BigDecimal bdtToNzd = BigDecimal.ZERO;
        try {
            bdtToNzd = exchangeRateService.convert(BigDecimal.ONE, "BDT", "NZD");
        } catch (Exception ex) {
            log.warn("Exchange rate unavailable for batch summary: {}", ex.getMessage());
        }
        final BigDecimal rate = bdtToNzd; // effectively final for lambda

        return plans.stream().map(plan -> {
            BigDecimal monthly  = monthlyTotals.getOrDefault(plan.getId(), BigDecimal.ZERO);
            BigDecimal moving   = movingTotals.getOrDefault(plan.getId(), BigDecimal.ZERO);
            LivingFund fund     = fundByPlanId.get(plan.getId());

            // Compute affordability inline (no extra queries)
            BigDecimal savedBdt = (fund != null && fund.getUserSavedAmountBdt() != null)
                    ? fund.getUserSavedAmountBdt() : BigDecimal.ZERO;
            BigDecimal savedNzd = savedBdt.multiply(rate).setScale(2, java.math.RoundingMode.HALF_UP);

            BigDecimal survivalMonths = BigDecimal.ZERO;
            if (monthly.compareTo(BigDecimal.ZERO) > 0) {
                survivalMonths = savedNzd.divide(monthly, 2, java.math.RoundingMode.HALF_UP);
            }

            AffordabilityStatus status = AffordabilityStatus.INSUFFICIENT_DATA;
            if (fund != null && fund.getUserSavedAmountBdt() != null
                    && monthly.compareTo(BigDecimal.ZERO) > 0) {
                double sm = survivalMonths.doubleValue();
                if (sm >= 9)      status = AffordabilityStatus.SAFE;
                else if (sm >= 4) status = AffordabilityStatus.TIGHT;
                else              status = AffordabilityStatus.RISKY;
            }

            double survivalScore = Math.min(survivalMonths.doubleValue() / 12.0, 1.0);
            double savingsScore = 0.0;
            if (fund != null && fund.getRecommendedAmountNzd() != null
                    && fund.getRecommendedAmountNzd().compareTo(BigDecimal.ZERO) > 0
                    && rate.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal targetBdt = fund.getRecommendedAmountNzd()
                        .divide(rate, 2, java.math.RoundingMode.HALF_UP);
                if (targetBdt.compareTo(BigDecimal.ZERO) > 0) {
                    savingsScore = Math.min(
                            savedBdt.divide(targetBdt, 4, java.math.RoundingMode.HALF_UP).doubleValue(), 1.0);
                }
            }
            int readinessScore = (int) Math.round(65 * survivalScore + 35 * savingsScore);

            return new PlanSummaryResponseDto(
                    plan.getId(), plan.getDisplayPlanName(),
                    plan.getCountry().getId(), plan.getCountry().getNameEn(),
                    plan.getCity().getId(), plan.getCity().getNameEn(), plan.getCity().getNameBn(),
                    plan.getPlanningProfile().getId(), plan.getPlanningProfile().getCode(),
                    plan.getPlanningProfile().getNameEn(),
                    plan.isMasterPlan(), plan.isPublished(), plan.getStatus(),
                    monthly, moving, survivalMonths, status, readinessScore,
                    plan.getCreatedAt(), plan.getUpdatedAt()
            );
        }).toList();
    }

    /**
     * Single-plan summary — kept for cases where a single plan summary is needed
     * after a create/update operation. Uses direct queries (acceptable for single plan).
     *
     * @deprecated Prefer {@link #buildSummariesBatch(List)} for list endpoints.
     */
    PlanSummaryResponseDto toSummary(Plan plan) {
        BigDecimal monthly = monthlyItemRepository
                .sumByPlanIds(List.of(plan.getId())).stream()
                .findFirst().map(r -> (BigDecimal) r[1]).orElse(BigDecimal.ZERO);
        BigDecimal moving = movingItemRepository
                .sumByPlanIds(List.of(plan.getId())).stream()
                .findFirst().map(r -> (BigDecimal) r[1]).orElse(BigDecimal.ZERO);
        LivingFund fund = livingFundRepository.findByPlanId(plan.getId()).orElseGet(LivingFund::new);
        List<Plan> single = List.of(plan);
        // Reuse batch builder for consistency (handles rate + score calculation once)
        List<PlanSummaryResponseDto> result = buildSummariesBatch(single);
        return result.isEmpty() ? null : result.get(0);
    }

    LivingFundResponseDto buildLivingFundResponse(LivingFund fund, List<MonthlyLivingItem> items) {
        BigDecimal monthlyTotal = sum(items.stream().map(MonthlyLivingItem::getEstimatedAmountNzd).toList());

        // Fetch exchange rate — may be unavailable on first startup before cron runs
        BigDecimal bdtToNzd = BigDecimal.ZERO;
        boolean rateAvailable = false;
        try {
            bdtToNzd = exchangeRateService.convert(BigDecimal.ONE, "BDT", "NZD");
            rateAvailable = bdtToNzd.compareTo(BigDecimal.ZERO) > 0;
        } catch (Exception ex) {
            log.warn("Exchange rate BDT→NZD unavailable for affordability computation: {}", ex.getMessage());
        }

        BigDecimal savedBdt = fund.getUserSavedAmountBdt() != null ? fund.getUserSavedAmountBdt() : BigDecimal.ZERO;

        // ── Early return when rate is unavailable ─────────────────────────────
        // Instead of silently returning ZERO-based calculations, surface a clear
        // INSUFFICIENT_DATA status so the frontend can show an informative message.
        if (!rateAvailable) {
            List<String> warnings = List.of(
                    "Exchange rate data is not yet available. " +
                    "Affordability calculations will appear once rates are loaded. " +
                    "Please try again in a few minutes or contact support.");
            return new LivingFundResponseDto(
                    fund.getId(), fund.getPlan() != null ? fund.getPlan().getId() : null,
                    fund.getMinimumAmountNzd(), fund.getRecommendedAmountNzd(),
                    fund.getExplanationEn(), fund.getExplanationBn(),
                    fund.getDisclaimerEn(), fund.getDisclaimerBn(),
                    savedBdt, fund.getUserMonthlyContributionBdt(),
                    fund.getUserTargetDate(), fund.getUserNotes(),
                    BigDecimal.ZERO, monthlyTotal,
                    BigDecimal.ZERO, AffordabilityStatus.INSUFFICIENT_DATA, 0, warnings
            );
        }

        // ── Rate is available — compute affordability ─────────────────────────
        BigDecimal savedNzd = savedBdt.multiply(bdtToNzd).setScale(2, java.math.RoundingMode.HALF_UP);

        BigDecimal survivalMonths = BigDecimal.ZERO;
        if (monthlyTotal.compareTo(BigDecimal.ZERO) > 0) {
            survivalMonths = savedNzd.divide(monthlyTotal, 2, java.math.RoundingMode.HALF_UP);
        }

        AffordabilityStatus status = AffordabilityStatus.INSUFFICIENT_DATA;
        if (fund.getUserSavedAmountBdt() != null && monthlyTotal.compareTo(BigDecimal.ZERO) > 0) {
            double sm = survivalMonths.doubleValue();
            if (sm >= 9)        status = AffordabilityStatus.SAFE;
            else if (sm >= 4)   status = AffordabilityStatus.TIGHT;
            else                status = AffordabilityStatus.RISKY;
        }

        // Readiness score
        double survivalScore = Math.min(survivalMonths.doubleValue() / 12.0, 1.0);
        double savingsScore = 0.0;
        BigDecimal recommended = fund.getRecommendedAmountNzd();
        if (recommended != null && recommended.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal targetBdt = recommended.divide(bdtToNzd, 2, java.math.RoundingMode.HALF_UP);
            if (targetBdt.compareTo(BigDecimal.ZERO) > 0) {
                savingsScore = Math.min(savedBdt.divide(targetBdt, 4, java.math.RoundingMode.HALF_UP).doubleValue(), 1.0);
            }
        }
        int readinessScore = (int) Math.round(65 * survivalScore + 35 * savingsScore);

        // Smart warnings
        List<String> warnings = new ArrayList<>();
        if (status == AffordabilityStatus.RISKY) {
            warnings.add("CRITICAL: Your living fund covers less than 4 months of expenses. This is critically low.");
        } else if (status == AffordabilityStatus.TIGHT) {
            warnings.add("WARNING: Your budget is tight. Consider a cheaper city or shared accommodation.");
        }

        return new LivingFundResponseDto(
                fund.getId(), fund.getPlan() != null ? fund.getPlan().getId() : null,
                fund.getMinimumAmountNzd(), fund.getRecommendedAmountNzd(),
                fund.getExplanationEn(), fund.getExplanationBn(),
                fund.getDisclaimerEn(), fund.getDisclaimerBn(),
                savedBdt, fund.getUserMonthlyContributionBdt(),
                fund.getUserTargetDate(), fund.getUserNotes(),
                savedNzd, monthlyTotal, survivalMonths, status, readinessScore, warnings
        );
    }


    private BigDecimal sum(List<BigDecimal> amounts) {
        return amounts.stream()
                .filter(a -> a != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
