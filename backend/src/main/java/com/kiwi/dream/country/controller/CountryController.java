package com.kiwi.dream.country.controller;

import com.kiwi.dream.common.response.CommonApiResponse;
import com.kiwi.dream.country.dto.request.CreateCountryRequestDto;
import com.kiwi.dream.country.dto.request.UpdateCountryRequestDto;
import com.kiwi.dream.country.dto.response.CountryResponseDto;
import com.kiwi.dream.country.service.CountryService;
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
@RequestMapping("/api/v1/countries")
@RequiredArgsConstructor
@Tag(name = "Countries", description = "Browse destination countries (public) and manage them (admin)")
public class CountryController {

    private final CountryService countryService;

    // ── Public endpoints ──────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "List all active countries ordered by display order")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Countries returned")
    })
    public ResponseEntity<CommonApiResponse<List<CountryResponseDto>>> listActive() {
        return ResponseEntity.ok(CommonApiResponse.success(countryService.listActive()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a country by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Country returned"),
            @ApiResponse(responseCode = "404", description = "Country not found")
    })
    public ResponseEntity<CommonApiResponse<CountryResponseDto>> getById(@PathVariable String id) {
        return ResponseEntity.ok(CommonApiResponse.success(countryService.getById(id)));
    }

    // ── Admin endpoints ───────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new country (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Country created"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "409", description = "Country code already exists")
    })
    public ResponseEntity<CommonApiResponse<CountryResponseDto>> create(
            @Valid @RequestBody CreateCountryRequestDto requestDto) {
        CountryResponseDto created = countryService.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonApiResponse.success("Country created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update a country's details (ADMIN) — code cannot be changed")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Country updated"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Country not found")
    })
    public ResponseEntity<CommonApiResponse<CountryResponseDto>> update(
            @PathVariable String id,
            @Valid @RequestBody UpdateCountryRequestDto requestDto) {
        return ResponseEntity.ok(CommonApiResponse.success("Country updated successfully",
                countryService.update(id, requestDto)));
    }

    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Toggle a country's active status (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Active status toggled"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Country not found")
    })
    public ResponseEntity<CommonApiResponse<CountryResponseDto>> toggleActive(@PathVariable String id) {
        return ResponseEntity.ok(CommonApiResponse.success("Country status toggled",
                countryService.toggleActive(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a country (ADMIN — blocked if cities exist)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Country deleted"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Admin role required"),
            @ApiResponse(responseCode = "404", description = "Country not found"),
            @ApiResponse(responseCode = "409", description = "Cannot delete country while cities exist")
    })
    public ResponseEntity<CommonApiResponse<Void>> delete(@PathVariable String id) {
        countryService.delete(id);
        return ResponseEntity.ok(CommonApiResponse.success("Country deleted successfully"));
    }
}
