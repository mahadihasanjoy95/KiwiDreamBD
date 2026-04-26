package com.kiwi.dream.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.client.RestClient;

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
}
