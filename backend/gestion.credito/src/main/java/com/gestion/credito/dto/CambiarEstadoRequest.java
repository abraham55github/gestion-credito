package com.gestion.credito.dto;

import com.gestion.credito.model.EstadoSolicitud;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CambiarEstadoRequest(

        @Schema(description = "Nuevo estado (APROBADA o RECHAZADA)", example = "APROBADA")
        @NotNull
        EstadoSolicitud estado,

        @Schema(description = "Motivo de la decisión, obligatorio", example = "Cliente cumple con el historial requerido")
        @NotBlank
        String comentario
) {
}
