package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Publicacion;
import com.plataforma.plataforma_servicios.servicio.PublicacionServicio;
import com.plataforma.plataforma_servicios.repositorio.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/publicaciones")
@CrossOrigin(origins = "*")
public class PublicacionController {

    private final PublicacionServicio publicacionServicio;
    private final UsuarioRepository usuarios;

    public PublicacionController(PublicacionServicio publicacionServicio, UsuarioRepository usuarios) {
        this.publicacionServicio = publicacionServicio;
        this.usuarios = usuarios;
    }

    @GetMapping
    public ResponseEntity<Page<Publicacion>> obtenerTodas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String ubicacion,
            @RequestParam(required = false) String q) {
        if (page < 0 || size < 1 || size > 100) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(publicacionServicio.buscar(categoria, ubicacion, q, PageRequest.of(page, size)));
    }

    @GetMapping("/buscar")
    public ResponseEntity<Page<Publicacion>> buscar(@RequestParam(required = false) String categoria,
                                                     @RequestParam(required = false) String ubicacion,
                                                     @RequestParam(required = false) String q,
                                                     @RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "12") int size) {
        return obtenerTodas(page, size, categoria, ubicacion, q);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Publicacion> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(publicacionServicio.porId(id));
    }

    @PostMapping
    public ResponseEntity<Publicacion> crear(@RequestBody Publicacion publicacion, Authentication auth) {
        var autor = usuarios.findByEmailIgnoreCase(auth.getName()).orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("La sesión ya no es válida."));
        publicacion.setUsuarioId(autor.getId());
        publicacion.setAutor(autor.getNombre());
        Publicacion nueva = publicacionServicio.crear(publicacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, Authentication auth) {
        var autor = usuarios.findByEmailIgnoreCase(auth.getName()).orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("La sesión ya no es válida."));
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROL_ADMIN"));
        publicacionServicio.eliminar(id, autor.getId(), autor.getNombre(), admin);
        return ResponseEntity.noContent().build();
    }
}
