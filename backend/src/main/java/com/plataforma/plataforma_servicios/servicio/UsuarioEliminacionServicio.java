package com.plataforma.plataforma_servicios.servicio;

import com.plataforma.plataforma_servicios.repositorio.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioEliminacionServicio {
    private final UsuarioRepository usuarios;
    private final PerfilRepository perfiles;
    private final PublicacionRepository publicaciones;
    private final ComentarioRepository comentarios;
    private final InteresRepository intereses;
    private final MensajeRepository mensajes;
    private final SolicitudServicioRepository solicitudes;
    private final ContratacionRepository contrataciones;
    private final ResenaRepository resenas;
    private final ServicioProfesionalRepository servicios;
    private final ExperienciaLaboralRepository experiencias;
    private final FormacionRepository formaciones;
    private final HabilidadProfesionalRepository habilidades;
    private final PortafolioRepository portafolios;
    private final DisponibilidadRepository disponibilidades;

    public UsuarioEliminacionServicio(UsuarioRepository usuarios, PerfilRepository perfiles, PublicacionRepository publicaciones,
            ComentarioRepository comentarios, InteresRepository intereses, MensajeRepository mensajes,
            SolicitudServicioRepository solicitudes, ContratacionRepository contrataciones, ResenaRepository resenas,
            ServicioProfesionalRepository servicios, ExperienciaLaboralRepository experiencias, FormacionRepository formaciones,
            HabilidadProfesionalRepository habilidades, PortafolioRepository portafolios, DisponibilidadRepository disponibilidades) {
        this.usuarios = usuarios; this.perfiles = perfiles; this.publicaciones = publicaciones; this.comentarios = comentarios;
        this.intereses = intereses; this.mensajes = mensajes; this.solicitudes = solicitudes; this.contrataciones = contrataciones;
        this.resenas = resenas; this.servicios = servicios; this.experiencias = experiencias; this.formaciones = formaciones;
        this.habilidades = habilidades; this.portafolios = portafolios; this.disponibilidades = disponibilidades;
    }

    @Transactional
    public void eliminar(Long id) {
        var usuario = usuarios.findById(id).orElseThrow(() -> new EntityNotFoundException("No se encontró el usuario."));
        var publicacionesUsuario = publicaciones.findByUsuarioId(id);
        var idsPublicaciones = publicacionesUsuario.stream().map(p -> p.getId()).toList();
        if (!idsPublicaciones.isEmpty()) {
            comentarios.deleteByPublicacionIdIn(idsPublicaciones);
            intereses.deleteByPublicacionIdIn(idsPublicaciones);
        }
        comentarios.deleteByUsuarioId(id);
        intereses.deleteByUsuarioId(id);
        publicaciones.deleteByUsuarioId(id);
        mensajes.deleteByEmisorUsuarioIdOrReceptorUsuarioId(id, id);
        // Los registros previos a la columna de usuario usan el nombre visible. Solo se limpian
        // por nombre cuando ese nombre es único, para no borrar mensajes de otra cuenta homónima.
        if (usuarios.countByNombreIgnoreCase(usuario.getNombre()) == 1) {
            mensajes.deleteByEmisorIgnoreCaseOrReceptorIgnoreCase(usuario.getNombre(), usuario.getNombre());
            comentarios.deleteByAutorIgnoreCase(usuario.getNombre());
            intereses.deleteByUsuarioIgnoreCase(usuario.getNombre());
            publicaciones.deleteByAutorIgnoreCase(usuario.getNombre());
        }
        resenas.deleteByAutorUsuarioIdOrEvaluadoUsuarioId(id, id);
        contrataciones.deleteByClienteUsuarioIdOrProveedorUsuarioId(id, id);
        solicitudes.deleteByClienteUsuarioIdOrProfesionalUsuarioId(id, id);
        perfiles.findByUsuarioId(id).ifPresent(p -> {
            Long perfilId = p.getIdPerfil();
            disponibilidades.deleteByPerfil_IdPerfil(perfilId);
            experiencias.deleteByPerfilIdPerfil(perfilId);
            formaciones.deleteByPerfilIdPerfil(perfilId);
            habilidades.deleteByPerfilIdPerfil(perfilId);
            portafolios.deleteByPerfilIdPerfil(perfilId);
            servicios.deleteByPerfilIdPerfil(perfilId);
        });
        usuarios.delete(usuario);
    }
}
