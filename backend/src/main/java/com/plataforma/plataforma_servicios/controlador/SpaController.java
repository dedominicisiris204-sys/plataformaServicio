package com.plataforma.plataforma_servicios.controlador;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Sends direct browser requests for client-side routes back to the React app.
 * Without this, reloading a React Router URL makes Spring look for a real file
 * or controller at that path and return 404.
 */
@Controller
public class SpaController {

    @GetMapping({"/login", "/registro", "/perfil", "/mensajes"})
    public String forwardToSinglePageApp() {
        return "forward:/index.html";
    }
}
