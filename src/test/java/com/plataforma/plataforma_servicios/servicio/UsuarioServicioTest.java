package com.plataforma.plataforma_servicios.servicio;

import com.plataforma.plataforma_servicios.repositorio.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioServicioTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioServicio usuarioServicio;

    @Test
    void eliminaUsuarioExistente() {
        when(usuarioRepository.existsById(12L)).thenReturn(true);

        assertTrue(usuarioServicio.eliminarPorId(12L));

        verify(usuarioRepository).deleteById(12L);
    }

    @Test
    void noIntentaEliminarUsuarioInexistente() {
        when(usuarioRepository.existsById(99L)).thenReturn(false);

        assertFalse(usuarioServicio.eliminarPorId(99L));

        verify(usuarioRepository, never()).deleteById(99L);
    }
}
