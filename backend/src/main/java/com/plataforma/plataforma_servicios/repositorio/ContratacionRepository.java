package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.Contratacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContratacionRepository extends JpaRepository<Contratacion, Long> {
    boolean existsBySolicitudServicioId(Long solicitudServicioId);
    java.util.Optional<Contratacion> findBySolicitudServicioId(Long solicitudServicioId);
    void deleteByClienteUsuarioIdOrProveedorUsuarioId(Long clienteId, Long proveedorId);
}
