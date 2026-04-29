package com.kiwi.dream.exchangerate.repository;

import com.kiwi.dream.exchangerate.entity.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, String> {

    /**
     * Returns the single active rate for a given currency pair.
     * Used by all monetary conversion calls across the platform.
     */
    @Query("SELECT e FROM ExchangeRate e " +
           "WHERE UPPER(e.fromCurrency) = UPPER(:from) " +
           "AND UPPER(e.toCurrency) = UPPER(:to) " +
           "AND e.active = true " +
           "ORDER BY e.updatedAt DESC, e.effectiveDate DESC")
    List<ExchangeRate> findActiveRates(@Param("from") String fromCurrency,
                                       @Param("to") String toCurrency);

    default Optional<ExchangeRate> findActiveRate(String fromCurrency, String toCurrency) {
        return findActiveRates(fromCurrency, toCurrency).stream().findFirst();
    }

    /**
     * Returns all rates (active + archived) for a currency pair, newest first.
     * Used by the admin rate history view.
     */
    @Query("SELECT e FROM ExchangeRate e " +
           "WHERE UPPER(e.fromCurrency) = UPPER(:from) " +
           "AND UPPER(e.toCurrency) = UPPER(:to) " +
           "ORDER BY e.effectiveDate DESC")
    List<ExchangeRate> findAllByPairOrderByEffectiveDateDesc(@Param("from") String fromCurrency,
                                                              @Param("to") String toCurrency);

    /**
     * Returns all currently active rates across all currency pairs.
     * Used by the public rate list endpoint.
     */
    @Query("SELECT e FROM ExchangeRate e " +
           "WHERE e.active = true " +
           "ORDER BY e.fromCurrency ASC, e.toCurrency ASC, e.updatedAt DESC, e.effectiveDate DESC")
    List<ExchangeRate> findByActiveTrueOrderByFromCurrencyAscToCurrencyAsc();

    /**
     * Returns the newest row for a pair regardless of active status.
     * Used by sync/admin upserts so the table stores the latest value in-place.
     */
    @Query("SELECT e FROM ExchangeRate e " +
           "WHERE UPPER(e.fromCurrency) = UPPER(:from) " +
           "AND UPPER(e.toCurrency) = UPPER(:to) " +
           "ORDER BY e.active DESC, e.updatedAt DESC, e.effectiveDate DESC")
    List<ExchangeRate> findRowsForUpsert(@Param("from") String fromCurrency,
                                         @Param("to") String toCurrency);

    /**
     * Deletes old inactive rows for a pair after the latest row has been upserted.
     */
    @Modifying
    @Query("DELETE FROM ExchangeRate e " +
           "WHERE UPPER(e.fromCurrency) = UPPER(:from) " +
           "AND UPPER(e.toCurrency) = UPPER(:to) " +
           "AND e.active = false")
    int deleteInactiveByPair(@Param("from") String fromCurrency,
                             @Param("to") String toCurrency);
}
