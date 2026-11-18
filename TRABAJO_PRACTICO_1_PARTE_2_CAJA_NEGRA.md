# Trabajo Práctico Nº 1 – Parte 2
## Pruebas de caja negra sobre el backend y arquitectura web de la Plataforma de Servicios y Oficios

| Campo | Detalle |
| :--- | :--- |
| **Materia** | Verificación y Validación de Programas |
| **Docente** | Elías Josué Vergara Ceballos |
| **Integrantes (Grupo de 2)** | Iris De Dominicis – Josué Chimbo |
| **Software probado** | Plataforma de Servicios y Oficios (Spring Boot + MySQL + React Vite) |
| **Fecha de entrega** | Noviembre de 2026 |

---

## 1. Nuevas funcionalidades seleccionadas para probar

Para evidenciar la amplitud de la plataforma desarrollada, seleccionamos **6 funcionalidades avanzadas** del sistema. Las mismas se encuentran distribuidas de forma equitativa: **3 funcionalidades para Iris De Dominicis** y **3 funcionalidades para Josué Chimbo**, evaluando en cada una 4 casos de prueba de caja negra (**24 casos en total**):

### A. Funcionalidades asignadas a Iris De Dominicis:
1. **1.1. Solicitudes Formales de Presupuesto y Contratación (`POST /api/solicitudes` y `GET`):** Permite a un cliente solicitar una cotización formal a un especialista con desglose de mano de obra y materiales. El backend valida obligatoriamente el título del trabajo, que existan emisor y destinatario, y bloquea con error `400 Bad Request` si un usuario intenta solicitarse un servicio a sí mismo.
2. **1.2. Sistema Comunitario de Preguntas y Comentarios en Publicaciones (`POST /api/comentarios` y `GET`):** Permite a los usuarios y vecinos consultar detalles sobre los anuncios de trabajo (ej: zona de cobertura, materiales o urgencias). Exige publicación válida, autor y contenido no vacío, devolviendo `201 Created` al registrar o `400 Bad Request` en peticiones sin texto.
3. **1.3. Perfiles Profesionales y Validación Oficial de Matrícula (`GET /api/perfiles/usuario/{id}`):** Módulo de Confianza y Seguridad (*Trust & Safety*). Administra la insignia verificada (*Tilde Azul*), número de matrícula oficial (ERSeP, Gasista Matriculado) y reputación de 5 estrellas. Retorna `200 OK` con los datos del perfil o `404 Not Found` si el usuario no existe.

### B. Funcionalidades asignadas a Josué Chimbo:
4. **1.4. Mensajería Interna y Chat Seguro Antifraude (`POST /api/mensajes` y `GET`):** Canal de comunicación directa entre clientes y profesionales. Exige emisor, receptor y contenido válido. Almacena marcas de tiempo exactas para auditoría y permite consultar el hilo bidireccional cronológico entre los dos interlocutores mediante `GET /api/mensajes/conversacion`.
5. **1.5. Billetera Virtual y Pasarela de Cobros Mercado Pago con Comisión del 10% (`POST /api/mercadopago/crear-preferencia`):** Aplica la política de monetización ética del sistema: calcula en tiempo real la retención del 10% de comisión sobre la mano de obra y acredita el 90% neto al especialista. Exige montos estrictamente positivos (`monto > 0`) y concepto obligatorio.
6. **1.6. Suscripciones y Planes Mensuales para Empresas (`POST /api/empresas` y `GET`):** Gestión corporativa para empresas constructoras y pymes de servicios. Según el plan elegido (PyME $12.000, Constructora $28.000, Corporativo $55.000), calcula automáticamente la cuota mensual y la fecha de renovación a 30 días con estado `ACTIVA`.

---

## 2. Planilla de los 24 casos de prueba de caja negra

| ID | Funcionalidad | Integrante | Objetivo de la prueba | Precondición | Body JSON enviado | Resultado esperado | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-01** | Presupuestos | Iris De Dominicis | Crear solicitud formal válida | Servidor activo. Clientes registrados. | `{"titulo":"Instalación Bomba","descripcion":"Tanque de agua termofusión","creadorUsuarioId":1,"profesionalUsuarioId":2,"presupuestoEstimado":45000}` | `201 Created`. Guarda solicitud con estado PENDIENTE. | **Pasa** |
| **CP-02** | Presupuestos | Iris De Dominicis | Rechazo por título vacío | Servidor activo. | `{"titulo":"","descripcion":"Reparación","creadorUsuarioId":1,"profesionalUsuarioId":2}` | `400 Bad Request`. "El título es obligatorio." | **Pasa** |
| **CP-03** | Presupuestos | Iris De Dominicis | Rechazo de auto-solicitud | Servidor activo. | `{"titulo":"Instalación","creadorUsuarioId":1,"profesionalUsuarioId":1}` | `400 Bad Request`. "No puedes solicitar un servicio a ti mismo." | **Pasa** |
| **CP-04** | Presupuestos | Iris De Dominicis | Consultar solicitud por ID | Solicitud ID=1 existe en MySQL. | Sin body (`GET /api/solicitudes/1`) | `200 OK`. Retorna datos completos de la solicitud. | **Pasa** |
| **CP-05** | Comentarios | Iris De Dominicis | Publicar comentario válido | Publicación ID=1 existe. | `{"publicacionId":1,"autor":"Iris De Dominicis","contenido":"Hola, ¿hacen presupuesto en Nueva Córdoba?"}` | `201 Created`. Devuelve comentario con timestamp. | **Pasa** |
| **CP-06** | Comentarios | Iris De Dominicis | Rechazo por texto vacío | Servidor activo. | `{"publicacionId":1,"autor":"Iris","contenido":""}` | `400 Bad Request`. "contenido es obligatorio." | **Pasa** |
| **CP-07** | Comentarios | Iris De Dominicis | Listar comentarios de publicación | Publicación con comentarios. | Sin body (`GET /api/comentarios/publicacion/1`) | `200 OK`. Array JSON ordenado cronológicamente. | **Pasa** |
| **CP-08** | Comentarios | Iris De Dominicis | Eliminar comentario inexistente | Servidor activo. | Sin body (`DELETE /api/comentarios/9999`) | `404 Not Found`. El comentario no existe. | **Pasa** |
| **CP-09** | Perfil & Matrícula | Iris De Dominicis | Consultar perfil con matrícula | Usuario ID=1 registrado. | Sin body (`GET /api/perfiles/usuario/1`) | `200 OK`. Retorna perfil con oficio, matrícula y rating 5.0. | **Pasa** |
| **CP-10** | Perfil & Matrícula | Iris De Dominicis | Consultar usuario no existente | Usuario no registrado. | Sin body (`GET /api/perfiles/usuario/9999`) | `404 Not Found`. Usuario no encontrado. | **Pasa** |
| **CP-11** | Perfil & Matrícula | Iris De Dominicis | Actualizar matrícula oficial | Perfil existente. | `{"oficio":"Electricista ERSeP","matriculaNumero":"MAT-89421","verificado":true}` | `200 OK`. Perfil actualizado con tilde azul. | **Pasa** |
| **CP-12** | Perfil & Matrícula | Iris De Dominicis | Actualizar usuario inexistente | ID no registrado. | `{"oficio":"Plomero","matriculaNumero":"MAT-123"}` (`PUT /api/perfiles/usuario/9999`) | `404 Not Found`. No existe el registro. | **Pasa** |
| **CP-13** | Mensajería | Josué Chimbo | Enviar mensaje en chat seguro | Usuarios registrados. | `{"emisor":"Josue Chimbo","receptor":"Iris De Dominicis","contenido":"Hola Iris, presupuesto aprobado."}` | `201 Created`. Registra mensaje con timestamp. | **Pasa** |
| **CP-14** | Mensajería | Josué Chimbo | Rechazo por mensaje sin texto | Usuarios registrados. | `{"emisor":"Josue Chimbo","receptor":"Iris De Dominicis","contenido":""}` | `400 Bad Request`. Contenido obligatorio. | **Pasa** |
| **CP-15** | Mensajería | Josué Chimbo | Rechazo por omitir emisor | Servidor activo. | `{"emisor":"","receptor":"Iris De Dominicis","contenido":"Hola"}` | `400 Bad Request`. Emisor y receptor requeridos. | **Pasa** |
| **CP-16** | Mensajería | Josué Chimbo | Historial de chat bidireccional | Mensajes previos. | `GET /api/mensajes/conversacion?emisor=Josue Chimbo&receptor=Iris De Dominicis` | `200 OK`. Array cronológico de mensajes. | **Pasa** |
| **CP-17** | Mercado Pago | Josué Chimbo | Preferencia con 10% comisión | Módulo MP activo. | `{"concepto":"Seña Formal Mano de Obra","monto":35000,"email":"josue@plataforma.com"}` | `200 OK`. Desglosa $3.500 comisión (10%) y $31.500 neto. | **Pasa** |
| **CP-18** | Mercado Pago | Josué Chimbo | Rechazo por monto cero o menor | Servidor activo. | `{"concepto":"Pago Inválido","monto":0,"email":"josue@plataforma.com"}` | `400 Bad Request`. "El monto debe ser mayor a cero." | **Pasa** |
| **CP-19** | Mercado Pago | Josué Chimbo | Rechazo por concepto vacío | Servidor activo. | `{"concepto":"","monto":20000}` | `400 Bad Request`. "El concepto es obligatorio." | **Pasa** |
| **CP-20** | Mercado Pago | Josué Chimbo | Configuración pública pasarela | Servidor activo. | Sin body (`GET /api/mercadopago/config`) | `200 OK`. Retorna publicKey y modoSandbox. | **Pasa** |
| **CP-21** | Empresas | Josué Chimbo | Registrar Plan Constructora | Servidor activo. | `{"nombre":"Constructora Central S.A.","cuit":"30-71234567-9","rubro":"Obras","planSuscripcion":"CONSTRUCTORA"}` | `201 Created`. Asigna cuota de $28.000 y estado ACTIVA. | **Pasa** |
| **CP-22** | Empresas | Josué Chimbo | Registrar Plan PyME | Servidor activo. | `{"nombre":"Plomería Integral SRL","cuit":"30-68912345-1","rubro":"Mantenimiento","planSuscripcion":"PYME"}` | `201 Created`. Asigna cuota base de $12.000. | **Pasa** |
| **CP-23** | Empresas | Josué Chimbo | Listar empresas suscriptas | Al menos 1 empresa en MySQL. | Sin body (`GET /api/empresas`) | `200 OK`. Retorna listado de empresas activas. | **Pasa** |
| **CP-24** | Empresas | Josué Chimbo | Buscar empresa no existente | Servidor activo. | Sin body (`GET /api/empresas/9999`) | `404 Not Found`. Empresa no registrada. | **Pasa** |

---

## 3. Clases de Equivalencia y Valores Límite

### A. Clases de Equivalencia
- **Presupuestos (Iris):** Campo `titulo` (Válido: texto entre 1 y 150 car.; Inválido: vacío `""`). `creador` vs `profesional` (Válido: IDs distintos; Inválido: mismo ID en emisor y receptor).
- **Comentarios (Iris):** Campo `contenido` (Válido: texto no vacío; Inválido: `""` o nulo).
- **Mensajería (Josué):** Campo `contenido` (Válido: texto de mensaje; Inválido: `""`).
- **Mercado Pago (Josué):** Campo `monto` (Válido: `$35.000` > 0; Inválidos: `$0`, `$-10.000`).
- **Empresas (Josué):** Campo `planSuscripcion` (Válidos: `PYME`, `CONSTRUCTORA`, `CORPORATIVO`).

### B. Valores Límite
- **Título de Presupuesto:** 0 letras (Rechazo 400), 1 letra (Acepta 201 Created).
- **Contenido de Comentario:** 0 letras (Rechazo 400), 1 letra (Acepta 201 Created).
- **Monto de Pago:** $0 (Frontera inválida 400), $1 (Mínimo válido 200 OK con desglose del 10%).
- **Cuota de Empresa:** Plan Constructora asigna automáticamente $28.000, Plan PyME asigna $12.000.

---

## 4. Ejecución de Pruebas y Evidencias Visuales Embebidas en Word

En el archivo Word (.docx) se encuentran embebidas las **12 imágenes en alta resolución** correspondientes a:
1. **Evidencias Postman:** Capturas reales de la ventana de ejecución de Postman para los 6 endpoints clave, mostrando método HTTP, URL, tiempo de respuesta, estado HTTP (`200 OK` / `201 Created`) y el JSON devuelto.
2. **Pantallas de la Aplicación Web (UI):** Capturas de pantalla de la interfaz de usuario en funcionamiento:
   - *Iris 1:* Modal de Presupuesto Digital Formal con cálculo del 10%.
   - *Iris 2:* Feed comunitario con comentarios desplegados en un anuncio.
   - *Iris 3:* Modal oficial de Validación de Matrícula (Tilde Azul).
   - *Josué 4:* Sala de Chat activa con especialista y accesos a seña antifraude.
   - *Josué 5:* Panel de Mi Billetera con saldo disponible ($135.000) y retiro a CBU.
   - *Josué 6:* Modal de Planes Mensuales Corporativos para Empresas.

---

## 5. Distribución para la Exposición Oral en Clase

| Integrante | Funcionalidades a cargo | Casos asignados a demostrar | Endpoints probados | Demostración en vivo |
| :--- | :--- | :--- | :--- | :--- |
| **Iris De Dominicis** | 1. Solicitudes de Presupuesto<br>2. Comentarios Comunitarios<br>3. Perfil y Matrícula Oficial | **CP-01, CP-03, CP-05, CP-09** | • `POST /api/solicitudes`<br>• `POST /api/comentarios`<br>• `GET /api/perfiles/usuario/1` | 1. Crear una solicitud formal de presupuesto en vivo (`201 Created`).<br>2. Demostrar el rechazo al intentar auto-solicitarse un trabajo (`400 Bad Request`).<br>3. Publicar un comentario en un anuncio de trabajo (`201 Created`).<br>4. Consultar el perfil profesional validado con tilde azul y matrícula (`200 OK`). |
| **Josué Chimbo** | 4. Mensajería y Chat Antifraude<br>5. Billetera y Pagos Mercado Pago<br>6. Suscripciones Empresas | **CP-13, CP-16, CP-17, CP-21** | • `POST /api/mensajes`<br>• `GET /api/mensajes/conversacion`<br>• `POST /api/mercadopago/crear-preferencia`<br>• `POST /api/empresas` | 1. Enviar un mensaje de chat seguro y consultar la conversación en tiempo real (`200 OK`).<br>2. Generar una preferencia de pago en Mercado Pago demostrando la retención del 10% ($3.500) y neto del 90% ($31.500).<br>3. Registrar una empresa en el Plan Constructora con cuota automática de $28.000 (`201 Created`). |
