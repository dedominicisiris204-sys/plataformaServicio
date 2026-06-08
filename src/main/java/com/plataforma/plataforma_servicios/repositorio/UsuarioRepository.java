package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Al extender JpaRepository, automáticamente heredas métodos como:
    // save(), findAll(), findById(), deleteById() sin escribir una sola línea de SQL.
}