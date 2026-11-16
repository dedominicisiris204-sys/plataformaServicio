# Integración Frontend - Plataforma de Servicios

Este documento detalla la relación entre la interfaz de usuario (React/Vite) y los servicios REST del backend Spring Boot, siguiendo las pautas de integración y desacoplamiento implementadas en **Odonto**.

---

## 1. Stack Tecnológico del Frontend

| Componente | Tecnología | Versión |
|---|---|---|
| **Librería UI** | React | 19.x |
| **Empaquetador** | Vite | 8.x |
| **Enrutamiento** | React Router | 7.x |
| **Estilos** | CSS Modular / Variables Nativas | CSS3 |

---

## 2. Flujo de Comunicación (Arquitectura en Capas)

La aplicación web se comunica con el servidor Spring Boot mediante clientes HTTP aislados:

```text
React Component / Page (Vistas)
        │
        ▼
Custom Hooks & Context (useAuth, AuthContext)
        │
        ▼
Service Layer (servicios cliente /api.js)
        │
        ▼
Spring Boot REST API (http://localhost:8080/api/...)
        │
        ▼
MySQL Database (3306)
```

---

## 3. Puntos de Integración Principales

| Vista / Componente | Ruta Frontend | Endpoint REST Backend | Método |
|---|---|---|---|
| **Salud del Sistema** | Componentes de monitoreo | `/api/health` | `GET` |
| **Inicio de Sesión** | `/login` | `/api/usuarios/login` | `POST` |
| **Registro de Usuario**| `/registro` | `/api/usuarios/registro` | `POST` |
| **Muro de Publicaciones**| `/publicaciones` | `/api/publicaciones` | `GET` / `POST` |
| **Catálogo de Servicios**| `/servicios` | `/api/servicios-profesionales` | `GET` |
| **Mensajería Interna** | `/mensajes` | `/api/mensajes` | `GET` / `POST` |
| **Perfil Profesional** | `/perfil` | `/api/perfil/{id}` | `GET` / `PUT` |

---

## 4. Reglas de Integración (Estilo Odonto)

1. **Variables de Entorno**: Las URLs base de la API deben gestionarse mediante `.env` (`VITE_API_BASE_URL=http://localhost:8080/api`).
2. **Manejo de Errores y Loading**: Cada petición HTTP gestiona explícitamente tres estados:
   - Cargando (`loading`)
   - Éxito con datos (`data`)
   - Error visual amigable para el usuario (`error`)
3. **CORS Desacoplado**: El backend incluye cabeceras de autorización y orígenes permitidos para habilitar el desarrollo local sin proxies complejos.
