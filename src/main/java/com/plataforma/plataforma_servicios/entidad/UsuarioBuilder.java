package com.plataforma.plataforma_servicios.entidad;

import java.time.LocalDate;

public class UsuarioBuilder {
    private Long id;
    private String nombre;
    private String email;
    private String contraseña;
    private LocalDate fechaRegistro;
    private Perfil perfil;

    public UsuarioBuilder setId(Long id) {
        this.id = id;
        return this;
    }

    public UsuarioBuilder setNombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public UsuarioBuilder setEmail(String email) {
        this.email = email;
        return this;
    }

    private UsuarioBuilder setContraseña(String contraseña) {
        this.contraseña = contraseña;
        return this;
    }

    public UsuarioBuilder setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
        return this;
    }

    public UsuarioBuilder setPerfil(Perfil perfil) {
        this.perfil = perfil;
        return this;
    }

    public Usuario createUsuario() {
        return new Usuario(id, nombre, email, contraseña, fechaRegistro, perfil);
    }
}