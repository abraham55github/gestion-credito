package com.gestion.credito.dto;

import com.gestion.credito.model.EstadoSolicitud;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CambiarEstadoRequest(

        @NotNull
        EstadoSolicitud estado,

        @NotBlank
        String comentario
) {
}
