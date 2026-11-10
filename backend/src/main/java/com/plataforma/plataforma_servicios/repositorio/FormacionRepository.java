package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.Formacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FormacionRepository extends JpaRepository<Formacion, Long> {
    List<Formacion> findByPerfilIdPerfilOrderByIdDesc(Long perfilId);
}
