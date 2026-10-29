package com.plataforma.plataforma_servicios.dto;

public record PerfilRespuesta(
        Long idPerfil,
        Long usuarioId,
        String nombre,
        String experiencia,
        String estudios,
        String habilidades,
        String zonaTrabajo,
        String horarios,
        Double calificacionPromedio,
        Double latitud,
        Double longitud) {
}
