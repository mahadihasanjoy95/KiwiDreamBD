package com.kiwi.dream.city.controller;

import com.kiwi.dream.city.dto.request.CreateCityRequestDto;
import com.kiwi.dream.city.dto.request.UpdateCityRequestDto;
import com.kiwi.dream.city.dto.response.CityResponseDto;
import com.kiwi.dream.city.service.CityService;
import com.kiwi.dream.common.response.CommonApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/countries/{countryId}/cities")
@RequiredArgsConstructor
@Tag(name = "Cities", description = "Browse cities within a country (public) and manage them (admin)")
public class CityController {

    private final CityService cityService;

    // ── Public endpoints ──────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "List all active cities for a country, ordered by display order")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cities returned"),
            @ApiResponse(responseCode = "404", description = "Country not found")
    })
    public ResponseEntity<CommonApiResponse<List<CityResponseDto>>> listByCountry(
            @PathVariable String countryId) {
        return ResponseEntity.ok(CommonApiResponse.success(cityService.listByCountry(countryId)));
    }

    @GetMapping("/{cityId}")
    @Operation(summary = "Get a city by ID within a country")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "City returned"),
            @ApiResponse(responseCode = "404", description = "City or country not found")
    })
    public ResponseEntity<CommonApiResponse<CityResponseDto>> getById(
            @PathVariable String countryId,
            @PathVariable String cityId) {
        return ResponseEntity.ok(CommonApiResponse.success(cityService.getById(countryId, cityId)));
    }

    // ── Admin endpoints ───────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new city within a country (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "City created"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Country not found"),
            @ApiResponse(responseCode = "409", description = "City code already exists in this country")
    })
    public ResponseEntity<CommonApiResponse<CityResponseDto>> create(
            @PathVariable String countryId,
            @Valid @RequestBody CreateCityRequestDto requestDto) {
        CityResponseDto created = cityService.create(countryId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonApiResponse.success("City created successfully", created));
    }

    @PutMapping("/{cityId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update a city's details (ADMIN) — code cannot be changed")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "City updated"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "City or country not found")
    })
    public ResponseEntity<CommonApiResponse<CityResponseDto>> update(
            @PathVariable String countryId,
            @PathVariable String cityId,
            @Valid @RequestBody UpdateCityRequestDto requestDto) {
        return ResponseEntity.ok(CommonApiResponse.success("City updated successfully",
                cityService.update(countryId, cityId, requestDto)));
    }

    @PatchMapping("/{cityId}/toggle-active")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Toggle a city's active status (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Active status toggled"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "City or country not found")
    })
    public ResponseEntity<CommonApiResponse<CityResponseDto>> toggleActive(
            @PathVariable String countryId,
            @PathVariable String cityId) {
        return ResponseEntity.ok(CommonApiResponse.success("City status toggled",
                cityService.toggleActive(countryId, cityId)));
    }

    @DeleteMapping("/{cityId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a city (SUPER_ADMIN only — blocked if plans are linked)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "City deleted"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "SUPER_ADMIN role required"),
            @ApiResponse(responseCode = "404", description = "City or country not found"),
            @ApiResponse(responseCode = "409", description = "Cannot delete city while plans are linked")
    })
    public ResponseEntity<CommonApiResponse<Void>> delete(
            @PathVariable String countryId,
            @PathVariable String cityId) {
        cityService.delete(countryId, cityId);
        return ResponseEntity.ok(CommonApiResponse.success("City deleted successfully"));
    }
}
