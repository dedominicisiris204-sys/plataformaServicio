package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Publicacion;
import com.plataforma.plataforma_servicios.repositorio.PublicacionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/publicaciones")
@CrossOrigin(origins = "*")
public class PublicacionController {

    private final PublicacionRepository publicacionRepository;

    public PublicacionController(PublicacionRepository publicacionRepository) {
        this.publicacionRepository = publicacionRepository;
    }

    @GetMapping
    public ResponseEntity<?> obtenerTodas(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {

        Sort ordenReciente = Sort.by(Sort.Direction.DESC, "id");

        if (page != null && size != null && size > 0) {
            Pageable pageable = PageRequest.of(Math.max(0, page), size, ordenReciente);
            return ResponseEntity.ok(publicacionRepository.findAll(pageable));
        }

        return ResponseEntity.ok(publicacionRepository.findAll(ordenReciente));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Publicacion> obtenerPorId(@PathVariable Long id) {
        return publicacionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Publicacion> crear(@RequestBody Publicacion publicacion) {
        Publicacion nueva = publicacionRepository.save(publicacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Publicacion> actualizar(
            @PathVariable Long id,
            @RequestBody Publicacion datos) {

        return publicacionRepository.findById(id)
                .map(existente -> {
                    if (datos.getAutor() != null && !datos.getAutor().isBlank()) {
                        existente.setAutor(datos.getAutor());
                    }
                    if (datos.getTipo() != null && !datos.getTipo().isBlank()) {
                        existente.setTipo(datos.getTipo());
                    }
                    if (datos.getUbicacion() != null) {
                        existente.setUbicacion(datos.getUbicacion());
                    }
                    if (datos.getContenido() != null && !datos.getContenido().isBlank()) {
                        existente.setContenido(datos.getContenido());
                    }
                    if (datos.getTags() != null) {
                        existente.setTags(datos.getTags());
                    }
                    existente.setImagenBase64(datos.getImagenBase64());
                    return ResponseEntity.ok(publicacionRepository.save(existente));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {

        if (!publicacionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        publicacionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
