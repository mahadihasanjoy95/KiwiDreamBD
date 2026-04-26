package com.kiwi.dream.country.repository;

import com.kiwi.dream.country.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CountryRepository extends JpaRepository<Country, String> {

    boolean existsByCode(String code);

    Optional<Country> findByCode(String code);

    List<Country> findByActiveTrueOrderByDisplayOrderAsc();
}
