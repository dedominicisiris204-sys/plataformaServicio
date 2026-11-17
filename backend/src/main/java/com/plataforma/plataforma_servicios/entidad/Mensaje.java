package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes")
public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String emisor;
    private String receptor;

    @Column(columnDefinition = "LONGTEXT")
    private String contenido;

    private LocalDateTime fechaEnvio;

    public Mensaje() {
        this.fechaEnvio = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmisor() { return emisor; }
    public void setEmisor(String emisor) { this.emisor = emisor; }
    public String getReceptor() { return receptor; }
    public void setReceptor(String receptor) { this.receptor = receptor; }
    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }
    public LocalDateTime getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(LocalDateTime fechaEnvio) { this.fechaEnvio = fechaEnvio; }
}
