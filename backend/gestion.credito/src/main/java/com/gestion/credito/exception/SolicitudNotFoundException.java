package com.gestion.credito.exception;

public class SolicitudNotFoundException extends RuntimeException {

    public SolicitudNotFoundException(Long id) {
        super("No existe una solicitud de crédito con id " + id);
    }
}
