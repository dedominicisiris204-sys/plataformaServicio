package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    // Busca la conversación filtrando por los involucrados
    List<Mensaje> findByEmisorAndReceptorOrEmisorAndReceptorOrderByFechaEnvioAsc(
            String emisor1, String receptor1, String emisor2, String receptor2
    );
}