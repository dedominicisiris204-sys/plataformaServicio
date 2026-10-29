package com.plataforma.plataforma_servicios.repositorio;

import com.plataforma.plataforma_servicios.entidad.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
}
