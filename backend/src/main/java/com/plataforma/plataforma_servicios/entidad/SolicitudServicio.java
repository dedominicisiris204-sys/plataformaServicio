package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;

@Entity
@Table(name = "solicitudes_servicio")
public class SolicitudServicio extends RegistroMarketplaceBase {
    @Column(name = "cliente_usuario_id")
    private Long clienteUsuarioId;
    @Column(name = "profesional_usuario_id")
    private Long profesionalUsuarioId;
    @Column(name = "fecha_estimada")
    private java.time.LocalDate fechaEstimada;
    @Column(name = "contratacion_id")
    private Long contratacionId;
    @Column(length = 120)
    private String categoria;
    @Column(length = 250)
    private String ubicacion;
    private java.math.BigDecimal presupuesto;
    public Long getClienteUsuarioId() { return clienteUsuarioId; }
    public void setClienteUsuarioId(Long v) { this.clienteUsuarioId = v; }
    public Long getProfesionalUsuarioId() { return profesionalUsuarioId; }
    public void setProfesionalUsuarioId(Long v) { this.profesionalUsuarioId = v; }
    public java.time.LocalDate getFechaEstimada() { return fechaEstimada; }
    public void setFechaEstimada(java.time.LocalDate v) { this.fechaEstimada = v; }
    public Long getContratacionId() { return contratacionId; }
    public void setContratacionId(Long v) { this.contratacionId = v; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String v) { this.categoria = v; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String v) { this.ubicacion = v; }
    public java.math.BigDecimal getPresupuesto() { return presupuesto; }
    public void setPresupuesto(java.math.BigDecimal v) { this.presupuesto = v; }
}
