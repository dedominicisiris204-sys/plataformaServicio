package com.plataforma.plataforma_servicios.config;

import com.plataforma.plataforma_servicios.entidad.Perfil;
import com.plataforma.plataforma_servicios.repositorio.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Component
public class PerfilOwnershipInterceptor implements HandlerInterceptor {
    private final PerfilRepository perfiles;
    private final UsuarioRepository usuarios;
    private final Map<String, Function<Long, Optional<Long>>> ownerPorRegistro;

    public PerfilOwnershipInterceptor(PerfilRepository perfiles, UsuarioRepository usuarios,
            ServicioProfesionalRepository servicios, ExperienciaLaboralRepository experiencias,
            FormacionRepository formaciones, HabilidadProfesionalRepository habilidades,
            PortafolioRepository portafolios, DisponibilidadRepository disponibilidades) {
        this.perfiles = perfiles; this.usuarios = usuarios;
        this.ownerPorRegistro = Map.of(
                "servicios-profesionales", id -> servicios.findById(id).map(x -> x.getPerfil().getIdPerfil()),
                "experiencias", id -> experiencias.findById(id).map(x -> x.getPerfil().getIdPerfil()),
                "formaciones", id -> formaciones.findById(id).map(x -> x.getPerfil().getIdPerfil()),
                "habilidades-profesionales", id -> habilidades.findById(id).map(x -> x.getPerfil().getIdPerfil()),
                "portafolio", id -> portafolios.findById(id).map(x -> x.getPerfil().getIdPerfil()),
                "disponibilidades", id -> disponibilidades.findById(id).map(x -> x.getPerfil().getIdPerfil()));
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!"POST".equals(request.getMethod()) && !"PUT".equals(request.getMethod()) && !"DELETE".equals(request.getMethod())) return true;
        String[] p = request.getRequestURI().split("/");
        if (p.length < 4 || !"api".equals(p[1]) || !ownerPorRegistro.containsKey(p[2])) return true;
        Long profileId = null;
        if ("POST".equals(request.getMethod()) && p.length > 4 && "perfil".equals(p[3])) {
            profileId = parse(p[4]);
        } else if ("DELETE".equals(request.getMethod())) {
            Long registroId = parse(p[3]);
            if (registroId == null) return deny(response);
            profileId = ownerPorRegistro.get(p[2]).apply(registroId).orElse(null);
        }
        if (profileId == null) return deny(response);
        Long propietarioId = perfiles.findById(profileId).map(Perfil::getUsuario).map(u -> u.getId()).orElse(null);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (propietarioId == null || auth == null || !auth.isAuthenticated()) return deny(response);
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROL_ADMIN"));
        Long actorId = usuarios.findByEmailIgnoreCase(auth.getName()).map(u -> u.getId()).orElse(null);
        if (!admin && !propietarioId.equals(actorId)) return deny(response);
        return true;
    }

    private boolean deny(HttpServletResponse response) throws Exception {
        response.sendError(HttpServletResponse.SC_FORBIDDEN, "No podés modificar datos de otro perfil.");
        return false;
    }
    private Long parse(String value) { try { return Long.parseLong(value); } catch (RuntimeException e) { return null; } }
}
