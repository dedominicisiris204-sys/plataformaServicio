package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Contratacion;
import com.plataforma.plataforma_servicios.entidad.Perfil;
import com.plataforma.plataforma_servicios.entidad.Resena;
import com.plataforma.plataforma_servicios.repositorio.ContratacionRepository;
import com.plataforma.plataforma_servicios.repositorio.PerfilRepository;
import com.plataforma.plataforma_servicios.repositorio.ResenaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resenas")
@CrossOrigin(origins = "*")
public class ResenaController {
    private final ResenaRepository resenaRepository;
    private final ContratacionRepository contratacionRepository;
    private final PerfilRepository perfilRepository;

    public ResenaController(ResenaRepository resenaRepository, ContratacionRepository contratacionRepository,
                            PerfilRepository perfilRepository) {
        this.resenaRepository = resenaRepository;
        this.contratacionRepository = contratacionRepository;
        this.perfilRepository = perfilRepository;
    }

    @GetMapping("/profesional/{usuarioId}")
    public ResponseEntity<List<Resena>> porProfesional(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(resenaRepository.findByEvaluadoUsuarioIdOrderByFechaCreacionDesc(usuarioId));
    }

    @GetMapping("/autor/{usuarioId}")
    public ResponseEntity<List<Resena>> porAutor(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(resenaRepository.findByAutorUsuarioIdOrderByFechaCreacionDesc(usuarioId));
    }

    @GetMapping("/contratacion/{contratacionId}/autor/{usuarioId}")
    public ResponseEntity<Boolean> existente(@PathVariable Long contratacionId, @PathVariable Long usuarioId) {
        return ResponseEntity.ok(resenaRepository.existsByContratacionIdAndAutorUsuarioId(contratacionId, usuarioId));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> crear(@RequestBody Resena resena) {
        if (resena.getContratacionId() == null || resena.getAutorUsuarioId() == null
                || resena.getEvaluadoUsuarioId() == null || resena.getPuntuacion() == null
                || resena.getPuntuacion() < 1 || resena.getPuntuacion() > 5) {
            return ResponseEntity.badRequest().body(Map.of("error", "Indicá una contratación y una puntuación entre 1 y 5."));
        }
        Contratacion contrato = contratacionRepository.findById(resena.getContratacionId()).orElse(null);
        if (contrato == null) return ResponseEntity.notFound().build();
        if (!"COMPLETADA".equalsIgnoreCase(contrato.getEstado())
                || !resena.getAutorUsuarioId().equals(contrato.getClienteUsuarioId())
                || !resena.getEvaluadoUsuarioId().equals(contrato.getProveedorUsuarioId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Solo el cliente puede calificar al profesional después de completar el trabajo."));
        }
        if (resenaRepository.existsByContratacionIdAndAutorUsuarioId(resena.getContratacionId(), resena.getAutorUsuarioId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Ya calificaste esta contratación."));
        }
        resena.setCreadorUsuarioId(resena.getAutorUsuarioId());
        Resena guardada = resenaRepository.save(resena);
        List<Resena> resenas = resenaRepository.findByEvaluadoUsuarioIdOrderByFechaCreacionDesc(resena.getEvaluadoUsuarioId());
        perfilRepository.findByUsuarioId(resena.getEvaluadoUsuarioId()).ifPresent(perfil -> {
            double promedio = resenas.stream().mapToInt(Resena::getPuntuacion).average().orElse(0.0);
            perfil.setCalificacionPromedio(promedio);
            perfilRepository.save(perfil);
        });
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }
}
