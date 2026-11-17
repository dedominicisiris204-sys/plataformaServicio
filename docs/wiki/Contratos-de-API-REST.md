# 🔌 Contratos de API REST

---

## 📡 1. Especificación de Endpoints del Backend

Todas las respuestas del servidor se entregan bajo cabecera `Content-Type: application/json`. El backend se ejecuta por defecto en el puerto `8085` (con proxy en Vite a través de `http://localhost:5174/api`).

---

### 🩺 Health Check & Disponibilidad
* **Endpoint:** `GET /api/health`
* **Descripción:** Endpoint de diagnóstico para validar que el servicio Spring Boot se encuentra activo y respondiendo.
* **Respuesta Exitosa (`200 OK`):**
```json
{
  "service": "plataforma-servicios",
  "status": "UP",
  "timestamp": "2026-11-16T20:30:45.694814500Z"
}
```

---

### 📰 Publicaciones del Muro
* **Listar Publicaciones:** `GET /api/publicaciones`
  * **Respuesta (`200 OK`):** Array de objetos publicación.
```json
[
  {
    "id": 12,
    "autor": "Mariana Lopez",
    "tipo": "Busco profesional - Albañilería",
    "contenido": "🚨 Busco albañil o ceramista responsable para colocar porcelanato...",
    "ubicacion": "Barrio Centro",
    "imagenBase64": "https://images.unsplash.com/...",
    "interesados": 7,
    "comentarios": 2,
    "tags": ["Albañilería", "Busco profesional", "PRECIO:A convenir", "DISP:Urgente"]
  }
]
```

* **Crear Publicación:** `POST /api/publicaciones`
  * **Cuerpo de la Petición:**
```json
{
  "autor": "Carlos Rodríguez",
  "tipo": "Servicio ofrecido - Electricidad",
  "contenido": "Instalaciones eléctricas y guardia 24hs",
  "ubicacion": "Zona Norte",
  "tags": ["Electricidad", "Guardia24hs", "Matriculado"]
}
```
  * **Respuesta (`201 Created`):** Objeto publicación persistido con ID autogenerado.

---

### 👤 Usuarios y Autenticación
* **Listar Usuarios:** `GET /api/usuarios`
* **Obtener Usuario por ID:** `GET /api/usuarios/{id}`
* **Registrar Usuario:** `POST /api/usuarios`
  * **Cuerpo de la Petición:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@plomero.com",
  "password": "password123",
  "rol": "PROFESIONAL",
  "oficio": "Plomería",
  "matricula": "MAT-8492"
}
```
* **Eliminar Usuario:** `DELETE /api/usuarios/{id}`

---

### 💬 Mensajería y Conversaciones
* **Listar Mensajes entre Usuarios:** `GET /api/mensajes?remitenteId={id}&destinatarioId={id}`
* **Enviar Mensaje:** `POST /api/mensajes`
```json
{
  "remitenteId": 1,
  "destinatarioId": 2,
  "contenido": "Hola Juan, ¿podrías pasar a revisar el termotanque hoy?",
  "fechaEnvio": "2026-11-16T18:00:00"
}
```

---

### 💬 Comentarios en Publicaciones
* **Obtener Comentarios de un Aviso:** `GET /api/publicaciones/{id}/comentarios`
* **Agregar Comentario:** `POST /api/publicaciones/{id}/comentarios`
```json
{
  "autor": "Esteban Rossi",
  "texto": "Hola, te dejé un mensaje privado con mi disponibilidad para mañana."
}
```

---

## 🔒 2. Seguridad y Manejo de Errores

| Código HTTP | Significado | Causa Habitual |
| :--- | :--- | :--- |
| `200 OK` | Petición exitosa | La operación de lectura o actualización se completó normalmente. |
| `201 Created` | Recurso creado | Una nueva publicación o usuario fue insertado en MySQL. |
| `400 Bad Request` | Parámetros inválidos | Datos requeridos ausentes o formato de email incorrecto. |
| `404 Not Found` | No encontrado | El ID de publicación o usuario especificado no existe. |
| `502 Bad Gateway` | Gateway Error | El servidor Frontend no puede comunicarse con el puerto `8085` del Backend (ocurre si Spring Boot está apagado). |
