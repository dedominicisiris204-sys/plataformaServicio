package com.plataforma.plataforma_servicios.servicio;

import com.plataforma.plataforma_servicios.entidad.Perfil;
import com.plataforma.plataforma_servicios.entidad.Usuario;
import com.plataforma.plataforma_servicios.repositorio.PerfilRepository;
import com.plataforma.plataforma_servicios.repositorio.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class PerfilServicio {
    private final PerfilRepository perfiles;
    private final UsuarioRepository usuarios;
    public PerfilServicio(PerfilRepository perfiles, UsuarioRepository usuarios) { this.perfiles = perfiles; this.usuarios = usuarios; }

    @Transactional(readOnly = true)
    public Optional<Perfil> porUsuario(Long id) { return perfiles.findByUsuarioId(id); }
    @Transactional(readOnly = true)
    public Optional<Perfil> porId(Long id) { return perfiles.findById(id); }

    @Transactional
    public Perfil guardar(Long usuarioId, Perfil datos) {
        Usuario usuario = usuarios.findById(usuarioId).orElseThrow(() -> new EntityNotFoundException("No se encontró el usuario."));
        Perfil p = perfiles.findByUsuarioId(usuarioId).orElseGet(Perfil::new);
        p.setUsuario(usuario);
        p.setFotoPerfil(limitar(datos.getFotoPerfil(), 500, "foto"));
        p.setOficio(limitar(datos.getOficio(), 150, "oficio"));
        p.setDescripcion(limitar(datos.getDescripcion(), 1000, "descripción"));
        p.setServicios(limitar(datos.getServicios(), 1000, "servicios"));
        p.setExperiencia(limitar(datos.getExperiencia(), 500, "experiencia"));
        p.setEstudios(limitar(datos.getEstudios(), 255, "estudios"));
        p.setHabilidades(limitar(datos.getHabilidades(), 500, "habilidades"));
        p.setZonaTrabajo(limitar(datos.getZonaTrabajo(), 150, "zona"));
        p.setHorarios(limitar(datos.getHorarios(), 150, "horarios"));
        if (p.getCalificacionPromedio() == null) p.setCalificacionPromedio(0.0);
        return perfiles.save(p);
    }
    private String limitar(String valor, int maximo, String campo) {
        if (valor != null && valor.length() > maximo) throw new IllegalArgumentException("El campo " + campo + " supera el máximo de " + maximo + " caracteres.");
        return valor;
    }
}
