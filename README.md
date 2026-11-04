# Plataforma Conecta Empleo

Aplicación web para conectar postulantes y empresas, administrar perfiles, publicar ofertas y mantener conversaciones.

## Estado del proyecto

Este repositorio contiene un prototipo académico en evolución. Cuenta con una arquitectura separada en `backend/` (Spring Boot) y `frontend/` (React + Vite).

## Tecnologías

- **Backend:** Java 17, Spring Boot, Spring Data JPA / Hibernate, MySQL o MariaDB, Maven Wrapper
- **Frontend:** React, Vite, JavaScript, CSS3

## Requisitos

- JDK 17
- Node.js (versión 18+ recomendada)
- MySQL o MariaDB disponible localmente

## Configuración local

1. Crear una base de datos llamada `plataforma_servicios`.
2. Configurar la conexión y las credenciales de la base de datos en `backend/src/main/resources/application.properties` (puedes tomar como base `application.properties.example`).
3. Iniciar el backend:
   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run
   ```
4. Iniciar el frontend:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
   *(También puedes utilizar el script automatizado `.\iniciar-plataforma.ps1`)*

5. Abrir en el navegador:
   - Frontend: `http://localhost:5173/`
   - Backend API: `http://localhost:8080/`

## API disponible

### Usuarios

Base URL: `/api/usuarios`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/usuarios` | Lista usuarios |
| POST | `/api/usuarios` | Registra un usuario |
| POST | `/api/usuarios/login` | Inicia sesión |
| PUT | `/api/usuarios/{id}` | Actualiza nombre, correo y contraseña |
| DELETE | `/api/usuarios/{id}` | Elimina un usuario |

### Mensajes

Base URL: `/api/mensajes`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/mensajes` | Guarda un mensaje |
| GET | `/api/mensajes/chat?usuario={usuario}&empresa={empresa}` | Recupera mensajes entre dos participantes |

## Estructura principal

- `backend/`: API REST Spring Boot (controladores, entidades, repositorios y servicios).
- `frontend/`: Interfaz de usuario en React + Vite (páginas de inicio, login, registro, perfiles, publicaciones y mensajes).

## Colaboradores

- Iris
- Kevin
- Mateo
- Josué
