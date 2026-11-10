package com.plataforma.plataforma_servicios.entidad;

import java.time.LocalDate;

public class UsuarioBuilder {

    private Long id;
    private String nombre;
    private String email;
    private String password;
    private LocalDate fechaRegistro;
    private Perfil perfil;

    public UsuarioBuilder() {
    }

    public UsuarioBuilder id(Long id) {
        this.id = id;
        return this;
    }

    public UsuarioBuilder nombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public UsuarioBuilder email(String email) {
        this.email = email;
        return this;
    }

    public UsuarioBuilder password(String password) {
        this.password = password;
        return this;
    }

    public UsuarioBuilder fechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
        return this;
    }

    public UsuarioBuilder perfil(Perfil perfil) {
        this.perfil = perfil;
        return this;
    }

    public Usuario build() {
        Usuario usuario = new Usuario();

        usuario.setId(id);
        usuario.setNombre(nombre);
        usuario.setEmail(email);
        usuario.setPassword(password);
        usuario.setFechaRegistro(fechaRegistro);
        usuario.setPerfil(perfil);

        return usuario;
    }
}