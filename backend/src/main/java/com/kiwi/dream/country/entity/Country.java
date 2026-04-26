package com.kiwi.dream.country.entity;

import com.kiwi.dream.common.entity.BaseAuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "countries")
@Getter
@Setter
public class Country extends BaseAuditableEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    @Column(name = "code", length = 10, nullable = false, unique = true)
    private String code;

    @Column(name = "name_en", length = 100, nullable = false)
    private String nameEn;

    @Column(name = "name_bn", length = 200, nullable = false)
    private String nameBn;

    @Column(name = "flag_emoji", length = 10)
    private String flagEmoji;

    @Column(name = "flag_image_url", length = 1000)
    private String flagImageUrl;

    @Column(name = "color_hex", length = 7)
    private String colorHex;

    @Column(name = "currency_code", length = 5, nullable = false)
    private String currencyCode;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_bn", columnDefinition = "TEXT")
    private String descriptionBn;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @PrePersist
    private void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
