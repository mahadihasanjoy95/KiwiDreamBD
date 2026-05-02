package com.kiwi.dream.exchangerate.scheduler;

import com.kiwi.dream.exchangerate.service.ExchangeRateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Triggers exchange rate synchronisation from the external currency API.
 *
 * <p>Two trigger points:</p>
 * <ul>
 *   <li><b>Application startup</b> — fires once after the Spring context is fully
 *       loaded (via {@link ApplicationReadyEvent}). Ensures fresh rates are available
 *       from the very first request, even if the app was down during the last cron run.</li>
 *   <li><b>Nightly cron at midnight (server time)</b> — fires every day at 00:00.
 *       Keeps BDT ↔ destination rates up to date automatically.</li>
 * </ul>
 *
 * <p>Startup and nightly syncs refresh the current rows from the external API so
 * production always starts with the latest available rates.</p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ExchangeRateSyncJob {

    private final ExchangeRateService exchangeRateService;

    /**
     * Runs once after the application has fully started.
     * Wrapped in a try-catch so a network failure at startup does not crash the app.
     */
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.info("Application startup: triggering initial exchange rate sync...");
        try {
            int updated = exchangeRateService.syncRatesFromApi();
            log.info("Startup exchange rate sync complete. {} pair(s) updated.", updated);
        } catch (Exception ex) {
            log.error("Startup exchange rate sync failed — app will continue with existing rates. Error: {}",
                    ex.getMessage());
        }
    }

    /**
     * Runs every day at midnight (00:00:00 Bangladesh time).
     * Uses a 1-second initial delay after the CRON expression is parsed.
     */
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Dhaka")
    public void syncNightly() {
        log.info("Nightly cron: starting exchange rate sync...");
        try {
            int updated = exchangeRateService.syncRatesFromApi();
            log.info("Nightly exchange rate sync complete. {} pair(s) updated.", updated);
        } catch (Exception ex) {
            log.error("Nightly exchange rate sync failed. Error: {}", ex.getMessage());
        }
    }
}
