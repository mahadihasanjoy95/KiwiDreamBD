package com.kiwi.dream.city.entity;

import com.kiwi.dream.common.converter.StringListConverter;
import com.kiwi.dream.common.converter.StringMapConverter;
import com.kiwi.dream.common.entity.BaseAuditableEntity;
import com.kiwi.dream.country.entity.Country;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(
        name = "cities",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_city_code_country",
                columnNames = {"country_id", "code"}
        )
)
@Getter
@Setter
public class City extends BaseAuditableEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @Column(name = "code", length = 20, nullable = false)
    private String code;

    @Column(name = "name_en", length = 150, nullable = false)
    private String nameEn;

    @Column(name = "name_bn", length = 300, nullable = false)
    private String nameBn;

    @Column(name = "tagline_en", length = 255)
    private String taglineEn;

    @Column(name = "tagline_bn", length = 500)
    private String taglineBn;

    @Column(name = "short_description_en", columnDefinition = "TEXT")
    private String shortDescriptionEn;

    @Column(name = "short_description_bn", columnDefinition = "TEXT")
    private String shortDescriptionBn;

    @Column(name = "long_description_en", columnDefinition = "TEXT")
    private String longDescriptionEn;

    @Column(name = "long_description_bn", columnDefinition = "TEXT")
    private String longDescriptionBn;

    @Column(name = "weekly_range_min_nzd", precision = 15, scale = 2)
    private BigDecimal weeklyRangeMinNzd;

    @Column(name = "weekly_range_max_nzd", precision = 15, scale = 2)
    private BigDecimal weeklyRangeMaxNzd;

    @Column(name = "room_rent_hint_nzd", precision = 15, scale = 2)
    private BigDecimal roomRentHintNzd;

    @Column(name = "transport_hint_nzd", precision = 15, scale = 2)
    private BigDecimal transportHintNzd;

    @Column(name = "groceries_hint_nzd", precision = 15, scale = 2)
    private BigDecimal groceriesHintNzd;

    /**
     * Normalised cost index relative to NZ average (100).
     * Values above 100 are more expensive than average; below 100 cheaper.
     * Used by the recommendation engine suburb-suggestion rule.
     */
    @Column(name = "cost_index")
    private Integer costIndex = 100;

    @Column(name = "overall_feel_en", columnDefinition = "TEXT")
    private String overallFeelEn;

    @Column(name = "overall_feel_bn", columnDefinition = "TEXT")
    private String overallFeelBn;

    @Column(name = "icon_svg_url", length = 1000)
    private String iconSvgUrl;

    @Column(name = "color_hex", length = 7)
    private String colorHex;

    /** JSON array of university name strings, e.g. ["University of Auckland", "AUT"]. */
    @Convert(converter = StringListConverter.class)
    @Column(name = "universities", columnDefinition = "JSON")
    private List<String> universities;

    /** JSON array of suburb snapshot objects. */
    @Convert(converter = SuburbListConverter.class)
    @Column(name = "suburbs", columnDefinition = "JSON")
    private List<SuburbInfo> suburbs;

    /** JSON array of tag strings, e.g. ["student-friendly", "affordable"]. */
    @Convert(converter = StringListConverter.class)
    @Column(name = "tags", columnDefinition = "JSON")
    private List<String> tags;

    /** JSON object with numeric ratings, e.g. {"transport": 4.2, "safety": 4.5, "affordability": 3.8}. */
    @Convert(converter = StringMapConverter.class)
    @Column(name = "ratings", columnDefinition = "JSON")
    private Map<String, Double> ratings;

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
