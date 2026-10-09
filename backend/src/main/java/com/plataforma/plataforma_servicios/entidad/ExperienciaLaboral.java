package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "experiencias_laborales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExperienciaLaboral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 150)
    private String empresa;

    @Column(length = 150)
    private String puesto;

    @Column(length = 50)
    private String fechaInicio;

    @Column(length = 50)
    private String fechaFin;

    @Column(length = 1000)
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "perfil_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Perfil perfil;
}
