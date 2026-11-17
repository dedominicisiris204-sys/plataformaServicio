package com.plataforma.plataforma_servicios.entidad;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "disponibilidades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Disponibilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String dia;

    @Column(length = 20)
    private String horaInicio;

    @Column(length = 20)
    private String horaFin;

    @Column(nullable = false)
    private Boolean disponible = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "perfil_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Perfil perfil;
}
