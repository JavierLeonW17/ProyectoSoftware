package com.proyectoarquitectura.app.repository;

import com.proyectoarquitectura.app.models.entity.Notificacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {

    Page<Notificacion> findByUsuarioIdOrderByCreadoEnDesc(Integer usuarioId, Pageable pageable);

    Page<Notificacion> findByUsuarioIdAndLeidaFalseOrderByCreadoEnDesc(Integer usuarioId, Pageable pageable);

    long countByUsuarioIdAndLeidaFalse(Integer usuarioId);

    @Modifying
    @Query("UPDATE Notificacion n SET n.leida = true, n.leidaEn = :ahora WHERE n.usuario.id = :usuarioId AND n.leida = false")
    int marcarTodasComoLeidas(@Param("usuarioId") Integer usuarioId, @Param("ahora") LocalDateTime ahora);
}
