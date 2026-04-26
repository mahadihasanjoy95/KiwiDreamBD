package com.kiwi.dream.profile.mapper;

import com.kiwi.dream.profile.dto.response.PlanningProfileResponseDto;
import com.kiwi.dream.profile.entity.PlanningProfile;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PlanningProfileMapper {

    PlanningProfileResponseDto toDto(PlanningProfile profile);
}
