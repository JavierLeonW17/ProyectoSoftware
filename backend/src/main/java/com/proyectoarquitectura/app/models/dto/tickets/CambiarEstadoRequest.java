package com.proyectoarquitectura.app.models.dto.tickets;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CambiarEstadoRequest {

    @NotBlank
    @Pattern(
            regexp = "abierto|en_proceso|cerrado|vencido|cancelado|reabierto",
            message = "estado invalido"
    )
    private String estado;
}
