package com.proyectoarquitectura.app.security;

import com.proyectoarquitectura.app.models.entity.Usuario;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Getter
public class CustomUserDetails implements UserDetails {

    private final Usuario usuario;

    public CustomUserDetails(Usuario usuario) {
        this.usuario = usuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (usuario.getRol() == null || usuario.getRol().getNombre() == null) {
            return List.of();
        }
        return List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombre().toUpperCase()));
    }

    @Override
    public String getPassword() {
        return usuario.getContrasenaHash();
    }

    @Override
    public String getUsername() {
        return usuario.getCorreo();
    }

    @Override
    public boolean isAccountNonExpired() {
        return !"eliminado".equalsIgnoreCase(usuario.getEstado());
    }

    @Override
    public boolean isAccountNonLocked() {
        if ("suspendido".equalsIgnoreCase(usuario.getEstado())) return false;
        LocalDateTime hasta = usuario.getBloqueadoHasta();
        return hasta == null || hasta.isBefore(LocalDateTime.now());
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return "activo".equalsIgnoreCase(usuario.getEstado());
    }
}
