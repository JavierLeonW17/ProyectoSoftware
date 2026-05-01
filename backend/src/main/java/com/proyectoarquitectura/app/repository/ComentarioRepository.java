package com.proyectoarquitectura.app.repository;

import com.proyectoarquitectura.app.models.entity.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {

    List<Comentario> findByTicketIdOrderByCreadoEnAsc(Integer ticketId);

    List<Comentario> findByTicketIdAndEsNotaInternaFalseOrderByCreadoEnAsc(Integer ticketId);

    long countByTicketId(Integer ticketId);
}
