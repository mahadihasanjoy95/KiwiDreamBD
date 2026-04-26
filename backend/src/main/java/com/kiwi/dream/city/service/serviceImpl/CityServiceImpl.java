package com.kiwi.dream.city.service.serviceImpl;

import com.kiwi.dream.city.dto.request.CreateCityRequestDto;
import com.kiwi.dream.city.dto.request.UpdateCityRequestDto;
import com.kiwi.dream.city.dto.response.CityResponseDto;
import com.kiwi.dream.city.entity.City;
import com.kiwi.dream.city.exception.CityCodeAlreadyExistsException;
import com.kiwi.dream.city.exception.CityNotFoundException;
import com.kiwi.dream.city.mapper.CityMapper;
import com.kiwi.dream.city.repository.CityRepository;
import com.kiwi.dream.city.service.CityService;
import com.kiwi.dream.common.exception.ConflictException;
import com.kiwi.dream.country.entity.Country;
import com.kiwi.dream.country.exception.CountryNotFoundException;
import com.kiwi.dream.country.repository.CountryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CityServiceImpl implements CityService {

    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;
    private final CityMapper cityMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CityResponseDto> listByCountry(String countryId) {
        requireCountryExists(countryId);
        return cityRepository.findByCountryIdAndActiveTrueOrderByDisplayOrderAsc(countryId)
                .stream()
                .map(cityMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CityResponseDto getById(String countryId, String cityId) {
        return cityMapper.toDto(loadOrThrow(countryId, cityId));
    }

    @Override
    @Transactional
    public CityResponseDto create(String countryId, CreateCityRequestDto requestDto) {
        Country country = countryRepository.findById(countryId)
                .orElseThrow(() -> new CountryNotFoundException(countryId));

        String normalizedCode = requestDto.code().toUpperCase().trim();
        if (cityRepository.existsByCountryIdAndCode(countryId, normalizedCode)) {
            throw new CityCodeAlreadyExistsException(normalizedCode, country.getCode());
        }

        City city = new City();
        city.setCountry(country);
        city.setCode(normalizedCode);
        city.setNameEn(requestDto.nameEn().trim());
        city.setNameBn(requestDto.nameBn().trim());
        city.setTaglineEn(requestDto.taglineEn());
        city.setTaglineBn(requestDto.taglineBn());
        city.setShortDescriptionEn(requestDto.shortDescriptionEn());
        city.setShortDescriptionBn(requestDto.shortDescriptionBn());
        city.setLongDescriptionEn(requestDto.longDescriptionEn());
        city.setLongDescriptionBn(requestDto.longDescriptionBn());
        city.setWeeklyRangeMinNzd(requestDto.weeklyRangeMinNzd());
        city.setWeeklyRangeMaxNzd(requestDto.weeklyRangeMaxNzd());
        city.setRoomRentHintNzd(requestDto.roomRentHintNzd());
        city.setTransportHintNzd(requestDto.transportHintNzd());
        city.setGroceriesHintNzd(requestDto.groceriesHintNzd());
        city.setCostIndex(requestDto.costIndex() != null ? requestDto.costIndex() : 100);
        city.setOverallFeelEn(requestDto.overallFeelEn());
        city.setOverallFeelBn(requestDto.overallFeelBn());
        city.setIconSvgUrl(requestDto.iconSvgUrl());
        city.setColorHex(requestDto.colorHex());
        city.setUniversities(requestDto.universities());
        city.setSuburbs(requestDto.suburbs());
        city.setTags(requestDto.tags());
        city.setRatings(requestDto.ratings());
        city.setDisplayOrder(requestDto.displayOrder() != null ? requestDto.displayOrder() : 0);
        city.setActive(true);

        City saved = cityRepository.save(city);
        log.info("City created: {} ({}) under country {}", saved.getNameEn(), saved.getCode(), country.getCode());
        return cityMapper.toDto(saved);
    }

    @Override
    @Transactional
    public CityResponseDto update(String countryId, String cityId, UpdateCityRequestDto requestDto) {
        City city = loadOrThrow(countryId, cityId);

        if (requestDto.nameEn() != null && !requestDto.nameEn().isBlank()) {
            city.setNameEn(requestDto.nameEn().trim());
        }
        if (requestDto.nameBn() != null && !requestDto.nameBn().isBlank()) {
            city.setNameBn(requestDto.nameBn().trim());
        }
        if (requestDto.taglineEn() != null) {
            city.setTaglineEn(requestDto.taglineEn().isBlank() ? null : requestDto.taglineEn().trim());
        }
        if (requestDto.taglineBn() != null) {
            city.setTaglineBn(requestDto.taglineBn().isBlank() ? null : requestDto.taglineBn().trim());
        }
        if (requestDto.shortDescriptionEn() != null) {
            city.setShortDescriptionEn(requestDto.shortDescriptionEn().isBlank() ? null : requestDto.shortDescriptionEn());
        }
        if (requestDto.shortDescriptionBn() != null) {
            city.setShortDescriptionBn(requestDto.shortDescriptionBn().isBlank() ? null : requestDto.shortDescriptionBn());
        }
        if (requestDto.longDescriptionEn() != null) {
            city.setLongDescriptionEn(requestDto.longDescriptionEn().isBlank() ? null : requestDto.longDescriptionEn());
        }
        if (requestDto.longDescriptionBn() != null) {
            city.setLongDescriptionBn(requestDto.longDescriptionBn().isBlank() ? null : requestDto.longDescriptionBn());
        }
        if (requestDto.weeklyRangeMinNzd() != null)  city.setWeeklyRangeMinNzd(requestDto.weeklyRangeMinNzd());
        if (requestDto.weeklyRangeMaxNzd() != null)  city.setWeeklyRangeMaxNzd(requestDto.weeklyRangeMaxNzd());
        if (requestDto.roomRentHintNzd() != null)    city.setRoomRentHintNzd(requestDto.roomRentHintNzd());
        if (requestDto.transportHintNzd() != null)   city.setTransportHintNzd(requestDto.transportHintNzd());
        if (requestDto.groceriesHintNzd() != null)   city.setGroceriesHintNzd(requestDto.groceriesHintNzd());
        if (requestDto.costIndex() != null)            city.setCostIndex(requestDto.costIndex());
        if (requestDto.overallFeelEn() != null) {
            city.setOverallFeelEn(requestDto.overallFeelEn().isBlank() ? null : requestDto.overallFeelEn());
        }
        if (requestDto.overallFeelBn() != null) {
            city.setOverallFeelBn(requestDto.overallFeelBn().isBlank() ? null : requestDto.overallFeelBn());
        }
        if (requestDto.iconSvgUrl() != null) {
            city.setIconSvgUrl(requestDto.iconSvgUrl().isBlank() ? null : requestDto.iconSvgUrl().trim());
        }
        if (requestDto.colorHex() != null) {
            city.setColorHex(requestDto.colorHex().isBlank() ? null : requestDto.colorHex().trim());
        }
        if (requestDto.universities() != null) city.setUniversities(requestDto.universities());
        if (requestDto.suburbs() != null)      city.setSuburbs(requestDto.suburbs());
        if (requestDto.tags() != null)         city.setTags(requestDto.tags());
        if (requestDto.ratings() != null)      city.setRatings(requestDto.ratings());
        if (requestDto.displayOrder() != null) city.setDisplayOrder(requestDto.displayOrder());

        return cityMapper.toDto(cityRepository.save(city));
    }

    @Override
    @Transactional
    public CityResponseDto toggleActive(String countryId, String cityId) {
        City city = loadOrThrow(countryId, cityId);
        city.setActive(!city.isActive());
        log.info("City {} toggled active → {}", city.getCode(), city.isActive());
        return cityMapper.toDto(cityRepository.save(city));
    }

    @Override
    @Transactional
    public void delete(String countryId, String cityId) {
        City city = loadOrThrow(countryId, cityId);
        try {
            cityRepository.delete(city);
            cityRepository.flush();
            log.info("City deleted: {} ({})", city.getNameEn(), city.getCode());
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException("CITY_HAS_PLANS",
                    "Cannot delete city '" + city.getCode() + "' while plans are linked to it") {};
        }
    }

    // ──────────────────────────────────────────────────────────────────────────

    private City loadOrThrow(String countryId, String cityId) {
        return cityRepository.findByIdAndCountryId(cityId, countryId)
                .orElseThrow(() -> new CityNotFoundException(cityId));
    }

    private void requireCountryExists(String countryId) {
        if (!countryRepository.existsById(countryId)) {
            throw new CountryNotFoundException(countryId);
        }
    }
}
