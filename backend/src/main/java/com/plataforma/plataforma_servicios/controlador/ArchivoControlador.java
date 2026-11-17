package com.plataforma.plataforma_servicios.controlador;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/archivos")
@CrossOrigin(origins = "*")
public class ArchivoControlador {

    private static final Path UPLOAD_DIR = Paths.get("uploads").toAbsolutePath().normalize();
    private static final long TAMANO_MAXIMO = 5L * 1024 * 1024;
    private static final Map<String, String> TIPOS_VALIDOS = Map.of(
            "jpg", "image/jpeg", "jpeg", "image/jpeg", "png", "image/png", "webp", "image/webp");

    public ArchivoControlador() {
        try {
            if (!Files.exists(UPLOAD_DIR)) {
                Files.createDirectories(UPLOAD_DIR);
            }
        } catch (IOException e) {
            System.err.println("No se pudo inicializar el directorio uploads: " + e.getMessage());
        }
    }

    @PostMapping("/subir")
    public ResponseEntity<?> subirArchivo(
            @RequestParam(value = "archivo", required = false) MultipartFile archivoParam,
            @RequestParam(value = "file", required = false) MultipartFile fileParam) {

        MultipartFile archivo = archivoParam != null ? archivoParam : fileParam;

        if (archivo == null || archivo.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Debe proporcionar un archivo válido."));
        }

        String nombreOriginal = archivo.getOriginalFilename();
        if (nombreOriginal == null || nombreOriginal.isBlank()) {
            nombreOriginal = "archivo_" + System.currentTimeMillis();
        }

        String extension = "";
        int puntoIndex = nombreOriginal.lastIndexOf('.');
        if (puntoIndex > 0) {
            extension = nombreOriginal.substring(puntoIndex + 1).toLowerCase();
        }

        String tipoEsperado = TIPOS_VALIDOS.get(extension);
        if (tipoEsperado == null || !tipoEsperado.equalsIgnoreCase(archivo.getContentType())) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body(Map.of("error", "Formato no permitido. Subí una imagen JPG, PNG o WEBP válida."));
        }
        if (archivo.getSize() > TAMANO_MAXIMO) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body(Map.of("error", "La imagen no puede superar los 5 MB."));
        }

        try {
            if (!Files.exists(UPLOAD_DIR)) {
                Files.createDirectories(UPLOAD_DIR);
            }

            String nombreSeguro = UUID.randomUUID().toString() + "_" +
                    nombreOriginal.replaceAll("[^a-zA-Z0-9.-]", "_");

            Path destino = UPLOAD_DIR.resolve(nombreSeguro);
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("url", "/uploads/" + nombreSeguro);
            respuesta.put("nombre", nombreSeguro);
            respuesta.put("tamano", archivo.getSize());
            respuesta.put("mensaje", "Archivo cargado con éxito");

            return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al guardar el archivo: " + e.getMessage()));
        }
    }

    @GetMapping("/salud")
    public ResponseEntity<String> salud() {
        return ResponseEntity.ok("Servicio de archivos activo");
    }
}
