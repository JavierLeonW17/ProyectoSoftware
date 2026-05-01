package com.proyectoarquitectura.app.service.auth;

import com.proyectoarquitectura.app.models.entity.Usuario;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

// Brevo API v3: https://developers.brevo.com/reference/sendtransacemail
// Sin BREVO_API_KEY o BREVO_SENDER_EMAIL no envia, solo loguea (modo dev).
@Slf4j
@Service
public class BrevoEmailService implements EmailService {

    private final RestClient restClient;
    private final String apiKey;
    private final String senderEmail;
    private final String senderName;
    private final String frontendUrl;

    public BrevoEmailService(@Value("${brevo.api-key}") String apiKey,
                             @Value("${brevo.api-url}") String apiUrl,
                             @Value("${brevo.sender.email}") String senderEmail,
                             @Value("${brevo.sender.name}") String senderName,
                             @Value("${app.frontend.url}") String frontendUrl) {
        this.apiKey = apiKey;
        this.senderEmail = senderEmail;
        this.senderName = senderName;
        this.frontendUrl = frontendUrl;
        this.restClient = RestClient.builder().baseUrl(apiUrl).build();
    }

    @Override
    public void enviarVerificacionCorreo(Usuario u, String token) {
        String link = frontendUrl + "/auth/verify-email?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
        log.info("==============================================================");
        log.info("[VERIFY-EMAIL]  usuario={}", u.getCorreo());
        log.info("[VERIFY-EMAIL]  link   ={}", link);
        log.info("[VERIFY-EMAIL]  token  ={}", token);
        log.info("==============================================================");
        String html = """
                <!DOCTYPE html>
                <html><body style="font-family: Arial, sans-serif; color:#111;">
                    <h2>Hola %s,</h2>
                    <p>Gracias por registrarte en TicketHub. Para activar tu cuenta haz clic en el siguiente enlace:</p>
                    <p><a href="%s" style="background:#4F46E5;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Verificar correo</a></p>
                    <p>Si el boton no funciona, copia esta URL en tu navegador:</p>
                    <p><code>%s</code></p>
                    <p>Este enlace expira en 24 horas.</p>
                    <hr/>
                    <p style="color:#666;font-size:12px;">Si tu no creaste esta cuenta, ignora este correo.</p>
                </body></html>
                """.formatted(escapar(u.getNombres()), link, link);

        enviar(u.getCorreo(), u.getNombres() + " " + u.getApellidos(),
                "Verifica tu correo en TicketHub", html);
    }

    @Override
    public void enviarResetPassword(Usuario u, String token) {
        String link = frontendUrl + "/auth/reset-password?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
        log.info("==============================================================");
        log.info("[RESET-PASSWORD] usuario={}", u.getCorreo());
        log.info("[RESET-PASSWORD] link   ={}", link);
        log.info("[RESET-PASSWORD] token  ={}", token);
        log.info("==============================================================");
        String html = """
                <!DOCTYPE html>
                <html><body style="font-family: Arial, sans-serif; color:#111;">
                    <h2>Hola %s,</h2>
                    <p>Recibimos una solicitud para restablecer tu contrasena en TicketHub.</p>
                    <p><a href="%s" style="background:#4F46E5;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Restablecer contrasena</a></p>
                    <p>Si el boton no funciona, copia esta URL en tu navegador:</p>
                    <p><code>%s</code></p>
                    <p>Este enlace expira en 30 minutos.</p>
                    <hr/>
                    <p style="color:#666;font-size:12px;">Si tu no solicitaste el cambio, ignora este correo.</p>
                </body></html>
                """.formatted(escapar(u.getNombres()), link, link);

        enviar(u.getCorreo(), u.getNombres() + " " + u.getApellidos(),
                "Restablece tu contrasena de TicketHub", html);
    }

    @Override
    public void enviar(String toEmail, String toName, String subject, String htmlContent) {
        if (apiKey == null || apiKey.isBlank() || senderEmail == null || senderEmail.isBlank()) {
            log.warn("[BREVO DESACTIVADO] No se envia correo a {} (subject={}). Configura BREVO_API_KEY y BREVO_SENDER_EMAIL.", toEmail, subject);
            log.debug("[BREVO HTML]\n{}", htmlContent);
            return;
        }

        Map<String, Object> body = Map.of(
                "sender", Map.of("name", senderName, "email", senderEmail),
                "to", List.of(Map.of("email", toEmail, "name", toName == null ? toEmail : toName)),
                "subject", subject,
                "htmlContent", htmlContent
        );

        try {
            restClient.post()
                    .uri("")
                    .header("api-key", apiKey)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Correo enviado a {} (subject='{}')", toEmail, subject);
        } catch (RestClientResponseException e) {
            log.error("Brevo respondio {} al enviar a {}: {}",
                    e.getStatusCode(), toEmail, e.getResponseBodyAsString());
            throw new IllegalStateException("No se pudo enviar el correo", e);
        } catch (Exception e) {
            log.error("Error inesperado enviando correo a {}: {}", toEmail, e.getMessage(), e);
            throw new IllegalStateException("No se pudo enviar el correo", e);
        }
    }

    private String escapar(String s) {
        if (s == null) return "";
        return s.replace("<", "&lt;").replace(">", "&gt;");
    }
}
