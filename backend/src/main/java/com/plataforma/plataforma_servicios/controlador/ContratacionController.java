package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Contratacion;
import com.plataforma.plataforma_servicios.repositorio.ContratacionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/contrataciones")
@CrossOrigin(origins = "*")
public class ContratacionController {

    private final ContratacionRepository contratacionRepository;

    public ContratacionController(ContratacionRepository contratacionRepository) {
        this.contratacionRepository = contratacionRepository;
    }

    @GetMapping
    public ResponseEntity<List<Contratacion>> obtenerTodas() {
        return ResponseEntity.ok(contratacionRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contratacion> obtenerPorId(@PathVariable Long id) {
        return contratacionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Contratacion>> obtenerPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(contratacionRepository.findByClienteUsuarioIdOrderByFechaCreacionDesc(clienteId));
    }

    @GetMapping("/proveedor/{proveedorId}")
    public ResponseEntity<List<Contratacion>> obtenerPorProveedor(@PathVariable Long proveedorId) {
        return ResponseEntity.ok(contratacionRepository.findByProveedorUsuarioIdOrderByFechaCreacionDesc(proveedorId));
    }

    @PostMapping
    public ResponseEntity<Contratacion> crear(@RequestBody Contratacion contratacion) {
        if (contratacion.getEstado() == null || contratacion.getEstado().isBlank()) {
            contratacion.setEstado("ACTIVA");
        }
        Contratacion nueva = contratacionRepository.save(contratacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Contratacion> opt = contratacionRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Contratacion c = opt.get();
        String estado = body.get("estado");
        if (estado != null && !estado.isBlank()) {
            c.setEstado(estado.toUpperCase());
        }
        return ResponseEntity.ok(contratacionRepository.save(c));
    }
}
