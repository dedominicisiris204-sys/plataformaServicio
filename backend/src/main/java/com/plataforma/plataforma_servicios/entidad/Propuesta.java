package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;

@Entity
@Table(name = "propuestas_servicio")
public class Propuesta extends RegistroMarketplaceBase {
    private Long solicitudServicioId;
    private Long proveedorUsuarioId;
    private java.math.BigDecimal precio;
    @Column(length = 1200)
    private String plazoEstimado;
    public Long getSolicitudServicioId() { return solicitudServicioId; }
    public void setSolicitudServicioId(Long v) { this.solicitudServicioId = v; }
    public Long getProveedorUsuarioId() { return proveedorUsuarioId; }
    public void setProveedorUsuarioId(Long v) { this.proveedorUsuarioId = v; }
    public java.math.BigDecimal getPrecio() { return precio; }
    public void setPrecio(java.math.BigDecimal v) { this.precio = v; }
    public String getPlazoEstimado() { return plazoEstimado; }
    public void setPlazoEstimado(String v) { this.plazoEstimado = v; }
}
