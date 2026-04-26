package com.kiwi.dream.country.service.serviceImpl;

import com.kiwi.dream.common.exception.ConflictException;
import com.kiwi.dream.country.dto.request.CreateCountryRequestDto;
import com.kiwi.dream.country.dto.request.UpdateCountryRequestDto;
import com.kiwi.dream.country.dto.response.CountryResponseDto;
import com.kiwi.dream.country.entity.Country;
import com.kiwi.dream.country.exception.CountryCodeAlreadyExistsException;
import com.kiwi.dream.country.exception.CountryNotFoundException;
import com.kiwi.dream.country.mapper.CountryMapper;
import com.kiwi.dream.country.repository.CountryRepository;
import com.kiwi.dream.country.service.CountryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CountryServiceImpl implements CountryService {

    private final CountryRepository countryRepository;
    private final CountryMapper countryMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CountryResponseDto> listActive() {
        return countryRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(countryMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CountryResponseDto getById(String id) {
        return countryMapper.toDto(loadOrThrow(id));
    }

    @Override
    @Transactional
    public CountryResponseDto create(CreateCountryRequestDto requestDto) {
        String normalizedCode = requestDto.code().toUpperCase().trim();
        if (countryRepository.existsByCode(normalizedCode)) {
            throw new CountryCodeAlreadyExistsException(normalizedCode);
        }

        Country country = countryMapper.toEntity(requestDto);
        country.setCode(normalizedCode);
        if (requestDto.displayOrder() == null) {
            country.setDisplayOrder(0);
        }

        Country saved = countryRepository.save(country);
        log.info("Country created: {} ({})", saved.getNameEn(), saved.getCode());
        return countryMapper.toDto(saved);
    }

    @Override
    @Transactional
    public CountryResponseDto update(String id, UpdateCountryRequestDto requestDto) {
        Country country = loadOrThrow(id);

        if (requestDto.nameEn() != null && !requestDto.nameEn().isBlank()) {
            country.setNameEn(requestDto.nameEn().trim());
        }
        if (requestDto.nameBn() != null && !requestDto.nameBn().isBlank()) {
            country.setNameBn(requestDto.nameBn().trim());
        }
        if (requestDto.currencyCode() != null && !requestDto.currencyCode().isBlank()) {
            country.setCurrencyCode(requestDto.currencyCode().trim().toUpperCase());
        }
        if (requestDto.flagEmoji() != null) {
            country.setFlagEmoji(requestDto.flagEmoji().isBlank() ? null : requestDto.flagEmoji().trim());
        }
        if (requestDto.flagImageUrl() != null) {
            country.setFlagImageUrl(requestDto.flagImageUrl().isBlank() ? null : requestDto.flagImageUrl().trim());
        }
        if (requestDto.colorHex() != null) {
            country.setColorHex(requestDto.colorHex().isBlank() ? null : requestDto.colorHex().trim());
        }
        if (requestDto.descriptionEn() != null) {
            country.setDescriptionEn(requestDto.descriptionEn().isBlank() ? null : requestDto.descriptionEn().trim());
        }
        if (requestDto.descriptionBn() != null) {
            country.setDescriptionBn(requestDto.descriptionBn().isBlank() ? null : requestDto.descriptionBn().trim());
        }
        if (requestDto.displayOrder() != null) {
            country.setDisplayOrder(requestDto.displayOrder());
        }

        return countryMapper.toDto(countryRepository.save(country));
    }

    @Override
    @Transactional
    public CountryResponseDto toggleActive(String id) {
        Country country = loadOrThrow(id);
        country.setActive(!country.isActive());
        log.info("Country {} toggled active → {}", country.getCode(), country.isActive());
        return countryMapper.toDto(countryRepository.save(country));
    }

    @Override
    @Transactional
    public void delete(String id) {
        Country country = loadOrThrow(id);
        try {
            countryRepository.delete(country);
            countryRepository.flush();
            log.info("Country deleted: {} ({})", country.getNameEn(), country.getCode());
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException("COUNTRY_HAS_CITIES",
                    "Cannot delete country '" + country.getCode() + "' while cities exist") {};
        }
    }

    // ──────────────────────────────────────────────────────────────────────────

    private Country loadOrThrow(String id) {
        return countryRepository.findById(id)
                .orElseThrow(() -> new CountryNotFoundException(id));
    }
}
