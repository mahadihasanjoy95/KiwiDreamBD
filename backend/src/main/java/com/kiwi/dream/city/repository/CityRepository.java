package com.kiwi.dream.city.repository;

import com.kiwi.dream.city.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, String> {

    List<City> findByCountryIdAndActiveTrueOrderByDisplayOrderAsc(String countryId);

    List<City> findByCountryIdOrderByDisplayOrderAsc(String countryId);

    boolean existsByCountryIdAndCode(String countryId, String code);

    Optional<City> findByIdAndCountryId(String id, String countryId);

    boolean existsByCountryId(String countryId);
}
