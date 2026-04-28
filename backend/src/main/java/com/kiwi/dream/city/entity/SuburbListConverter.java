package com.kiwi.dream.city.entity;

import com.fasterxml.jackson.core.type.TypeReference;
import com.kiwi.dream.common.converter.JsonConverter;
import jakarta.persistence.Converter;

import java.util.List;

/** Persists {@code List<SuburbInfo>} as a JSON array in the suburbs column. */
@Converter
public class SuburbListConverter extends JsonConverter<List<SuburbInfo>> {

    public SuburbListConverter() {
        super(new TypeReference<>() {});
    }
}
