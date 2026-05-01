package com.proyectoarquitectura.app.service.auth;

import com.proyectoarquitectura.app.models.dto.auth.AuthResponse;
import com.proyectoarquitectura.app.models.dto.auth.LoginRequest;
import com.proyectoarquitectura.app.models.dto.auth.RegisterRequest;
import com.proyectoarquitectura.app.models.dto.auth.UsuarioResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {

    UsuarioResponse register(RegisterRequest req);

    void verifyEmail(String token);

    AuthResponse login(LoginRequest req, HttpServletRequest httpRequest);

    AuthResponse refresh(String refreshToken);

    void logout(String refreshToken);

    void forgotPassword(String correo);

    void resetPassword(String token, String nuevaContrasena);
}
