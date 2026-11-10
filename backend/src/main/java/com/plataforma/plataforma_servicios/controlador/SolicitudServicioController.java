package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Contratacion;
import com.plataforma.plataforma_servicios.entidad.SolicitudServicio;
import com.plataforma.plataforma_servicios.repositorio.ContratacionRepository;
import com.plataforma.plataforma_servicios.repositorio.SolicitudServicioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "*")
public class SolicitudServicioController {

    private final SolicitudServicioRepository solicitudRepository;
    private final ContratacionRepository contratacionRepository;

    public SolicitudServicioController(
            SolicitudServicioRepository solicitudRepository,
            ContratacionRepository contratacionRepository) {
        this.solicitudRepository = solicitudRepository;
        this.contratacionRepository = contratacionRepository;
    }

    @GetMapping
    public ResponseEntity<List<SolicitudServicio>> obtenerTodas() {
        return ResponseEntity.ok(solicitudRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitudServicio> obtenerPorId(@PathVariable Long id) {
        return solicitudRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<SolicitudServicio>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(solicitudRepository.findByCreadorUsuarioIdOrderByFechaCreacionDesc(usuarioId));
    }

    @GetMapping("/profesional/{id}")
    public ResponseEntity<List<SolicitudServicio>> obtenerPorProfesional(@PathVariable Long id) {
        return ResponseEntity.ok(solicitudRepository.findByProfesionalUsuarioIdOrderByFechaCreacionDesc(id));
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody SolicitudServicio solicitud) {
        if (solicitud.getTitulo() == null || solicitud.getTitulo().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El título de la solicitud es obligatorio."));
        }
        if (solicitud.getCreadorUsuarioId() == null || solicitud.getProfesionalUsuarioId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Debe indicarse el cliente y el profesional destinatario."));
        }
        if (solicitud.getCreadorUsuarioId().equals(solicitud.getProfesionalUsuarioId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "No podés enviarte una solicitud a tu propio perfil."));
        }

        if (solicitud.getEstado() == null || solicitud.getEstado().isBlank() || "BORRADOR".equalsIgnoreCase(solicitud.getEstado())) {
            solicitud.setEstado("PENDIENTE");
        }

        SolicitudServicio guardada = solicitudRepository.save(solicitud);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {

        Optional<SolicitudServicio> opt = solicitudRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        SolicitudServicio solicitud = opt.get();
        String nuevoEstado = payload == null ? null : (String) payload.get("estado");
        if (!List.of("ACEPTADA", "RECHAZADA", "COMPLETADA").contains(nuevoEstado == null ? "" : nuevoEstado.toUpperCase())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Estado no permitido."));
        }
        Long proveedorId;
        try {
            proveedorId = Long.valueOf(String.valueOf(payload.get("proveedorUsuarioId")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Debe identificarse el profesional que gestiona la solicitud."));
        }
        if (!proveedorId.equals(solicitud.getProfesionalUsuarioId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "La solicitud no pertenece a este profesional."));
        }
        if ("PENDIENTE".equalsIgnoreCase(solicitud.getEstado()) && "ACEPTADA".equalsIgnoreCase(nuevoEstado)
                && !contratacionRepository.existsBySolicitudServicioId(solicitud.getId())) {
            Contratacion contratacion = new Contratacion();
            contratacion.setSolicitudServicioId(solicitud.getId());
            contratacion.setClienteUsuarioId(solicitud.getCreadorUsuarioId());
            contratacion.setProveedorUsuarioId(proveedorId);
            contratacion.setTitulo("Contratación: " + solicitud.getTitulo());
            contratacion.setDescripcion(solicitud.getDescripcion());
            contratacion.setEstado("ACTIVA");
            contratacionRepository.save(contratacion);
        }
        solicitud.setEstado(nuevoEstado.toUpperCase());
        return ResponseEntity.ok(solicitudRepository.save(solicitud));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!solicitudRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        solicitudRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
