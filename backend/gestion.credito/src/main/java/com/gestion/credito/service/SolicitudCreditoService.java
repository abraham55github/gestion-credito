package com.gestion.credito.service;

import com.gestion.credito.dto.CambiarEstadoRequest;
import com.gestion.credito.dto.CrearSolicitudRequest;
import com.gestion.credito.dto.SolicitudResponse;
import com.gestion.credito.model.EstadoSolicitud;
import com.gestion.credito.model.SolicitudCredito;
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
        SolicitudCredito solicitud = new SolicitudCredito(
                request.cedula(),
                request.monto(),
                request.plazoMeses()
        );

        SolicitudCredito guardada = repository.save(solicitud);
        return SolicitudResponse.desde(guardada);
    }

    public List<SolicitudResponse> listar(EstadoSolicitud estado) {
        List<SolicitudCredito> lista = estado == null ? repository.findAll() : repository.findByEstadoSolicitud(estado);

        return lista.stream().map(SolicitudResponse::desde).toList();
    }

    public SolicitudResponse cambiarEstado(Long id, CambiarEstadoRequest request) {
        SolicitudCredito solicitud = repository.findById(id).orElseThrow();

        solicitud.cambiarEstado(request.estado(), request.comentario());
        solicitud = repository.save(solicitud);
        return SolicitudResponse.desde(solicitud);
    }



}
