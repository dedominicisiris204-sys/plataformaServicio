package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Usuario;
import com.plataforma.plataforma_servicios.servicio.UsuarioServicio;
import com.plataforma.plataforma_servicios.config.JwtService;
import com.plataforma.plataforma_servicios.servicio.UsuarioEliminacionServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.HashMap;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioControlador {

    private final UsuarioServicio usuarioServicio;
    private final JwtService jwtService;
    private final UsuarioEliminacionServicio eliminacionServicio;

    public UsuarioControlador(UsuarioServicio usuarioServicio, JwtService jwtService, UsuarioEliminacionServicio eliminacionServicio) {
        this.usuarioServicio = usuarioServicio;
        this.jwtService = jwtService;
        this.eliminacionServicio = eliminacionServicio;
    }

    @GetMapping
    public ResponseEntity<?> obtenerTodos(@RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "20") int size,
                                          @RequestParam(required = false) String q) {
        if (page < 0 || size < 1 || size > 100) return ResponseEntity.badRequest().body("Paginación inválida.");
        if (q != null && !q.isBlank()) return ResponseEntity.ok(usuarioServicio.buscar(q.trim(), PageRequest.of(page, size)));
        return ResponseEntity.ok(usuarioServicio.listar(PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        Usuario usuario = usuarioServicio.buscarPorId(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/{id}/publico")
    public ResponseEntity<?> obtenerResumenPublico(@PathVariable Long id) {
        Usuario usuario = usuarioServicio.buscarPorId(id);
        if (usuario == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Map.of("id", usuario.getId(), "nombre", usuario.getNombre(), "rol", usuario.getRol()));
    }

    @PostMapping
    public ResponseEntity<String> guardar(@RequestBody Usuario usuario) {
        if (usuario.getId() != null) throw new IllegalArgumentException("No se puede indicar un identificador al crear una cuenta.");
        usuario.setFechaRegistro(null);
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
                .<ResponseEntity<?>>map(usuario -> {
                    Map<String, Object> resultado = new HashMap<>();
                    resultado.put("token", jwtService.generar(usuario));
                    resultado.put("usuario", Map.of("id", usuario.getId(), "nombre", usuario.getNombre(),
                            "email", usuario.getEmail(), "rol", usuario.getRol(), "fechaRegistro", usuario.getFechaRegistro()));
                    resultado.put("id", usuario.getId());
                    resultado.put("nombre", usuario.getNombre());
                    resultado.put("email", usuario.getEmail());
                    resultado.put("rol", usuario.getRol());
                    return ResponseEntity.ok(resultado);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Email o contraseña incorrectos."));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Usuario detalles, Authentication auth) {
        Usuario existente = usuarioServicio.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        if (auth == null || (!auth.getName().equalsIgnoreCase(usuarioServicio.emailPorId(id))
                && !auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROL_ADMIN")))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No podés modificar esta cuenta.");
        }
        if (detalles.getNombre() != null) existente.setNombre(detalles.getNombre());
        if (detalles.getEmail() != null) existente.setEmail(detalles.getEmail());
        if (detalles.getPassword() != null && !detalles.getPassword().isBlank()) {
            existente.setPassword(detalles.getPassword());
        }
        Usuario actualizado = usuarioServicio.registrarUsuario(existente);
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("id", actualizado.getId());
        respuesta.put("nombre", actualizado.getNombre());
        respuesta.put("email", actualizado.getEmail());
        respuesta.put("rol", actualizado.getRol());
        respuesta.put("fechaRegistro", actualizado.getFechaRegistro());
        if (auth.getName().equalsIgnoreCase(actualizado.getEmail())) respuesta.put("token", jwtService.generar(actualizado));
        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id, Authentication auth) {
        Usuario existente = usuarioServicio.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        if (auth == null || (!auth.getName().equalsIgnoreCase(usuarioServicio.emailPorId(id))
                && !auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROL_ADMIN")))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No podés eliminar esta cuenta.");
        }
        eliminacionServicio.eliminar(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }
}
