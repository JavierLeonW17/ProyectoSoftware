package com.proyectoarquitectura.app.repository;

import com.proyectoarquitectura.app.models.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByCorreo(String correo);

    // JOIN FETCH del rol para evitar LazyInitializationException cuando se usa fuera de transaccion
    // (JwtAuthenticationFilter y CustomUserDetailsService).
    @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.rol WHERE u.correo = :correo")
    Optional<Usuario> findByCorreoConRol(@Param("correo") String correo);

    Optional<Usuario> findByNumeroDocumento(String numeroDocumento);

    boolean existsByCorreo(String correo);

    boolean existsByNumeroDocumento(String numeroDocumento);

    List<Usuario> findByRolId(Integer rolId);

    List<Usuario> findByEmpresaId(Integer empresaId);

    List<Usuario> findByAreaId(Integer areaId);

    List<Usuario> findByEstado(String estado);

    List<Usuario> findByRolIdAndEstado(Integer rolId, String estado);
}
