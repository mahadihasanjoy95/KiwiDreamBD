package com.kiwi.dream.exchangerate.controller;

import com.kiwi.dream.common.response.CommonApiResponse;
import com.kiwi.dream.exchangerate.dto.request.SetExchangeRateRequestDto;
import com.kiwi.dream.exchangerate.dto.response.ExchangeRateResponseDto;
import com.kiwi.dream.exchangerate.service.ExchangeRateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exchange-rates")
@RequiredArgsConstructor
@Tag(name = "Exchange Rates", description = "BDT ↔ destination currency rates — public read, admin write")
public class ExchangeRateController {

    private final ExchangeRateService exchangeRateService;

    // ── Public endpoints ──────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "List all currently active exchange rates across all currency pairs",
            description = "Used by the frontend on startup to fetch the current BDT ↔ NZD rate " +
                          "for displaying converted figures across all plan screens.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Active rates returned")
    })
    public ResponseEntity<CommonApiResponse<List<ExchangeRateResponseDto>>> listActive() {
        return ResponseEntity.ok(CommonApiResponse.success(exchangeRateService.listActive()));
    }

    @GetMapping("/{fromCurrency}/{toCurrency}")
    @Operation(summary = "Get the active exchange rate for a specific currency pair",
            description = "Returns the current active rate for the given pair (e.g. BDT → NZD). " +
                          "Returns 404 if no active rate has been set by an admin yet.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Active rate returned"),
            @ApiResponse(responseCode = "404", description = "No active rate found for this pair")
    })
    public ResponseEntity<CommonApiResponse<ExchangeRateResponseDto>> getActive(
            @PathVariable String fromCurrency,
            @PathVariable String toCurrency) {
        return ResponseEntity.ok(CommonApiResponse.success(
                exchangeRateService.getActive(fromCurrency, toCurrency)));
    }

    // ── Admin endpoints ───────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Set a new exchange rate for a currency pair (ADMIN)",
            description = "Updates the latest active rate for the same pair. " +
                          "This is the primary admin action for updating the BDT ↔ NZD rate " +
                          "that all plan screens use for currency conversion.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Latest rate updated"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<CommonApiResponse<ExchangeRateResponseDto>> setRate(
            @Valid @RequestBody SetExchangeRateRequestDto requestDto) {
        ExchangeRateResponseDto result = exchangeRateService.setRate(requestDto);
        return ResponseEntity.ok(CommonApiResponse.success(
                "Exchange rate updated.", result));
    }

    @GetMapping("/{fromCurrency}/{toCurrency}/history")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get full rate history for a currency pair (ADMIN)",
            description = "Returns remaining rows for a pair, newest first. " +
                          "The sync process keeps only the latest active rate to avoid table growth.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Rate history returned"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<CommonApiResponse<List<ExchangeRateResponseDto>>> getHistory(
            @PathVariable String fromCurrency,
            @PathVariable String toCurrency) {
        return ResponseEntity.ok(CommonApiResponse.success(
                exchangeRateService.getHistory(fromCurrency, toCurrency)));
    }

    @PostMapping("/sync")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Manually trigger an exchange rate sync from the external API (ADMIN)",
            description = "Forces an immediate fetch of all rates from the external API. " +
                          "Useful after adding a new country or when the nightly cron has not run yet. " +
                          "Admin overrides are preserved — only AUTO_FETCH rows are refreshed in-place.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Sync triggered — returns number of pairs updated"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<CommonApiResponse<Integer>> triggerSync() {
        int updated = exchangeRateService.syncRatesFromApi();
        return ResponseEntity.ok(CommonApiResponse.success(
                updated + " currency pair(s) updated from external API.", updated));
    }
}
