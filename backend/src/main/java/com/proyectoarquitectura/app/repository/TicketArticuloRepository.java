package com.proyectoarquitectura.app.repository;

import com.proyectoarquitectura.app.models.entity.TicketArticulo;
import com.proyectoarquitectura.app.models.entity.TicketArticuloId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketArticuloRepository extends JpaRepository<TicketArticulo, TicketArticuloId> {

    List<TicketArticulo> findByTicketId(Integer ticketId);

    List<TicketArticulo> findByArticuloId(Integer articuloId);

    long countByArticuloIdAndUtilTrue(Integer articuloId);
}
