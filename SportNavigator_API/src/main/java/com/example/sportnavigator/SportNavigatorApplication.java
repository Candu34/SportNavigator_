package com.example.sportnavigator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SportNavigatorApplication {

    public static void main(String[] args) {
        SpringApplication.run(SportNavigatorApplication.class, args);
    }

}
