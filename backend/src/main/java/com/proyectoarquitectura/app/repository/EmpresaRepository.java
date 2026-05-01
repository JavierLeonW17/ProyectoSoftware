package com.proyectoarquitectura.app.repository;

import com.proyectoarquitectura.app.models.entity.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {

    Optional<Empresa> findByNit(String nit);

    List<Empresa> findByEstado(String estado);

    boolean existsByNit(String nit);
}
