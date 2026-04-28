package com.kiwi.dream.city.mapper;

import com.kiwi.dream.city.dto.response.CityResponseDto;
import com.kiwi.dream.city.entity.City;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CityMapper {

    @Mapping(target = "countryId",   source = "country.id")
    @Mapping(target = "countryCode", source = "country.code")
    CityResponseDto toDto(City city);
}
