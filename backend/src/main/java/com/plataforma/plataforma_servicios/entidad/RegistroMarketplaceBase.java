package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@MappedSuperclass
public abstract class RegistroMarketplaceBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "creador_usuario_id")
    private Long creadorUsuarioId;

    @Column(length = 180)
    private String titulo;

    @Column(length = 5000)
    private String descripcion;

    @Column(length = 40)
    private String estado = "BORRADOR";

    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void alCrear() {
        if (fechaCreacion == null) fechaCreacion = LocalDateTime.now();
        if (estado == null || estado.isBlank()) estado = "BORRADOR";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCreadorUsuarioId() { return creadorUsuarioId; }
    public void setCreadorUsuarioId(Long id) { this.creadorUsuarioId = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fecha) { this.fechaCreacion = fecha; }
}
