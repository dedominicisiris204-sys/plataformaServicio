# Arquitectura del Backend - Plataforma de Servicios

Este documento detalla el diseño técnico, las decisiones arquitectónicas y la evolución hacia una estructura modular basada en dominios (Package by Feature / Domain-Driven Design), siguiendo el estándar de referencia del proyecto **Odonto**.

---

## 1. Stack Tecnológico

| Componente | Tecnología | Versión | Propósito |
|---|---|---|---|
| **Lenguaje** | Java | 17 LTS | Base de ejecución tipada y moderna |
| **Framework** | Spring Boot | 4.0.6 (o 3.x LTS) | Scaffold del servidor REST |
| **Persistencia** | Spring Data JPA / Hibernate | Incluido en starter | Mapeo objeto-relacional y repositorios |
| **Base de Datos** | MySQL | 8.0+ | Motor relacional transaccional |
| **Seguridad** | Spring Security / BCrypt | Incluido | Cifrado de credenciales y autorización |
| **Build Tool** | Maven Wrapper (`mvnw` / `mvnw.cmd`) | Maven 3.9+ | Ejecución reproducible sin instalación global |

---

## 2. Comparativa Estructural: De Capas a Dominios (Estilo Odonto)

### Estructura Tradicional Anterior (Package by Layer)
Anteriormente, el backend acumulaba decenas de archivos en carpetas genéricas:
```text
com.plataforma.plataforma_servicios/
├── config/
├── controlador/        (16 controladores mezclados)
├── dto/
├── entidad/            (22 entidades juntas)
├── excepcion/
├── repositorio/        (19 repositorios juntos)
└── servicio/           (3 servicios)
```

### Estructura Mejorada Modular (Estilo Odonto / Package by Feature)
Al igual que en **Odonto** (`diagnostico/`, `historia/`, `tratamiento/`), cada dominio del negocio agrupa sus entidades, repositorios, controladores, DTOs y lógica específica:

```text
com.plataforma.plataforma_servicios/
├── PlataformaServiciosApplication.java
│
├── config/                         # Configuraciones transversales
│   ├── PasswordConfig.java
│   ├── SecurityConfig.java
│   └── WebConfig.java (CORS)
│
├── health/                         # Endpoint técnico de salud (Igual a Odonto)
│   └── HealthController.java       # GET /api/health
│
├── usuario/                        # Módulo de Usuarios y Perfiles
│   ├── Usuario.java
│   ├── Perfil.java
│   ├── UsuarioRepository.java
│   ├── PerfilRepository.java
│   ├── UsuarioServicio.java
│   ├── UsuarioControlador.java
│   └── PerfilController.java
│
├── publicacion/                    # Módulo de Muro y Publicaciones
│   ├── Publicacion.java
│   ├── Comentario.java
│   ├── PublicacionRepository.java
│   ├── ComentarioRepository.java
│   ├── PublicacionController.java
│   └── ComentarioController.java
│
├── servicio/                       # Módulo de Servicios y Oficios
│   ├── ServicioProfesional.java
│   ├── SolicitudServicio.java
│   ├── Contratacion.java
│   ├── Disponibilidad.java
│   ├── ServicioProfesionalRepository.java
│   ├── SolicitudServicioRepository.java
│   └── ServicioProfesionalController.java
│
├── empresa/                        # Módulo de Empresas y Empleabilidad
│   ├── Empresa.java
│   ├── MiembroEmpresa.java
│   ├── OportunidadLaboral.java
│   ├── Postulacion.java
│   └── EmpresaRepository.java
│
├── mensaje/                        # Módulo de Mensajería y Chat
│   ├── Mensaje.java
│   ├── MensajeRepository.java
│   ├── MensajeServicio.java
│   └── MensajeControlador.java
│
└── calificacion/                   # Módulo de Reseñas y Feedback
    ├── Resena.java
    ├── ResenaRepository.java
    └── ResenaController.java
```

---

## 3. Principios de Diseño Aplicados

1. **Alta Cohesión y Bajo Acoplamiento**: Los cambios en el módulo de calificaciones o publicaciones no afectan la lógica de usuarios o autenticación.
2. **Navegabilidad Rápida**: Un desarrollador que trabaje en el chat sólo abre el paquete `mensaje/`, donde encuentra modelo, repositorio y controlador juntos.
3. **Contrato de Salud Verificable**: Se incorpora `GET /api/health` para verificaciones de disponibilidad en tiempo real o pruebas de integración continua.
4. **Seguridad y CORS Centralizados**: La clase `WebConfig` permite solicitudes desde el cliente React (`http://localhost:5173`) sin bloqueos en el navegador.

---

## 4. Comandos de Verificación del Backend

Para compilar y verificar el estado del backend de forma independiente:

```powershell
cd backend
.\mvnw.cmd clean compile
.\mvnw.cmd spring-boot:run
```
