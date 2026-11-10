package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.HabilidadProfesional;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HabilidadProfesionalRepository extends JpaRepository<HabilidadProfesional, Long> {
    List<HabilidadProfesional> findByPerfilIdPerfilOrderByIdDesc(Long perfilId);
}
