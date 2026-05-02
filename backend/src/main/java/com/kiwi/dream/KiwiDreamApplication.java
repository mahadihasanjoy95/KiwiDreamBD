package com.kiwi.dream;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
@EnableScheduling
@SpringBootApplication
public class KiwiDreamApplication {

    public static void main(String[] args) {
        SpringApplication.run(KiwiDreamApplication.class, args);
    }
}
