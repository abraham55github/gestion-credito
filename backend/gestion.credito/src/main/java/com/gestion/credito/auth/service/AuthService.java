package com.gestion.credito.auth.service;

import com.gestion.credito.auth.dto.RegisterRequest;
import com.gestion.credito.auth.dto.UsuarioResponse;
import com.gestion.credito.auth.model.UsuarioEntity;
import com.gestion.credito.auth.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public UsuarioResponse registrar(RegisterRequest request) {
        // constraseña en texto plano
        UsuarioEntity usuario = new UsuarioEntity(
                request.cedula(),
                request.password(),
                request.nombre(),
                request.apellido(),
                request.correo()
        );

        UsuarioEntity guardado = usuarioRepository.save(usuario);
        return UsuarioResponse.desde(guardado);
    }
}
