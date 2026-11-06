package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.SolicitudServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolicitudServicioRepository extends JpaRepository<SolicitudServicio, Long> {
    List<SolicitudServicio> findByProfesionalUsuarioIdOrderByFechaCreacionDesc(Long id);
    List<SolicitudServicio> findByClienteUsuarioIdOrderByFechaCreacionDesc(Long id);
    void deleteByClienteUsuarioIdOrProfesionalUsuarioId(Long clienteId, Long profesionalId);
}
