package com.kiwi.dream.plan.mapper;

import com.kiwi.dream.plan.dto.response.ChecklistItemResponseDto;
import com.kiwi.dream.plan.dto.response.MonthlyItemResponseDto;
import com.kiwi.dream.plan.dto.response.MovingItemResponseDto;
import com.kiwi.dream.plan.dto.response.PlanArchiveResponseDto;
import com.kiwi.dream.plan.entity.ChecklistItem;
import com.kiwi.dream.plan.entity.MonthlyLivingItem;
import com.kiwi.dream.plan.entity.MovingCostItem;
import com.kiwi.dream.plan.entity.PlanArchive;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper for sub-resource entities → DTOs.
 *
 * <p>PlanResponseDto and PlanSummaryResponseDto are constructed manually in the
 * service layer because they include computed fields (survivalMonths, affordabilityStatus,
 * readinessScore) that cannot be derived by MapStruct alone.</p>
 */
@Mapper(componentModel = "spring")
public interface PlanMapper {

    @Mapping(source = "plan.id", target = "planId")
    @Mapping(source = "custom", target = "custom")
    MonthlyItemResponseDto toMonthlyItemDto(MonthlyLivingItem item);

    @Mapping(source = "plan.id", target = "planId")
    MovingItemResponseDto toMovingItemDto(MovingCostItem item);

    @Mapping(source = "plan.id", target = "planId")
    @Mapping(source = "done", target = "done")
    ChecklistItemResponseDto toChecklistItemDto(ChecklistItem item);

    @Mapping(source = "user.id", target = "userId")
    PlanArchiveResponseDto toArchiveDto(PlanArchive archive);
}
