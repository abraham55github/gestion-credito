package com.gestion.credito.service;

import com.gestion.credito.dto.CrearSolicitudRequest;
import com.gestion.credito.dto.SolicitudResponse;
import com.gestion.credito.model.SolicitudCredito;
import com.gestion.credito.repository.SolicitudCreditoRepository;
import org.springframework.stereotype.Service;

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
}
