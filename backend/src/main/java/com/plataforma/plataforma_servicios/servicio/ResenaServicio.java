package com.plataforma.plataforma_servicios.servicio;

import com.plataforma.plataforma_servicios.entidad.Perfil;
import com.plataforma.plataforma_servicios.entidad.Resena;
import com.plataforma.plataforma_servicios.repositorio.ContratacionRepository;
import com.plataforma.plataforma_servicios.repositorio.PerfilRepository;
import com.plataforma.plataforma_servicios.repositorio.ResenaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResenaServicio {
    private final ResenaRepository resenas;
    private final ContratacionRepository contrataciones;
    private final PerfilRepository perfiles;

    public ResenaServicio(ResenaRepository resenas, ContratacionRepository contrataciones, PerfilRepository perfiles) {
        this.resenas = resenas;
        this.contrataciones = contrataciones;
        this.perfiles = perfiles;
    }

    @Transactional
    public Resena crear(Long contratoId, Long autorId, Integer puntuacion, String comentario) {
        if (puntuacion == null || puntuacion < 1 || puntuacion > 5) throw new IllegalArgumentException("La calificación debe ser de 1 a 5 estrellas.");
        var contrato = contrataciones.findById(contratoId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("No se encontró la contratación."));
        if (!"COMPLETADA".equals(contrato.getEstado()) || !autorId.equals(contrato.getClienteUsuarioId())) {
            throw new org.springframework.security.access.AccessDeniedException("Solo el cliente puede calificar una contratación completada.");
        }
        if (resenas.existsByContratacionId(contratoId)) throw new IllegalArgumentException("Esta contratación ya tiene una reseña.");
        Resena resena = new Resena();
        resena.setContratacionId(contratoId);
        resena.setAutorUsuarioId(autorId);
        resena.setEvaluadoUsuarioId(contrato.getProveedorUsuarioId());
        resena.setPuntuacion(puntuacion);
        resena.setComentario(comentario == null ? "" : comentario.trim());
        resena.setEstado("PUBLICADA");
        Resena guardada = resenas.save(resena);
        List<Resena> delProfesional = resenas.findByEvaluadoUsuarioIdOrderByFechaCreacionDesc(guardada.getEvaluadoUsuarioId());
        double promedio = delProfesional.stream().mapToInt(Resena::getPuntuacion).average().orElse(0.0);
        perfiles.findByUsuarioId(guardada.getEvaluadoUsuarioId()).ifPresent(perfil -> {
            perfil.setCalificacionPromedio(Math.round(promedio * 10.0) / 10.0);
            perfiles.save(perfil);
        });
        return guardada;
    }

    @Transactional(readOnly = true)
    public List<Resena> porProfesional(Long id) { return resenas.findByEvaluadoUsuarioIdOrderByFechaCreacionDesc(id); }
}
