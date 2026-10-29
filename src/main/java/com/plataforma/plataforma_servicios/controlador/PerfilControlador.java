package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.dto.PerfilActualizacion;
import com.plataforma.plataforma_servicios.dto.PerfilRespuesta;
import com.plataforma.plataforma_servicios.servicio.PerfilServicio;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/perfiles")
@CrossOrigin(origins = "*")
public class PerfilControlador {

    private final PerfilServicio perfilServicio;

    public PerfilControlador(PerfilServicio perfilServicio) {
        this.perfilServicio = perfilServicio;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<PerfilRespuesta> obtener(@PathVariable Long usuarioId) {
        return perfilServicio.obtenerPorUsuario(usuarioId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/usuario/{usuarioId}")
    public ResponseEntity<PerfilRespuesta> actualizar(
            @PathVariable Long usuarioId,
            @Valid @RequestBody PerfilActualizacion actualizacion) {
        try {
            return perfilServicio.actualizar(usuarioId, actualizacion)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/servicios")
    public List<PerfilRespuesta> listarServicios() {
        return perfilServicio.listarServicios();
    }
}
