package com.plataforma.plataforma_servicios.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final PerfilOwnershipInterceptor ownershipInterceptor;
    public WebConfig(PerfilOwnershipInterceptor ownershipInterceptor) { this.ownershipInterceptor = ownershipInterceptor; }
    @Override
    public void addInterceptors(InterceptorRegistry registry) { registry.addInterceptor(ownershipInterceptor); }
}
