package com.kiwi.dream.exchangerate.mapper;

import com.kiwi.dream.exchangerate.dto.response.ExchangeRateResponseDto;
import com.kiwi.dream.exchangerate.entity.ExchangeRate;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class SpringExchangeRateMapper implements ExchangeRateMapper {

    @Override
    public ExchangeRateResponseDto toDto(ExchangeRate exchangeRate) {
        if (exchangeRate == null) {
            return null;
        }
        return new ExchangeRateResponseDto(
                exchangeRate.getId(),
                exchangeRate.getFromCurrency(),
                exchangeRate.getToCurrency(),
                exchangeRate.getRateValue(),
                exchangeRate.getEffectiveDate(),
                exchangeRate.isActive(),
                exchangeRate.getSource(),
                exchangeRate.getNote(),
                exchangeRate.getCreatedAt(),
                exchangeRate.getUpdatedAt()
        );
    }
}
