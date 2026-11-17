package com.plataforma.plataforma_servicios.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    @Profile("production")
    public UserDetailsService previewUsers(
            @Value("${spring.security.user.name:admin}") String username,
            @Value("${spring.security.user.password:}") String password) {
        if (password.isBlank()) {
            throw new IllegalStateException("APP_PASSWORD debe configurarse en producción.");
        }

        var encodedPassword = new BCryptPasswordEncoder().encode(password);
        var previewUser = User.withUsername(username)
                .password(encodedPassword)
                .roles("PREVIEW")
                .build();
        return new InMemoryUserDetailsManager(previewUser);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, Environment environment) throws Exception {
        boolean publicPreview = environment.matchesProfiles("production");

        if (publicPreview) {
            http.csrf(csrf -> csrf.disable())
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers("/api/health").permitAll()
                            .anyRequest().authenticated())
                    .httpBasic(Customizer.withDefaults());
        } else {
            http.csrf(csrf -> csrf.disable())
                    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        }

        return http.build();
    }
}
