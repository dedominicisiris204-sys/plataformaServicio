package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Comentario;
import com.plataforma.plataforma_servicios.repositorio.ComentarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
@CrossOrigin(origins = "*")
public class ComentarioController {

    private final ComentarioRepository repository;

    public ComentarioController(ComentarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/publicacion/{publicacionId}")
    public ResponseEntity<List<Comentario>> obtener(
            @PathVariable Long publicacionId) {

        return ResponseEntity.ok(
                repository.findByPublicacionIdOrderByFechaAsc(publicacionId)
        );
    }

    @PostMapping
    public ResponseEntity<?> crear(
            @RequestBody Comentario comentario) {

        if (comentario.getPublicacionId() == null ||
            comentario.getAutor() == null ||
            comentario.getAutor().isBlank() ||
            comentario.getContenido() == null ||
            comentario.getContenido().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("publicacionId, autor y contenido son obligatorios");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(repository.save(comentario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
