package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.Publicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {
    @Query("select p from Publicacion p where " +
            "(:categoria is null or lower(p.tipo) like lower(concat('%', :categoria, '%'))) and " +
            "(:ubicacion is null or lower(p.ubicacion) like lower(concat('%', :ubicacion, '%'))) and " +
            "(:q is null or lower(p.contenido) like lower(concat('%', :q, '%')) or lower(p.autor) like lower(concat('%', :q, '%'))) " +
            "order by p.fecha desc")
    Page<Publicacion> buscar(@Param("categoria") String categoria,
                             @Param("ubicacion") String ubicacion,
                             @Param("q") String q,
                             Pageable pageable);
    java.util.List<Publicacion> findByUsuarioId(Long usuarioId);
    void deleteByUsuarioId(Long usuarioId);
    void deleteByAutorIgnoreCase(String autor);
    long countByAutorIgnoreCase(String autor);
}
