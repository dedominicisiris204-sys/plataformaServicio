package com.plataforma.plataforma_servicios.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Desactiva protecciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n CSRF para poder hacer POST
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡Permite todo sin contraseÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±a!

        return http.build();
    }
}