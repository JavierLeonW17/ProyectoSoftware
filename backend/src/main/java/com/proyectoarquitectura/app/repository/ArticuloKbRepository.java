package com.proyectoarquitectura.app.repository;

import com.proyectoarquitectura.app.models.entity.ArticuloKb;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticuloKbRepository extends JpaRepository<ArticuloKb, Integer> {

    Optional<ArticuloKb> findBySlug(String slug);

    Page<ArticuloKb> findByEstado(String estado, Pageable pageable);

    Page<ArticuloKb> findByCategoriaIdAndEstado(Integer categoriaId, String estado, Pageable pageable);

    List<ArticuloKb> findTop10ByEstadoOrderByVistasDesc(String estado);

    Page<ArticuloKb> findByEstadoAndTituloContainingIgnoreCase(String estado, String titulo, Pageable pageable);
}
