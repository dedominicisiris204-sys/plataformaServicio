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
    private Long profesionalUsuarioId;
    private java.time.LocalDate fechaEstimada;
    public String getCategoria() { return categoria; }
    public void setCategoria(String v) { this.categoria = v; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String v) { this.ubicacion = v; }
    public java.math.BigDecimal getPresupuesto() { return presupuesto; }
    public void setPresupuesto(java.math.BigDecimal v) { this.presupuesto = v; }
    public Long getProfesionalUsuarioId() { return profesionalUsuarioId; }
    public void setProfesionalUsuarioId(Long v) { this.profesionalUsuarioId = v; }
    public java.time.LocalDate getFechaEstimada() { return fechaEstimada; }
    public void setFechaEstimada(java.time.LocalDate v) { this.fechaEstimada = v; }
}
