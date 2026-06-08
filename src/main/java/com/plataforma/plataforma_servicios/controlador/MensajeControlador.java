package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.entidad.Mensaje;
import com.plataforma.plataforma_servicios.servicio.MensajeServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mensajes")
@CrossOrigin(origins = "*")
public class MensajeControlador {

    @Autowired
    private MensajeServicio mensajeServicio;

    @PostMapping
    public ResponseEntity<Mensaje> mandar(@RequestBody Mensaje mensaje) {
        return ResponseEntity.ok(mensajeServicio.enviarMensaje(mensaje));
    }

    @GetMapping("/chat")
    public ResponseEntity<List<Mensaje>> chat(@RequestParam String usuario, @RequestParam String empresa) {
        return ResponseEntity.ok(mensajeServicio.obtenerConversacion(usuario, empresa));
    }
}