package com.kiwi.dream.upload.service;

import com.kiwi.dream.upload.dto.UploadResponseDto;
import org.springframework.web.multipart.MultipartFile;

public interface S3UploadService {

    /**
     * Upload an icon image to S3.
     *
     * Accepted types: SVG, PNG, JPEG, WebP, ICO, GIF
     * Max size: 5 MB (enforced by Spring multipart config + this service)
     *
     * @param file the uploaded file
     * @return {@link UploadResponseDto} containing the public HTTPS URL
     */
    UploadResponseDto uploadIcon(MultipartFile file);
}
