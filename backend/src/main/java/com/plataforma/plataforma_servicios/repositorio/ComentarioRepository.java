package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    List<Comentario> findByPublicacionIdOrderByFechaAsc(Long publicacionId);

    List<Comentario> findByComentarioPadreIdOrderByFechaAsc(Long comentarioPadreId);

    long countByPublicacionId(Long publicacionId);

    @Transactional
    void deleteByComentarioPadreId(Long comentarioPadreId);
}
