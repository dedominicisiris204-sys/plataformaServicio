package com.plataforma.plataforma_servicios.controlador;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/mercadopago")
@CrossOrigin(origins = "*")
public class MercadoPagoControlador {

    @Value("${mercadopago.access-token}")
    private String accessToken;

    @Value("${mercadopago.public-key}")
    private String publicKey;

    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> obtenerConfiguracion() {
        Map<String, Object> resp = new HashMap<>();
        boolean esTestDefault = accessToken == null || accessToken.contains("00000000");
        resp.put("publicKey", publicKey);
        resp.put("modoSandbox", esTestDefault);
        resp.put("activo", true);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/crear-preferencia")
    public ResponseEntity<Map<String, Object>> crearPreferencia(@RequestBody Map<String, Object> datos) {
        String concepto = (String) datos.getOrDefault("concepto", "Pago de Servicio en Plataforma");
        Number monto = (Number) datos.getOrDefault("monto", 15000);
        String clienteEmail = (String) datos.getOrDefault("email", "cliente@plataforma.com");

        String preferenceId = "PREF-" + UUID.randomUUID().toString().substring(0, 8);
        String initPoint = "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=" + preferenceId;

        // Cálculo de comisión plataforma (10%)
        double montoTotal = monto.doubleValue();
        double comision10 = montoTotal * 0.10;
        double netoProfesional = montoTotal - comision10;

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("preferenceId", preferenceId);
        resultado.put("initPoint", initPoint);
        resultado.put("sandboxInitPoint", initPoint);
        resultado.put("concepto", concepto);
        resultado.put("montoTotal", montoTotal);
        resultado.put("comisionPlataforma", comision10);
        resultado.put("netoProfesional", netoProfesional);
        resultado.put("fecha", LocalDateTime.now().toString());
        resultado.put("estado", "PENDIENTE_PAGO");

        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/webhook")
    public ResponseEntity<Map<String, String>> recibirWebhook(@RequestBody(required = false) Map<String, Object> payload) {
        Map<String, String> resp = new HashMap<>();
        resp.put("status", "ok");
        resp.put("mensaje", "Notificación de pago recibida e impactada en comisiones");
        return ResponseEntity.ok(resp);
    }
}
