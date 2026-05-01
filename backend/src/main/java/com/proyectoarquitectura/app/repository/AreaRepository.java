package com.proyectoarquitectura.app.repository;

import com.proyectoarquitectura.app.models.entity.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AreaRepository extends JpaRepository<Area, Integer> {

    Optional<Area> findByNombre(String nombre);

    List<Area> findByActivoTrue();
}
