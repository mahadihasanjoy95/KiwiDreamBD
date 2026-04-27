package com.kiwi.dream.city.repository;

import com.kiwi.dream.city.entity.City;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, String> {

    // ── Public (active-only) ──────────────────────────────────────────────────

    List<City> findByCountryIdAndActiveTrueOrderByDisplayOrderAsc(String countryId);

    // ── Admin (all, searchable, paginated) ───────────────────────────────────

    /**
     * Returns all cities (including inactive) paginated and optionally filtered
     * by a case-insensitive search term against city name or code.
     */
    @Query("""
            SELECT c FROM City c
            WHERE (:search IS NULL OR :search = ''
                   OR LOWER(c.nameEn) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(c.nameBn) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(c.code)   LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY c.country.code ASC, c.displayOrder ASC, c.nameEn ASC
            """)
    Page<City> findAllForAdmin(@Param("search") String search, Pageable pageable);

    /**
     * Returns all cities for a specific country (including inactive), paginated.
     */
    @Query("""
            SELECT c FROM City c
            WHERE c.country.id = :countryId
              AND (:search IS NULL OR :search = ''
                   OR LOWER(c.nameEn) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(c.nameBn) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(c.code)   LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY c.displayOrder ASC, c.nameEn ASC
            """)
    Page<City> findByCountryIdForAdmin(@Param("countryId") String countryId,
                                       @Param("search") String search,
                                       Pageable pageable);

    // ── Misc ─────────────────────────────────────────────────────────────────

    List<City> findByCountryIdOrderByDisplayOrderAsc(String countryId);

    boolean existsByCountryIdAndCode(String countryId, String code);

    Optional<City> findByIdAndCountryId(String id, String countryId);

    boolean existsByCountryId(String countryId);
}
