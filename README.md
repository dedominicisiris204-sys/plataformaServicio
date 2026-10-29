# Plataforma Conecta Empleo

Aplicación web para conectar postulantes y empresas, administrar perfiles, publicar ofertas y mantener conversaciones.

## Estado del proyecto

Este repositorio contiene un prototipo académico en evolución. La API de usuarios y mensajes está implementada parcialmente; el portal de ofertas del HTML actual todavía usa datos locales del navegador. Antes de usarlo con información real, deben completarse autenticación y autorización, ya que la configuración actual permite solicitudes sin iniciar sesión.

## Tecnologías

- Java 17
- Spring Boot y Spring MVC
- Spring Data JPA / Hibernate
- MySQL o MariaDB
- Maven Wrapper
- HTML, CSS y JavaScript estáticos

## Requisitos

- JDK 17
- MySQL o MariaDB disponible localmente
- Maven Wrapper incluido en el repositorio

## Configuración local

1. Crear una base de datos llamada `plataforma_servicios`.
2. Configurar la conexión y las credenciales de la base de datos en `src/main/resources/application.properties` para el entorno local. No usar credenciales reales ni compartir ese archivo con secretos en Git.
3. Iniciar la aplicación desde la raíz del proyecto:

   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

4. Abrir `http://localhost:8080/`.

La aplicación usa el puerto `8080` por defecto. Hibernate está configurado para actualizar el esquema automáticamente en el entorno actual; para un despliegue se recomienda incorporar migraciones versionadas y separar la configuración por ambiente.

## API disponible

### Usuarios

Base URL: `/api/usuarios`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/usuarios` | Lista usuarios |
| POST | `/api/usuarios` | Registra un usuario |
| PUT | `/api/usuarios/{id}` | Actualiza nombre, correo y, opcionalmente, contraseña |
| DELETE | `/api/usuarios/{id}` | Elimina un usuario; devuelve `204 No Content` o `404 Not Found` |

### Mensajes

Base URL: `/api/mensajes`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/mensajes` | Guarda un mensaje |
| GET | `/api/mensajes/chat?usuario={usuario}&empresa={empresa}` | Recupera mensajes entre dos participantes |

## Estructura principal

- `controlador/`: endpoints HTTP para usuarios y mensajes.
- `servicio/`: lógica de aplicación.
- `entidad/`: entidades JPA de usuario, perfil y mensaje.
- `repositorio/`: repositorios Spring Data.
- `config/`: configuración de seguridad.
- `src/main/resources/static/`: interfaz web estática.

## Colaboradores

- Iris
- Kevin
- Mateo
- Josué

## Próximos pasos recomendados

1. Implementar autenticación y permisos por rol; almacenar contraseñas con hash y nunca devolverlas desde la API.
2. Persistir ofertas en la base de datos y conectar el portal a endpoints del backend.
3. Vincular mensajes con identidades autenticadas y verificar permisos de conversación.
4. Añadir validación de solicitudes, pruebas automatizadas, migraciones y configuración por ambiente.
