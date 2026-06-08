package com.plataforma.plataforma_servicios.servicio;

import com.plataforma.plataforma_servicios.entidad.Mensaje;
import com.plataforma.plataforma_servicios.repositorio.MensajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MensajeServicio {

    @Autowired
    private MensajeRepository mensajeRepository;

    public Mensaje enviarMensaje(Mensaje mensaje) {
        return mensajeRepository.save(mensaje);
    }

    public List<Mensaje> obtenerConversacion(String p1, String p2) {
        return mensajeRepository.findByEmisorAndReceptorOrEmisorAndReceptorOrderByFechaEnvioAsc(p1, p2, p2, p1);
    }
}