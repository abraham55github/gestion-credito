package com.gestion.credito.service;

import com.gestion.credito.dto.CambiarEstadoRequest;
import com.gestion.credito.dto.CrearSolicitudRequest;
import com.gestion.credito.dto.SolicitudResponse;
import com.gestion.credito.exception.SolicitudNotFoundException;
import com.gestion.credito.exception.TransicionEstadoInvalidaException;
import com.gestion.credito.model.EstadoSolicitud;
import com.gestion.credito.model.SolicitudCreditoEntity;
import com.gestion.credito.repository.SolicitudCreditoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SolicitudCreditoEntityServiceTest {

    @Mock
    private SolicitudCreditoRepository repository;

    @InjectMocks
    private SolicitudCreditoService service;

    @Test
    void crear_nuevaSolicitud_naceEnEstadoPendiente() {
        when(repository.save(any(SolicitudCreditoEntity.class))).thenAnswer(invocacion -> invocacion.getArgument(0));

        SolicitudResponse respuesta = service.crear(new CrearSolicitudRequest("123456789", new BigDecimal("1000"), 12));

        assertThat(respuesta.estado()).isEqualTo(EstadoSolicitud.PENDIENTE);
        assertThat(respuesta.cedula()).isEqualTo("123456789");
    }

    @Test
    void cambiarEstado_solicitudPendiente_seAprueba() {
        SolicitudCreditoEntity solicitud = new SolicitudCreditoEntity("123456789", new BigDecimal("1000"), 12);
        when(repository.findById(1L)).thenReturn(Optional.of(solicitud));
        when(repository.save(any(SolicitudCreditoEntity.class))).thenAnswer(invocacion -> invocacion.getArgument(0));

        SolicitudResponse respuesta = service.cambiarEstado(
                1L, new CambiarEstadoRequest(EstadoSolicitud.APROBADA, "Cliente cumple requisitos"));

        assertThat(respuesta.estado()).isEqualTo(EstadoSolicitud.APROBADA);
        assertThat(respuesta.comentario()).isEqualTo("Cliente cumple requisitos");
    }

    @Test
    void cambiarEstado_solicitudYaResuelta_lanzaTransicionInvalida() {
        SolicitudCreditoEntity solicitud = new SolicitudCreditoEntity("123456789", new BigDecimal("1000"), 12);
        solicitud.cambiarEstado(EstadoSolicitud.APROBADA, "Primer comentario");
        when(repository.findById(1L)).thenReturn(Optional.of(solicitud));

        assertThrows(TransicionEstadoInvalidaException.class, () -> service.cambiarEstado(
                1L, new CambiarEstadoRequest(EstadoSolicitud.RECHAZADA, "Intento tardío")));
    }

    @Test
    void cambiarEstado_idInexistente_lanzaSolicitudNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(SolicitudNotFoundException.class, () -> service.cambiarEstado(
                99L, new CambiarEstadoRequest(EstadoSolicitud.APROBADA, "comentario")));
    }

}
