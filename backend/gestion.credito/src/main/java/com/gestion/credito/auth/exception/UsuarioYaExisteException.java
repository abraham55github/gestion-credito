package com.gestion.credito.auth.exception;

public class UsuarioYaExisteException extends RuntimeException {

    private UsuarioYaExisteException(String mensaje) {
        super(mensaje);
    }

    public static UsuarioYaExisteException porCedula(String cedula) {
        return new UsuarioYaExisteException("Ya existe un usuario registrado con la cédula '" + cedula + "'");
    }

    public static UsuarioYaExisteException porEmail(String email) {
        return new UsuarioYaExisteException("Ya existe un usuario registrado con el correo '" + email + "'");
    }
}
