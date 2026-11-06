package com.plataforma.plataforma_servicios.servicio;

import com.plataforma.plataforma_servicios.entidad.Contratacion;
import com.plataforma.plataforma_servicios.entidad.SolicitudServicio;
import com.plataforma.plataforma_servicios.repositorio.ContratacionRepository;
import com.plataforma.plataforma_servicios.repositorio.SolicitudServicioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class SolicitudNegocioServicio {
    private final SolicitudServicioRepository solicitudes;
    private final ContratacionRepository contrataciones;

    public SolicitudNegocioServicio(SolicitudServicioRepository solicitudes, ContratacionRepository contrataciones) {
        this.solicitudes = solicitudes;
        this.contrataciones = contrataciones;
    }

    @Transactional
    public SolicitudServicio crear(Long clienteId, Long profesionalId, String titulo, String descripcion,
                                   LocalDate fechaEstimada, String ubicacion) {
        if (clienteId == null || profesionalId == null || clienteId.equals(profesionalId)) {
            throw new IllegalArgumentException("Elegí un profesional distinto de tu cuenta.");
        }
        if (descripcion == null || descripcion.isBlank() || descripcion.length() > 5000) {
            throw new IllegalArgumentException("La descripción es obligatoria y debe tener hasta 5000 caracteres.");
        }
        SolicitudServicio s = new SolicitudServicio();
        s.setClienteUsuarioId(clienteId);
        s.setProfesionalUsuarioId(profesionalId);
        s.setCreadorUsuarioId(clienteId);
        s.setTitulo(titulo == null || titulo.isBlank() ? "Solicitud de presupuesto" : titulo.trim());
        s.setDescripcion(descripcion.trim());
        s.setFechaEstimada(fechaEstimada);
        s.setUbicacion(ubicacion);
        s.setEstado("PENDIENTE");
        return solicitudes.save(s);
    }

    @Transactional(readOnly = true)
    public List<SolicitudServicio> recibidas(Long profesionalId) {
        return solicitudes.findByProfesionalUsuarioIdOrderByFechaCreacionDesc(profesionalId);
    }

    @Transactional(readOnly = true)
    public List<SolicitudServicio> enviadas(Long clienteId) {
        return solicitudes.findByClienteUsuarioIdOrderByFechaCreacionDesc(clienteId);
    }

    @Transactional
    public SolicitudServicio cambiarEstado(Long id, Long profesionalId, String nuevoEstado) {
        if (nuevoEstado == null || !List.of("ACEPTADA", "RECHAZADA", "COMPLETADA").contains(nuevoEstado)) {
            throw new IllegalArgumentException("El estado debe ser ACEPTADA, RECHAZADA o COMPLETADA.");
        }
        SolicitudServicio s = solicitudes.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("No se encontró la solicitud."));
        if (!profesionalId.equals(s.getProfesionalUsuarioId())) {
            throw new org.springframework.security.access.AccessDeniedException("No podés cambiar esta solicitud.");
        }
        String actual = s.getEstado();
        boolean permitido = "PENDIENTE".equals(actual)
                ? List.of("ACEPTADA", "RECHAZADA").contains(nuevoEstado)
                : "ACEPTADA".equals(actual) && "COMPLETADA".equals(nuevoEstado);
        if (!permitido) throw new IllegalArgumentException("No se puede cambiar el estado de " + actual + " a " + nuevoEstado + ".");
        s.setEstado(nuevoEstado);
        SolicitudServicio guardada = solicitudes.save(s);
        if ("ACEPTADA".equals(nuevoEstado) && !contrataciones.existsBySolicitudServicioId(s.getId())) {
            Contratacion c = new Contratacion();
            c.setSolicitudServicioId(s.getId());
            c.setClienteUsuarioId(s.getClienteUsuarioId());
            c.setProveedorUsuarioId(s.getProfesionalUsuarioId());
            c.setTitulo(s.getTitulo());
            c.setDescripcion(s.getDescripcion());
            c.setEstado("ACEPTADA");
            Contratacion guardada = contrataciones.save(c);
            s.setContratacionId(guardada.getId());
            solicitudes.save(s);
        } else if ("COMPLETADA".equals(nuevoEstado)) {
            contrataciones.findBySolicitudServicioId(s.getId()).ifPresent(c -> {
                c.setEstado("COMPLETADA");
                contrataciones.save(c);
            });
        }
        return guardada;
    }
}
