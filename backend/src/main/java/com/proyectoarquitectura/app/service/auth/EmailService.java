package com.proyectoarquitectura.app.service.auth;

import com.proyectoarquitectura.app.models.entity.Usuario;

public interface EmailService {

    void enviarVerificacionCorreo(Usuario usuario, String token);

    void enviarResetPassword(Usuario usuario, String token);

    void enviar(String toEmail, String toName, String subject, String htmlContent);
}
