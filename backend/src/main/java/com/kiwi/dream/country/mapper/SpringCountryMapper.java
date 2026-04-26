package com.kiwi.dream.country.mapper;

import com.kiwi.dream.country.dto.request.CreateCountryRequestDto;
import com.kiwi.dream.country.dto.response.CountryResponseDto;
import com.kiwi.dream.country.entity.Country;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class SpringCountryMapper implements CountryMapper {

    @Override
    public Country toEntity(CreateCountryRequestDto dto) {
        if (dto == null) {
            return null;
        }
        Country country = new Country();
        country.setCode(dto.code());
        country.setNameEn(dto.nameEn());
        country.setNameBn(dto.nameBn());
        country.setFlagEmoji(dto.flagEmoji());
        country.setFlagImageUrl(dto.flagImageUrl());
        country.setColorHex(dto.colorHex());
        country.setCurrencyCode(dto.currencyCode());
        country.setDescriptionEn(dto.descriptionEn());
        country.setDescriptionBn(dto.descriptionBn());
        country.setDisplayOrder(dto.displayOrder());
        country.setActive(true);
        return country;
    }

    @Override
    public CountryResponseDto toDto(Country country) {
        if (country == null) {
            return null;
        }
        return new CountryResponseDto(
                country.getId(),
                country.getCode(),
                country.getNameEn(),
                country.getNameBn(),
                country.getFlagEmoji(),
                country.getFlagImageUrl(),
                country.getColorHex(),
                country.getCurrencyCode(),
                country.getDescriptionEn(),
                country.getDescriptionBn(),
                country.getDisplayOrder(),
                country.isActive(),
                country.getCreatedAt(),
                country.getUpdatedAt()
        );
    }
}
