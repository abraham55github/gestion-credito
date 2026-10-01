package com.gestion.credito.controller;

import com.gestion.credito.dto.CambiarEstadoRequest;
import com.gestion.credito.dto.CrearSolicitudRequest;
import com.gestion.credito.dto.SolicitudResponse;
import com.gestion.credito.model.EstadoSolicitud;
import com.gestion.credito.service.SolicitudCreditoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<SolicitudResponse>> listar(
            @RequestParam(required = false) EstadoSolicitud estado
    ) {
        List<SolicitudResponse> lista = service.listar(estado);
        return ResponseEntity.ok(lista);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<SolicitudResponse> cambiarEstado(
            @PathVariable Long id,
            @Valid @RequestBody CambiarEstadoRequest request
    ) {
        SolicitudResponse actualizada = service.cambiarEstado(id, request);
        return ResponseEntity.ok(actualizada);
    }
}
