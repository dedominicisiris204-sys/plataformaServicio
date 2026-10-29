package com.plataforma.plataforma_servicios.servicio;

import com.plataforma.plataforma_servicios.entidad.Usuario;
import com.plataforma.plataforma_servicios.repositorio.UsuarioRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class UsuarioServicio {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServicio(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Usuario registrarUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("Los datos del usuario son obligatorios.");
        }
        if (usuario.getNombre() == null || usuario.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio.");
        }
        String nombre = usuario.getNombre().trim();
        if (nombre.length() > 100) {
            throw new IllegalArgumentException("El nombre no puede superar los 100 caracteres.");
        }
        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new IllegalArgumentException("El correo electrónico es obligatorio.");
        }
        String email = usuario.getEmail().trim().toLowerCase(Locale.ROOT);
        if (email.length() > 100 || !email.matches("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$".toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Ingresá un correo electrónico válido.");
        }
        if (usuario.getPassword() == null || usuario.getPassword().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria.");
        }
        if (usuario.getPassword().length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres.");
        }

        usuario.setNombre(nombre);
        usuario.setEmail(email);

        boolean emailEnUso = usuario.getId() == null
                ? usuarioRepository.existsByEmailIgnoreCase(email)
                : usuarioRepository.existsByEmailIgnoreCaseAndIdNot(email, usuario.getId());
        if (emailEnUso) {
            throw new EmailDuplicadoException();
        }

        String password = usuario.getPassword();
        if (!esHashBcrypt(password)) {
            usuario.setPassword(passwordEncoder.encode(password));
        }

        try {
            return usuarioRepository.save(usuario);
        } catch (DataIntegrityViolationException e) {
            throw new EmailDuplicadoException();
        }
    }

    @Transactional
    public Optional<Usuario> autenticar(String emailIngresado, String passwordIngresada) {
        if (emailIngresado == null || emailIngresado.isBlank()
                || passwordIngresada == null || passwordIngresada.isBlank()) {
            return Optional.empty();
        }

        Optional<Usuario> encontrado = usuarioRepository.findByEmailIgnoreCase(emailIngresado.trim());
        if (encontrado.isEmpty()) {
            return Optional.empty();
        }

        Usuario usuario = encontrado.get();
        String guardada = usuario.getPassword();
        if (guardada == null) {
            return Optional.empty();
        }

        if (esHashBcrypt(guardada)) {
            return passwordEncoder.matches(passwordIngresada, guardada)
                    ? Optional.of(usuario) : Optional.empty();
        }

        // Compatibilidad transitoria: cuentas antiguas guardadas en texto plano.
        // Si el acceso es válido, actualiza la contraseña a BCrypt en ese momento.
        if (guardada.equals(passwordIngresada)) {
            usuario.setPassword(passwordEncoder.encode(passwordIngresada));
            usuarioRepository.save(usuario);
            return Optional.of(usuario);
        }

        return Optional.empty();
    }

    private boolean esHashBcrypt(String password) {
        return password != null && (password.startsWith("$2a$")
                || password.startsWith("$2b$") || password.startsWith("$2y$"));
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public void eliminarPorId(Long id) {
        usuarioRepository.deleteById(id);
    }

    public static class EmailDuplicadoException extends RuntimeException {
        public EmailDuplicadoException() {
            super("Ese correo electrónico ya está registrado.");
        }
    }
}