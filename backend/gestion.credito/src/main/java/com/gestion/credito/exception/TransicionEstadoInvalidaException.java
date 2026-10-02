package com.gestion.credito.exception;

import com.gestion.credito.model.EstadoSolicitud;

public class TransicionEstadoInvalidaException extends RuntimeException {

    public TransicionEstadoInvalidaException(EstadoSolicitud estadoActual, EstadoSolicitud estadoSolicitado) {
        super("No se puede cambiar una solicitud de estado " + estadoActual
                + " a " + estadoSolicitado + ". Solo se pueden resolver solicitudes en estado PENDIENTE.");
    }
}
