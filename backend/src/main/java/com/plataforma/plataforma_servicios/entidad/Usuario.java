package com.plataforma.plataforma_servicios.entidad;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements Serializable {

    public static final String ROL_CLIENTE = "ROL_CLIENTE";
    public static final String ROL_PROFESIONAL = "ROL_PROFESIONAL";
    public static final String ROL_ADMIN = "ROL_ADMIN";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "rol", nullable = false, length = 30)
    private String rol = ROL_CLIENTE;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDate fechaRegistro;

    @OneToOne(
        mappedBy = "usuario",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL
    )
    private Perfil perfil;

    @PrePersist
    protected void onCreate() {
        if (fechaRegistro == null) {
            fechaRegistro = LocalDate.now();
        }
        if (rol == null || rol.isBlank()) {
            rol = ROL_CLIENTE;
        }
    }
}
