package com.kiwi.dream.upload.dto;

/**
 * Response returned after a successful file upload.
 * {@code url} is the public HTTPS URL of the uploaded file.
 */
public record UploadResponseDto(String url) {}
