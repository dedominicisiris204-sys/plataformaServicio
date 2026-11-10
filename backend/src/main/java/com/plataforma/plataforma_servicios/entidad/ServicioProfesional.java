package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "servicios_profesionales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServicioProfesional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(length = 1000)
    private String descripcion;

    @Column(length = 100)
    private String modalidad;

    @Column(length = 100)
    private String precio;

    @Column(length = 100)
    private String unidadPrecio;

    @Column(nullable = false)
    private Boolean activo = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "perfil_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Perfil perfil;
}
