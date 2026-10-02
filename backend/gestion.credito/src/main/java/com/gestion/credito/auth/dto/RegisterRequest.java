package com.gestion.credito.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank
        String cedula,

        @NotBlank
        String nombre,

        @NotBlank
        String apellido,

        @NotBlank
        @Email
        String correo,

        @NotBlank
        @Size(min = 6, message = "debe tener al menos 6 caracteres")
        String password
) {
}
