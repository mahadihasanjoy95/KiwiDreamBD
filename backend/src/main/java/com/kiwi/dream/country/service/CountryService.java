package com.kiwi.dream.country.service;

import com.kiwi.dream.country.dto.request.CreateCountryRequestDto;
import com.kiwi.dream.country.dto.request.UpdateCountryRequestDto;
import com.kiwi.dream.country.dto.response.CountryResponseDto;

import java.util.List;

public interface CountryService {

    List<CountryResponseDto> listActive();

    CountryResponseDto getById(String id);

    CountryResponseDto create(CreateCountryRequestDto requestDto);

    CountryResponseDto update(String id, UpdateCountryRequestDto requestDto);

    CountryResponseDto toggleActive(String id);

    void delete(String id);
}
