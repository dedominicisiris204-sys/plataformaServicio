package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.Resena;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResenaRepository extends JpaRepository<Resena, Long> {
    java.util.List<Resena> findByEvaluadoUsuarioIdOrderByFechaCreacionDesc(Long id);
    boolean existsByContratacionId(Long id);
    void deleteByAutorUsuarioIdOrEvaluadoUsuarioId(Long autorId, Long evaluadoId);
}
