package com.kiwi.dream.exchangerate.mapper;

import com.kiwi.dream.exchangerate.dto.response.ExchangeRateResponseDto;
import com.kiwi.dream.exchangerate.entity.ExchangeRate;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExchangeRateMapper {

    ExchangeRateResponseDto toDto(ExchangeRate exchangeRate);
}
