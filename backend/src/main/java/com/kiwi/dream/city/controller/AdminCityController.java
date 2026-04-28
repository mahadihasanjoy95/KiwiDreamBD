package com.kiwi.dream.city.controller;

import com.kiwi.dream.city.dto.response.CityResponseDto;
import com.kiwi.dream.city.service.CityService;
import com.kiwi.dream.common.response.CommonApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Admin-only city browsing endpoints.
 * Returns ALL cities (including inactive) across all countries, paginated.
 *
 * Read/write city management (create, update, toggle, delete) is still at
 * {@code /api/v1/countries/{countryId}/cities} — that keeps the REST hierarchy intact.
 * This controller exists purely for the admin list-all view.
 */
@RestController
@RequestMapping("/api/v1/admin/cities")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@Tag(name = "Admin — Cities", description = "Admin: paginated list of all cities across all countries (includes inactive)")
public class AdminCityController {

    private final CityService cityService;

    @GetMapping
    @Operation(
            summary = "List all cities (admin, paginated)",
            description = """
                    Returns ALL cities across every country, including inactive ones.
                    Supports optional search (matches nameEn, nameBn, or code)
                    and optional `countryId` filter. Results are ordered by
                    country code → displayOrder → nameEn.
                    """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paginated city list returned"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<CommonApiResponse<Page<CityResponseDto>>> listAll(
            @Parameter(description = "Filter by country UUID (optional)")
            @RequestParam(required = false) String countryId,

            @Parameter(description = "Free-text search against name / code (optional)")
            @RequestParam(required = false) String search,

            @Parameter(description = "0-based page number")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Items per page (max 200)")
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 200));

        Page<CityResponseDto> result = (countryId != null && !countryId.isBlank())
                ? cityService.listByCountryAdmin(countryId, search, pageable)
                : cityService.listAllAdmin(search, pageable);

        return ResponseEntity.ok(CommonApiResponse.success(result));
    }
}
