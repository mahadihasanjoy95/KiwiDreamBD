package com.kiwi.dream.city.mapper;

import com.kiwi.dream.city.dto.response.CityResponseDto;
import com.kiwi.dream.city.entity.City;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class SpringCityMapper implements CityMapper {

    @Override
    public CityResponseDto toDto(City city) {
        if (city == null) {
            return null;
        }
        return new CityResponseDto(
                city.getId(),
                city.getCountry() != null ? city.getCountry().getId() : null,
                city.getCountry() != null ? city.getCountry().getCode() : null,
                city.getCode(),
                city.getNameEn(),
                city.getNameBn(),
                city.getTaglineEn(),
                city.getTaglineBn(),
                city.getShortDescriptionEn(),
                city.getShortDescriptionBn(),
                city.getLongDescriptionEn(),
                city.getLongDescriptionBn(),
                city.getWeeklyRangeMinNzd(),
                city.getWeeklyRangeMaxNzd(),
                city.getRoomRentHintNzd(),
                city.getTransportHintNzd(),
                city.getGroceriesHintNzd(),
                city.getCostIndex(),
                city.getOverallFeelEn(),
                city.getOverallFeelBn(),
                city.getIconSvgUrl(),
                city.getColorHex(),
                city.getUniversities(),
                city.getSuburbs(),
                city.getTags(),
                city.getRatings(),
                city.getDisplayOrder(),
                city.isActive(),
                city.getCreatedAt(),
                city.getUpdatedAt()
        );
    }
}
