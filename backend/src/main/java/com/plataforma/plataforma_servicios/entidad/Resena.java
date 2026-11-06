package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;

@Entity
@Table(name = "resenas_contratacion", uniqueConstraints = @UniqueConstraint(name = "uk_resena_contratacion", columnNames = "contratacion_id"))
public class Resena extends RegistroMarketplaceBase {
    @Column(name = "contratacion_id")
    private Long contratacionId;
    private Long autorUsuarioId;
    private Long evaluadoUsuarioId;
    private Integer puntuacion;
    @Column(length = 2000)
    private String comentario;
    public Long getContratacionId() { return contratacionId; }
    public void setContratacionId(Long v) { this.contratacionId = v; }
    public Long getAutorUsuarioId() { return autorUsuarioId; }
    public void setAutorUsuarioId(Long v) { this.autorUsuarioId = v; }
    public Long getEvaluadoUsuarioId() { return evaluadoUsuarioId; }
    public void setEvaluadoUsuarioId(Long v) { this.evaluadoUsuarioId = v; }
    public Integer getPuntuacion() { return puntuacion; }
    public void setPuntuacion(Integer v) { this.puntuacion = v; }
    public String getComentario() { return comentario; }
    public void setComentario(String v) { this.comentario = v; }
}
