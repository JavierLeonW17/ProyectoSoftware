package com.proyectoarquitectura.app.models.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "sla_reglas")
public class SlaRegla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 20)
    private String prioridad;

    @Column(name = "tiempo_respuesta_horas", nullable = false)
    private Integer tiempoRespuestaHoras;

    @Column(name = "tiempo_resolucion_horas", nullable = false)
    private Integer tiempoResolucionHoras;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aplica_rol_id")
    private Rol aplicaRol;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;
}
