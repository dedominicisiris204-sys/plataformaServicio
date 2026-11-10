package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "portafolios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Portafolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 500)
    private String imagenUrl;

    @Column(length = 200)
    private String titulo;

    @Column(length = 1000)
    private String descripcion;

    @Column(length = 100)
    private String categoria;

    @Column(length = 50)
    private String fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "perfil_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Perfil perfil;
}
