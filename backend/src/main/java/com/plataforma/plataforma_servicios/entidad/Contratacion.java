package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;

@Entity
@Table(name = "contrataciones")
public class Contratacion extends RegistroMarketplaceBase {
    private Long solicitudServicioId;
    private Long propuestaId;
    private Long clienteUsuarioId;
    private Long proveedorUsuarioId;
    public Long getSolicitudServicioId() { return solicitudServicioId; }
    public void setSolicitudServicioId(Long v) { this.solicitudServicioId = v; }
    public Long getPropuestaId() { return propuestaId; }
    public void setPropuestaId(Long v) { this.propuestaId = v; }
    public Long getClienteUsuarioId() { return clienteUsuarioId; }
    public void setClienteUsuarioId(Long v) { this.clienteUsuarioId = v; }
    public Long getProveedorUsuarioId() { return proveedorUsuarioId; }
    public void setProveedorUsuarioId(Long v) { this.proveedorUsuarioId = v; }
}
