package com.plataforma.plataforma_servicios.servicio;

import com.plataforma.plataforma_servicios.dto.PerfilActualizacion;
import com.plataforma.plataforma_servicios.dto.PerfilRespuesta;
import com.plataforma.plataforma_servicios.entidad.Perfil;
import com.plataforma.plataforma_servicios.entidad.Usuario;
import com.plataforma.plataforma_servicios.repositorio.PerfilRepository;
import com.plataforma.plataforma_servicios.repositorio.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class PerfilServicio {

    private final PerfilRepository perfilRepository;
    private final UsuarioRepository usuarioRepository;

    public PerfilServicio(PerfilRepository perfilRepository, UsuarioRepository usuarioRepository) {
        this.perfilRepository = perfilRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public Optional<PerfilRespuesta> obtenerPorUsuario(Long usuarioId) {
        return perfilRepository.findByUsuario_Id(usuarioId).map(this::aRespuesta);
    }

    @Transactional
    public Optional<PerfilRespuesta> actualizar(Long usuarioId, PerfilActualizacion actualizacion) {
        if ((actualizacion.latitud() == null) != (actualizacion.longitud() == null)) {
            throw new IllegalArgumentException("La latitud y la longitud deben informarse juntas.");
        }

        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        if (usuario.isEmpty()) {
            return Optional.empty();
        }

        Perfil perfil = perfilRepository.findByUsuario_Id(usuarioId).orElseGet(Perfil::new);
        perfil.setUsuario(usuario.get());
        perfil.setExperiencia(actualizacion.experiencia());
        perfil.setEstudios(actualizacion.estudios());
        perfil.setHabilidades(actualizacion.habilidades());
        perfil.setZonaTrabajo(actualizacion.zonaTrabajo());
        perfil.setHorarios(actualizacion.horarios());
        perfil.setLatitud(actualizacion.latitud());
        perfil.setLongitud(actualizacion.longitud());

        return Optional.of(aRespuesta(perfilRepository.save(perfil)));
    }

    @Transactional(readOnly = true)
    public List<PerfilRespuesta> listarServicios() {
        return perfilRepository.findAll().stream()
                .filter(perfil -> perfil.getUsuario() != null)
                .filter(perfil -> perfil.getHabilidades() != null && !perfil.getHabilidades().isBlank())
                .sorted(Comparator.comparing(perfil -> perfil.getUsuario().getNombre(), String.CASE_INSENSITIVE_ORDER))
                .map(this::aRespuesta)
                .toList();
    }

    private PerfilRespuesta aRespuesta(Perfil perfil) {
        Usuario usuario = perfil.getUsuario();
        return new PerfilRespuesta(
                perfil.getIdPerfil(),
                usuario.getId(),
                usuario.getNombre(),
                perfil.getExperiencia(),
                perfil.getEstudios(),
                perfil.getHabilidades(),
                perfil.getZonaTrabajo(),
                perfil.getHorarios(),
                perfil.getCalificacionPromedio(),
                perfil.getLatitud(),
                perfil.getLongitud());
    }
}
