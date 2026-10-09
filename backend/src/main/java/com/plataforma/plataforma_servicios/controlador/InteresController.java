package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Interes;
import com.plataforma.plataforma_servicios.repositorio.InteresRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/intereses")
@CrossOrigin(origins = "*")
public class InteresController {

    private final InteresRepository repository;

    public InteresController(InteresRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/publicacion/{publicacionId}")
    public ResponseEntity<List<Interes>> obtener(
            @PathVariable Long publicacionId) {

        return ResponseEntity.ok(
                repository.findByPublicacionId(publicacionId)
        );
    }

    @GetMapping("/publicacion/{publicacionId}/cantidad")
    public ResponseEntity<Long> cantidad(
            @PathVariable Long publicacionId) {

        return ResponseEntity.ok(
                repository.countByPublicacionId(publicacionId)
        );
    }

    @PostMapping
    public ResponseEntity<?> agregar(@RequestBody Interes interes) {

        if (interes.getPublicacionId() == null ||
            interes.getUsuario() == null ||
            interes.getUsuario().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("publicacionId y usuario son obligatorios");
        }

        if (repository.existsByPublicacionIdAndUsuario(
                interes.getPublicacionId(),
                interes.getUsuario())) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("El usuario ya marco que esta interesado");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(repository.save(interes));
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
