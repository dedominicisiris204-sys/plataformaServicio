# 📝 Requisitos del Sistema (RF y RNF)

---

## 📋 1. Requisitos Funcionales (RF)

Los requisitos del sistema se estructuran de acuerdo a los módulos del negocio:

### Módulo A: Gestión de Usuarios e Identidad
* **RF-01:** El sistema debe permitir el registro de nuevos usuarios (Clientes y Especialistas).
* **RF-02:** Los especialistas deben poder registrar su oficio principal, número de matrícula habilitante y radio de cobertura geográfica.
* **RF-03:** El sistema debe permitir iniciar y cerrar sesión mediante credenciales seguras.
* **RF-04:** El sistema debe permitir visualizar y editar el perfil profesional con foto de perfil, descripción y datos de contacto.
* **RF-05:** El sistema debe contar con un distintivo visual de **Matrícula Verificada** para profesionales validados.

### Módulo B: Muro y Publicaciones Comunitarias
* **RF-06:** Los usuarios deben poder publicar solicitudes de servicio (pedidos de trabajo) con descripción, ubicación, fotos adjuntas y nivel de urgencia.
* **RF-07:** Los profesionales deben poder publicar ofertas de sus servicios por oficio.
* **RF-08:** El muro debe permitir filtrar publicaciones por oficio (Electricidad, Plomería, Pintura, Albañilería, etc.).
* **RF-09:** El sistema debe incluir un filtro prioritario para **Guardia y Urgencias 24hs**.
* **RF-10:** Los usuarios deben poder indicar interés ("Me interesa") y dejar comentarios públicos en las publicaciones.

### Módulo C: Presupuestos Digitales Formales
* **RF-11:** El sistema debe permitir a los profesionales emitir cotizaciones formales digitales asociadas a un requerimiento.
* **RF-12:** El presupuesto debe requerir obligatoriamente el desglose de **Costo de Mano de Obra** y **Costo de Materiales**.
* **RF-13:** El sistema debe calcular de manera automática el monto total presupuestado.
* **RF-14:** El sistema debe permitir imprimir o exportar la cotización en formato PDF con validez temporal (15 días).

### Módulo D: Tablero Kanban y Flujo de Trabajo
* **RF-15:** El sistema debe proveer un tablero interactivo con 4 columnas de estado:
  1. Presupuesto Solicitado
  2. Aceptado / En Curso
  3. Finalizado
  4. Calificado / Cerrado
* **RF-16:** Los usuarios deben poder transicionar las tarjetas entre estados mediante botones de acción directa.
* **RF-17:** Al concluir un trabajo, el sistema debe solicitar una calificación con estrellas (1 a 5) y reseña de satisfacción.

### Módulo E: Geocercanía y Radar de Profesionales
* **RF-18:** El sistema debe permitir visualizar en un mapa interactivo la ubicación de profesionales disponibles.
* **RF-19:** El usuario debe poder ajustar un filtro de distancia por radio en kilómetros (2 km, 5 km, 10 km, 25 km).
* **RF-20:** El mapa debe destacar a los prestadores con guardia de 24hs activa.

### Módulo F: Portafolio Antes y Después
* **RF-21:** El sistema debe proveer una galería comparativa de transformaciones con divisor deslizable 50/50 ("Antes" y "Después").
* **RF-22:** Las obras exhibidas deben poder filtrarse por categoría de oficio.

### Módulo G: Mensajería y Notificaciones
* **RF-23:** Los usuarios deben poder enviarse mensajes directos dentro de la plataforma.
* **RF-24:** El sistema debe mostrar notificaciones flotantes push (tipo toast) ante nuevos presupuestos o avisos de guardia.

---

## 🛡️ 2. Requisitos No Funcionales (RNF)

* **RNF-01 (Rendimiento):** El tiempo medio de respuesta de las peticiones a la API REST debe ser inferior a 1,5 segundos en condiciones normales.
* **RNF-02 (Disponibilidad):** La arquitectura desacoplada debe permitir que el cliente web permanezca interactivo incluso ante latencias temporales de red.
* **RNF-03 (Seguridad):** Las contraseñas de los usuarios no deben almacenarse en texto plano. La API debe protegerse contra inyecciones SQL mediante Spring Data JPA / Hibernate.
* **RNF-04 (Usabilidad y Accesibilidad):** Interfaz amigable con contraste visual optimizado, compatible con pantallas móviles, tablets y monitores de escritorio.
* **RNF-05 (Compatibilidad de Navegadores):** Plena compatibilidad con Google Chrome, Mozilla Firefox, Microsoft Edge y navegadores móviles basados en Chromium y WebKit.
* **RNF-06 (Modularidad):** Código frontend organizado en componentes funcionales reutilizables y backend estructurado según el patrón *Package-by-Feature*.
* **RNF-07 (Persistencia Relacional):** Integridad referencial asegurada en el motor MySQL 8.0 con transacciones ACID.
