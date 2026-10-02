package com.gestion.credito.repository;

import com.gestion.credito.model.EstadoSolicitud;
import com.gestion.credito.model.SolicitudCreditoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitudCreditoRepository extends JpaRepository<SolicitudCreditoEntity, Long> {
    List<SolicitudCreditoEntity> findByEstadoSolicitud(EstadoSolicitud estado);
}
