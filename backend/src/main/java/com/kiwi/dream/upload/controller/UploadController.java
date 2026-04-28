package com.kiwi.dream.upload.controller;

import com.kiwi.dream.common.response.CommonApiResponse;
import com.kiwi.dream.upload.dto.UploadResponseDto;
import com.kiwi.dream.upload.service.S3UploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/upload")
@RequiredArgsConstructor
@Tag(name = "File Upload", description = "Admin-only file upload endpoints (S3)")
public class UploadController {

    private final S3UploadService uploadService;

    @PostMapping(value = "/icon", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "Upload a planning-profile icon to S3 (ADMIN)",
            description = """
                    Accepts SVG, PNG, JPEG, WebP, ICO, or GIF files up to 5 MB.
                    Returns the public HTTPS URL of the uploaded file, which can be stored
                    as the `iconSvgUrl` field on a planning profile.

                    The S3 bucket must have ACLs enabled and the object is uploaded with
                    public-read ACL. Ensure your bucket policy does not block public access.
                    """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "File uploaded successfully — URL returned"),
            @ApiResponse(responseCode = "400", description = "Invalid file type or size exceeded"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Admin role required"),
            @ApiResponse(responseCode = "500", description = "S3 upload failed")
    })
    public ResponseEntity<CommonApiResponse<UploadResponseDto>> uploadIcon(
            @RequestParam("file") MultipartFile file) {
        try {
            UploadResponseDto result = uploadService.uploadIcon(file);
            return ResponseEntity.ok(CommonApiResponse.success("Icon uploaded successfully", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(CommonApiResponse.error("UPLOAD_VALIDATION_ERROR", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError()
                    .body(CommonApiResponse.error("UPLOAD_FAILED", e.getMessage()));
        }
    }
}
