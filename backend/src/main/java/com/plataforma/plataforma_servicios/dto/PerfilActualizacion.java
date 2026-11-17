package com.plataforma.plataforma_servicios.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

public record PerfilActualizacion(
        @Size(max = 500) String experiencia,
        @Size(max = 255) String estudios,
        @Size(max = 255) String habilidades,
        @Size(max = 100) String zonaTrabajo,
        @Size(max = 100) String horarios,
        @DecimalMin("-90.0") @DecimalMax("90.0") Double latitud,
        @DecimalMin("-180.0") @DecimalMax("180.0") Double longitud) {
}
