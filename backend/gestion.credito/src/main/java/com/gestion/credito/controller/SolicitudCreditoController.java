package com.gestion.credito.controller;

import com.gestion.credito.dto.CrearSolicitudRequest;
import com.gestion.credito.dto.SolicitudResponse;
import com.gestion.credito.service.SolicitudCreditoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/solicitudes")
public class SolicitudCreditoController {

    private final SolicitudCreditoService service;

    public SolicitudCreditoController(SolicitudCreditoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SolicitudResponse> crear(
            @Valid @RequestBody CrearSolicitudRequest request,
            UriComponentsBuilder uriBuilder
    ) {
        SolicitudResponse creada = service.crear(request);

        return ResponseEntity
                .created(uriBuilder.path("/solicitudes/{id}").build(creada.id()))
                .body(creada);
    }
}
