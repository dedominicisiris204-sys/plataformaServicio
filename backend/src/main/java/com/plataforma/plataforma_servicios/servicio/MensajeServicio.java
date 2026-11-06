package com.plataforma.plataforma_servicios.servicio;

import com.plataforma.plataforma_servicios.entidad.Mensaje;
import com.plataforma.plataforma_servicios.repositorio.MensajeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import jakarta.persistence.EntityNotFoundException;

@Service
public class MensajeServicio {

    private final MensajeRepository mensajeRepository;

    public MensajeServicio(MensajeRepository mensajeRepository) { this.mensajeRepository = mensajeRepository; }

    @Transactional
    public Mensaje enviarMensaje(Mensaje mensaje) {
        if (mensaje.getEmisor() == null || mensaje.getEmisor().isBlank() || mensaje.getReceptor() == null || mensaje.getReceptor().isBlank()
                || mensaje.getContenido() == null || mensaje.getContenido().isBlank()) throw new IllegalArgumentException("Emisor, receptor y mensaje son obligatorios.");
        if (mensaje.getContenido().length() > 5000) throw new IllegalArgumentException("El mensaje supera los 5000 caracteres.");
        mensaje.setFechaEnvio(java.time.LocalDateTime.now());
        mensaje.setLeido(false);
        return mensajeRepository.save(mensaje);
    }

    @Transactional(readOnly = true)
    public List<Mensaje> listarTodos() { return mensajeRepository.findAll(); }

    @Transactional(readOnly = true)
    public List<Mensaje> obtenerConversacion(String p1, String p2) {
        return mensajeRepository.findByEmisorAndReceptorOrEmisorAndReceptorOrderByFechaEnvioAsc(p1, p2, p2, p1);
    }

    @Transactional
    public List<Mensaje> marcarConversacionLeida(String usuario, String otro) {
        List<Mensaje> lista = obtenerConversacion(usuario, otro);
        lista.stream().filter(m -> m.getReceptor().equalsIgnoreCase(usuario) && !m.isLeido()).forEach(m -> m.setLeido(true));
        return mensajeRepository.saveAll(lista);
    }

    @Transactional(readOnly = true)
    public long contarNoLeidos(String usuario) {
        return mensajeRepository.findByReceptorIgnoreCaseAndLeidoFalse(usuario).size();
    }

    @Transactional(readOnly = true)
    public List<Mensaje> conversacion(Long actualId, Long otroId, String actualNombre, String otroNombre) {
        List<Mensaje> lista = mensajeRepository.findByEmisorUsuarioIdAndReceptorUsuarioIdOrReceptorUsuarioIdAndEmisorUsuarioIdOrderByFechaEnvioAsc(
                actualId, otroId, actualId, otroId);
        return lista.isEmpty() ? obtenerConversacion(actualNombre, otroNombre) : lista;
    }

    @Transactional
    public List<Mensaje> marcarConversacionLeida(Long actualId, Long otroId, String actualNombre, String otroNombre) {
        List<Mensaje> lista = conversacion(actualId, otroId, actualNombre, otroNombre);
        List<Mensaje> nuevasLeidas = lista.stream().filter(m -> (actualId.equals(m.getReceptorUsuarioId()) ||
                (m.getReceptorUsuarioId() == null && m.getReceptor().equalsIgnoreCase(actualNombre))) && !m.isLeido()).toList();
        nuevasLeidas.forEach(m -> m.setLeido(true));
        if (!nuevasLeidas.isEmpty()) mensajeRepository.saveAll(nuevasLeidas);
        return lista;
    }

    @Transactional(readOnly = true)
    public long contarNoLeidos(Long usuarioId, String nombre) {
        long ids = mensajeRepository.countByReceptorUsuarioIdAndLeidoFalse(usuarioId);
        long legacy = mensajeRepository.findByReceptorIgnoreCaseAndLeidoFalse(nombre).stream().filter(m -> m.getReceptorUsuarioId() == null).count();
        return ids + legacy;
    }

    @Transactional
    public void eliminar(Long id, Long usuarioId, String usuario) {
        Mensaje m = mensajeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No se encontró el mensaje."));
        boolean participante = usuarioId.equals(m.getEmisorUsuarioId()) || usuarioId.equals(m.getReceptorUsuarioId())
                || (m.getEmisorUsuarioId() == null && usuario.equalsIgnoreCase(m.getEmisor()))
                || (m.getReceptorUsuarioId() == null && usuario.equalsIgnoreCase(m.getReceptor()));
        if (!participante) throw new org.springframework.security.access.AccessDeniedException("No podés eliminar este mensaje.");
        mensajeRepository.delete(m);
    }
}
