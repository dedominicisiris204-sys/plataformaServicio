package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Perfil;
import com.plataforma.plataforma_servicios.entidad.Usuario;
import com.plataforma.plataforma_servicios.repositorio.PerfilRepository;
import com.plataforma.plataforma_servicios.repositorio.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/perfiles")
@CrossOrigin(origins = "*")
public class PerfilController {

    private final PerfilRepository perfilRepository;
    private final UsuarioRepository usuarioRepository;

    public PerfilController(
            PerfilRepository perfilRepository,
            UsuarioRepository usuarioRepository) {
        this.perfilRepository = perfilRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> obtenerPorUsuario(
            @PathVariable Long usuarioId) {

        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);

        if (usuario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return perfilRepository.findByUsuarioId(usuarioId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NO_CONTENT).build());
    }

    @PutMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> guardarPorUsuario(
            @PathVariable Long usuarioId,
            @RequestBody Perfil datos) {

        Optional<Usuario> usuarioOptional =
                usuarioRepository.findById(usuarioId);

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = usuarioOptional.get();

        Perfil perfil = perfilRepository
                .findByUsuarioId(usuarioId)
                .orElseGet(Perfil::new);

        perfil.setUsuario(usuario);
        perfil.setFotoPerfil(datos.getFotoPerfil());
        perfil.setOficio(datos.getOficio());
        perfil.setDescripcion(datos.getDescripcion());
        perfil.setServicios(datos.getServicios());
        perfil.setExperiencia(datos.getExperiencia());
        perfil.setEstudios(datos.getEstudios());
        perfil.setHabilidades(datos.getHabilidades());
        perfil.setZonaTrabajo(datos.getZonaTrabajo());
        perfil.setHorarios(datos.getHorarios());

        if (perfil.getCalificacionPromedio() == null) {
            perfil.setCalificacionPromedio(0.0);
        }

        Perfil guardado = perfilRepository.save(perfil);

        return ResponseEntity.ok(guardado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {

        return perfilRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
