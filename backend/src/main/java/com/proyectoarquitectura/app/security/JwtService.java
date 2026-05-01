package com.proyectoarquitectura.app.security;

import com.proyectoarquitectura.app.models.entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Date;
import java.util.HexFormat;
import java.util.UUID;

@Slf4j
@Service
public class JwtService {

    public static final String CLAIM_PURPOSE = "purpose";
    public static final String CLAIM_ROL = "rol";
    public static final String CLAIM_USER_ID = "uid";

    private final SecretKey signingKey;
    private final String issuer;
    @Getter private final long accessExpirationMs;
    @Getter private final long refreshExpirationMs;
    private final long verifyEmailExpirationMs;
    private final long resetPasswordExpirationMs;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.issuer}") String issuer,
                      @Value("${app.jwt.access-expiration-ms}") long accessExpirationMs,
                      @Value("${app.jwt.refresh-expiration-ms}") long refreshExpirationMs,
                      @Value("${app.jwt.verify-email-expiration-ms}") long verifyEmailExpirationMs,
                      @Value("${app.jwt.reset-password-expiration-ms}") long resetPasswordExpirationMs) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                    "app.jwt.secret no esta configurado. Define la variable de entorno JWT_SECRET (minimo 32 caracteres).");
        }
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException(
                    "app.jwt.secret debe tener al menos 32 bytes para HMAC-SHA256.");
        }
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.issuer = issuer;
        this.accessExpirationMs = accessExpirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
        this.verifyEmailExpirationMs = verifyEmailExpirationMs;
        this.resetPasswordExpirationMs = resetPasswordExpirationMs;
    }

    public String generateAccessToken(Usuario u) {
        return buildToken(u, TokenPurpose.ACCESS, accessExpirationMs);
    }

    public String generateRefreshToken(Usuario u) {
        return buildToken(u, TokenPurpose.REFRESH, refreshExpirationMs);
    }

    public String generateVerifyEmailToken(Usuario u) {
        return buildToken(u, TokenPurpose.VERIFY_EMAIL, verifyEmailExpirationMs);
    }

    public String generateResetPasswordToken(Usuario u) {
        return buildToken(u, TokenPurpose.RESET_PASSWORD, resetPasswordExpirationMs);
    }

    private String buildToken(Usuario u, TokenPurpose purpose, long ttlMs) {
        Instant now = Instant.now();
        Instant exp = now.plusMillis(ttlMs);

        var builder = Jwts.builder()
                .id(UUID.randomUUID().toString())
                .issuer(issuer)
                .subject(u.getCorreo())
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .claim(CLAIM_PURPOSE, purpose.name())
                .claim(CLAIM_USER_ID, u.getId());

        if (u.getRol() != null && u.getRol().getNombre() != null) {
            builder.claim(CLAIM_ROL, u.getRol().getNombre());
        }
        return builder.signWith(signingKey, Jwts.SIG.HS256).compact();
    }

    public Claims parseAndValidate(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public TokenPurpose extractPurpose(Claims claims) {
        String p = claims.get(CLAIM_PURPOSE, String.class);
        if (p == null) return null;
        try {
            return TokenPurpose.valueOf(p);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public Integer extractUserId(Claims claims) {
        Object uid = claims.get(CLAIM_USER_ID);
        if (uid instanceof Integer i) return i;
        if (uid instanceof Number n) return n.intValue();
        return null;
    }

    // Hash usado en sesiones.token_hash para no almacenar el refresh token en claro.
    public String hashToken(String token) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 no disponible", e);
        }
    }
}
