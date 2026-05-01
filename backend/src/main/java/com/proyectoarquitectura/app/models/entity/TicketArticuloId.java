package com.proyectoarquitectura.app.models.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class TicketArticuloId implements Serializable {

    @Column(name = "ticket_id")
    private Integer ticketId;

    @Column(name = "articulo_id")
    private Integer articuloId;
}
