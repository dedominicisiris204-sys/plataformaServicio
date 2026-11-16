# 🏗️ Arquitectura del Sistema y Stack Tecnológico

---

## 🏛️ 1. Arquitectura General del Sistema

El sistema implementa una **Arquitectura Cliente-Servidor Desacoplada**, donde el Frontend (Single Page Application en React) y el Backend (API REST en Spring Boot) operan como subsistemas independientes que se comunican exclusivamente a través del protocolo **HTTP/HTTPS** mediante el intercambio de cargas útiles en formato **JSON**.

```
+-------------------------------------------------------------+
|                      CLIENTE WEB (React 19)                 |
|  - Vite Dev Server / Producción Build (Puerto 5174)         |
|  - Sidebar Modular + Vistas (Kanban, Presupuesto, Radar)    |
|  - Client-Side Routing (React Router 7)                     |
|  - Gestión de Estado Reactivo & Theme Provider              |
+------------------------------+------------------------------+
                               |
                        Peticiones HTTP
                         JSON Rest API
                               |
+------------------------------v------------------------------+
|                     VITE REVERSE PROXY                      |
|           /api/*  ===>  http://localhost:8085/api/*          |
+------------------------------+------------------------------+
                               |
+------------------------------v------------------------------+
|                  BACKEND SPRING BOOT (Java 17/21)           |
|  - Spring Web MVC & DispatcherServlet (Puerto 8085)         |
|  - Spring Security (CORS Filter & Autenticación)            |
|  - Capa de Controladores REST (Health, Publicaciones, etc.) |
|  - Capa de Lógica de Negocio (Servicios y Validaciones)     |
|  - Capa de Acceso a Datos (Spring Data JPA / Hibernate)     |
+------------------------------+------------------------------+
                               |
                         JDBC Driver
                               |
+------------------------------v------------------------------+
|               BASE DE DATOS RELACIONAL (MySQL 8.0)          |
|  - Puerto 3306                                              |
|  - Base de Datos: plataforma_servicios                      |
|  - Tablas: usuario, publicacion, comentario, mensaje, etc.  |
+-------------------------------------------------------------+
```

---

## 🧱 2. Diseño Modular del Backend (Inspirado en el Estándar de Odonto)

Siguiendo las mejores prácticas del proyecto de referencia **Odonto** (estructurado bajo el patrón arquitectónico *Package-by-Feature* o Diseño Guiado por el Dominio), la plataforma divide sus responsabilidades en módulos funcionales autónomos:

### Capas del Backend:
1. **Controladores (`controlador`):** Exponen los contratos REST públicos (`GET`, `POST`, `PUT`, `DELETE`), serializan respuestas JSON y gestionan códigos de estado HTTP (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
2. **Servicios (`servicio`):** Encapsulan la lógica de negocio, cálculos de costos, control de usuarios duplicados y reglas de transacción (`@Transactional`).
3. **Repositorios (`repositorio`):** Interfaces que extienden `JpaRepository<T, ID>`, aprovechando el poder de consultas derivadas y queries nativas optimizadas.
4. **Entidades (`entidad`):** Modelos de dominio mapeados a tablas MySQL con anotaciones Jakarta Persistence (`@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@ManyToOne`, `@OneToMany`).
5. **Configuración (`config`):** Clases `@Configuration` para configurar CORS permisivo, beans de seguridad y rutas estáticas.

### Módulos de Dominio:
* 🩺 **Salud y Diagnóstico (`health`):** Endpoint técnico `GET /api/health` para monitoreo continuo.
* 👤 **Identidad y Usuarios (`usuario`):** Registro seguro, roles de usuario y control de accesos.
* 📰 **Publicaciones y Muro (`publicacion`):** Gestión de ofertas, pedidos comunitarios e imágenes.
* 💬 **Mensajería Interna (`mensaje`):** Chat y acuerdos directos entre prestadores y clientes.
* ⭐ **Calidad y Reseñas (`resena`):** Puntuaciones, estrellas y validación de reputación.

---

## 💻 3. Arquitectura del Frontend (React 19 + Vite 8)

El cliente web se diseñó con un enfoque centrado en el usuario, responsivo y de alto rendimiento:

* **Single Page Application (SPA):** Navegación instantánea sin recargas de página mediante `react-router-dom`.
* **Sidebar Modular:** Panel lateral persistente que desacopla la navegación principal de las vistas de trabajo.
* **Estilizado Glassmorphic & CSS Variables:** Paleta de colores consistente con soporte nativo de `:root`, `[data-theme="light"]` y `[data-theme="dark"]`.
* **Reverse Proxy en Desarrollo:** Configuración en `vite.config.js` que redirige automáticamente las solicitudes hacia `/api` al backend en el puerto `8085`, evitando bloqueos de Cross-Origin Resource Sharing (CORS).

---

## 🛠️ 4. Stack Tecnológico Detallado

| Área | Tecnología | Versión | Propósito |
| :--- | :--- | :--- | :--- |
| **Backend Core** | Java | 17 LTS / 21 | Lenguaje de programación robusto y tipado |
| **Framework Backend** | Spring Boot | 4.0.6 | Framework base para microservicios y APIs REST |
| **Seguridad** | Spring Security | Compatible | Autenticación y control de cabeceras HTTP |
| **ORM / Persistencia** | Hibernate / Spring Data JPA | 7.x | Mapeo objeto-relacional y consultas automáticas |
| **Base de Datos** | MySQL Server | 8.0 | Motor de base de datos relacional ACID |
| **Build Backend** | Maven Wrapper (`mvnw`) | 3.9+ | Gestión de dependencias y empaquetado reproducible |
| **Frontend Core** | React | 19.x | Biblioteca para interfaces de usuario declarativas |
| **Bundler & Dev Server** | Vite | 8.3 | Empaquetador ultrarrápido y servidor con Hot Module Replacement (HMR) |
| **Enrutamiento** | React Router | 7.x | Navegación del lado del cliente |
| **Estilos** | CSS3 Nativo + Glassmorphism | Estándar W3C | Variables CSS, transparencias y modo oscuro |
| **Automatización** | Batch (.bat) & PowerShell | Windows | Lanzadores y detenidos automáticos con 1 solo clic |
| **Control de Versiones** | Git & GitHub | Estándar | Gestión del ciclo de vida del código |
