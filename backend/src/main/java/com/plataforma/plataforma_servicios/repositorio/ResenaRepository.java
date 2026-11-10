package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResenaRepository extends JpaRepository<Resena, Long> {
    List<Resena> findByEvaluadoUsuarioIdOrderByFechaCreacionDesc(Long evaluadoUsuarioId);
    List<Resena> findByAutorUsuarioIdOrderByFechaCreacionDesc(Long autorUsuarioId);
    boolean existsByContratacionIdAndAutorUsuarioId(Long contratacionId, Long autorUsuarioId);
    List<Resena> findByContratacionIdAndAutorUsuarioId(Long contratacionId, Long autorUsuarioId);
}
