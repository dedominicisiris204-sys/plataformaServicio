package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Comentario;
import com.plataforma.plataforma_servicios.repositorio.ComentarioRepository;
import com.plataforma.plataforma_servicios.repositorio.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
public class ComentarioController {
    private final ComentarioRepository comentarios;
    private final UsuarioRepository usuarios;
    public ComentarioController(ComentarioRepository comentarios, UsuarioRepository usuarios) { this.comentarios = comentarios; this.usuarios = usuarios; }

    @GetMapping("/publicacion/{publicacionId}")
    public ResponseEntity<List<Comentario>> obtener(@PathVariable Long publicacionId) {
        return ResponseEntity.ok(comentarios.findByPublicacionIdOrderByFechaAsc(publicacionId));
    }

    @PostMapping
    public ResponseEntity<Comentario> crear(@RequestBody Comentario comentario, Authentication auth) {
        if (comentario.getPublicacionId() == null || comentario.getContenido() == null || comentario.getContenido().isBlank()) throw new IllegalArgumentException("La publicación y el comentario son obligatorios.");
        if (comentario.getContenido().length() > 5000) throw new IllegalArgumentException("El comentario supera los 5000 caracteres.");
        var autor = usuarioActual(auth);
        comentario.setUsuarioId(autor.getId());
        comentario.setAutor(autor.getNombre());
        comentario.setFecha(java.time.LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(comentarios.save(comentario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, Authentication auth) {
        var comentario = comentarios.findById(id).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("No se encontró el comentario."));
        var actor = usuarioActual(auth);
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROL_ADMIN"));
        if (!admin && !actor.getId().equals(comentario.getUsuarioId())) throw new org.springframework.security.access.AccessDeniedException("No podés eliminar este comentario.");
        comentarios.delete(comentario);
        return ResponseEntity.noContent().build();
    }

    private com.plataforma.plataforma_servicios.entidad.Usuario usuarioActual(Authentication auth) {
        if (auth == null) throw new org.springframework.security.access.AccessDeniedException("Iniciá sesión para continuar.");
        return usuarios.findByEmailIgnoreCase(auth.getName()).orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("La sesión ya no es válida."));
    }
}
