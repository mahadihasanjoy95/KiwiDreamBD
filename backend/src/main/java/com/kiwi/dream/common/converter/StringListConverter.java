package com.kiwi.dream.common.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.Converter;

import java.util.List;

/** Persists {@code List<String>} as a JSON array string in a JSON column. */
@Converter
public class StringListConverter extends JsonConverter<List<String>> {

    public StringListConverter() {
        super(new TypeReference<>() {});
    }
}
