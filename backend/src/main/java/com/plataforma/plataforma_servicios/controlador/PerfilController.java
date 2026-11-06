package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Perfil;
import com.plataforma.plataforma_servicios.repositorio.UsuarioRepository;
import com.plataforma.plataforma_servicios.servicio.PerfilServicio;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfiles")
public class PerfilController {
    private final PerfilServicio perfilServicio;
    private final UsuarioRepository usuarios;

    public PerfilController(PerfilServicio perfilServicio, UsuarioRepository usuarios) {
        this.perfilServicio = perfilServicio;
        this.usuarios = usuarios;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return perfilServicio.porUsuario(usuarioId).<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PutMapping("/usuario/{usuarioId}")
    public ResponseEntity<Perfil> guardarPorUsuario(@PathVariable Long usuarioId, @RequestBody Perfil datos, Authentication auth) {
        var actual = usuarios.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("La sesión ya no es válida."));
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROL_ADMIN"));
        if (!admin && !actual.getId().equals(usuarioId)) throw new org.springframework.security.access.AccessDeniedException("No podés editar este perfil.");
        return ResponseEntity.ok(perfilServicio.guardar(usuarioId, datos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return perfilServicio.porId(id).<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
