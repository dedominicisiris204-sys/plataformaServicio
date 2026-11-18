package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Empresa;
import com.plataforma.plataforma_servicios.repositorio.EmpresaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = "*")
public class EmpresaController {

    private final EmpresaRepository empresaRepository;

    public EmpresaController(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    @GetMapping
    public ResponseEntity<List<Empresa>> listar() {
        return ResponseEntity.ok(empresaRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empresa> obtenerPorId(@PathVariable Long id) {
        return empresaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Empresa> registrarEmpresa(@RequestBody Empresa empresa) {
        if (empresa.getEstado() == null || empresa.getEstado().isBlank()) {
            empresa.setEstado("ACTIVA");
        }
        if (empresa.getPlanSuscripcion() == null) {
            empresa.setPlanSuscripcion("PYME");
        }
        // Asignar cuota mensual según el plan y rubro
        if (empresa.getCuotaMensual() == null || empresa.getCuotaMensual() <= 0) {
            switch (empresa.getPlanSuscripcion().toUpperCase()) {
                case "CONSTRUCTORA":
                    empresa.setCuotaMensual(28000.0);
                    break;
                case "CORPORATIVO":
                    empresa.setCuotaMensual(55000.0);
                    break;
                case "PYME":
                default:
                    empresa.setCuotaMensual(12000.0);
                    break;
            }
        }
        empresa.setFechaRenovacion(LocalDateTime.now().plusMonths(1));
        Empresa guardada = empresaRepository.save(empresa);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    @PutMapping("/{id}/suscripcion")
    public ResponseEntity<?> actualizarPlan(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        return empresaRepository.findById(id).map(empresa -> {
            if (body.containsKey("planSuscripcion")) {
                empresa.setPlanSuscripcion((String) body.get("planSuscripcion"));
            }
            if (body.containsKey("cuotaMensual")) {
                empresa.setCuotaMensual(Double.valueOf(body.get("cuotaMensual").toString()));
            }
            if (body.containsKey("estadoSuscripcion")) {
                empresa.setEstadoSuscripcion((String) body.get("estadoSuscripcion"));
            }
            empresa.setFechaRenovacion(LocalDateTime.now().plusMonths(1));
            return ResponseEntity.ok(empresaRepository.save(empresa));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
