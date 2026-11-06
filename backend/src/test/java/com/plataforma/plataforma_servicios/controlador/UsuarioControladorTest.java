package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.config.JwtService;
import com.plataforma.plataforma_servicios.entidad.Usuario;
import com.plataforma.plataforma_servicios.servicio.UsuarioEliminacionServicio;
import com.plataforma.plataforma_servicios.servicio.UsuarioServicio;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = UsuarioControlador.class)
@AutoConfigureMockMvc(addFilters = false)
class UsuarioControladorTest {
    @Autowired MockMvc mvc;
    @MockitoBean UsuarioServicio usuarioServicio;
    @MockitoBean JwtService jwtService;
    @MockitoBean UsuarioEliminacionServicio eliminacionServicio;

    @Test
    void registraUsuarioCon201() throws Exception {
        Usuario u = usuario(); u.setId(3L);
        when(usuarioServicio.registrarUsuario(any(Usuario.class))).thenReturn(u);
        mvc.perform(post("/api/usuarios").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Mateo\",\"email\":\"mateo@example.com\",\"password\":\"secreto1\"}"))
                .andExpect(status().isCreated()).andExpect(content().string(org.hamcrest.Matchers.containsString("ID=3")));
    }

    @Test
    void correoDuplicadoDevuelve409() throws Exception {
        when(usuarioServicio.registrarUsuario(any(Usuario.class))).thenThrow(new UsuarioServicio.EmailDuplicadoException());
        mvc.perform(post("/api/usuarios").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Mateo\",\"email\":\"mateo@example.com\",\"password\":\"secreto1\"}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.mensaje").value("Ese correo electrónico ya está registrado."));
    }

    @Test
    void loginCorrectoDevuelveToken() throws Exception {
        when(usuarioServicio.autenticar(anyString(), anyString())).thenReturn(Optional.of(usuario()));
        when(jwtService.generar(any(Usuario.class))).thenReturn("test.jwt.token");
        mvc.perform(post("/api/usuarios/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"mateo@example.com\",\"password\":\"secreto1\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.token").value("test.jwt.token"))
                .andExpect(jsonPath("$.usuario.email").value("mateo@example.com"));
    }

    @Test
    void loginIncorrectoDevuelve401() throws Exception {
        when(usuarioServicio.autenticar(anyString(), anyString())).thenReturn(Optional.empty());
        mvc.perform(post("/api/usuarios/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"mateo@example.com\",\"password\":\"incorrecta\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "mateo@example.com")
    void eliminaUsuarioExistente() throws Exception {
        Usuario u = usuario(); u.setId(3L);
        when(usuarioServicio.buscarPorId(3L)).thenReturn(u);
        when(usuarioServicio.emailPorId(3L)).thenReturn(u.getEmail());
        mvc.perform(delete("/api/usuarios/3")).andExpect(status().isOk());
        verify(eliminacionServicio).eliminar(3L);
    }

    @Test
    void idInexistenteDevuelve404() throws Exception {
        when(usuarioServicio.buscarPorId(anyLong())).thenReturn(null);
        mvc.perform(delete("/api/usuarios/999")).andExpect(status().isNotFound());
        verifyNoInteractions(eliminacionServicio);
    }

    private Usuario usuario() {
        Usuario u = new Usuario();
        u.setId(3L); u.setNombre("Mateo"); u.setEmail("mateo@example.com");
        u.setRol(Usuario.ROL_CLIENTE); u.setFechaRegistro(java.time.LocalDate.now());
        return u;
    }
}
