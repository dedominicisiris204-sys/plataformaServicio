# 📋 Descripción General del Proyecto

---

## 🔍 1. La Problemática Real del Sector de Oficios

En la actualidad, la contratación de profesionales de oficios (plomería, electricidad, albañilería, gas, carpintería, pintura) en comunidades y ciudades intermedias presenta serias deficiencias:

1. **Dispersión y Desorganización:** Los anuncios se realizan en grupos informales de redes sociales o aplicaciones de mensajería (WhatsApp, Facebook), donde la información se pierde con rapidez.
2. **Incertidumbre en los Costos:** Rara vez se emiten cotizaciones formales por escrito. Los clientes desconocen el desglose entre el costo de la mano de obra y el costo de los materiales, generando desconfianza y disputas económicas.
3. **Falta de Seguimiento del Trabajo:** No existe un mecanismo para conocer el estado actual de una obra o reparación una vez aceptada, ni constancia de cuándo fue finalizada o entregada.
4. **Dificultad ante Emergencias (24 Horas):** Ante una fuga de agua o un cortocircuito nocturno, es sumamente difícil identificar qué profesional certificado se encuentra de guardia o a pocos kilómetros del domicilio.
5. **Carencia de Validación y Reputación:** Se contrata a ciegas, sin poder verificar matrículas habilitantes, reseñas comprobadas o fotografías fidedignas de trabajos anteriores.

---

## 💡 2. La Solución Integral: SERVIRE

**SERVIRE** es una plataforma web integral que digitaliza y transparenta la intermediación entre clientes y profesionales de servicios:

* **Muro Comunitario Centralizado:** Publicaciones categorizadas con etiquetas de disponibilidad, fotos del problema y botón de solicitud de presupuesto.
* **Presupuestos Formales Digitales:** Los especialistas pueden emitir una cotización detallada (mano de obra + lista de materiales requeridos) lista para imprimir o guardar en PDF.
* **Gestión Visual por Kanban:** Un tablero interactivo de 4 etapas (*Presupuesto Solicitado*, *En Curso*, *Finalizado*, *Calificado*) permite que ambas partes hagan un seguimiento transparente del progreso.
* **Filtro de Urgencias & Geocercanía:** Detección de especialistas disponibles en guardia 24hs filtrables por radio de cercanía (2 km, 5 km, 10 km, 25 km).
* **Portafolio Interactivo "Antes y Después":** Un slider visual dividido al 50% permite al cliente comprobar la calidad real de las reformas antes de contratar.
* **Identidad Verificada:** Distintivo de matrícula habilitante y calificaciones verificadas con estrellas.

---

## 🎯 3. Objetivos del Proyecto

### Objetivo General
Diseñar, desarrollar e implementar una plataforma web modular, segura, responsiva y escalable bajo arquitectura desacoplada (React 19 + Spring Boot + MySQL) para la gestión integral de servicios y oficios profesionales.

### Objetivos Específicos
1. Desarrollar una API REST robusta en Spring Boot con arquitectura en capas y soporte de autenticación, validación y persistencia relacional.
2. Construir una interfaz de usuario en React 19 moderna y accesible, implementando diseño glassmorphic, modo claro/oscuro y componentes interactivos.
3. Incorporar un tablero Kanban reactivo que gestione el ciclo de vida de los trabajos contratados.
4. Desarrollar un generador de presupuestos formal que calcule totales y desglose costos automáticamente.
5. Facilitar la búsqueda geolocalizada y el contacto rápido ante situaciones de urgencia 24hs.
6. Garantizar la facilidad de despliegue mediante scripts de automatización con 1 solo clic en entornos Windows.

---

## 📈 4. Beneficios Métricos Esperados

| Métrica | Situación Anterior (Sin Plataforma) | Con SERVIRE | Impacto |
| :--- | :--- | :--- | :--- |
| **Tiempo de búsqueda de un especialista** | 2 a 4 días por redes sociales | < 15 minutos mediante radar | **-85% tiempo** |
| **Claridad y acuerdo en costos** | Verbal o mensajes informales | Presupuesto formal PDF descargable | **100% transparencia** |
| **Trazabilidad del trabajo** | Sin registro del estado | Tablero Kanban en tiempo real | **Trazabilidad total** |
| **Atención de emergencias 24hs** | Búsqueda manual sin garantías | Filtro y badge instantáneo de guardia | **Respuesta inmediata** |
| **Confianza en la contratación** | Recomendación de boca en boca | Matrícula y reseñas verificadas | **Mayor seguridad** |
