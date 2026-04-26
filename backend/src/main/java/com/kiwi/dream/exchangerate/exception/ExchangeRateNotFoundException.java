package com.kiwi.dream.exchangerate.exception;

import com.kiwi.dream.common.exception.ResourceNotFoundException;

public class ExchangeRateNotFoundException extends ResourceNotFoundException {

    public ExchangeRateNotFoundException(String fromCurrency, String toCurrency) {
        super("EXCHANGE_RATE_NOT_FOUND",
                "No active exchange rate found for " + fromCurrency.toUpperCase() + " → " + toCurrency.toUpperCase());
    }

    public ExchangeRateNotFoundException(String id) {
        super("EXCHANGE_RATE_NOT_FOUND", "Exchange rate not found: " + id);
    }
}
