package com.kiwi.dream.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.util.concurrent.Executor;

/**
 * Configures the async task executor used by {@code @Async} methods
 * (primarily the email-sending service).
 */
@Configuration
@EnableAsync
@EnableScheduling
public class AsyncConfig {

    @Bean(name = "emailExecutor")
    public Executor emailExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("email-");
        executor.initialize();
        return executor;
    }

    /**
     * RestClient instance used by {@link com.kiwi.dream.exchangerate.service.serviceImpl.ExchangeRateServiceImpl}
     * to call the external currency rate API.
     */
    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .defaultHeader("Accept", "application/json")
                .build();
    }

    /**
     * Shared ObjectMapper with Java time module registered.
     *
     * <p>Required by {@code UserPlanServiceImpl} for serializing plan archive
     * snapshots to JSON. Also configures ISO-8601 date strings (not timestamps)
     * so {@code Instant}, {@code LocalDate} etc. are human-readable in the DB.</p>
     */
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }
}
