package com.kiwi.dream.city.service;

import com.kiwi.dream.city.dto.request.CreateCityRequestDto;
import com.kiwi.dream.city.dto.request.UpdateCityRequestDto;
import com.kiwi.dream.city.dto.response.CityResponseDto;

import java.util.List;

public interface CityService {

    List<CityResponseDto> listByCountry(String countryId);

    CityResponseDto getById(String countryId, String cityId);

    CityResponseDto create(String countryId, CreateCityRequestDto requestDto);

    CityResponseDto update(String countryId, String cityId, UpdateCityRequestDto requestDto);

    CityResponseDto toggleActive(String countryId, String cityId);

    void delete(String countryId, String cityId);
}
