package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;

@Entity
@Table(name = "miembros_empresa")
public class MiembroEmpresa extends RegistroMarketplaceBase {
    private Long empresaId;
    private Long usuarioId;
    @Column(length = 50)
    private String rol = "MIEMBRO";
    public Long getEmpresaId() { return empresaId; }
    public void setEmpresaId(Long v) { this.empresaId = v; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long v) { this.usuarioId = v; }
    public String getRol() { return rol; }
    public void setRol(String v) { this.rol = v; }
}
