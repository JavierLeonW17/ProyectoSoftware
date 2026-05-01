package com.proyectoarquitectura.app.service.tickets;

import com.proyectoarquitectura.app.models.dto.tickets.CreateTicketRequest;
import com.proyectoarquitectura.app.models.dto.tickets.TicketResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TicketService {

    TicketResponse crear(CreateTicketRequest req, Integer clienteId);

    TicketResponse obtenerPorId(Integer id);

    TicketResponse obtenerPorCodigo(String codigo);

    Page<TicketResponse> listar(Pageable pageable);

    Page<TicketResponse> listarPorCliente(Integer clienteId, Pageable pageable);

    Page<TicketResponse> listarPorAgente(Integer agenteId, Pageable pageable);

    Page<TicketResponse> listarPorEstado(String estado, Pageable pageable);

    TicketResponse asignarAgente(Integer ticketId, Integer agenteId);

    TicketResponse cambiarEstado(Integer ticketId, String nuevoEstado, Integer usuarioActorId);
}
