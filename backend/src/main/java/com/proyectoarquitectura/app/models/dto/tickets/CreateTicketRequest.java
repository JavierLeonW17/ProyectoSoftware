package com.proyectoarquitectura.app.models.dto.tickets;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateTicketRequest {

    @NotBlank(message = "El asunto es obligatorio")
    @Size(max = 200)
    private String asunto;

    @NotBlank(message = "La descripcion es obligatoria")
    private String descripcion;

    @NotBlank(message = "El tipo es obligatorio")
    @Pattern(regexp = "problema|solicitud|consulta", message = "tipo debe ser: problema, solicitud o consulta")
    private String tipo;

    @Pattern(regexp = "alta|media|baja", message = "prioridad debe ser: alta, media o baja")
    @Builder.Default
    private String prioridad = "media";

    @NotNull(message = "La categoria es obligatoria")
    private Integer categoriaId;
}
