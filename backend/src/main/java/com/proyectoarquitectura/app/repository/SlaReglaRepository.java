package com.proyectoarquitectura.app.repository;

import com.proyectoarquitectura.app.models.entity.SlaRegla;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SlaReglaRepository extends JpaRepository<SlaRegla, Integer> {

    List<SlaRegla> findByActivoTrue();

    // findFirst (no findBy) porque el seed tiene varias reglas para la misma prioridad+rol.
    Optional<SlaRegla> findFirstByPrioridadAndAplicaRolIdAndActivoTrueOrderByIdAsc(String prioridad, Integer rolId);

    List<SlaRegla> findByPrioridad(String prioridad);
}
