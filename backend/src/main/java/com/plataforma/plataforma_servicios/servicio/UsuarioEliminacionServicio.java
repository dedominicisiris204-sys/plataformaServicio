package com.plataforma.plataforma_servicios.servicio;

import com.plataforma.plataforma_servicios.entidad.Publicacion;
import com.plataforma.plataforma_servicios.entidad.Usuario;
import com.plataforma.plataforma_servicios.repositorio.PublicacionRepository;
import com.plataforma.plataforma_servicios.repositorio.UsuarioRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class UsuarioEliminacionServicio {
    @PersistenceContext
    private EntityManager entityManager;

    private final UsuarioRepository usuarioRepository;
    private final PublicacionRepository publicacionRepository;

    public UsuarioEliminacionServicio(UsuarioRepository usuarioRepository, PublicacionRepository publicacionRepository) {
        this.usuarioRepository = usuarioRepository;
        this.publicacionRepository = publicacionRepository;
    }

    @Transactional
    public void eliminar(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("El usuario no existe."));
        Set<String> identidades = Set.of(usuario.getNombre().toLowerCase(Locale.ROOT), usuario.getEmail().toLowerCase(Locale.ROOT));

        List<Long> publicaciones = entityManager.createQuery(
                "select p.id from Publicacion p where p.autorUsuarioId = :id or lower(p.autor) in :identidades", Long.class)
                .setParameter("id", usuarioId).setParameter("identidades", identidades).getResultList();
        List<Long> solicitudes = entityManager.createQuery(
                "select s.id from SolicitudServicio s where s.creadorUsuarioId = :id or s.profesionalUsuarioId = :id", Long.class)
                .setParameter("id", usuarioId).getResultList();

        entityManager.createQuery("delete from Resena r where r.autorUsuarioId = :id or r.evaluadoUsuarioId = :id")
                .setParameter("id", usuarioId).executeUpdate();
        entityManager.createQuery("delete from Contratacion c where c.clienteUsuarioId = :id or c.proveedorUsuarioId = :id")
                .setParameter("id", usuarioId).executeUpdate();
        entityManager.createQuery("delete from Propuesta p where p.proveedorUsuarioId = :id")
                .setParameter("id", usuarioId).executeUpdate();
        entityManager.createQuery("delete from Postulacion p where p.postulanteUsuarioId = :id")
                .setParameter("id", usuarioId).executeUpdate();
        entityManager.createQuery("delete from SolicitudServicio s where s.creadorUsuarioId = :id or s.profesionalUsuarioId = :id")
                .setParameter("id", usuarioId).executeUpdate();

        if (!publicaciones.isEmpty()) {
            entityManager.createQuery("delete from Comentario c where c.publicacionId in :ids")
                    .setParameter("ids", publicaciones).executeUpdate();
            entityManager.createQuery("delete from Interes i where i.publicacionId in :ids")
                    .setParameter("ids", publicaciones).executeUpdate();
        }
        entityManager.createQuery("delete from Comentario c where lower(c.autor) in :identidades")
                .setParameter("identidades", identidades).executeUpdate();
        entityManager.createQuery("delete from Interes i where lower(i.usuario) in :identidades")
                .setParameter("identidades", identidades).executeUpdate();
        entityManager.createQuery("delete from Mensaje m where lower(m.emisor) in :identidades or lower(m.receptor) in :identidades")
                .setParameter("identidades", identidades).executeUpdate();

        if (!publicaciones.isEmpty()) {
            publicacionRepository.deleteAll(publicacionRepository.findAllById(publicaciones));
        }

        entityManager.createQuery("delete from ServicioProfesional s where s.perfil.idPerfil in (select p.idPerfil from Perfil p where p.usuario.id = :id)")
                .setParameter("id", usuarioId).executeUpdate();
        entityManager.createQuery("delete from ExperienciaLaboral e where e.perfil.idPerfil in (select p.idPerfil from Perfil p where p.usuario.id = :id)")
                .setParameter("id", usuarioId).executeUpdate();
        entityManager.createQuery("delete from Formacion f where f.perfil.idPerfil in (select p.idPerfil from Perfil p where p.usuario.id = :id)")
                .setParameter("id", usuarioId).executeUpdate();
        entityManager.createQuery("delete from HabilidadProfesional h where h.perfil.idPerfil in (select p.idPerfil from Perfil p where p.usuario.id = :id)")
                .setParameter("id", usuarioId).executeUpdate();
        entityManager.createQuery("delete from Portafolio p where p.perfil.idPerfil in (select p2.idPerfil from Perfil p2 where p2.usuario.id = :id)")
                .setParameter("id", usuarioId).executeUpdate();
        entityManager.createQuery("delete from Disponibilidad d where d.perfil.idPerfil in (select p.idPerfil from Perfil p where p.usuario.id = :id)")
                .setParameter("id", usuarioId).executeUpdate();

        entityManager.remove(usuario);
    }
}
