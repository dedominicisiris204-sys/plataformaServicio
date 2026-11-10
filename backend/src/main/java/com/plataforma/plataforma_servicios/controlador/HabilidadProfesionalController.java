package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.*;
import com.plataforma.plataforma_servicios.repositorio.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/habilidades-profesionales")
@CrossOrigin(origins = "*")
public class HabilidadProfesionalController {

    private final HabilidadProfesionalRepository repo;
    private final PerfilRepository perfilRepo;

    public HabilidadProfesionalController(HabilidadProfesionalRepository repo, PerfilRepository perfilRepo) {
        this.repo = repo;
        this.perfilRepo = perfilRepo;
    }

    @GetMapping("/perfil/{perfilId}")
    public List<HabilidadProfesional> listar(@PathVariable Long perfilId) {
        return repo.findByPerfilIdPerfilOrderByIdDesc(perfilId);
    }

    @PostMapping("/perfil/{perfilId}")
    public ResponseEntity<?> crear(@PathVariable Long perfilId, @RequestBody HabilidadProfesional datos) {
        return perfilRepo.findById(perfilId).map(perfil -> {
            datos.setId(null);
            datos.setPerfil(perfil);
            return ResponseEntity.ok(repo.save(datos));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
