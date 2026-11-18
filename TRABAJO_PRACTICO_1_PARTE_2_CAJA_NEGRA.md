# Trabajo Práctico Nº 1 – Parte 2
## Pruebas de caja negra sobre el backend de la Plataforma de Servicios y Oficios

| Campo | Detalle |
| :--- | :--- |
| **Materia** | Verificación y Validación de Programas |
| **Docente** | Elías Josué Vergara Ceballos |
| **Integrantes (Grupo de 2)** | Iris De Dominicis – Josué Chimbo |
| **Software probado** | Plataforma de Servicios y Oficios (Backend Spring Boot + MySQL) |
| **Fecha de entrega** | Noviembre de 2026 |

---

## 1. Funcionalidades seleccionadas para probar

Para cumplir con la pauta de trabajo en parejas, seleccionamos **6 funcionalidades críticas** del backend desarrollado en Spring Boot conectado a base de datos relacional MySQL. Las dividimos en partes iguales: **3 funcionalidades a cargo de Iris De Dominicis** y **3 funcionalidades a cargo de Josué Chimbo**, evaluando para cada una 4 casos de prueba de caja negra exhaustivos (24 casos en total):

### A. Funcionalidades a cargo de Iris De Dominicis:
1. **1.1. Registro de usuarios (`POST /api/usuarios`):** Es la puerta de entrada a la plataforma. Verifica el formato del correo con regex (presencia de `@` y dominio), exige una longitud mínima de 6 caracteres en la contraseña, limita el nombre a un máximo de 100 caracteres y comprueba en MySQL que el correo no esté duplicado.
2. **1.2. Inicio de sesión / Login (`POST /api/usuarios/login`):** Gestiona la autenticación segura. Recibe las credenciales, consulta la base de datos, compara la contraseña encriptada con algoritmo BCrypt y emite el objeto de sesión con su rol asignado, o rechaza el acceso con error HTTP `401 Unauthorized` si los datos son erróneos o inexistentes.
3. **1.3. Publicación de servicios y oficios (`POST /api/publicaciones` y `GET /api/publicaciones`):** Constituye el núcleo de avisos laborales (electricidad, plomería, etc.). Controla que la publicación tenga autor, un tipo de oficio válido, que el contenido no esté en blanco y que no exceda el límite de almacenamiento de 5000 caracteres.

### B. Funcionalidades a cargo de Josué Chimbo:
4. **1.4. Marcar interés en una publicación (`POST /api/intereses` y `GET`):** Permite a los clientes expresar interés formal en contratar un aviso. Posee una regla de negocio estricta: bloquea con error HTTP `409 Conflict` si el mismo usuario intenta votar o mostrar interés dos veces sobre el mismo aviso, previniendo spam o métricas infladas.
5. **1.5. Mensajería interna y chat seguro (`POST /api/mensajes` y `GET /api/mensajes/conversacion`):** Administra la comunicación directa y encriptada entre el cliente y el profesional. Exige que el emisor, el receptor y el cuerpo del mensaje existan y no contengan texto vacío, y permite recuperar el historial cronológico bidireccional entre ambos interlocutores.
6. **1.6. Creación de preferencia de pago con comisión (`POST /api/mercadopago/crear-preferencia`):** Es la pasarela financiera que liquida las señas y presupuestos. Aplica automáticamente la política de monetización del sistema (10% de retención de plataforma y 90% neto para el trabajador), exigiendo montos positivos mayores a cero y descripción obligatoria.

---

## 2. Planilla de los 24 casos de prueba de caja negra

A continuación se detalla la matriz de pruebas con los **24 casos de prueba** (4 por cada funcionalidad), especificando precondición, pasos de ejecución en Postman, body JSON enviado, respuesta esperada del servidor y resultado obtenido:

| ID | Funcionalidad | Integrante | Objetivo de la prueba | Precondición | Pasos en Postman | Payload / Body JSON enviado | Resultado esperado | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-01** | Registro | Iris De Dominicis | Registro exitoso de usuario nuevo | Servidor activo en puerto 8085. Email no registrado. | 1. POST /api/usuarios<br>2. Cargar body JSON<br>3. Enviar (Send) | `{"nombre":"Iris De Dominicis","email":"iris@test.com","password":"password123","rol":"ESPECIALISTA"}` | `201 Created`. Devuelve ID de usuario generado en MySQL. | **Pasa** |
| **CP-02** | Registro | Iris De Dominicis | Rechazo por contraseña corta (5 caracteres) | Servidor activo. | 1. POST /api/usuarios<br>2. Cargar clave corta<br>3. Enviar | `{"nombre":"Iris Test","email":"iristest@correo.com","password":"12345","rol":"CLIENTE"}` | `400 Bad Request`. "La contraseña debe tener al menos 6 caracteres." | **Pasa** |
| **CP-03** | Registro | Iris De Dominicis | Rechazo por correo sin arroba ni dominio | Servidor activo. | 1. POST /api/usuarios<br>2. Mail inválido<br>3. Enviar | `{"nombre":"Carlos Gomez","email":"correo-invalido","password":"password123"}` | `400 Bad Request`. "Ingresá un correo electrónico válido." | **Pasa** |
| **CP-04** | Registro | Iris De Dominicis | Rechazo por correo ya existente (duplicado) | `iris@test.com` ya existe en MySQL (CP-01). | 1. POST /api/usuarios<br>2. Enviar mismo email<br>3. Enviar | `{"nombre":"Iris Clon","email":"iris@test.com","password":"otraClave456"}` | `409 Conflict`. "Ese correo electrónico ya está registrado." | **Pasa** |
| **CP-05** | Login | Iris De Dominicis | Login exitoso con credenciales válidas | Usuario `iris@test.com` registrado en MySQL. | 1. POST /api/usuarios/login<br>2. Cargar datos<br>3. Enviar | `{"email":"iris@test.com","password":"password123"}` | `200 OK`. Devuelve JSON con id, nombre, email y rol activo. | **Pasa** |
| **CP-06** | Login | Iris De Dominicis | Rechazo por contraseña incorrecta | Usuario `iris@test.com` registrado. | 1. POST /api/usuarios/login<br>2. Clave equivocada<br>3. Enviar | `{"email":"iris@test.com","password":"clave_incorrecta"}` | `401 Unauthorized`. "Email o contraseña incorrectos." | **Pasa** |
| **CP-07** | Login | Iris De Dominicis | Rechazo por correo inexistente en la base | Correo no registrado en el sistema. | 1. POST /api/usuarios/login<br>2. Mail no existente<br>3. Enviar | `{"email":"noexiste@plataforma.com","password":"password123"}` | `401 Unauthorized`. "Email o contraseña incorrectos." | **Pasa** |
| **CP-08** | Login | Iris De Dominicis | Rechazo por envío de credenciales vacías | Servidor activo. | 1. POST /api/usuarios/login<br>2. Strings vacíos<br>3. Enviar | `{"email":"","password":""}` | `400 Bad Request` o `401 Unauthorized`. Bloqueo de sesión sin datos. | **Pasa** |
| **CP-09** | Publicación | Iris De Dominicis | Creación exitosa de anuncio laboral | Servidor activo. Usuario autenticado. | 1. POST /api/publicaciones<br>2. Cargar datos de oficio<br>3. Enviar | `{"autor":"Iris De Dominicis","contenido":"Instalaciones sanitarias y reparaciones de grifería.","tipo":"Plomería","ubicacion":"Córdoba Capital"}` | `201 Created`. Guarda anuncio y retorna JSON con ID asignado. | **Pasa** |
| **CP-10** | Publicación | Iris De Dominicis | Rechazo por descripción en blanco o vacía | Servidor activo. | 1. POST /api/publicaciones<br>2. Contenido vacío<br>3. Enviar | `{"autor":"Iris De Dominicis","contenido":"","tipo":"Plomería"}` | `400 Bad Request`. "La descripción de la publicación es obligatoria." | **Pasa** |
| **CP-11** | Publicación | Iris De Dominicis | Rechazo por descripción > 5000 caracteres | Servidor activo. | 1. POST /api/publicaciones<br>2. Texto de 5001 car.<br>3. Enviar | `{"autor":"Iris De Dominicis","contenido":"TextoExtenso...(5001 caracteres)","tipo":"Plomería"}` | `400 Bad Request`. "La descripción no puede superar los 5000 caracteres." | **Pasa** |
| **CP-12** | Publicación | Iris De Dominicis | Consulta y listado general de publicaciones | Al menos una publicación cargada en MySQL. | 1. GET /api/publicaciones<br>2. Enviar petición | Sin body (Método GET) | `200 OK`. Retorna array JSON con todas las publicaciones activas. | **Pasa** |
| **CP-13** | Interés | Josué Chimbo | Marcar interés formal por primera vez | Publicación ID=1 existe. Usuario sin votos previos. | 1. POST /api/intereses<br>2. Cargar JSON<br>3. Enviar | `{"publicacionId":1,"usuario":"josue@test.com"}` | `201 Created`. Registra el interés en la publicación. | **Pasa** |
| **CP-14** | Interés | Josué Chimbo | Bloqueo de interés duplicado (Anti-Spam) | Usuario `josue@test.com` ya votó previamente (CP-13). | 1. POST /api/intereses<br>2. Repetir mismo JSON<br>3. Enviar | `{"publicacionId":1,"usuario":"josue@test.com"}` | `409 Conflict`. "El usuario ya marco que esta interesado". | **Pasa** |
| **CP-15** | Interés | Josué Chimbo | Rechazo por omitir el campo obligatorio usuario | Publicación ID=1 existe en MySQL. | 1. POST /api/intereses<br>2. Omitir usuario<br>3. Enviar | `{"publicacionId":1,"usuario":""}` | `400 Bad Request`. "publicacionId y usuario son obligatorios". | **Pasa** |
| **CP-16** | Interés | Josué Chimbo | Consultar contador de interesados en anuncio | Publicación ID=1 con interesados registrados. | 1. GET /api/intereses/publicacion/1/cantidad<br>2. Enviar | Sin body (Método GET) | `200 OK`. Devuelve un número entero representativo del total. | **Pasa** |
| **CP-17** | Mensajería | Josué Chimbo | Envío de mensaje directo en chat seguro | Usuarios emisor y receptor registrados. | 1. POST /api/mensajes<br>2. Cargar emisor, receptor y texto<br>3. Enviar | `{"emisor":"Josué Chimbo","receptor":"Iris De Dominicis","contenido":"Hola Iris, ¿cuándo podrías revisar la instalación?"}` | `200 OK` o `201 Created`. Retorna mensaje con timestamp asignado. | **Pasa** |
| **CP-18** | Mensajería | Josué Chimbo | Rechazo de mensaje con contenido vacío | Usuarios emisor y receptor existentes. | 1. POST /api/mensajes<br>2. Contenido en blanco<br>3. Enviar | `{"emisor":"Josué Chimbo","receptor":"Iris De Dominicis","contenido":""}` | `400 Bad Request`. Bloquea el envío de mensajes sin texto. | **Pasa** |
| **CP-19** | Mensajería | Josué Chimbo | Rechazo por omitir emisor o receptor | Servidor activo. | 1. POST /api/mensajes<br>2. Receptor nulo<br>3. Enviar | `{"emisor":"Josué Chimbo","receptor":"","contenido":"Hola mundo"}` | `400 Bad Request`. Emisor y receptor son requeridos. | **Pasa** |
| **CP-20** | Mensajería | Josué Chimbo | Obtener conversación bidireccional entre usuarios | Mensajes previos registrados en base de datos. | 1. GET /api/mensajes/conversacion?emisor=Josué Chimbo&receptor=Iris De Dominicis<br>2. Enviar | Parámetros URL (Query Params) | `200 OK`. Retorna array JSON con los mensajes ordenados cronológicamente. | **Pasa** |
| **CP-21** | Pagos MP | Josué Chimbo | Creación de preferencia con desglose del 10% | Servidor activo. Módulo Mercado Pago habilitado. | 1. POST /api/mercadopago/crear-preferencia<br>2. Cargar monto<br>3. Enviar | `{"concepto":"Seña Reparación Cuadro Eléctrico","monto":20000,"email":"cliente@plataforma.com"}` | `200 OK`. Devuelve `preferenceId`, `initPoint`, y desglosa 10% comisión ($2.000) y neto ($18.000). | **Pasa** |
| **CP-22** | Pagos MP | Josué Chimbo | Rechazo de preferencia con monto negativo o cero | Servidor activo. | 1. POST /api/mercadopago/crear-preferencia<br>2. Monto <= 0<br>3. Enviar | `{"concepto":"Pago Inválido","monto":0,"email":"cliente@plataforma.com"}` | `400 Bad Request`. "El monto de la operación debe ser mayor a cero." | **Pasa** |
| **CP-23** | Pagos MP | Josué Chimbo | Rechazo por concepto o descripción vacía | Servidor activo. | 1. POST /api/mercadopago/crear-preferencia<br>2. Concepto vacío<br>3. Enviar | `{"concepto":"","monto":15000}` | `400 Bad Request`. "El concepto del servicio es obligatorio." | **Pasa** |
| **CP-24** | Pagos MP | Josué Chimbo | Obtener configuración pública de pasarela | Servidor activo. | 1. GET /api/mercadopago/config<br>2. Enviar | Sin body (Método GET) | `200 OK`. Devuelve objeto con `publicKey`, `modoSandbox` y estado activo. | **Pasa** |

---

## 3. Técnica de Clases de Equivalencia

La técnica de particiones o clases de equivalencia consiste en clasificar el dominio de entrada en subconjuntos donde cualquier valor de la misma clase produce un comportamiento análogo en el sistema. Esto permite optimizar los casos de prueba sin perder cobertura.

Aplicamos esta técnica sobre campos fundamentales de las funcionalidades asignadas a ambos integrantes:

| Funcionalidad e Integrante | Campo analizado | Clase de equivalencia válida (Aceptada) | Clases de equivalencia inválidas (Rechazadas) | Valores de prueba aplicados en Postman |
| :--- | :--- | :--- | :--- | :--- |
| **Registro** *(Iris)* | `email` | Formato válido de correo electrónico (`nombre@dominio.com`) que no exista previamente en MySQL. | • Sin carácter `@`<br>• Sin dominio o TLD<br>• Campo vacío o nulo<br>• Correo repetido (ya registrado) | **Válido:** `iris@test.com`<br>**Inválidos:** `correo-invalido`, `""`, `iris@test.com` (duplicado) |
| **Registro** *(Iris)* | `password` | Cadena de texto alfanumérica con longitud mayor o igual a 6 caracteres. | • Menos de 6 caracteres<br>• Campo vacío o espacios en blanco | **Válido:** `password123` (11 car.)<br>**Inválidos:** `12345` (5 car.), `""` |
| **Publicación** *(Iris)* | `contenido` | Texto descriptivo con longitud comprendida entre 1 y 5000 caracteres. | • Cadena vacía (`""`) o solo espacios<br>• Texto que supere los 5000 caracteres | **Válido:** Anuncio estándar (65 car.)<br>**Inválidos:** `""`, texto de 5001 car. |
| **Intereses** *(Josué)* | `usuario` + `publicacionId` | Tupla de `publicacionId` existente y `usuario` que no haya manifestado interés en dicho anuncio. | • Usuario que ya tiene un registro previo en ese anuncio<br>• Parámetro `usuario` vacío<br>• Parámetro `publicacionId` omitido | **Válido:** Voto nuevo por `josue@test.com`<br>**Inválidos:** Reintento con mismo usuario, `usuario: ""` |
| **Mensajería** *(Josué)* | `contenido` | Mensaje de texto no vacío entre emisor y receptor válidos. | • Mensaje con cadena vacía<br>• Mensaje nulo | **Válido:** `"Hola Iris, ¿cuándo coordinamos?"`<br>**Inválido:** `""` |
| **Pagos MP** *(Josué)* | `monto` | Valor numérico estrictamente positivo (`monto > 0`). | • Valor igual a 0<br>• Valor negativo (`monto < 0`) | **Válido:** `$20.000`<br>**Inválidos:** `$0`, `$-5.000` |

---

## 4. Técnica de Valores Límite

Los defectos de software se concentran con frecuencia en las fronteras de las condiciones lógicas (por ejemplo, errores de tipo `off-by-one` al usar `>` en vez de `>=`). Por ello, se probaron sistemáticamente los límites permitidos: el valor justo en el límite, el valor inmediatamente anterior (`Límite - 1`) y el inmediatamente posterior (`Límite + 1`).

| Campo y Función | Regla de negocio en backend | Valores límite probados | Comportamiento del servidor Spring Boot |
| :--- | :--- | :--- | :--- |
| **Contraseña** *(Registro - Iris)* | Longitud mínima de 6 caracteres | • **5 caracteres:** `Límite - 1` *(Inválido)*<br>• **6 caracteres:** `Límite exacto` *(Válido)*<br>• **7 caracteres:** `Límite + 1` *(Válido)* | • Con 5 caracteres devolvió `400 Bad Request`.<br>• Con 6 y 7 caracteres aceptó el registro correctamente (`201 Created`). |
| **Nombre** *(Registro - Iris)* | Longitud máxima de 100 caracteres | • **99 caracteres:** `Límite - 1` *(Válido)*<br>• **100 caracteres:** `Límite exacto` *(Válido)*<br>• **101 caracteres:** `Límite + 1` *(Inválido)* | • Con 99 y 100 caracteres guardó en MySQL (`201 Created`).<br>• Con 101 caracteres rechazó con `400 Bad Request`. |
| **Descripción** *(Publicación - Iris)* | Longitud entre 1 y 5000 caracteres | • **0 caracteres (vacío):** `Límite inferior - 1` *(Inválido)*<br>• **1 carácter:** `Límite inferior exacto` *(Válido)*<br>• **5000 caracteres:** `Límite superior exacto` *(Válido)*<br>• **5001 caracteres:** `Límite superior + 1` *(Inválido)* | • Con 0 y 5001 caracteres devolvió error `400 Bad Request`.<br>• Con 1 y 5000 caracteres creó la publicación (`201 Created`). |
| **Monto de Pago** *(Mercado Pago - Josué)* | Monto estrictamente mayor a 0 (`monto > 0`) | • **$0:** `Frontera` *(Inválido)*<br>• **$1:** `Límite mínimo positivo` *(Válido)*<br>• **$-1:** `Inválido` | • Con $0 devolvió error `400 Bad Request`.<br>• Con $1 generó la preferencia de pago (`200 OK`). |

---

## 5. Ejecución de las pruebas y resultados obtenidos

Todas las peticiones fueron ejecutadas y verificadas utilizando **Postman** apuntando al backend Spring Boot en `http://localhost:8085` conectado a la base de datos MySQL `plataforma_servicios`.

Los **24 casos de prueba pasaron exitosamente**. Durante el proceso de validación se corrigieron tres aspectos de integridad en el servidor:
1. En el registro se aseguró la persistencia del atributo `rol` con valor por defecto `ESPECIALISTA` cuando no es provisto.
2. En las publicaciones se incorporaron las validaciones de longitud para que no se admitan textos vacíos ni superiores a 5000 caracteres.
3. En las preferencias de pago se implementó el cálculo formal del 10% de comisión de plataforma y 90% neto transferible al trabajador.

### Evidencias de ejecución de pruebas principales:

#### Prueba 1 – Registro Exitoso (CP-01 – Iris De Dominicis):
- **Petición:** `POST http://localhost:8085/api/usuarios`
- **Body JSON:**
```json
{
  "nombre": "Iris De Dominicis",
  "email": "iris@test.com",
  "password": "password123",
  "rol": "ESPECIALISTA"
}
```
- **Respuesta obtenida:** `201 Created` | `"USUARIO REGISTRADO CORRECTAMENTE. ID=..."`

---

#### Prueba 2 – Login Exitoso con Autenticación BCrypt (CP-05 – Iris De Dominicis):
- **Petición:** `POST http://localhost:8085/api/usuarios/login`
- **Body JSON:**
```json
{
  "email": "iris@test.com",
  "password": "password123"
}
```
- **Respuesta obtenida:** `200 OK` | Devuelve el objeto JSON con `id`, `nombre`, `email`, `rol` y fecha de registro.

---

#### Prueba 3 – Publicación de Servicios Válida (CP-09 – Iris De Dominicis):
- **Petición:** `POST http://localhost:8085/api/publicaciones`
- **Body JSON:**
```json
{
  "autor": "Iris De Dominicis",
  "contenido": "Instalaciones sanitarias y reparaciones de grifería.",
  "tipo": "Plomería",
  "ubicacion": "Córdoba Capital"
}
```
- **Respuesta obtenida:** `201 Created` | Guarda la publicación con ID asignado y timestamp.

---

#### Prueba 4 – Bloqueo de Interés Duplicado / Anti-Spam (CP-14 – Josué Chimbo):
- **Petición:** `POST http://localhost:8085/api/intereses` *(segundo intento consecutivo con el mismo usuario)*
- **Body JSON:**
```json
{
  "publicacionId": 1,
  "usuario": "josue@test.com"
}
```
- **Respuesta obtenida:** `409 Conflict` | `"El usuario ya marco que esta interesado"`

---

#### Prueba 5 – Envío de Mensaje en Chat Seguro (CP-17 – Josué Chimbo):
- **Petición:** `POST http://localhost:8085/api/mensajes`
- **Body JSON:**
```json
{
  "emisor": "Josué Chimbo",
  "receptor": "Iris De Dominicis",
  "contenido": "Hola Iris, ¿cuándo podrías revisar la instalación?"
}
```
- **Respuesta obtenida:** `200 OK` | Devuelve el mensaje registrado con su ID y fecha de envío.

---

#### Prueba 6 – Creación de Preferencia con Retención del 10% (CP-21 – Josué Chimbo):
- **Petición:** `POST http://localhost:8085/api/mercadopago/crear-preferencia`
- **Body JSON:**
```json
{
  "concepto": "Seña Reparación Cuadro Eléctrico",
  "monto": 20000,
  "email": "cliente@plataforma.com"
}
```
- **Respuesta obtenida:** `200 OK` | Devuelve `preferenceId`, `initPoint`, comisión retenida de $2.000 (10%) y neto de $18.000 (90%).

---

## 6. Casos seleccionados para la exposición en clase

Para la defensa oral y práctica en clase, nos distribuimos equitativamente los casos a demostrar en vivo mediante Postman:

| Integrante | Funcionalidades a cargo | Casos asignados a demostrar | Endpoints probados | Dinámica de la demostración en vivo |
| :--- | :--- | :--- | :--- | :--- |
| **Iris De Dominicis** | 1. Registro de usuarios<br>2. Autenticación / Login<br>3. Publicaciones laborales | **CP-01, CP-04, CP-05, CP-10** | • `POST /api/usuarios`<br>• `POST /api/usuarios/login`<br>• `POST /api/publicaciones` | 1. Registrar una cuenta profesional en vivo (`201 Created`).<br>2. Demostrar el bloqueo por email duplicado (`409 Conflict`).<br>3. Iniciar sesión con validación de clave encriptada (`200 OK`).<br>4. Intentar publicar un anuncio sin descripción y mostrar el rechazo de validación (`400 Bad Request`). |
| **Josué Chimbo** | 4. Registro de intereses<br>5. Mensajería y chat<br>6. Pasarela con comisión | **CP-13, CP-14, CP-17, CP-21** | • `POST /api/intereses`<br>• `POST /api/mensajes`<br>• `POST /api/mercadopago/crear-preferencia` | 1. Marcar el primer interés de un cliente en un anuncio (`201 Created`).<br>2. Reintentar el mismo interés para evidenciar el escudo anti-spam (`409 Conflict`).<br>3. Enviar un mensaje de chat seguro y consultar la conversación bidireccional (`200 OK`).<br>4. Generar una preferencia de pago en Mercado Pago demostrando el cálculo automático del 10% de comisión de plataforma (`200 OK`). |

---

## 7. Conclusión

El diseño y ejecución de esta batería de **24 casos de prueba de caja negra** permitió certificar la robustez y confiabilidad del backend de la Plataforma de Servicios y Oficios. La aplicación de **particiones de equivalencia** y el análisis de **valores límite** fueron determinantes para cubrir los casos borde de validación (longitudes de contraseña, límites de texto, restricciones de correo y montos positivos) sin redundancias. 

Asimismo, la distribución equitativa de **3 funcionalidades por integrante** facilitó la verificación integral de los módulos de seguridad, interacción social y transaccionalidad, garantizando un producto estable y preparado para su defensa práctica.
