package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Al extender JpaRepository, automÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ticamente heredas mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©todos como:
    // save(), findAll(), findById(), deleteById() sin escribir una sola lÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nea de SQL.
}