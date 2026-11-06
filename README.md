# Plataforma de Servicios y Oficios

Aplicación web para publicar servicios, encontrar profesionales, solicitar presupuestos, coordinar trabajos y compartir reseñas verificadas.

## Arquitectura

- **Backend:** Java 17, Spring Boot 4, Spring MVC, Spring Security, Spring Data JPA y Maven Wrapper.
- **Frontend:** React 19, Vite 8, React Router 7 y CSS.
- **Base de datos:** MySQL o MariaDB. Hibernate actualiza el esquema (`ddl-auto=update`).
- **Archivos:** imágenes JPG, PNG y WEBP de hasta 5 MB se guardan en `backend/uploads/` y se sirven bajo `/uploads/`.
- **Autenticación:** JWT Bearer. El secreto se configura con `APP_JWT_SECRET` (mínimo 32 bytes); los tokens vencen luego de 24 horas por defecto.

## Requisitos locales

- JDK 17 o posterior disponible como `java` en PATH.
- Node.js y npm.
- MySQL/MariaDB escuchando en `localhost:3306`.

Crear la base antes de iniciar:

```sql
CREATE DATABASE plataforma_servicios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Copiar `backend/src/main/resources/application.properties.example` a `backend/src/main/resources/application.properties` y configurar la conexión. El archivo local está ignorado por Git. En PowerShell, definir un secreto local antes de iniciar Spring:

```powershell
$env:APP_JWT_SECRET = ([guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N"))
```

La primera cuenta se crea desde `/registro` con rol cliente o profesional. Para habilitar el directorio administrativo, después de registrar la cuenta autorizada, un administrador de la base puede asignarle el rol:

```sql
UPDATE usuarios SET rol = 'ROL_ADMIN' WHERE email = 'admin@ejemplo.com';
```

El registro público no permite crear cuentas administradoras ni modificar el rol.

## Iniciar en Windows

Desde PowerShell, en la raíz del repositorio:

```powershell
Copy-Item backend\src\main\resources\application.properties.example backend\src\main\resources\application.properties
$env:APP_JWT_SECRET = ([guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N"))
Set-Location backend
.\mvnw.cmd spring-boot:run
```

En otra terminal:

```powershell
Set-Location frontend
npm ci
npm run dev
```

Abrir <http://localhost:5173>. El frontend reenvía `/api` y `/uploads` a Spring Boot en `localhost:8080`.

También se puede ejecutar `.iniciar-plataforma.ps1` desde la raíz. El script usa su propia ubicación, prepara la configuración local si falta, comprueba MySQL/MariaDB, genera un secreto temporal y arranca Vite y Spring Boot. Si el script genera un secreto temporal nuevo, hay que volver a iniciar sesión después de reiniciarlo.

## Pruebas y calidad

```powershell
Set-Location backend
.\mvnw.cmd test

Set-Location ..\frontend
npm run lint
npm run build
```

## API REST principal

Las rutas de escritura requieren `Authorization: Bearer <token>`, excepto el registro y el inicio de sesión.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/usuarios` | Registro |
| POST | `/api/usuarios/login` | Inicio de sesión; devuelve JWT y datos básicos |
| GET | `/api/usuarios` | Directorio paginado, solo administrador; acepta `page`, `size` y `q` |
| GET/PUT/DELETE | `/api/usuarios/{id}` | Consulta, edición y baja de cuenta |
| GET/PUT | `/api/perfiles/usuario/{usuarioId}` | Consulta pública y edición propia del perfil profesional |
| GET/POST/DELETE | `/api/publicaciones` | Feed paginado y creación/eliminación de publicaciones |
| GET | `/api/publicaciones/buscar` | Búsqueda con `categoria`, `ubicacion`, `q`, `page` y `size` |
| GET/POST | `/api/comentarios` | Lectura pública y creación autenticada de comentarios |
| GET/POST | `/api/intereses` | Lectura pública y registro autenticado de interés |
| GET/POST | `/api/mensajes/conversacion` | Consulta de conversación y actualización de no leídos |
| POST | `/api/mensajes` | Envío de mensaje autenticado |
| GET | `/api/mensajes/no-leidos` | Cantidad de mensajes no leídos de la sesión |
| POST | `/api/archivos/subir` | Carga de imagen multipart; devuelve una URL |
| POST | `/api/solicitudes` | Crear solicitud de presupuesto |
| GET | `/api/solicitudes/profesional/{id}` | Solicitudes recibidas por el profesional |
| GET | `/api/solicitudes/cliente/{id}` | Solicitudes enviadas por el cliente |
| PUT | `/api/solicitudes/{id}/estado` | Aceptar, rechazar o completar la contratación |
| GET | `/api/resenas/profesional/{id}` | Reseñas públicas verificadas |
| POST | `/api/resenas` | Calificar una contratación completada (1–5 estrellas) |

Las entidades de perfil también exponen rutas bajo `/api/servicios-profesionales`, `/api/experiencias`, `/api/formaciones`, `/api/habilidades-profesionales`, `/api/portafolio` y `/api/disponibilidades`.

## Colaboradores

- **Iris:** estructura principal e integración de la aplicación.
- **Kevin:** perfiles, ubicación y catálogo de servicios.
- **Josué:** integración de pantallas, directorio de usuarios, perfil público y notificaciones.
- **Mateo:** documentación e integración de correcciones en su rama.

## Codificación

Los archivos de frontend y backend deben guardarse como UTF-8 sin BOM. Las respuestas HTTP usan UTF-8.
