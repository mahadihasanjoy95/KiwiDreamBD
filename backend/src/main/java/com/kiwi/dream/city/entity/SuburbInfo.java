package com.kiwi.dream.city.entity;

/**
 * Embedded suburb snapshot stored as a JSON element inside the cities.suburbs column.
 * Not a JPA entity — serialized/deserialized by SuburbListConverter.
 */
public record SuburbInfo(
        String nameEn,
        String nameBn,
        Double rentHintNzd,
        Integer transportRating,   // 1–5
        Integer budgetRating       // 1–5
) {}
