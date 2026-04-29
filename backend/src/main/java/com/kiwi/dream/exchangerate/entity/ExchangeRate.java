package com.kiwi.dream.exchangerate.entity;

import com.kiwi.dream.common.entity.BaseAuditableEntity;
import com.kiwi.dream.exchangerate.enums.ExchangeRateSource;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Stores the admin-managed exchange rate between BDT and a destination currency.
 *
 * <p>Only the latest row per {@code fromCurrency}/{@code toCurrency} pair is
 * kept active. Startup/nightly syncs update the latest row in-place and prune
 * old inactive rows so the table stays small as the platform scales.</p>
 *
 * <p>All monetary conversions across the platform read the single active row
 * for the relevant currency pair via {@link ExchangeRateRepository#findActiveRate}.</p>
 */
@Entity
@Table(
        name = "exchange_rates",
        indexes = {
                @Index(name = "idx_exchange_rate_pair_active",
                        columnList = "from_currency, to_currency, is_active")
        }
)
@Getter
@Setter
public class ExchangeRate extends BaseAuditableEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    /**
     * Source currency code — e.g. "BDT".
     * Always stored in uppercase.
     */
    @Column(name = "from_currency", length = 5, nullable = false)
    private String fromCurrency;

    /**
     * Destination currency code — e.g. "NZD".
     * Always stored in uppercase.
     */
    @Column(name = "to_currency", length = 5, nullable = false)
    private String toCurrency;

    /**
     * How many units of {@code toCurrency} equal 1 unit of {@code fromCurrency}.
     * E.g. if 1 BDT = 0.00137 NZD, store 0.001370.
     * Stored with 6 decimal places for precision.
     */
    @Column(name = "rate_value", precision = 20, scale = 6, nullable = false)
    private BigDecimal rateValue;

    /** Calendar date from which this rate is considered effective. */
    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    /**
     * Only one row per currency pair should be active.
     * Updating the rate refreshes the latest row instead of creating history.
     */
    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    /** Optional admin note, e.g. "Source: Bangladesh Bank, April 2026". */
    @Column(name = "note", length = 500)
    private String note;

    /**
     * Indicates whether this row was set by an admin override or by the
     * nightly auto-fetch cron job. Defaults to AUTO_FETCH.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false, length = 20)
    private ExchangeRateSource source = ExchangeRateSource.AUTO_FETCH;

    @PrePersist
    private void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
