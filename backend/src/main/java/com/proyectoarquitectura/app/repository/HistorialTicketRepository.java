package com.proyectoarquitectura.app.repository;

import com.proyectoarquitectura.app.models.entity.HistorialTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialTicketRepository extends JpaRepository<HistorialTicket, Integer> {

    List<HistorialTicket> findByTicketIdOrderByCreadoEnDesc(Integer ticketId);

    List<HistorialTicket> findByTicketIdAndTipoAccion(Integer ticketId, String tipoAccion);
}
