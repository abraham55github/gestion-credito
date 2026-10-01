package com.gestion.credito.repository;

import com.gestion.credito.model.EstadoSolicitud;
import com.gestion.credito.model.SolicitudCredito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitudCreditoRepository extends JpaRepository<SolicitudCredito, Long> {
    List<SolicitudCredito> findByEstadoSolicitud(EstadoSolicitud estado);
}
