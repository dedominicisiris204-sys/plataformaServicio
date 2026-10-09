package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Usuario;
import com.plataforma.plataforma_servicios.servicio.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioControlador {

    @Autowired
    private UsuarioServicio usuarioServicio;

    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodos() {
        return ResponseEntity.ok(usuarioServicio.listarTodos());
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Usuario usuario) {

        try {
            Usuario nuevoUsuario = usuarioServicio.registrarUsuario(usuario);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("USUARIO REGISTRADO CORRECTAMENTE. ID=" + nuevoUsuario.getId());

        } catch (Exception e) {

            e.printStackTrace();

            Throwable causa = e;

            while (causa.getCause() != null) {
                causa = causa.getCause();
            }

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "ERROR REAL AL REGISTRAR USUARIO | "
                            + e.getClass().getName()
                            + " | "
                            + e.getMessage()
                            + " | CAUSA: "
                            + causa.getClass().getName()
                            + ": "
                            + causa.getMessage()
                    );
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario datos) {

        List<Usuario> usuarios = usuarioServicio.listarTodos();

        Usuario usuarioEncontrado = usuarios.stream()
                .filter(u -> u.getEmail() != null
                        && u.getEmail().equalsIgnoreCase(datos.getEmail()))
                .filter(u -> u.getPassword() != null
                        && u.getPassword().equals(datos.getPassword()))
                .findFirst()
                .orElse(null);

        if (usuarioEncontrado == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Email o contrasena incorrectos");
        }

        return ResponseEntity.ok(usuarioEncontrado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(
            @PathVariable Long id,
            @RequestBody Usuario usuarioDetalles) {

        Usuario usuarioExistente = usuarioServicio.listarTodos()
                .stream()
                .filter(u -> u.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (usuarioExistente == null) {
            return ResponseEntity.notFound().build();
        }

        usuarioExistente.setNombre(usuarioDetalles.getNombre());
        usuarioExistente.setEmail(usuarioDetalles.getEmail());

        if (usuarioDetalles.getPassword() != null
                && !usuarioDetalles.getPassword().isBlank()) {
            usuarioExistente.setPassword(usuarioDetalles.getPassword());
        }

        Usuario usuarioActualizado =
                usuarioServicio.registrarUsuario(usuarioExistente);

        return ResponseEntity.ok(usuarioActualizado);
    }


    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> errorBody(HttpMessageNotReadableException e) {

        Throwable causa = e;

        while (causa.getCause() != null) {
            causa = causa.getCause();
        }

        String mensaje = causa.getMessage();

        if (mensaje == null || mensaje.isBlank()) {
            mensaje = e.getMessage();
        }

        e.printStackTrace();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        "ERROR AL LEER JSON | "
                        + e.getClass().getName()
                        + " | "
                        + mensaje
                );
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {

        try {
            usuarioServicio.eliminarPorId(id);
            return ResponseEntity.ok("Usuario eliminado correctamente");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar usuario: " + e.getMessage());
        }
    }
}
