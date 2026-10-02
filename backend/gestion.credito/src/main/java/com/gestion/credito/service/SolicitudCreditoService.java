package com.gestion.credito.service;

import com.gestion.credito.dto.CambiarEstadoRequest;
import com.gestion.credito.dto.CrearSolicitudRequest;
import com.gestion.credito.dto.SolicitudResponse;
import com.gestion.credito.exception.SolicitudNotFoundException;
import com.gestion.credito.exception.TransicionEstadoInvalidaException;
import com.gestion.credito.model.EstadoSolicitud;
import com.gestion.credito.model.SolicitudCreditoEntity;
import com.gestion.credito.repository.SolicitudCreditoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolicitudCreditoService {

    private final SolicitudCreditoRepository repository;

    public SolicitudCreditoService(SolicitudCreditoRepository repository) {
        this.repository = repository;
    }

    public SolicitudResponse crear(CrearSolicitudRequest request) {
        SolicitudCreditoEntity solicitud = new SolicitudCreditoEntity(
                request.cedula(),
                request.monto(),
                request.plazoMeses()
        );

        SolicitudCreditoEntity guardada = repository.save(solicitud);
        return SolicitudResponse.desde(guardada);
    }

    public List<SolicitudResponse> listar(EstadoSolicitud estado) {
        List<SolicitudCreditoEntity> lista = estado == null ? repository.findAll() : repository.findByEstadoSolicitud(estado);

        return lista.stream().map(SolicitudResponse::desde).toList();
    }

    public SolicitudResponse cambiarEstado(Long id, CambiarEstadoRequest request) {
        SolicitudCreditoEntity solicitud = repository.findById(id)
                .orElseThrow(() -> new SolicitudNotFoundException(id));

        if (solicitud.getEstadoSolicitud() != EstadoSolicitud.PENDIENTE) {
            throw new TransicionEstadoInvalidaException(solicitud.getEstadoSolicitud(), request.estado());
        }

        solicitud.cambiarEstado(request.estado(), request.comentario());
        solicitud = repository.save(solicitud);
        return SolicitudResponse.desde(solicitud);
    }
}
