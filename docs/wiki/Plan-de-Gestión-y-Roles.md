# 👥 Plan de Gestión, Roles y Metodología

---

## 🧭 1. Metodología de Desarrollo

El proyecto adoptó un marco de trabajo ágil adaptado (**Scrum híbrido con Kanban**):

* **Sprints de 2 Semanas:** Planificación periódica de objetivos e historias de usuario.
* **Tablero Kanban:** Gestión visual de tareas de desarrollo en curso, asegurando la no saturación del trabajo en progreso (WIP).
* **Entregas Continuas:** Integración periódica en la rama `develop` y lanzamientos estables en la rama `main`.

---

## 👥 2. Matriz de Roles y Responsabilidades (RACI)

* **R (Responsible):** Quien ejecuta la tarea.
* **A (Accountable):** Quien responde y aprueba la entrega.
* **C (Consulted):** Quien aporta información o colabora.
* **I (Informed):** Quien se mantiene informado del avance.

| Actividad / Módulo | Iris (Líder/Backend) | Kevin (Frontend Lead) | Josue (Full Stack) | Mateo (QA/Frontend) |
| :--- | :---: | :---: | :---: | :---: |
| **Definición de Arquitectura y Estándar Odonto** | **A / R** | C | C | I |
| **Diseño UI / UX y Sistema de Temas Glassmorphic** | C | **A / R** | C | C |
| **Desarrollo Backend Spring Boot & JPA** | **A / R** | I | R | I |
| **Controladores REST y Endpoints de Salud** | **A** | I | **R** | I |
| **Desarrollo de Tablero Kanban y Presupuestos** | C | **A / R** | R | C |
| **Módulo de Geocercanía y Guardia 24hs** | C | R | **A / R** | C |
| **Control de Calidad, Pruebas y Casos de Uso** | C | C | C | **A / R** |
| **Automatización de Despliegue (.bat / .ps1)** | **A / R** | C | I | C |
| **Documentación Técnica y Wiki Oficial** | **A / R** | R | R | R |

---

## 📅 3. Cronograma de Fases del Proyecto (16 Semanas)

```
[Semana 01 - 02] Análisis del Negocio y Relevamiento de Problemática
[Semana 03 - 04] Diseño de Arquitectura, Modelado de BD y Prototipos UI
[Semana 05 - 08] Fase 1 de Desarrollo: Backend Spring Boot y Auth
[Semana 09 - 11] Fase 2 de Desarrollo: Frontend React, Muro y Publicaciones
[Semana 12 - 14] Fase 3 de Innovación: Tablero Kanban, Presupuestos y Geocercanía
[Semana 15]      Pruebas Integrales, Corrección de Errores y Ajuste 502/Proxy
[Semana 16]      Entrega Final, Presentación de Wiki y Despliegue en Vivo
```

---

## ⚠️ 4. Matriz de Gestión de Riesgos

| ID | Riesgo Identificado | Probabilidad | Impacto | Estrategia de Mitigación Implementada |
| :--- | :--- | :---: | :---: | :--- |
| **R01** | **Conflictos de puertos locales (5173 / 8080 en uso)** | Alta | Alto | Se configuró el backend en el puerto dinámico `8085` y el frontend en `5174`, creando además scripts de detención limpia (`DETENER.bat`). |
| **R02** | **Error HTTP 502 por demora en inicio de Hibernate** | Media | Alto | Implementación de proxy reverso en Vite, comprobación de salud en `/api/health` y manejo de fallback en la UI. |
| **R03** | **Inconsistencia entre presupuestos y trabajos contratados** | Media | Medio | Vinculación estricta entre la cotización formal digital y la columna del tablero Kanban. |
| **R04** | **Pérdida o divergencia de código entre colaboradores** | Media | Crítico | Adopción de política de ramas Git (`main`, `develop`, ramas de feature) con sincronización obligatoria antes de mergear. |
| **R05** | **Falta de confianza en profesionales sin referencias** | Alta | Alto | Incorporación de sellos de **Matrícula Verificada**, galería "Antes y Después" y valoraciones por estrellas. |
