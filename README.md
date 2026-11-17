# Plataforma de Servicios y Oficios Profesionales

Sistema integral de intermediación para la contratación de servicios y oficios profesionales. Conecta clientes y empresas con especialistas certificados, integrando perfiles laborales, portafolios de trabajo, mensajería en tiempo real y evaluaciones de calidad.

El proyecto está construido bajo una arquitectura cliente-servidor desacoplada (Frontend en React + Backend en Spring Boot) estructurada de forma modular, siguiendo los estándares de diseño y documentación del proyecto de referencia **Odonto**.

---

## Equipo de Desarrollo

* **Iris De Dominicis**
* **Kevin Farías**
* **Mateo Cuello**
* **Josue Chimbo**

---

## Stack Tecnológico

### Backend
* **Java 17 LTS**
* **Spring Boot** (Spring Web MVC, Spring Data JPA, Spring Security, Bean Validation)
* **Maven Wrapper** (`mvnw` / `mvnw.cmd`)
* **MySQL 8.0**
* **Lombok**

### Frontend
* **React 19**
* **Vite 8**
* **React Router 7**
* **CSS3 Modular y Variables Nativas**

---

## Inicio Rápido

### Método 1: Un solo clic (Recomendado en Windows)
En la raíz del proyecto, ejecuta con doble clic:

```text
ARRANCAR.bat
```
Este script verifica MySQL, arranca frontend (puerto 5174) y backend (puerto 8085) en ventanas independientes y abre el navegador automáticamente en `http://localhost:5174`. Para detener todo con un clic, ejecuta `DETENER.bat`.

### Despliegue en Railway

La raíz del repositorio incluye un `Dockerfile` que construye el frontend y el backend y sirve ambos desde el mismo origen. En Railway, crea un servicio desde este repositorio y añade una base MySQL 8. Configura estas variables en el servicio de la aplicación:

| Variable | Valor |
| --- | --- |
| `SPRING_PROFILES_ACTIVE` | `production` |
| `DB_HOST` | referencia a `MYSQLHOST` del servicio MySQL |
| `DB_PORT` | referencia a `MYSQLPORT` del servicio MySQL |
| `DB_NAME` | referencia a `MYSQLDATABASE` del servicio MySQL |
| `DB_USERNAME` | referencia a `MYSQLUSER` del servicio MySQL |
| `DB_PASSWORD` | referencia a `MYSQLPASSWORD` del servicio MySQL |

El sitio y la API quedan públicos y no requieren credenciales. Monta un volumen persistente en `/app/uploads` para conservar las imágenes cargadas. La base MySQL del template incluye su propio volumen.

### Método 2: Inicio por línea de comandos

#### Backend:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

#### Frontend:
```powershell
cd frontend
npm run dev
```

---

## Estructura del Proyecto (Inspirada en Odonto)

```text
PROYECTO_PLATAFORMA_SERVICIOS/
├── ARRANCAR.bat                 # Lanzador universal con 1 solo clic
├── DETENER.bat                  # Detención limpia de procesos y puertos
├── iniciar-plataforma.ps1       # Script avanzado PowerShell con rutas dinámicas
├── README.md                    # Documento principal del proyecto
│
├── docs/                        # Documentación técnica de arquitectura (Estilo Odonto)
│   ├── arquitectura-backend.md  # Decisiones técnicas, endpoints y diseño modular
│   ├── integracion-frontend.md  # Contratos API, flujo HTTP y desacoplamiento
│   └── guia-arranque-rapido.md  # Manual paso a paso y solución de problemas
│
├── backend/                     # Servidor Spring Boot
│   ├── mvnw / mvnw.cmd          # Maven Wrapper
│   ├── pom.xml                  # Dependencias y configuración de compilación
│   └── src/main/java/com/plataforma/plataforma_servicios/
│       ├── PlataformaServiciosApplication.java
│       ├── config/              # Seguridad, CORS y codificación de contraseñas
│       ├── controlador/         # Endpoints REST (Health, Usuarios, Publicaciones, Servicios...)
│       ├── dto/                 # Objetos de transferencia de datos
│       ├── entidad/             # Modelos JPA mapeados a MySQL
│       ├── repositorio/         # Repositorios Spring Data JPA
│       ├── servicio/            # Lógica de negocio y casos de uso
│       └── excepcion/           # Manejo global de excepciones
│
└── frontend/                    # Cliente Web React / Vite
    ├── package.json             # Dependencias del frontend
    ├── vite.config.js           # Configuración del servidor de desarrollo Vite
    └── src/
        ├── App.jsx              # Enrutador principal y componentes raíz
        ├── components/          # Componentes reutilizables (Navbar, Sidebar, Modal...)
        ├── pages/               # Vistas (Inicio, Servicios, Mensajes, Perfil...)
        ├── services/            # Clientes HTTP hacia la API REST
        └── styles/              # Hojas de estilo y temas CSS
```

---

## Módulos de Dominio (Modularidad Package-by-Feature)

Al igual que los módulos clínicos de **Odonto** (`diagnostico`, `historia`, `tratamiento`), la plataforma se articula en torno a módulos de negocio clave:

1. **Salud y Diagnóstico (`health`)**: Endpoint técnico `GET /api/health` para validación de disponibilidad del servicio.
2. **Identidad y Usuarios (`usuario`)**: Registro, autenticación, perfiles profesionales y gestión de cuentas.
3. **Muro y Publicaciones (`publicacion`)**: Publicaciones de solicitudes, requerimientos comunitarios y comentarios.
4. **Catálogo de Servicios y Oficios (`servicio`)**: Ofertas de electricistas, plomeros, carpinteros, solicitudes y contrataciones.
5. **Empresas y Empleo (`empresa`)**: Fichas de empresas contratantes, oportunidades laborales y postulaciones.
6. **Mensajería en Tiempo Real (`mensaje`)**: Bandeja de entrada, hilos de chat y comunicación directa entre partes.
7. **Calidad y Reputación (`calificacion`)**: Sistema de reseñas, puntuaciones y feedback de clientes.

---

## Documentación Detallada

* [`docs/arquitectura-backend.md`](docs/arquitectura-backend.md): Especificación técnica del backend y migración a dominios.
* [`docs/integracion-frontend.md`](docs/integracion-frontend.md): Guía de consumo de API y reglas de integración.
* [`docs/guia-arranque-rapido.md`](docs/guia-arranque-rapido.md): Instrucciones completas de instalación y resolución de incidencias.
