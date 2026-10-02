package com.gestion.credito.dto;

import com.gestion.credito.model.EstadoSolicitud;
import com.gestion.credito.model.SolicitudCreditoEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SolicitudResponse(
        Long id,
        String cedula,
        BigDecimal monto,
        Integer plazoMeses,
        EstadoSolicitud estado,
        String comentario,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaActualizacion
) {

    public static SolicitudResponse desde(SolicitudCreditoEntity solicitud) {
        return new SolicitudResponse(
                solicitud.getId(),
                solicitud.getCedula(),
                solicitud.getMonto(),
                solicitud.getPlazoMeses(),
                solicitud.getEstadoSolicitud(),
                solicitud.getComentario(),
                solicitud.getFechaCreacion(),
                solicitud.getFechaActualizacion()
        );
    }
}
