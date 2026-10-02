package com.gestion.credito.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CrearSolicitudRequest(

        @Schema(description = "Cédula del solicitante", example = "1023456789")
        @NotBlank
        String cedula,

        @Schema(description = "Monto solicitado (entre 500 y 50000)", example = "15000")
        @NotNull
        @DecimalMin(value = "500")
        @DecimalMax(value = "50000")
        BigDecimal monto,

        @Schema(description = "Plazo en meses (entre 6 y 60)", example = "24")
        @NotNull
        @Min(6)
        @Max(60)
        Integer plazoMeses
) {
}
