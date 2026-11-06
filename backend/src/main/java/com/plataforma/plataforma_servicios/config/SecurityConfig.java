package com.plataforma.plataforma_servicios.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint((request, response, exception) ->
                        response.sendError(org.springframework.http.HttpStatus.UNAUTHORIZED.value(), "Iniciá sesión para continuar.")))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/usuarios", "/api/usuarios/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/*/publico").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/publicaciones", "/api/publicaciones/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/perfiles/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/resenas/profesional/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/comentarios/**", "/api/intereses/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/servicios-profesionales/**", "/api/experiencias/**", "/api/formaciones/**", "/api/habilidades-profesionales/**", "/api/portafolio/**", "/api/disponibilidades/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/usuarios").hasAuthority("ROL_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/mensajes").hasAuthority("ROL_ADMIN")
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
