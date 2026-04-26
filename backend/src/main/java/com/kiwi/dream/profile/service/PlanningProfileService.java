package com.kiwi.dream.profile.service;

import com.kiwi.dream.profile.dto.request.CreatePlanningProfileRequestDto;
import com.kiwi.dream.profile.dto.request.UpdatePlanningProfileRequestDto;
import com.kiwi.dream.profile.dto.response.PlanningProfileResponseDto;

import java.util.List;

public interface PlanningProfileService {

    List<PlanningProfileResponseDto> listActive();

    PlanningProfileResponseDto getById(String id);

    PlanningProfileResponseDto create(CreatePlanningProfileRequestDto requestDto);

    PlanningProfileResponseDto update(String id, UpdatePlanningProfileRequestDto requestDto);

    PlanningProfileResponseDto toggleActive(String id);

    void delete(String id);
}
