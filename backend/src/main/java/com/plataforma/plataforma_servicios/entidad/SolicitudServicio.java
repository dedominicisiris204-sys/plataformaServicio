package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;

@Entity
@Table(name = "solicitudes_servicio")
public class SolicitudServicio extends RegistroMarketplaceBase {
    @Column(length = 120)
    private String categoria;
    @Column(length = 250)
    private String ubicacion;
    private java.math.BigDecimal presupuesto;
    public String getCategoria() { return categoria; }
    public void setCategoria(String v) { this.categoria = v; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String v) { this.ubicacion = v; }
    public java.math.BigDecimal getPresupuesto() { return presupuesto; }
    public void setPresupuesto(java.math.BigDecimal v) { this.presupuesto = v; }
}
