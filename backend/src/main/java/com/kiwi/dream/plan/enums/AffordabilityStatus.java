package com.kiwi.dream.plan.enums;

/**
 * Computed affordability status for a user plan based on how many months
 * the living fund covers at the current monthly spend rate.
 *
 * <ul>
 *   <li>SAFE   — survivalMonths >= 9</li>
 *   <li>TIGHT  — survivalMonths >= 4 AND < 7</li>
 *   <li>RISKY  — survivalMonths < 4</li>
 *   <li>INSUFFICIENT_DATA — fund not set or monthly total is zero</li>
 * </ul>
 */
public enum AffordabilityStatus {
    SAFE,
    TIGHT,
    RISKY,
    INSUFFICIENT_DATA
}
