package com.proyectoarquitectura.app.models.dto.tickets;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AsignarAgenteRequest {

    @NotNull(message = "El id del agente es obligatorio")
    private Integer agenteId;
}
