package com.proyectoarquitectura.app.repository;

import com.proyectoarquitectura.app.models.entity.Sesion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SesionRepository extends JpaRepository<Sesion, Integer> {

    Optional<Sesion> findByTokenHash(String tokenHash);

    List<Sesion> findByUsuarioId(Integer usuarioId);

    List<Sesion> findByUsuarioIdAndCerradoEnIsNullAndExpiraEnAfter(Integer usuarioId, LocalDateTime now);
}
