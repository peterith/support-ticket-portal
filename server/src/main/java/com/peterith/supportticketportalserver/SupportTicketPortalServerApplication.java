package com.peterith.supportticketportalserver;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class SupportTicketPortalServerApplication {

    @Value("${cors.origin}")
    private String corsOrigin;

    public static void main(String[] args) {
        SpringApplication.run(SupportTicketPortalServerApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/authenticate")
                        .allowedMethods("POST")
                        .allowedOrigins(corsOrigin);

                registry.addMapping("/tickets")
                        .allowedMethods("GET", "POST")
                        .allowedOrigins(corsOrigin);

                registry.addMapping("/tickets/*")
                        .allowedMethods("DELETE", "PUT")
                        .allowedOrigins(corsOrigin);
            }
        };
    }
}
