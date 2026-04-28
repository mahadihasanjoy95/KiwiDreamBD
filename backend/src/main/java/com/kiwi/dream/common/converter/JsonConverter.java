package com.kiwi.dream.common.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import lombok.extern.slf4j.Slf4j;

/**
 * Generic base converter for persisting Java objects as JSON strings in a
 * MySQL JSON column.  Subclass it with a concrete TypeReference:
 *
 * <pre>
 * {@literal @}Converter
 * public class StringListConverter extends JsonConverter{@literal <}List{@literal <}String{@literal >>} {
 *     public StringListConverter() { super(new TypeReference{@literal <>}() {}); }
 * }
 * </pre>
 */
@Slf4j
public abstract class JsonConverter<T> implements AttributeConverter<T, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final TypeReference<T> typeRef;

    protected JsonConverter(TypeReference<T> typeRef) {
        this.typeRef = typeRef;
    }

    @Override
    public String convertToDatabaseColumn(T attribute) {
        if (attribute == null) return null;
        try {
            return MAPPER.writeValueAsString(attribute);
        } catch (Exception e) {
            log.error("Failed to serialize JSON column value", e);
            return null;
        }
    }

    @Override
    public T convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) return null;
        try {
            return MAPPER.readValue(dbData, typeRef);
        } catch (Exception e) {
            log.error("Failed to deserialize JSON column value: {}", dbData, e);
            return null;
        }
    }
}
