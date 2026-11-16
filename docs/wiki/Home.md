# 🛠️ Wiki Oficial: Plataforma de Servicios y Oficios (SERVIRE)

Bienvenido a la documentación técnica y funcional integral de la **Plataforma de Servicios y Oficios Profesionales (SERVIRE)**. 

Este sistema es una solución tecnológica web moderna, interactiva y desacoplada diseñada para conectar a la comunidad con profesionales de oficios calificados (electricistas, plomeros, carpinteros, albañiles, pintores, etc.), gestionando el ciclo completo de contratación: desde la búsqueda por geocercanía y urgencia 24hs hasta la emisión de presupuestos digitales formales, el seguimiento en tablero Kanban y la calificación con estrellas.

El proyecto fue desarrollado como trabajo final para la materia **Gestión de Proyectos** de la **Tecnicatura en Desarrollo de Software**, siguiendo los estándares de diseño modular del proyecto de referencia **Odonto**.

---

## 👥 Integrantes del Equipo y Roles

| Integrante | Rol Principal | Responsabilidad |
| :--- | :--- | :--- |
| **Iris De Dominicis** | **Líder de Proyecto & Backend Lead** | Coordinación general, arquitectura Spring Boot, seguridad, base de datos y despliegue |
| **Kevin David Farías** | **Frontend Lead** | Arquitectura en React 19, integración de estado y diseño de interfaz glassmorphic |
| **Josue Elias Chimbo** | **Full Stack Developer** | Desarrollo de endpoints REST, controladores y componentes modulares |
| **Mateo Alberto Cuello** | **QA & Frontend Developer** | Pruebas de integración, validación de componentes interactivos y experiencia de usuario |

* **Profesor Evaluador:** Narcizo  
* **Institución:** Instituto Superior de Formación Técnica  
* **Año Académico:** 2026

---

## 🗺️ Mapa Completo de la Wiki

Navega a través de las diferentes secciones técnicas y de gestión:

| Sección | Descripción | Acceso Rápido |
| :--- | :--- | :--- |
| **1. Descripción del Proyecto** | Problemática real del mercado, solución planteada, objetivos y beneficios métricos. | [[Ver Página|Descripcion-del-Proyecto]] |
| **2. Arquitectura y Tecnologías** | Arquitectura desacoplada cliente-servidor, diseño modular por dominios (Package-by-Feature estilo *Odonto*), Spring Boot, React 19 y MySQL. | [[Ver Página|Arquitectura-y-Tecnologias]] |
| **3. Módulos y Funcionalidades** | Detalle de las 8 funcionalidades clave: Kanban, Presupuestos Digitales, Portafolio Antes/Después, Geocercanía, Guardia 24hs, etc. | [[Ver Página|Modulos-y-Funcionalidades]] |
| **4. Flujo de Trabajo (Kanban)** | Ciclo de vida de 4 estados interactivos para la ejecución de servicios y contrataciones. | [[Ver Página|Flujo-de-Trabajo-y-Kanban]] |
| **5. Contratos de API REST** | Especificación técnica de endpoints JSON (`/api/health`, `/api/publicaciones`, `/api/usuarios`, etc.). | [[Ver Página|Contratos-de-API-REST]] |
| **6. Requisitos del Sistema** | Requisitos Funcionales (RF) actualizados y Requisitos No Funcionales (RNF) de rendimiento y seguridad. | [[Ver Página|Requisitos-del-Sistema]] |
| **7. Plan de Gestión y Roles** | Metodología ágil, matriz RACI completa, cronograma por fases y matriz de gestión de riesgos. | [[Ver Página|Plan-de-Gestion-y-Roles]] |
| **8. Implementación y Despliegue** | Manual paso a paso para ejecutar el proyecto en Windows con 1 solo clic (`ARRANCAR.bat`) y comandos manuales. | [[Ver Página|Implementacion-y-Despliegue]] |

---

## ⚡ Enlaces Rápidos del Repositorio

* **Repositorio de Código:** [GitHub - dedominicisiris204-sys/plataformaServicio](https://github.com/dedominicisiris204-sys/plataformaServicio)
* **Rama Principal:** `main`
* **Rama de Integración:** `develop`
* **URL de Ejecución Local:** `http://localhost:5174` (Frontend Vite) / `http://localhost:8085` (Backend Spring Boot)
