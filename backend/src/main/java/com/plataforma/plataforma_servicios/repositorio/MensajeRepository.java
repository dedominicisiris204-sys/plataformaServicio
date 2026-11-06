package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    // Busca la conversaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n filtrando por los involucrados
    List<Mensaje> findByEmisorAndReceptorOrEmisorAndReceptorOrderByFechaEnvioAsc(
            String emisor1, String receptor1, String emisor2, String receptor2
    );
    List<Mensaje> findByReceptorIgnoreCaseAndLeidoFalse(String receptor);
    void deleteByEmisorIgnoreCaseOrReceptorIgnoreCase(String emisor, String receptor);
    List<Mensaje> findByEmisorUsuarioIdAndReceptorUsuarioIdOrReceptorUsuarioIdAndEmisorUsuarioIdOrderByFechaEnvioAsc(Long emisorId, Long receptorId, Long receptorId2, Long emisorId2);
    List<Mensaje> findByReceptorUsuarioIdAndLeidoFalse(Long receptorUsuarioId);
    long countByReceptorUsuarioIdAndLeidoFalse(Long receptorUsuarioId);
    long countByReceptorIgnoreCaseAndLeidoFalse(String receptor);
    void deleteByEmisorUsuarioIdOrReceptorUsuarioId(Long emisorUsuarioId, Long receptorUsuarioId);
}
