package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.ExperienciaLaboral;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExperienciaLaboralRepository extends JpaRepository<ExperienciaLaboral, Long> {
    List<ExperienciaLaboral> findByPerfilIdPerfilOrderByIdDesc(Long perfilId);
}