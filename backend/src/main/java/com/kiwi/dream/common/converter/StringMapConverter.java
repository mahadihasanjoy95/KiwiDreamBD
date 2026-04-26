package com.kiwi.dream.common.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.Converter;

import java.util.Map;

/** Persists {@code Map<String, Double>} as a JSON object string in a JSON column. */
@Converter
public class StringMapConverter extends JsonConverter<Map<String, Double>> {

    public StringMapConverter() {
        super(new TypeReference<>() {});
    }
}
