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
* **Obtener Comentarios de un Aviso:** `GET /api/comentarios/publicacion/{publicacionId}`
* **Agregar Comentario:** `POST /api/comentarios`
```json
{
  "publicacionId": 1,
  "autor": "Esteban Rossi",
  "contenido": "Hola, ¿trabajan con cañerías de termofusión en Nueva Córdoba?"
}
```

---

### 📄 Solicitudes Formales de Presupuesto
* **Listar Solicitudes:** `GET /api/solicitudes`
* **Consultar Solicitud por ID:** `GET /api/solicitudes/{id}`
* **Crear Solicitud de Presupuesto:** `POST /api/solicitudes`
```json
{
  "titulo": "Instalación de Bomba Presurizadora",
  "descripcion": "Instalación en tanque de agua con cañería termofusión.",
  "creadorUsuarioId": 1,
  "profesionalUsuarioId": 2,
  "presupuestoEstimado": 45000
}
```

---

### 💳 Pasarela de Pagos Mercado Pago (10% Comisión)
* **Configuración Pública:** `GET /api/mercadopago/config`
* **Crear Preferencia de Pago:** `POST /api/mercadopago/crear-preferencia`
```json
{
  "concepto": "Seña Formal Mano de Obra",
  "monto": 35000,
  "email": "cliente@plataforma.com"
}
```
* **Respuesta (`200 OK`):**
```json
{
  "preferenceId": "PREF-c81729da",
  "montoTotal": 35000.0,
  "comisionPlataforma10": 3500.0,
  "netoProfesional90": 31500.0,
  "initPoint": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=PREF-c81729da"
}
```

---

### 🏢 Suscripciones Corporativas para Empresas
* **Listar Empresas Suscriptas:** `GET /api/empresas`
* **Registrar Empresa con Plan:** `POST /api/empresas`
```json
{
  "nombre": "Constructora Central S.A.",
  "cuit": "30-71234567-9",
  "rubro": "Construcción y Obras Civiles",
  "planSuscripcion": "CONSTRUCTORA"
}
```

---

### 🛡️ Perfiles y Validación de Matrícula (Trust & Safety)
* **Consultar Perfil por Usuario:** `GET /api/perfiles/usuario/{usuarioId}`
* **Actualizar Matrícula y Estado Verificado:** `PUT /api/perfiles/usuario/{usuarioId}`

---

## 🔒 2. Seguridad y Manejo de Errores

| Código HTTP | Significado | Causa Habitual |
| :--- | :--- | :--- |
| `200 OK` | Petición exitosa | La operación de lectura o actualización se completó normalmente. |
| `201 Created` | Recurso creado | Una nueva publicación o usuario fue insertado en MySQL. |
| `400 Bad Request` | Parámetros inválidos | Datos requeridos ausentes o formato de email incorrecto. |
| `404 Not Found` | No encontrado | El ID de publicación o usuario especificado no existe. |
| `502 Bad Gateway` | Gateway Error | El servidor Frontend no puede comunicarse con el puerto `8085` del Backend (ocurre si Spring Boot está apagado). |
