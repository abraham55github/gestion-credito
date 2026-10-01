package com.gestion.credito;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class GestionCreditoApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionCreditoApplication.class, args);
    }

}
