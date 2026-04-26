package com.kiwi.dream.profile.mapper;

import com.kiwi.dream.profile.dto.response.PlanningProfileResponseDto;
import com.kiwi.dream.profile.entity.PlanningProfile;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class SpringPlanningProfileMapper implements PlanningProfileMapper {

    @Override
    public PlanningProfileResponseDto toDto(PlanningProfile profile) {
        if (profile == null) {
            return null;
        }
        return new PlanningProfileResponseDto(
                profile.getId(),
                profile.getCode(),
                profile.getNameEn(),
                profile.getNameBn(),
                profile.getShortDetailsEn(),
                profile.getShortDetailsBn(),
                profile.getTags(),
                profile.getMonthlyBudgetRangeMinNzd(),
                profile.getMonthlyBudgetRangeMaxNzd(),
                profile.getDefaultPersonCount(),
                profile.getIconSvgUrl(),
                profile.getColorHex(),
                profile.getDisplayOrder(),
                profile.isActive(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}
