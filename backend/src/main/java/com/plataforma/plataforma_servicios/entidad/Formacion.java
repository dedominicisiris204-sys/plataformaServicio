package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "formaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Formacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 200)
    private String institucion;

    @Column(length = 200)
    private String titulo;

    @Column(length = 50)
    private String anio;

    @Column(length = 1000)
    private String descripcion;

    @Column(length = 200)
    private String certificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "perfil_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Perfil perfil;
}
