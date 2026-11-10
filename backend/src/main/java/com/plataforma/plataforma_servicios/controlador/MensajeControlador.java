package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Mensaje;
import com.plataforma.plataforma_servicios.repositorio.MensajeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mensajes")
@CrossOrigin(origins = "*")
public class MensajeControlador {

    private final MensajeRepository mensajeRepository;

    public MensajeControlador(MensajeRepository mensajeRepository) {
        this.mensajeRepository = mensajeRepository;
    }

    @GetMapping
    public ResponseEntity<List<Mensaje>> obtenerTodos() {
        return ResponseEntity.ok(mensajeRepository.findAll());
    }

    @GetMapping("/conversacion")
    public ResponseEntity<List<Mensaje>> obtenerConversacion(
            @RequestParam String emisor,
            @RequestParam String receptor) {

        List<Mensaje> mensajes =
                mensajeRepository.findByEmisorAndReceptorOrEmisorAndReceptorOrderByFechaEnvioAsc(
                        emisor, receptor, receptor, emisor
                );

        return ResponseEntity.ok(mensajes);
    }

    @PostMapping
    public ResponseEntity<Mensaje> enviar(@RequestBody Mensaje mensaje) {
        if (mensaje.getEmisor() == null || mensaje.getEmisor().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        if (mensaje.getReceptor() == null || mensaje.getReceptor().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        if (mensaje.getContenido() == null || mensaje.getContenido().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Mensaje nuevo = mensajeRepository.save(mensaje);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {

        if (!mensajeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        mensajeRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
