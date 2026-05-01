package com.proyectoarquitectura.app.repository;

import com.proyectoarquitectura.app.models.entity.LogAcceso;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LogAccesoRepository extends JpaRepository<LogAcceso, Integer> {

    Page<LogAcceso> findByCorreoIntentoOrderByCreadoEnDesc(String correoIntento, Pageable pageable);

    List<LogAcceso> findByUsuarioIdOrderByCreadoEnDesc(Integer usuarioId);

    long countByCorreoIntentoAndExitosoFalseAndCreadoEnAfter(String correoIntento, LocalDateTime desde);
}
