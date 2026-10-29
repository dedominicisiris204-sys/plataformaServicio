package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;

@Entity
@Table(name = "postulaciones")
public class Postulacion extends RegistroMarketplaceBase {
    private Long oportunidadId;
    private Long postulanteUsuarioId;
    @Column(length = 3000)
    private String presentacion;
    public Long getOportunidadId() { return oportunidadId; }
    public void setOportunidadId(Long v) { this.oportunidadId = v; }
    public Long getPostulanteUsuarioId() { return postulanteUsuarioId; }
    public void setPostulanteUsuarioId(Long v) { this.postulanteUsuarioId = v; }
    public String getPresentacion() { return presentacion; }
    public void setPresentacion(String v) { this.presentacion = v; }
}
