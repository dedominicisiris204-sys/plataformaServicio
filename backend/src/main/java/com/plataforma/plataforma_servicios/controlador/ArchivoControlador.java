package com.plataforma.plataforma_servicios.controlador;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/archivos")
public class ArchivoControlador {
    private static final long MAX_BYTES = 5L * 1024 * 1024;
    private static final Map<String, String> EXTENSIONES = Map.of(
            "image/jpeg", ".jpg", "image/png", ".png", "image/webp", ".webp");
    private final Path directorio;

    public ArchivoControlador(@Value("${app.upload.dir:uploads}") String directorio) {
        this.directorio = Path.of(directorio).toAbsolutePath().normalize();
    }

    @PostMapping(value = "/subir", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> subir(@RequestParam("archivo") MultipartFile archivo) throws IOException {
        if (archivo == null || archivo.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seleccioná una imagen.");
        }
        if (archivo.getSize() > MAX_BYTES) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "La imagen no puede superar 5 MB.");
        }
        String tipo = archivo.getContentType();
        String extension = EXTENSIONES.get(tipo);
        if (extension == null || !Set.of("jpg", "png", "webp").contains(extension.substring(1))) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Solo se permiten imágenes JPG, PNG o WEBP.");
        }
        byte[] firma = archivo.getInputStream().readNBytes(12);
        boolean formatoReal = switch (tipo) {
            case "image/jpeg" -> firma.length >= 3 && (firma[0] & 0xff) == 0xff && (firma[1] & 0xff) == 0xd8 && (firma[2] & 0xff) == 0xff;
            case "image/png" -> firma.length >= 8 && (firma[0] & 0xff) == 0x89 && firma[1] == 0x50 && firma[2] == 0x4e && firma[3] == 0x47;
            case "image/webp" -> firma.length >= 12 && new String(firma, 0, 4, java.nio.charset.StandardCharsets.US_ASCII).equals("RIFF")
                    && new String(firma, 8, 4, java.nio.charset.StandardCharsets.US_ASCII).equals("WEBP");
            default -> false;
        };
        if (!formatoReal) throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "El contenido del archivo no coincide con una imagen permitida.");
        Files.createDirectories(directorio);
        String nombre = UUID.randomUUID() + extension;
        Path destino = directorio.resolve(nombre).normalize();
        if (!destino.startsWith(directorio)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nombre de archivo no válido.");
        }
        archivo.transferTo(destino);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("url", "/uploads/" + nombre));
    }
}
