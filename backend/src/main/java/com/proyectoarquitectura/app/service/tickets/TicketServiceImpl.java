package com.proyectoarquitectura.app.service.tickets;

import com.proyectoarquitectura.app.exception.BusinessException;
import com.proyectoarquitectura.app.exception.NotFoundException;
import com.proyectoarquitectura.app.models.dto.tickets.CreateTicketRequest;
import com.proyectoarquitectura.app.models.dto.tickets.TicketResponse;
import com.proyectoarquitectura.app.models.entity.Categoria;
import com.proyectoarquitectura.app.models.entity.HistorialTicket;
import com.proyectoarquitectura.app.models.entity.SlaRegla;
import com.proyectoarquitectura.app.models.entity.Ticket;
import com.proyectoarquitectura.app.models.entity.Usuario;
import com.proyectoarquitectura.app.repository.CategoriaRepository;
import com.proyectoarquitectura.app.repository.HistorialTicketRepository;
import com.proyectoarquitectura.app.repository.SlaReglaRepository;
import com.proyectoarquitectura.app.repository.TicketRepository;
import com.proyectoarquitectura.app.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final SlaReglaRepository slaReglaRepository;
    private final HistorialTicketRepository historialTicketRepository;

    public TicketServiceImpl(TicketRepository ticketRepository,
                             UsuarioRepository usuarioRepository,
                             CategoriaRepository categoriaRepository,
                             SlaReglaRepository slaReglaRepository,
                             HistorialTicketRepository historialTicketRepository) {
        this.ticketRepository = ticketRepository;
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
        this.slaReglaRepository = slaReglaRepository;
        this.historialTicketRepository = historialTicketRepository;
    }

    @Override
    @Transactional
    public TicketResponse crear(CreateTicketRequest req, Integer clienteId) {
        Usuario cliente = usuarioRepository.findById(clienteId)
                .orElseThrow(() -> new NotFoundException("Cliente no encontrado"));

        Categoria categoria = categoriaRepository.findById(req.getCategoriaId())
                .orElseThrow(() -> new NotFoundException("Categoria no encontrada"));

        SlaRegla sla = slaReglaRepository
                .findFirstByPrioridadAndAplicaRolIdAndActivoTrueOrderByIdAsc(req.getPrioridad(), cliente.getRol().getId())
                .orElse(null);

        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime venceSla = sla != null
                ? ahora.plusHours(sla.getTiempoResolucionHoras())
                : null;

        // codigo es NOT NULL UNIQUE; pongo un placeholder y lo reemplazo tras el INSERT,
        // cuando ya tengo el id. Asi no dependemos del trigger fn_generar_codigo_ticket.
        String codigoTemporal = "TMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Ticket t = Ticket.builder()
                .codigo(codigoTemporal)
                .asunto(req.getAsunto().trim())
                .descripcion(req.getDescripcion().trim())
                .tipo(req.getTipo())
                .prioridad(req.getPrioridad() == null ? "media" : req.getPrioridad())
                .estado("abierto")
                .categoria(categoria)
                .cliente(cliente)
                .slaRegla(sla)
                .fechaVencimientoSla(venceSla)
                .build();

        t = ticketRepository.save(t);
        t.setCodigo(String.format("TKT-%04d", t.getId()));

        log.info("Ticket creado id={} codigo={} cliente={} prioridad={}",
                t.getId(), t.getCodigo(), cliente.getCorreo(), t.getPrioridad());
        return TicketResponse.from(t);
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse obtenerPorId(Integer id) {
        return TicketResponse.from(buscar(id));
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse obtenerPorCodigo(String codigo) {
        Ticket t = ticketRepository.findByCodigo(codigo)
                .orElseThrow(() -> new NotFoundException("Ticket no encontrado: " + codigo));
        return TicketResponse.from(t);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TicketResponse> listar(Pageable pageable) {
        return ticketRepository.findAll(pageable).map(TicketResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TicketResponse> listarPorCliente(Integer clienteId, Pageable pageable) {
        return ticketRepository.findByClienteId(clienteId, pageable).map(TicketResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TicketResponse> listarPorAgente(Integer agenteId, Pageable pageable) {
        return ticketRepository.findByAgenteId(agenteId, pageable).map(TicketResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TicketResponse> listarPorEstado(String estado, Pageable pageable) {
        return ticketRepository.findByEstado(estado, pageable).map(TicketResponse::from);
    }

    @Override
    @Transactional
    public TicketResponse asignarAgente(Integer ticketId, Integer agenteId) {
        Ticket t = buscar(ticketId);
        Usuario agente = usuarioRepository.findById(agenteId)
                .orElseThrow(() -> new NotFoundException("Agente no encontrado"));

        if (agente.getRol() == null || !"agente".equalsIgnoreCase(agente.getRol().getNombre())) {
            throw BusinessException.badRequest("El usuario " + agenteId + " no tiene rol agente");
        }
        if (!"activo".equalsIgnoreCase(agente.getEstado())) {
            throw BusinessException.badRequest("El agente no esta activo");
        }
        if ("cerrado".equalsIgnoreCase(t.getEstado()) || "cancelado".equalsIgnoreCase(t.getEstado())) {
            throw BusinessException.badRequest("No se puede asignar un ticket cerrado o cancelado");
        }

        t.setAgente(agente);
        ticketRepository.save(t);
        log.info("Ticket {} asignado a agente {}", t.getCodigo(), agente.getCorreo());
        return TicketResponse.from(t);
    }

    @Override
    @Transactional
    public TicketResponse cambiarEstado(Integer ticketId, String nuevoEstado, Integer usuarioActorId) {
        Ticket t = buscar(ticketId);
        String anterior = t.getEstado();

        if (anterior.equalsIgnoreCase(nuevoEstado)) {
            return TicketResponse.from(t);
        }
        validarTransicion(anterior, nuevoEstado);

        t.setEstado(nuevoEstado);
        LocalDateTime ahora = LocalDateTime.now();

        // Reemplaza al trigger fn_registrar_cambio_estado que no esta creado en la BD.
        if ("en_proceso".equalsIgnoreCase(nuevoEstado) && "abierto".equalsIgnoreCase(anterior)) {
            t.setFechaInicioAtencion(ahora);
        }
        if ("cerrado".equalsIgnoreCase(nuevoEstado) && !"cerrado".equalsIgnoreCase(anterior)) {
            t.setFechaCierre(ahora);
            if (t.getFechaInicioAtencion() != null) {
                long minutos = java.time.Duration.between(t.getFechaInicioAtencion(), ahora).toMinutes();
                t.setTiempoSolucionMinutos((int) minutos);
            }
        }

        ticketRepository.save(t);
        registrarHistorialEstado(t, anterior, nuevoEstado, usuarioActorId);

        log.info("Ticket {} estado: {} -> {} (usuario_id={})", t.getCodigo(), anterior, nuevoEstado, usuarioActorId);
        return TicketResponse.from(t);
    }

    private void registrarHistorialEstado(Ticket t, String anterior, String nuevo, Integer actorId) {
        try {
            Usuario actor = actorId != null ? usuarioRepository.findById(actorId).orElse(null) : null;
            HistorialTicket h = HistorialTicket.builder()
                    .ticket(t)
                    .usuario(actor)
                    .tipoAccion("cambio_estado")
                    .campoModificado("estado")
                    .valorAnterior(anterior)
                    .valorNuevo(nuevo)
                    .descripcion("Estado cambiado de " + anterior + " a " + nuevo)
                    .build();
            historialTicketRepository.save(h);
        } catch (Exception e) {
            log.warn("No se pudo registrar historial del ticket {}: {}", t.getCodigo(), e.getMessage());
        }
    }

    private Ticket buscar(Integer id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket no encontrado: " + id));
    }

    private void validarTransicion(String desde, String hacia) {
        if ("cerrado".equalsIgnoreCase(desde) && !"reabierto".equalsIgnoreCase(hacia)) {
            throw BusinessException.badRequest("Un ticket cerrado solo puede pasar a reabierto");
        }
        if ("cancelado".equalsIgnoreCase(desde)) {
            throw BusinessException.badRequest("Un ticket cancelado no puede cambiar de estado");
        }
    }
}
