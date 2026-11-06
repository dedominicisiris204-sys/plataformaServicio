package com.plataforma.plataforma_servicios.servicio;

import com.plataforma.plataforma_servicios.entidad.Publicacion;
import com.plataforma.plataforma_servicios.repositorio.PublicacionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PublicacionServicio {
    private final PublicacionRepository publicaciones;
    public PublicacionServicio(PublicacionRepository publicaciones) { this.publicaciones = publicaciones; }

    @Transactional(readOnly = true)
    public Page<Publicacion> buscar(String categoria, String ubicacion, String q, Pageable pageable) {
        return publicaciones.buscar(limpiar(categoria), limpiar(ubicacion), limpiar(q), pageable);
    }
    @Transactional(readOnly = true)
    public Publicacion porId(Long id) { return publicaciones.findById(id).orElseThrow(() -> new EntityNotFoundException("No se encontró la publicación.")); }
    @Transactional
    public Publicacion crear(Publicacion p) {
        if (p.getAutor() == null || p.getAutor().isBlank() || p.getContenido() == null || p.getContenido().isBlank() || p.getTipo() == null || p.getTipo().isBlank()) {
            throw new IllegalArgumentException("Autor, descripción y tipo son obligatorios.");
        }
        if (p.getContenido().length() > 10000) throw new IllegalArgumentException("La descripción supera el máximo permitido.");
        p.setFecha(java.time.LocalDateTime.now());
        return publicaciones.save(p);
    }
    @Transactional
    public void eliminar(Long id, Long actorId, String actorNombre, boolean admin) {
        Publicacion p = porId(id);
        boolean propietario = actorId != null && actorId.equals(p.getUsuarioId());
        if (p.getUsuarioId() == null && publicaciones.countByAutorIgnoreCase(p.getAutor()) == 1) propietario = actorNombre.equalsIgnoreCase(p.getAutor());
        if (!admin && !propietario) throw new org.springframework.security.access.AccessDeniedException("No podés eliminar esta publicación.");
        publicaciones.deleteById(id);
    }
    private String limpiar(String v) { return v == null || v.isBlank() || "Todos".equalsIgnoreCase(v) || "Todas".equalsIgnoreCase(v) ? null : v.trim(); }
}
