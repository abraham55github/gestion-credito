package com.gestion.credito.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CrearSolicitudRequest(

        @NotBlank
        String cedula,

        @NotNull
        @DecimalMin(value = "500")
        @DecimalMax(value = "50000")
        BigDecimal monto,

        @NotNull
        @Min(6)
        @Max(60)
        Integer plazoMeses
) {
}
