package com.proyectoarquitectura.app.repository;

import com.proyectoarquitectura.app.models.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    Optional<Ticket> findByCodigo(String codigo);

    Page<Ticket> findByClienteId(Integer clienteId, Pageable pageable);

    Page<Ticket> findByAgenteId(Integer agenteId, Pageable pageable);

    Page<Ticket> findByEstado(String estado, Pageable pageable);

    List<Ticket> findByEstadoIn(List<String> estados);

    List<Ticket> findByPrioridadAndEstadoIn(String prioridad, List<String> estados);

    long countByEstado(String estado);

    long countByAgenteIdAndEstado(Integer agenteId, String estado);

    @Query("""
            SELECT t FROM Ticket t
            WHERE t.estado IN ('abierto','en_proceso')
              AND t.fechaVencimientoSla IS NOT NULL
              AND t.fechaVencimientoSla > :ahora
              AND t.fechaVencimientoSla < :limite
            ORDER BY t.fechaVencimientoSla ASC
            """)
    List<Ticket> findTicketsEnRiesgoSla(@Param("ahora") LocalDateTime ahora,
                                        @Param("limite") LocalDateTime limite);

    @Query("""
            SELECT t FROM Ticket t
            WHERE t.estado IN ('abierto','en_proceso')
              AND t.fechaVencimientoSla IS NOT NULL
              AND t.fechaVencimientoSla < :ahora
            """)
    List<Ticket> findTicketsVencidos(@Param("ahora") LocalDateTime ahora);
}
