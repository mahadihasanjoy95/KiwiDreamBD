package com.kiwi.dream.exchangerate.enums;

/**
 * Indicates how a given exchange rate row was created.
 *
 * <ul>
 *   <li>{@code AUTO_FETCH} — populated automatically by the nightly cron job
 *       that calls the external currency API.</li>
 *   <li>{@code ADMIN_OVERRIDE} — set manually by an admin via the API.
 *       Overrides remain active until the next auto-fetch cycle replaces them,
 *       or until an admin sets a new override.</li>
 * </ul>
 */
public enum ExchangeRateSource {
    AUTO_FETCH,
    ADMIN_OVERRIDE
}
