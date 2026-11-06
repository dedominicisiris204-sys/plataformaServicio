package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes")
public class Mensaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 150)
    private String emisor;
    @Column(nullable = false, length = 150)
    private String receptor;
    @Column(name = "emisor_usuario_id")
    private Long emisorUsuarioId;
    @Column(name = "receptor_usuario_id")
    private Long receptorUsuarioId;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;
    private LocalDateTime fechaEnvio;
    @Column(nullable = false)
    private boolean leido = false;

    public Mensaje() { this.fechaEnvio = LocalDateTime.now(); }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmisor() { return emisor; }
    public void setEmisor(String emisor) { this.emisor = emisor; }
    public String getReceptor() { return receptor; }
    public void setReceptor(String receptor) { this.receptor = receptor; }
    public Long getEmisorUsuarioId() { return emisorUsuarioId; }
    public void setEmisorUsuarioId(Long id) { this.emisorUsuarioId = id; }
    public Long getReceptorUsuarioId() { return receptorUsuarioId; }
    public void setReceptorUsuarioId(Long id) { this.receptorUsuarioId = id; }
    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }
    public LocalDateTime getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(LocalDateTime fechaEnvio) { this.fechaEnvio = fechaEnvio; }
    public boolean isLeido() { return leido; }
    public void setLeido(boolean leido) { this.leido = leido; }
}
