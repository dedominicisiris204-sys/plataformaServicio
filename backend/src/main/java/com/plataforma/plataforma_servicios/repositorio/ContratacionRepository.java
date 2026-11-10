package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.Contratacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContratacionRepository extends JpaRepository<Contratacion, Long> {
    List<Contratacion> findByClienteUsuarioIdOrderByFechaCreacionDesc(Long clienteUsuarioId);
    List<Contratacion> findByProveedorUsuarioIdOrderByFechaCreacionDesc(Long proveedorUsuarioId);
    List<Contratacion> findBySolicitudServicioId(Long solicitudServicioId);
    boolean existsBySolicitudServicioId(Long solicitudServicioId);
}
