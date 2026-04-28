package com.kiwi.dream.country.mapper;

import com.kiwi.dream.country.dto.request.CreateCountryRequestDto;
import com.kiwi.dream.country.dto.response.CountryResponseDto;
import com.kiwi.dream.country.entity.Country;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CountryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Country toEntity(CreateCountryRequestDto dto);

    CountryResponseDto toDto(Country country);
}
