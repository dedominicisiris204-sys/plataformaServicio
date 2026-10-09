package com.plataforma.plataforma_servicios.entidad;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "perfiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Perfil implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPerfil;

    @Column(name = "foto_perfil", length = 500)
    private String fotoPerfil;

    @Column(name = "oficio", length = 150)
    private String oficio;

    @Column(name = "descripcion", length = 1000)
    private String descripcion;

    @Column(name = "servicios", length = 1000)
    private String servicios;

    @Column(name = "experiencia", length = 500)
    private String experiencia;

    @Column(name = "estudios", length = 255)
    private String estudios;

    @Column(name = "habilidades", length = 500)
    private String habilidades;

    @Column(name = "zona_trabajo", length = 150)
    private String zonaTrabajo;

    @Column(name = "horarios", length = 150)
    private String horarios;

    @Column(name = "calificacion_promedio")
    private Double calificacionPromedio = 0.0;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "usuario_id",
        referencedColumnName = "id",
        unique = true
    )
    private Usuario usuario;
}
