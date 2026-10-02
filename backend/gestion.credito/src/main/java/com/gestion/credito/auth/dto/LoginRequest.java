package com.gestion.credito.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

        @NotBlank
        String correo,

        @NotBlank
        String password
) {
}
