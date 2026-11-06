package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Mensaje;
import com.plataforma.plataforma_servicios.repositorio.UsuarioRepository;
import com.plataforma.plataforma_servicios.servicio.MensajeServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mensajes")
public class MensajeControlador {
    private final MensajeServicio mensajeServicio;
    private final UsuarioRepository usuarios;

    public MensajeControlador(MensajeServicio mensajeServicio, UsuarioRepository usuarios) {
        this.mensajeServicio = mensajeServicio;
        this.usuarios = usuarios;
    }

    @GetMapping
    public ResponseEntity<List<Mensaje>> obtenerTodos() { return ResponseEntity.ok(mensajeServicio.listarTodos()); }

    @GetMapping("/no-leidos")
    public ResponseEntity<Map<String, Long>> noLeidos(Authentication auth) {
        var usuario = usuarioActual(auth);
        return ResponseEntity.ok(Map.of("cantidad", mensajeServicio.contarNoLeidos(usuario.getId(), usuario.getNombre())));
    }

    @GetMapping({"/conversacion", "/chat"})
    public ResponseEntity<List<Mensaje>> obtenerConversacion(@RequestParam(required = false) String emisor,
                                                              @RequestParam(required = false) String receptor,
                                                              @RequestParam(required = false) String usuario,
                                                              @RequestParam(required = false) String empresa,
                                                              Authentication auth) {
        var actual = usuarioActual(auth);
        String otro = receptor != null ? receptor : (emisor != null ? emisor : empresa);
        if (emisor != null && receptor != null) {
            if (!actual.getNombre().equalsIgnoreCase(emisor) && !actual.getNombre().equalsIgnoreCase(receptor)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            otro = actual.getNombre().equalsIgnoreCase(emisor) ? receptor : emisor;
        } else if (usuario != null && empresa != null) {
            if (!actual.getNombre().equalsIgnoreCase(usuario) && !actual.getNombre().equalsIgnoreCase(empresa)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            otro = actual.getNombre().equalsIgnoreCase(usuario) ? empresa : usuario;
        }
        if (otro == null || otro.isBlank()) return ResponseEntity.badRequest().build();
        var destino = usuarios.findByNombreIgnoreCase(otro.trim())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("No encontramos al destinatario."));
        return ResponseEntity.ok(mensajeServicio.marcarConversacionLeida(actual.getId(), destino.getId(), actual.getNombre(), destino.getNombre()));
    }

    @PostMapping
    public ResponseEntity<Mensaje> enviar(@RequestBody Mensaje mensaje, Authentication auth) {
        var actual = usuarioActual(auth);
        var destino = usuarios.findByNombreIgnoreCase(mensaje.getReceptor())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("No encontramos al destinatario."));
        if (destino.getId().equals(actual.getId())) throw new IllegalArgumentException("No podés enviarte un mensaje a vos mismo.");
        mensaje.setEmisor(actual.getNombre());
        mensaje.setReceptor(destino.getNombre());
        mensaje.setEmisorUsuarioId(actual.getId());
        mensaje.setReceptorUsuarioId(destino.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(mensajeServicio.enviarMensaje(mensaje));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, Authentication auth) {
        var actual = usuarioActual(auth);
        mensajeServicio.eliminar(id, actual.getId(), actual.getNombre());
        return ResponseEntity.noContent().build();
    }

    private com.plataforma.plataforma_servicios.entidad.Usuario usuarioActual(Authentication auth) {
        if (auth == null) throw new org.springframework.security.access.AccessDeniedException("Iniciá sesión para continuar.");
        return usuarios.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("La sesión ya no es válida."));
    }
}
