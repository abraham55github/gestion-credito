package com.gestion.credito.auth.dto;

import com.gestion.credito.auth.model.UsuarioEntity;

public record UsuarioResponse(
        String cedula,
        String nombre,
        String apellido,
        String correo
) {

    public static UsuarioResponse desde(UsuarioEntity usuario) {
        return new UsuarioResponse(
                usuario.getCedula(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail()
        );
    }
}
