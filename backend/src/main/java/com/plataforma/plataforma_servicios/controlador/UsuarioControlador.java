package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Usuario;
import com.plataforma.plataforma_servicios.servicio.UsuarioServicio;
import com.plataforma.plataforma_servicios.servicio.UsuarioServicio.EmailDuplicadoException;
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

    public UsuarioControlador(UsuarioServicio usuarioServicio) {
        this.usuarioServicio = usuarioServicio;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodos() {
        return ResponseEntity.ok(usuarioServicio.listarTodos());
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
            // No exponer detalles internos de la base de datos al cliente.
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
        usuarioServicio.eliminarPorId(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }
}