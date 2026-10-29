package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;

@Entity
@Table(name = "oportunidades_laborales")
public class OportunidadLaboral extends RegistroMarketplaceBase {
    private Long empresaId;
    @Column(length = 120)
    private String categoria;
    @Column(length = 180)
    private String ubicacion;
    @Column(length = 60)
    private String modalidad;
    public Long getEmpresaId() { return empresaId; }
    public void setEmpresaId(Long v) { this.empresaId = v; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String v) { this.categoria = v; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String v) { this.ubicacion = v; }
    public String getModalidad() { return modalidad; }
    public void setModalidad(String v) { this.modalidad = v; }
}
