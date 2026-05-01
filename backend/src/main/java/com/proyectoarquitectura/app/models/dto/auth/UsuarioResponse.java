package com.proyectoarquitectura.app.models.dto.auth;

import com.proyectoarquitectura.app.models.entity.Usuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioResponse {
    private Integer id;
    private String nombres;
    private String apellidos;
    private String correo;
    private String rol;
    private String estado;

    public static UsuarioResponse from(Usuario u) {
        return UsuarioResponse.builder()
                .id(u.getId())
                .nombres(u.getNombres())
                .apellidos(u.getApellidos())
                .correo(u.getCorreo())
                .rol(u.getRol() != null ? u.getRol().getNombre() : null)
                .estado(u.getEstado())
                .build();
    }
}
