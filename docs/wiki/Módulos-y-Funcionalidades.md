# ✨ Módulos y Funcionalidades del Sistema

---

## 🎯 Resumen de Funcionalidades Implementadas

La plataforma integra un conjunto de 8 características avanzadas diseñadas para brindar una experiencia completa tanto a los solicitantes como a los especialistas de oficios:

---

### 1. 🏠 Pantalla Principal y Portada Glassmorphic
* **Fondo Dinámico de Taller:** Imagen en alta definición fija con overlay degradado y efecto de vidrio esmerilado (*glassmorphism*).
* **Sección Hero:** Encabezado con buscador rápido en tiempo real (*"¿Qué servicio buscas? Ej: plomería, electricista..."*).
* **Estadísticas Clave:** Contadores visuales de profesionales registrados (+2.500), servicios completados (+1.200), calificación promedio (4.8★) y conexión local.
* **Filtros por Oficio:** Botones de acceso rápido para Electricidad, Plomería, Albañilería, Pintura, Limpieza, Jardinería, Carpintería y Reparaciones Generales.
* **Sección "¿Cómo funciona?":** Guía gráfica paso a paso en 4 etapas sencillas (Buscá, Cotizá, Seguimiento Kanban, Calificá).

---

### 2. 🧭 Barra Lateral de Navegación (Sidebar)
* **Acceso Directo Unificado:** Navegación persistente hacia todas las áreas del sistema sin perder el contexto visual.
* **Píldora de Perfil Activo:** Muestra el avatar, nombre de usuario y correo del usuario conectado.
* **Botones de Acción Rápida:**
  * `✍️ Realizar Publicación`: Modal instantáneo para crear pedidos u ofertas de trabajo con carga de fotografías.
  * `📄 Crear Presupuesto`: Generador formal de cotizaciones.
* **Acciones Inferiores:**
  * Selector interactivo de **Modo Claro / Modo Oscuro** con persistencia en `localStorage`.
  * Indicador de estado del servidor en tiempo real.
  * Píldora de soporte PWA e instalación en escritorio/móvil.

---

### 3. 📋 Tablero Kanban de Seguimiento de Trabajos
* **Flujo Visual en 4 Columnas:**
  1. 🟡 **Presupuesto Solicitado:** Solicitudes recibidas pendientes de análisis y aceptación.
  2. 🔵 **Aceptado / En Curso:** Trabajos en ejecución activa por parte del especialista.
  3. 🟢 **Finalizado (Listo para Calificar):** Obras completadas que esperan la conformidad del cliente.
  4. 🟣 **Calificado / Cerrado:** Trabajos concluidos con reseña y calificación en estrellas asentadas.
* **Transiciones Interactivas:** Botones en cada tarjeta (`Aceptar Trabajo →`, `Marcar Finalizado ✓`, `Calificar Servicio ⭐`, `← Volver`) para mover el trabajo entre estados.
* **Creación Dinámica:** Modal `+ Nuevo Trabajo` para dar de alta solicitudes directamente en el tablero.

---

### 4. 📄 Generador de Presupuestos Digitales Formales
* **Transparencia Total de Costos:** Permite desglosar el presupuesto en dos ítems obligatorios:
  * **Costo de Mano de Obra** ($)
  * **Costo Estimado de Materiales y Repuestos** ($)
* **Cálculo Automático:** Suma en tiempo real del total del trabajo.
* **Ticket Formal Listo para Imprimir:** Generación de una vista formal con número de cotización, fecha de validez (15 días), condiciones comerciales y botón directo para imprimir o exportar a **PDF**.

---

### 5. 🚨 Módulo de Guardia y Urgencias 24 Horas
* **Filtro de Emergencia Rápido:** Botón destacado `🚨 Solo Guardia 24hs` en la barra de búsqueda y en el muro.
* **Distintivo Rojo Parpadeante:** Las publicaciones y especialistas con guardia activa muestran un badge de urgencia para destacar sobre los turnos regulares.
* **Priorización de Oficios Críticos:** Diseñado específicamente para casos urgentes de cerrajería, plomería por inundación y fallas eléctricas totales.

---

### 6. 🖼️ Portafolio Interactivo "Antes y Después"
* **Slider Comparativo 50/50:** Componente visual deslizable que permite mover un divisor interactivo para contrastar la foto del estado inicial ("Antes") vs. la obra terminada ("Después").
* **Galería Filtrable por Oficio:** Casos reales de plomería (cambio de termotanques y vanitories), pintura (fachadas e interiores), electricidad (renovación de tableros con disyuntor) y carpintería (muebles a medida).
* **Ficha del Especialista:** Cada caso de éxito muestra el nombre del profesional y su número de matrícula habilitante.

---

### 7. 📍 Mapa de Geocercanía y Radar de Profesionales
* **Selector de Radio de Cobertura:** Control deslizante para filtrar especialistas en un radio de **2 km, 5 km, 10 km o 25 km**.
* **Radar Visual:** Interfaz con mapa interactivo y marcadores geolocalizados de profesionales disponibles.
* **Fichas de Contacto:** Detalle de distancia exacta al domicilio, oficio, valor hora promedio y botón de contacto inmediato.

---

### 8. 🔔 Centro de Notificaciones en Icono (Badge) y Modo Oscuro
* **Insignia en Tiempo Real:** Contador numérico sobre el icono de campana `🔔` en la barra superior, en el menú lateral y en la barra inferior móvil que alerta sobre presupuestos recibidos y mensajes sin interrumpir la navegación.
* **Modo Oscuro / Claro:** Cambio de tema instantáneo que reconfigura los fondos, contrastes de texto y bordes según las preferencias del usuario.

---

### 9. 💰 Mi Billetera Virtual y Cobros con Mercado Pago (10% Comisión)
* **Monetización Ética:** Retención automática del 10% exclusivamente sobre la mano de obra; los materiales tienen 0% de comisión.
* **Liquidación y Retiro a CBU/Alias:** Panel financiero para que el especialista consulte su saldo acumulado disponible ($135.000) y solicite la transferencia bancaria a su CBU, CVU o Alias.
* **Seña Protegida:** Generación de preferencias de pago oficiales en Mercado Pago para resguardar el dinero del cliente hasta la finalización del trabajo.

---

### 10. 🏢 Suscripciones Mensuales para Empresas y Constructoras
* **Planes Corporativos:**
  * **Plan PyME & Comercio:** $12.000/mes para pequeños talleres y mantenimiento.
  * **Plan Constructora & Obras:** $28.000/mes para obras civiles y refacciones integrales.
  * **Plan Corporativo / Industria:** $55.000/mes con acceso prioritario y soporte dedicado.
* **Gestión de Cuadrillas:** Herramienta para armar equipos de trabajo interdisciplinarios entre varios especialistas.

---

### 11. 💬 Chat Seguro con Escudo Antifraude
* **Directorio de Especialistas:** Directorio filtrable por oficio (electricistas, plomeros, albañiles, pintores, etc.) con botón de contacto directo.
* **Detección de Bypass:** Sistema inteligente que alerta cuando se intenta compartir teléfonos o correos externos, resguardando la garantía de la plataforma.

---

### 12. 📱 Experiencia Móvil Responsiva PWA (Pantalla Completa)
* **Drawer Deslizante:** Menú lateral completo que se activa con el botón hamburguesa `☰` y se cierra con `✕` en celulares y tablets.
* **Barra Inferior Táctil (Dock):** Accesos directos al alcance del pulgar para Inicio, Muro, Publicar (+), Chat y Menú.
