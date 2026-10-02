package com.gestion.credito.auth.service;

import com.gestion.credito.auth.dto.AuthResponse;
import com.gestion.credito.auth.dto.LoginRequest;
import com.gestion.credito.auth.dto.RegisterRequest;
import com.gestion.credito.auth.dto.UsuarioResponse;
import com.gestion.credito.auth.exception.CredencialesInvalidasException;
import com.gestion.credito.auth.exception.UsuarioYaExisteException;
import com.gestion.credito.auth.model.UsuarioEntity;
import com.gestion.credito.auth.repository.UsuarioRepository;
import com.gestion.credito.auth.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public UsuarioResponse registrar(RegisterRequest request) {
        if (usuarioRepository.existsByCedula(request.cedula())) {
            throw UsuarioYaExisteException.porCedula(request.cedula());
        }
        if (usuarioRepository.existsByEmail(request.correo())) {
            throw UsuarioYaExisteException.porEmail(request.correo());
        }

        UsuarioEntity usuario = new UsuarioEntity(
                request.cedula(),
                passwordEncoder.encode(request.password()),
                request.nombre(),
                request.apellido(),
                request.correo()
        );

        UsuarioEntity guardado = usuarioRepository.save(usuario);
        return UsuarioResponse.desde(guardado);
    }

    public AuthResponse login(LoginRequest request) {
        UsuarioEntity usuario = usuarioRepository.findByEmail(request.correo())
                .orElseThrow(CredencialesInvalidasException::new);

        if (!passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new CredencialesInvalidasException();
        }

        return new AuthResponse(jwtService.generarToken(usuario.getEmail()));
    }
}
