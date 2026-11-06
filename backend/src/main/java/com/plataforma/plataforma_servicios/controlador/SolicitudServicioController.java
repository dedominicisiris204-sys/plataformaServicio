package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.SolicitudServicio;
import com.plataforma.plataforma_servicios.repositorio.UsuarioRepository;
import com.plataforma.plataforma_servicios.servicio.SolicitudNegocioServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudServicioController {
    private final SolicitudNegocioServicio servicio;
    private final UsuarioRepository usuarios;

    public SolicitudServicioController(SolicitudNegocioServicio servicio, UsuarioRepository usuarios) {
        this.servicio = servicio;
        this.usuarios = usuarios;
    }

    @PostMapping
    public ResponseEntity<SolicitudServicio> crear(@RequestBody Map<String, Object> body, Authentication auth) {
        Long cliente = usuarioActual(auth);
        Long profesional = numero(body.get("profesionalUsuarioId"));
        var cuentaCliente = usuarios.findById(cliente).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("No se encontró el cliente."));
        var cuentaProfesional = usuarios.findById(profesional).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("No se encontró el profesional."));
        if (!com.plataforma.plataforma_servicios.entidad.Usuario.ROL_CLIENTE.equals(cuentaCliente.getRol())) {
            throw new org.springframework.security.access.AccessDeniedException("Solo las cuentas cliente pueden solicitar un presupuesto.");
        }
        if (!com.plataforma.plataforma_servicios.entidad.Usuario.ROL_PROFESIONAL.equals(cuentaProfesional.getRol())) {
            throw new IllegalArgumentException("La cuenta elegida no es un profesional.");
        }
        LocalDate fecha = null;
        try { if (body.get("fechaEstimada") != null) fecha = LocalDate.parse(body.get("fechaEstimada").toString()); }
        catch (DateTimeParseException e) { throw new IllegalArgumentException("La fecha estimada no es válida."); }
        SolicitudServicio nueva = servicio.crear(cliente, profesional, texto(body, "titulo"), texto(body, "descripcion"), fecha, texto(body, "ubicacion"));
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    @GetMapping("/profesional/{id}")
    public ResponseEntity<List<SolicitudServicio>> recibidas(@PathVariable Long id, Authentication auth) {
        if (!id.equals(usuarioActual(auth))) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        return ResponseEntity.ok(servicio.recibidas(id));
    }

    @GetMapping("/cliente/{id}")
    public ResponseEntity<List<SolicitudServicio>> enviadas(@PathVariable Long id, Authentication auth) {
        if (!id.equals(usuarioActual(auth))) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        return ResponseEntity.ok(servicio.enviadas(id));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<SolicitudServicio> estado(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication auth) {
        return ResponseEntity.ok(servicio.cambiarEstado(id, usuarioActual(auth), body.get("estado")));
    }

    private Long usuarioActual(Authentication auth) {
        if (auth == null) throw new org.springframework.security.access.AccessDeniedException("Sesión requerida.");
        return usuarios.findByEmailIgnoreCase(auth.getName()).map(u -> u.getId())
                .orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("La sesión ya no es válida."));
    }
    private Long numero(Object n) {
        try { return Long.valueOf(String.valueOf(n)); }
        catch (RuntimeException e) { throw new IllegalArgumentException("El profesional seleccionado no es válido."); }
    }
    private String texto(Map<String, Object> b, String k) { return b.get(k) == null ? null : b.get(k).toString(); }
}
