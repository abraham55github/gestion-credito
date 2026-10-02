package com.gestion.credito.controller;

import com.gestion.credito.dto.CambiarEstadoRequest;
import com.gestion.credito.dto.CrearSolicitudRequest;
import com.gestion.credito.dto.ErrorResponse;
import com.gestion.credito.dto.SolicitudResponse;
import com.gestion.credito.model.EstadoSolicitud;
import com.gestion.credito.service.SolicitudCreditoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/solicitudes")
@Tag(name = "Solicitudes de crédito", description = "Crear, listar y resolver solicitudes de crédito")
public class SolicitudCreditoController {

    private final SolicitudCreditoService service;

    public SolicitudCreditoController(SolicitudCreditoService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(
            summary = "Crear una solicitud de crédito",
            description = "Monto entre 500 y 50000, plazo entre 6 y 60 meses. Nace siempre en estado PENDIENTE."
    )
    @ApiResponse(responseCode = "201", description = "Solicitud creada")
    @ApiResponse(responseCode = "400", description = "Datos inválidos (monto/plazo fuera de rango, cédula vacía)",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
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
    @Operation(summary = "Listar solicitudes", description = "Filtro opcional por estado; sin parámetro devuelve todas.")
    @ApiResponse(responseCode = "200", description = "Listado obtenido")
    public ResponseEntity<List<SolicitudResponse>> listar(
            @Parameter(description = "Estado por el que filtrar (opcional)")
            @RequestParam(required = false) EstadoSolicitud estado
    ) {
        List<SolicitudResponse> lista = service.listar(estado);
        return ResponseEntity.ok(lista);
    }

    @PatchMapping("/{id}/estado")
    @Operation(
            summary = "Aprobar o rechazar una solicitud",
            description = "Solo se puede resolver una solicitud que esté en estado PENDIENTE. El comentario es obligatorio."
    )
    @ApiResponse(responseCode = "200", description = "Estado actualizado")
    @ApiResponse(responseCode = "404", description = "No existe una solicitud con ese id",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "La solicitud ya fue resuelta previamente",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public ResponseEntity<SolicitudResponse> cambiarEstado(
            @Parameter(description = "Id de la solicitud") @PathVariable Long id,
            @Valid @RequestBody CambiarEstadoRequest request
    ) {
        SolicitudResponse actualizada = service.cambiarEstado(id, request);
        return ResponseEntity.ok(actualizada);
    }
}
