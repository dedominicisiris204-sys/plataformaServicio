package com.plataforma.plataforma_servicios.servicio;

import com.plataforma.plataforma_servicios.entidad.Usuario;
import com.plataforma.plataforma_servicios.repositorio.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioServicio {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // LÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³gica para registrar o actualizar un usuario
    public Usuario registrarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // LÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³gica para listar todos los usuarios
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // LÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³gica para buscar un usuario especÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­fico por su ID
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    // LÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³gica para eliminar un usuario fÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­sicamente de la base de datos
    public void eliminarPorId(Long id) {
        usuarioRepository.deleteById(id);
    }
}