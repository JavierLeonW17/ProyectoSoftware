package com.proyectoarquitectura.app.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class AuthException extends RuntimeException {

    private final HttpStatus status;

    public AuthException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public static AuthException badRequest(String msg) {
        return new AuthException(HttpStatus.BAD_REQUEST, msg);
    }

    public static AuthException unauthorized(String msg) {
        return new AuthException(HttpStatus.UNAUTHORIZED, msg);
    }

    public static AuthException conflict(String msg) {
        return new AuthException(HttpStatus.CONFLICT, msg);
    }

    public static AuthException notFound(String msg) {
        return new AuthException(HttpStatus.NOT_FOUND, msg);
    }
}
