package com.kiwi.dream.city.service;

import com.kiwi.dream.city.dto.request.CreateCityRequestDto;
import com.kiwi.dream.city.dto.request.UpdateCityRequestDto;
import com.kiwi.dream.city.dto.response.CityResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CityService {

    // ── Public ────────────────────────────────────────────────────────────────

    /** Returns only active cities for a country, sorted by displayOrder. */
    List<CityResponseDto> listByCountry(String countryId);

    CityResponseDto getById(String countryId, String cityId);

    // ── Admin ─────────────────────────────────────────────────────────────────

    /** Returns all cities (including inactive), paginated, with optional search. */
    Page<CityResponseDto> listAllAdmin(String search, Pageable pageable);

    /** Returns all cities for one country (including inactive), paginated. */
    Page<CityResponseDto> listByCountryAdmin(String countryId, String search, Pageable pageable);

    CityResponseDto create(String countryId, CreateCityRequestDto requestDto);

    CityResponseDto update(String countryId, String cityId, UpdateCityRequestDto requestDto);

    CityResponseDto toggleActive(String countryId, String cityId);

    void delete(String countryId, String cityId);
}
