package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Usuario;
import com.plataforma.plataforma_servicios.servicio.UsuarioServicio;
import com.plataforma.plataforma_servicios.servicio.UsuarioEliminacionServicio;
import com.plataforma.plataforma_servicios.servicio.UsuarioServicio.EmailDuplicadoException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioControlador {

    private final UsuarioServicio usuarioServicio;
    private final UsuarioEliminacionServicio eliminacionServicio;

    public UsuarioControlador(UsuarioServicio usuarioServicio, UsuarioEliminacionServicio eliminacionServicio) {
        this.usuarioServicio = usuarioServicio;
        this.eliminacionServicio = eliminacionServicio;
    }

    @GetMapping
    public ResponseEntity<?> obtenerTodos(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String q) {

        if (page != null && size != null && size > 0) {
            Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(size, 100), Sort.by(Sort.Direction.ASC, "id"));
            return ResponseEntity.ok(usuarioServicio.listarPaginado(pageable, q));
        }

        return ResponseEntity.ok(usuarioServicio.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        Usuario usuario = usuarioServicio.buscarPorId(id);
        return usuario == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(usuario);
    }

    @PostMapping
    public ResponseEntity<String> guardar(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioServicio.registrarUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("USUARIO REGISTRADO CORRECTAMENTE. ID=" + nuevoUsuario.getId());
        } catch (EmailDuplicadoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("No se pudo registrar la cuenta. Revisá los datos e intentá nuevamente.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> datos) {
        if (datos == null) {
            return ResponseEntity.badRequest().body("Ingresá el correo y la contraseña.");
        }
        String email = datos.get("email");
        String password = datos.get("password");
        return usuarioServicio.autenticar(email, password)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Email o contraseña incorrectos."));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Usuario detalles) {
        Usuario existente = usuarioServicio.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            if (detalles.getNombre() != null) existente.setNombre(detalles.getNombre());
            if (detalles.getEmail() != null) existente.setEmail(detalles.getEmail());
            if (detalles.getPassword() != null && !detalles.getPassword().isBlank()) {
                existente.setPassword(detalles.getPassword());
            }
            return ResponseEntity.ok(usuarioServicio.registrarUsuario(existente));
        } catch (EmailDuplicadoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> errorBody(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest().body("El cuerpo de la solicitud no contiene un JSON válido.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        if (usuarioServicio.buscarPorId(id) == null) {
            return ResponseEntity.notFound().build();
        }
        eliminacionServicio.eliminar(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }
}
