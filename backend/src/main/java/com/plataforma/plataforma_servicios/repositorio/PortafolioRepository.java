package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.Portafolio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PortafolioRepository extends JpaRepository<Portafolio, Long> {
    List<Portafolio> findByPerfilIdPerfilOrderByIdDesc(Long perfilId);
}
