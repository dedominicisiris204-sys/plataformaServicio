package com.plataforma.plataforma_servicios.controlador;

import com.plataforma.plataforma_servicios.servicio.UsuarioServicio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioControladorTest {

    @Mock
    private UsuarioServicio usuarioServicio;

    @InjectMocks
    private UsuarioControlador controlador;

    @Test
    void eliminarUsuarioExistenteRespondeSinContenido() {
        when(usuarioServicio.eliminarPorId(12L)).thenReturn(true);

        var respuesta = controlador.eliminar(12L);

        assertEquals(HttpStatus.NO_CONTENT, respuesta.getStatusCode());
        verify(usuarioServicio).eliminarPorId(12L);
    }

    @Test
    void eliminarUsuarioInexistenteRespondeNoEncontrado() {
        when(usuarioServicio.eliminarPorId(99L)).thenReturn(false);

        var respuesta = controlador.eliminar(99L);

        assertEquals(HttpStatus.NOT_FOUND, respuesta.getStatusCode());
        verify(usuarioServicio).eliminarPorId(99L);
    }
}
