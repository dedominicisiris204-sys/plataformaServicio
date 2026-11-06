package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Interes;
import com.plataforma.plataforma_servicios.repositorio.InteresRepository;
import com.plataforma.plataforma_servicios.repositorio.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/intereses")
public class InteresController {
    private final InteresRepository intereses;
    private final UsuarioRepository usuarios;
    public InteresController(InteresRepository intereses, UsuarioRepository usuarios) { this.intereses = intereses; this.usuarios = usuarios; }

    @GetMapping("/publicacion/{publicacionId}")
    public ResponseEntity<List<Interes>> obtener(@PathVariable Long publicacionId) { return ResponseEntity.ok(intereses.findByPublicacionId(publicacionId)); }

    @GetMapping("/publicacion/{publicacionId}/cantidad")
    public ResponseEntity<Long> cantidad(@PathVariable Long publicacionId) { return ResponseEntity.ok(intereses.countByPublicacionId(publicacionId)); }

    @PostMapping
    public ResponseEntity<Interes> agregar(@RequestBody Interes interes, Authentication auth) {
        if (interes.getPublicacionId() == null) throw new IllegalArgumentException("Falta indicar la publicación.");
        var usuario = usuarioActual(auth);
        if (intereses.existsByPublicacionIdAndUsuarioId(interes.getPublicacionId(), usuario.getId())
                || intereses.existsByPublicacionIdAndUsuario(interes.getPublicacionId(), usuario.getNombre())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        interes.setUsuarioId(usuario.getId());
        interes.setUsuario(usuario.getNombre());
        interes.setFecha(java.time.LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(intereses.save(interes));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, Authentication auth) {
        var interes = intereses.findById(id).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("No se encontró el interés."));
        var actor = usuarioActual(auth);
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROL_ADMIN"));
        if (!admin && !actor.getId().equals(interes.getUsuarioId())) throw new org.springframework.security.access.AccessDeniedException("No podés eliminar este interés.");
        intereses.delete(interes);
        return ResponseEntity.noContent().build();
    }

    private com.plataforma.plataforma_servicios.entidad.Usuario usuarioActual(Authentication auth) {
        if (auth == null) throw new org.springframework.security.access.AccessDeniedException("Iniciá sesión para continuar.");
        return usuarios.findByEmailIgnoreCase(auth.getName()).orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("La sesión ya no es válida."));
    }
}
