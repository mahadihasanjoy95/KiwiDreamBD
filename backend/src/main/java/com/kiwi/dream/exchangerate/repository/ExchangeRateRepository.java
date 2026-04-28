package com.kiwi.dream.exchangerate.repository;

import com.kiwi.dream.exchangerate.entity.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
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
           "AND e.active = true")
    Optional<ExchangeRate> findActiveRate(@Param("from") String fromCurrency,
                                          @Param("to") String toCurrency);

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
    List<ExchangeRate> findByActiveTrueOrderByFromCurrencyAscToCurrencyAsc();
}
