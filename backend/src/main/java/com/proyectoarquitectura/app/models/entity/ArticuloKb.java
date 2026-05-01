package com.proyectoarquitectura.app.models.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "articulos_kb")
public class ArticuloKb {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, unique = true, length = 220)
    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(length = 500)
    private String resumen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "autor_id")
    private Usuario autor;

    @Column(nullable = false)
    @Builder.Default
    private Integer vistas = 0;

    @Column(name = "valoracion_promedio", precision = 2, scale = 1)
    @Builder.Default
    private BigDecimal valoracionPromedio = BigDecimal.ZERO;

    @Column(name = "total_valoraciones", nullable = false)
    @Builder.Default
    private Integer totalValoraciones = 0;

    @Column(name = "tiempo_lectura_minutos")
    private Integer tiempoLecturaMinutos;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "borrador";

    @Column(name = "publicado_en")
    private LocalDateTime publicadoEn;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en", nullable = false)
    private LocalDateTime actualizadoEn;
}
