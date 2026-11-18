package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "empresas")
public class Empresa extends RegistroMarketplaceBase {
    @Column(length = 180)
    private String nombreComercial;

    @Column(length = 120)
    private String rubro;

    @Column(length = 250)
    private String ubicacion;

    // Campos de suscripción y cuota mensual empresarial
    @Column(length = 50)
    private String planSuscripcion = "PYME"; // PYME, CONSTRUCTORA, CORPORATIVO

    private Double cuotaMensual = 15000.0;

    @Column(length = 30)
    private String estadoSuscripcion = "ACTIVA"; // ACTIVA, PENDIENTE, VENCIDA

    private LocalDateTime fechaRenovacion;

    public String getNombreComercial() { return nombreComercial; }
    public void setNombreComercial(String v) { this.nombreComercial = v; }
    public String getRubro() { return rubro; }
    public void setRubro(String v) { this.rubro = v; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String v) { this.ubicacion = v; }

    public String getPlanSuscripcion() { return planSuscripcion; }
    public void setPlanSuscripcion(String planSuscripcion) { this.planSuscripcion = planSuscripcion; }

    public Double getCuotaMensual() { return cuotaMensual; }
    public void setCuotaMensual(Double cuotaMensual) { this.cuotaMensual = cuotaMensual; }

    public String getEstadoSuscripcion() { return estadoSuscripcion; }
    public void setEstadoSuscripcion(String estadoSuscripcion) { this.estadoSuscripcion = estadoSuscripcion; }

    public LocalDateTime getFechaRenovacion() { return fechaRenovacion; }
    public void setFechaRenovacion(LocalDateTime fechaRenovacion) { this.fechaRenovacion = fechaRenovacion; }
}
