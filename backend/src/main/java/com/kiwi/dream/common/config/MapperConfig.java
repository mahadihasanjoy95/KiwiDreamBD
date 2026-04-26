package com.kiwi.dream.common.config;

import com.kiwi.dream.city.mapper.CityMapper;
import com.kiwi.dream.country.mapper.CountryMapper;
import com.kiwi.dream.exchangerate.mapper.ExchangeRateMapper;
import com.kiwi.dream.profile.mapper.PlanningProfileMapper;
import org.mapstruct.factory.Mappers;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    @ConditionalOnMissingBean(CityMapper.class)
    public CityMapper cityMapper() {
        return Mappers.getMapper(CityMapper.class);
    }

    @Bean
    @ConditionalOnMissingBean(CountryMapper.class)
    public CountryMapper countryMapper() {
        return Mappers.getMapper(CountryMapper.class);
    }

    @Bean
    @ConditionalOnMissingBean(PlanningProfileMapper.class)
    public PlanningProfileMapper planningProfileMapper() {
        return Mappers.getMapper(PlanningProfileMapper.class);
    }

    @Bean
    @ConditionalOnMissingBean(ExchangeRateMapper.class)
    public ExchangeRateMapper exchangeRateMapper() {
        return Mappers.getMapper(ExchangeRateMapper.class);
    }
}
