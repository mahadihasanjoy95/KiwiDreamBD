package com.kiwi.dream.profile.service.serviceImpl;

import com.kiwi.dream.common.exception.ConflictException;
import com.kiwi.dream.profile.dto.request.CreatePlanningProfileRequestDto;
import com.kiwi.dream.profile.dto.request.UpdatePlanningProfileRequestDto;
import com.kiwi.dream.profile.dto.response.PlanningProfileResponseDto;
import com.kiwi.dream.profile.entity.PlanningProfile;
import com.kiwi.dream.profile.exception.PlanningProfileCodeAlreadyExistsException;
import com.kiwi.dream.profile.exception.PlanningProfileNotFoundException;
import com.kiwi.dream.profile.mapper.PlanningProfileMapper;
import com.kiwi.dream.profile.repository.PlanningProfileRepository;
import com.kiwi.dream.profile.service.PlanningProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlanningProfileServiceImpl implements PlanningProfileService {

    private final PlanningProfileRepository profileRepository;
    private final PlanningProfileMapper profileMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PlanningProfileResponseDto> listActive() {
        return profileRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(profileMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PlanningProfileResponseDto getById(String id) {
        return profileMapper.toDto(loadOrThrow(id));
    }

    @Override
    @Transactional
    public PlanningProfileResponseDto create(CreatePlanningProfileRequestDto requestDto) {
        String normalizedCode = requestDto.code().toUpperCase().trim();
        if (profileRepository.existsByCode(normalizedCode)) {
            throw new PlanningProfileCodeAlreadyExistsException(normalizedCode);
        }

        PlanningProfile profile = new PlanningProfile();
        profile.setCode(normalizedCode);
        profile.setNameEn(requestDto.nameEn().trim());
        profile.setNameBn(requestDto.nameBn().trim());
        profile.setShortDetailsEn(requestDto.shortDetailsEn());
        profile.setShortDetailsBn(requestDto.shortDetailsBn());
        profile.setTags(requestDto.tags());
        profile.setMonthlyBudgetRangeMinNzd(requestDto.monthlyBudgetRangeMinNzd());
        profile.setMonthlyBudgetRangeMaxNzd(requestDto.monthlyBudgetRangeMaxNzd());
        profile.setDefaultPersonCount(requestDto.defaultPersonCount() != null ? requestDto.defaultPersonCount() : 1);
        profile.setIconSvgUrl(requestDto.iconSvgUrl());
        profile.setColorHex(requestDto.colorHex());
        profile.setDisplayOrder(requestDto.displayOrder() != null ? requestDto.displayOrder() : 0);
        profile.setActive(true);

        PlanningProfile saved = profileRepository.save(profile);
        log.info("Planning profile created: {} ({})", saved.getNameEn(), saved.getCode());
        return profileMapper.toDto(saved);
    }

    @Override
    @Transactional
    public PlanningProfileResponseDto update(String id, UpdatePlanningProfileRequestDto requestDto) {
        PlanningProfile profile = loadOrThrow(id);

        if (requestDto.nameEn() != null && !requestDto.nameEn().isBlank()) {
            profile.setNameEn(requestDto.nameEn().trim());
        }
        if (requestDto.nameBn() != null && !requestDto.nameBn().isBlank()) {
            profile.setNameBn(requestDto.nameBn().trim());
        }
        if (requestDto.shortDetailsEn() != null) {
            profile.setShortDetailsEn(requestDto.shortDetailsEn().isBlank() ? null : requestDto.shortDetailsEn());
        }
        if (requestDto.shortDetailsBn() != null) {
            profile.setShortDetailsBn(requestDto.shortDetailsBn().isBlank() ? null : requestDto.shortDetailsBn());
        }
        if (requestDto.tags() != null)                          profile.setTags(requestDto.tags());
        if (requestDto.monthlyBudgetRangeMinNzd() != null)      profile.setMonthlyBudgetRangeMinNzd(requestDto.monthlyBudgetRangeMinNzd());
        if (requestDto.monthlyBudgetRangeMaxNzd() != null)      profile.setMonthlyBudgetRangeMaxNzd(requestDto.monthlyBudgetRangeMaxNzd());
        if (requestDto.defaultPersonCount() != null)            profile.setDefaultPersonCount(requestDto.defaultPersonCount());
        if (requestDto.iconSvgUrl() != null) {
            profile.setIconSvgUrl(requestDto.iconSvgUrl().isBlank() ? null : requestDto.iconSvgUrl().trim());
        }
        if (requestDto.colorHex() != null) {
            profile.setColorHex(requestDto.colorHex().isBlank() ? null : requestDto.colorHex().trim());
        }
        if (requestDto.displayOrder() != null)                  profile.setDisplayOrder(requestDto.displayOrder());

        return profileMapper.toDto(profileRepository.save(profile));
    }

    @Override
    @Transactional
    public PlanningProfileResponseDto toggleActive(String id) {
        PlanningProfile profile = loadOrThrow(id);
        profile.setActive(!profile.isActive());
        log.info("Planning profile {} toggled active → {}", profile.getCode(), profile.isActive());
        return profileMapper.toDto(profileRepository.save(profile));
    }

    @Override
    @Transactional
    public void delete(String id) {
        PlanningProfile profile = loadOrThrow(id);
        try {
            profileRepository.delete(profile);
            profileRepository.flush();
            log.info("Planning profile deleted: {} ({})", profile.getNameEn(), profile.getCode());
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException("PROFILE_HAS_PLANS",
                    "Cannot delete profile '" + profile.getCode() + "' while plans are linked to it") {};
        }
    }

    // ──────────────────────────────────────────────────────────────────────────

    private PlanningProfile loadOrThrow(String id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new PlanningProfileNotFoundException(id));
    }
}
