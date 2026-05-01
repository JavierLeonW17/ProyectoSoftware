package com.proyectoarquitectura.app.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BusinessException extends RuntimeException {

    private final HttpStatus status;

    public BusinessException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public static BusinessException badRequest(String msg) {
        return new BusinessException(HttpStatus.BAD_REQUEST, msg);
    }

    public static BusinessException forbidden(String msg) {
        return new BusinessException(HttpStatus.FORBIDDEN, msg);
    }

    public static BusinessException conflict(String msg) {
        return new BusinessException(HttpStatus.CONFLICT, msg);
    }
}
