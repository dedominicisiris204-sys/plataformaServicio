package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "publicaciones")
public class Publicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String autor;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(nullable = false, length = 50)
    private String tipo;

    @Column(length = 150)
    private String ubicacion;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @ElementCollection
    @CollectionTable(
        name = "publicacion_tags",
        joinColumns = @JoinColumn(name = "publicacion_id")
    )
    @Column(name = "tag", length = 100)
    private List<String> tags = new ArrayList<>();

    @Column(nullable = false)
    private int interesados = 0;

    @Column(nullable = false)
    private int comentarios = 0;

    public Publicacion() {
        this.fecha = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public int getInteresados() {
        return interesados;
    }

    public void setInteresados(int interesados) {
        this.interesados = interesados;
    }

    public int getComentarios() {
        return comentarios;
    }

    public void setComentarios(int comentarios) {
        this.comentarios = comentarios;
    }
}
