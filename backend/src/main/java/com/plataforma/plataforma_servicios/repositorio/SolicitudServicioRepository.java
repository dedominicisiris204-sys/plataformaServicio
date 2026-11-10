package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.SolicitudServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudServicioRepository extends JpaRepository<SolicitudServicio, Long> {
    List<SolicitudServicio> findByCreadorUsuarioIdOrderByFechaCreacionDesc(Long creadorUsuarioId);
    List<SolicitudServicio> findByProfesionalUsuarioIdOrderByFechaCreacionDesc(Long profesionalUsuarioId);
    List<SolicitudServicio> findByEstadoOrderByFechaCreacionDesc(String estado);
    List<SolicitudServicio> findByCategoriaOrderByFechaCreacionDesc(String categoria);
}
