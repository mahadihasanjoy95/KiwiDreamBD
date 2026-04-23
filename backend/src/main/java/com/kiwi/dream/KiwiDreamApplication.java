package com.kiwi.dream;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
@SpringBootApplication
public class KiwiDreamApplication {

    public static void main(String[] args) {
        SpringApplication.run(KiwiDreamApplication.class, args);
    }
}
