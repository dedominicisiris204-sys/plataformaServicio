package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Setter
@Getter
@Entity
@Table(name = "perfiles")
public class Perfil implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    // --- GETTERS Y SETTERS ---
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPerfil;

    @Column(length = 500)
    private String experiencia;

    @Column(length = 255)
    private String estudios;

    @Column(length = 255)
    private String habilidades;

    @Column(name = "zona_trabajo", length = 100)
    private String zonaTrabajo;

    @Column(length = 100)
    private String horarios;

    @Column(name = "calificación_promedio")
    private Double calificacionPromedio = 0.0;

    // Relación Uno a Uno con Usuario
    // 'usuario_id' será la columna (Llave Foránea) en la tabla 'perfiles'
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", unique = true)
    private Usuario usuario;

    // --- Constructores ---
    public Perfil() {
    }

    public Perfil(Long idPerfil, String experiencia, String estudios, String habilidades,
                  String zonaTrabajo, String horarios, Double calificacionPromedio, Usuario usuario) {
        this.idPerfil = idPerfil;
        this.experiencia = experiencia;
        this.estudios = estudios;
        this.habilidades = habilidades;
        this.zonaTrabajo = zonaTrabajo;
        this.horarios = horarios;
        this.calificacionPromedio = calificacionPromedio;
        this.usuario = usuario;
    }

}