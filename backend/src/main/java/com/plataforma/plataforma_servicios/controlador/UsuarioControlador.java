package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Usuario;
import com.plataforma.plataforma_servicios.servicio.UsuarioServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        Usuario usuario = usuarioServicio.buscarPorId(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    @PostMapping
    public ResponseEntity<String> guardar(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioServicio.registrarUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("USUARIO REGISTRADO CORRECTAMENTE. ID=" + nuevoUsuario.getId());
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
        if (detalles.getNombre() != null) existente.setNombre(detalles.getNombre());
        if (detalles.getEmail() != null) existente.setEmail(detalles.getEmail());
        if (detalles.getPassword() != null && !detalles.getPassword().isBlank()) {
            existente.setPassword(detalles.getPassword());
        }
        if (detalles.getRol() != null && !detalles.getRol().isBlank()) {
            existente.setRol(detalles.getRol());
        }
        return ResponseEntity.ok(usuarioServicio.registrarUsuario(existente));
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
