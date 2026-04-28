package com.kiwi.dream.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.net.URI;
import java.util.List;
import java.util.LinkedHashSet;
import java.util.Set;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${app.admin.url:http://localhost:5174}")
    private String adminUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        Set<String> origins = allowedOrigins();

        registry.addMapping("/api/**")
                .allowedOrigins(origins.toArray(String[]::new))
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(false)
                .maxAge(3600);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins().stream().toList());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(false);
        config.setMaxAge(3600L);

        return request -> request.getRequestURI().startsWith("/api/") ? config : null;
    }

    private Set<String> allowedOrigins() {
        Set<String> origins = new LinkedHashSet<>();

        // Always allow local dev origins
        origins.add("http://localhost:5173");
        origins.add("http://localhost:5174");
        origins.add("http://127.0.0.1:5173");
        origins.add("http://127.0.0.1:5174");

        // Add production origins from env vars (strips path, keeps scheme+host+port)
        origins.add(extractOrigin(frontendUrl));
        origins.add(extractOrigin(adminUrl));

        return origins;
    }

    private String extractOrigin(String url) {
        try {
            URI uri = URI.create(url);
            int port = uri.getPort();
            return port == -1
                    ? uri.getScheme() + "://" + uri.getHost()
                    : uri.getScheme() + "://" + uri.getHost() + ":" + port;
        } catch (Exception e) {
            return url;
        }
    }
}
