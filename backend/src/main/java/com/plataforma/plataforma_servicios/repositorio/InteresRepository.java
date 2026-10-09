package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.Interes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InteresRepository extends JpaRepository<Interes, Long> {

    boolean existsByPublicacionIdAndUsuario(Long publicacionId, String usuario);

    List<Interes> findByPublicacionId(Long publicacionId);

    long countByPublicacionId(Long publicacionId);
}
