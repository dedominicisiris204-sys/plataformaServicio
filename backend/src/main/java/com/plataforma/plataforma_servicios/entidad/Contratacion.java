package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;

@Entity
@Table(name = "contrataciones")
public class Contratacion extends RegistroMarketplaceBase {
    private Long solicitudServicioId;
    private Long propuestaId;
    private Long clienteUsuarioId;
    private Long proveedorUsuarioId;

    // Campos de monetización y comisión justa de la plataforma
    private Double montoTotal = 0.0;
    private Double porcentajeComision = 10.0; // 10% estándar ético
    private Double comisionPlataforma = 0.0;
    private Double montoNetoTrabajador = 0.0;

    @Column(length = 30)
    private String estadoComision = "PENDIENTE"; // PENDIENTE, COBRADA, BONIFICADA

    public Long getSolicitudServicioId() { return solicitudServicioId; }
    public void setSolicitudServicioId(Long v) { this.solicitudServicioId = v; }
    public Long getPropuestaId() { return propuestaId; }
    public void setPropuestaId(Long v) { this.propuestaId = v; }
    public Long getClienteUsuarioId() { return clienteUsuarioId; }
    public void setClienteUsuarioId(Long v) { this.clienteUsuarioId = v; }
    public Long getProveedorUsuarioId() { return proveedorUsuarioId; }
    public void setProveedorUsuarioId(Long v) { this.proveedorUsuarioId = v; }

    public Double getMontoTotal() { return montoTotal; }
    public void setMontoTotal(Double montoTotal) {
        this.montoTotal = montoTotal != null ? montoTotal : 0.0;
        recalcularComision();
    }

    public Double getPorcentajeComision() { return porcentajeComision; }
    public void setPorcentajeComision(Double porcentajeComision) {
        this.porcentajeComision = porcentajeComision != null ? porcentajeComision : 10.0;
        recalcularComision();
    }

    public Double getComisionPlataforma() { return comisionPlataforma; }
    public void setComisionPlataforma(Double comisionPlataforma) { this.comisionPlataforma = comisionPlataforma; }

    public Double getMontoNetoTrabajador() { return montoNetoTrabajador; }
    public void setMontoNetoTrabajador(Double montoNetoTrabajador) { this.montoNetoTrabajador = montoNetoTrabajador; }

    public String getEstadoComision() { return estadoComision; }
    public void setEstadoComision(String estadoComision) { this.estadoComision = estadoComision; }

    private void recalcularComision() {
        if (this.montoTotal != null && this.porcentajeComision != null) {
            this.comisionPlataforma = Math.round((this.montoTotal * (this.porcentajeComision / 100.0)) * 100.0) / 100.0;
            this.montoNetoTrabajador = Math.round((this.montoTotal - this.comisionPlataforma) * 100.0) / 100.0;
        }
    }
}
