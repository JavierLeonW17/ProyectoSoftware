package com.proyectoarquitectura.app.repository;

import com.proyectoarquitectura.app.models.entity.Evidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvidenciaRepository extends JpaRepository<Evidencia, Integer> {

    List<Evidencia> findByTicketId(Integer ticketId);

    List<Evidencia> findByComentarioId(Integer comentarioId);
}
