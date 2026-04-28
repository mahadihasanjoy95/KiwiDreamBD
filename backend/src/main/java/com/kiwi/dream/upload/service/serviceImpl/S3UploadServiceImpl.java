package com.kiwi.dream.upload.service.serviceImpl;

import com.kiwi.dream.upload.dto.UploadResponseDto;
import com.kiwi.dream.upload.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3UploadServiceImpl implements S3UploadService {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucket;

    @Value("${aws.region}")
    private String region;

    /** Allowed MIME types for icon uploads. */
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/svg+xml",
            "image/png",
            "image/jpeg",
            "image/webp",
            "image/x-icon",
            "image/vnd.microsoft.icon",
            "image/gif"
    );

    /** Map MIME type → canonical file extension. */
    private static final Map<String, String> MIME_TO_EXT = Map.of(
            "image/svg+xml",                 "svg",
            "image/png",                     "png",
            "image/jpeg",                    "jpg",
            "image/webp",                    "webp",
            "image/x-icon",                  "ico",
            "image/vnd.microsoft.icon",      "ico",
            "image/gif",                     "gif"
    );

    private static final long MAX_BYTES = 5L * 1024 * 1024; // 5 MB

    @Override
    public UploadResponseDto uploadIcon(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No file provided");
        }

        // Validate size
        if (file.getSize() > MAX_BYTES) {
            throw new IllegalArgumentException("File exceeds the 5 MB limit (received "
                    + (file.getSize() / 1024 / 1024) + " MB)");
        }

        // Validate content type
        String contentType = resolveContentType(file);
        if (!ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException(
                    "Unsupported file type: " + contentType + ". Allowed: SVG, PNG, JPG, WebP, ICO, GIF");
        }

        String ext = MIME_TO_EXT.getOrDefault(contentType, "bin");
        String key = "icons/" + UUID.randomUUID() + "." + ext;

        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(contentType)
                    .contentLength(file.getSize())
                    // public-read: bucket must have "ACLs enabled" in S3 settings
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromBytes(file.getBytes()));

        } catch (IOException e) {
            throw new RuntimeException("Failed to read uploaded file: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("S3 upload failed for key={}: {}", key, e.getMessage());
            throw new RuntimeException("S3 upload failed: " + e.getMessage(), e);
        }

        String publicUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, region, key);
        log.info("Icon uploaded successfully: {}", publicUrl);
        return new UploadResponseDto(publicUrl);
    }

    /**
     * Determines the content type from the file's declared content type,
     * falling back to sniffing the original filename extension.
     */
    private String resolveContentType(MultipartFile file) {
        String declared = file.getContentType();
        if (declared != null && !declared.isBlank() && !declared.equals("application/octet-stream")) {
            return declared.toLowerCase().trim();
        }
        // Fallback: infer from filename extension
        String name = file.getOriginalFilename();
        if (name != null) {
            String lower = name.toLowerCase();
            if (lower.endsWith(".svg"))  return "image/svg+xml";
            if (lower.endsWith(".png"))  return "image/png";
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
            if (lower.endsWith(".webp")) return "image/webp";
            if (lower.endsWith(".ico"))  return "image/x-icon";
            if (lower.endsWith(".gif"))  return "image/gif";
        }
        return declared != null ? declared : "application/octet-stream";
    }
}
