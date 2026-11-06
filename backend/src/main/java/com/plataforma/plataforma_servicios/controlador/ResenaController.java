package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Resena;
import com.plataforma.plataforma_servicios.repositorio.UsuarioRepository;
import com.plataforma.plataforma_servicios.servicio.ResenaServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {
    private final ResenaServicio servicio;
    private final UsuarioRepository usuarios;

    public ResenaController(ResenaServicio servicio, UsuarioRepository usuarios) { this.servicio = servicio; this.usuarios = usuarios; }

    @PostMapping
    public ResponseEntity<Resena> crear(@RequestBody Map<String, Object> body, Authentication auth) {
        Long contratoId = parse(body.get("contratacionId"));
        Integer puntuacion = (int) parse(body.get("puntuacion"));
        String comentario = body.get("comentario") == null ? "" : body.get("comentario").toString();
        Long autor = usuarios.findByEmailIgnoreCase(auth.getName()).map(u -> u.getId())
                .orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("La sesión ya no es válida."));
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(contratoId, autor, puntuacion, comentario));
    }

    @GetMapping("/profesional/{id}")
    public ResponseEntity<List<Resena>> porProfesional(@PathVariable Long id) { return ResponseEntity.ok(servicio.porProfesional(id)); }

    private Long parse(Object valor) {
        try { return Long.valueOf(String.valueOf(valor)); }
        catch (RuntimeException e) { throw new IllegalArgumentException("Falta un identificador o valor numérico válido."); }
    }
}
