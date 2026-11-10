package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;

@Entity
@Table(name = "empresas")
public class Empresa extends RegistroMarketplaceBase {
    @Column(length = 180)
    private String nombreComercial;
    @Column(length = 120)
    private String rubro;
    @Column(length = 250)
    private String ubicacion;
    public String getNombreComercial() { return nombreComercial; }
    public void setNombreComercial(String v) { this.nombreComercial = v; }
    public String getRubro() { return rubro; }
    public void setRubro(String v) { this.rubro = v; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String v) { this.ubicacion = v; }
}
