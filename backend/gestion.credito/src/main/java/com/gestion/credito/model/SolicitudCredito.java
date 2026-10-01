package com.gestion.credito.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitud_credito")
public class SolicitudCredito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String cedula;

    @Column(nullable = false)
    private BigDecimal monto;

    @Column(nullable = false)
    private Integer plazoMeses;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSolicitud estadoSolicitud;

    @Column
    private String comentario;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    @Column
    private LocalDateTime fechaActualizacion;

    protected SolicitudCredito() {
    }

    public SolicitudCredito(String cedula, BigDecimal monto, Integer plazoMeses) {
        this.cedula = cedula;
        this.monto = monto;
        this.plazoMeses = plazoMeses;
        this.estadoSolicitud = EstadoSolicitud.PENDIENTE;
        this.fechaCreacion = LocalDateTime.now();
    }

    public void cambiarEstado(EstadoSolicitud nuevoEstado, String comentario) {
        this.estadoSolicitud = nuevoEstado;
        this.comentario = comentario;
        this.fechaActualizacion = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getCedula() {
        return cedula;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public Integer getPlazoMeses() {
        return plazoMeses;
    }

    public EstadoSolicitud getEstadoSolicitud() {
        return estadoSolicitud;
    }

    public String getComentario() {
        return comentario;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

}
