# 💻 Guía de Implementación y Despliegue Local

---

## 🛠️ 1. Requisitos Previos del Sistema

Antes de iniciar la plataforma, verifica tener instalados en tu equipo:

* **Java JDK:** Versión 17 LTS o 21 (verificable con `java -version`).
* **Node.js:** Versión 18 o superior con npm (verificable con `node -v` y `npm -v`).
* **MySQL Server:** Versión 8.0 o superior (ejecutándose en el puerto `3306`).
* **Git:** Para clonar y sincronizar el repositorio.

---

## 🗄️ 2. Configuración de la Base de Datos MySQL

1. Abre tu cliente MySQL favorito (MySQL Workbench, HeidiSQL, DBeaver o línea de comandos):
   ```sql
   CREATE DATABASE IF NOT EXISTS plataforma_servicios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Las tablas y relaciones serán creadas y actualizadas de forma totalmente automática por **Hibernate** al arrancar el backend (`spring.jpa.hibernate.ddl-auto=update`).

---

## 🚀 3. Método Rápido con 1 Solo Clic (Recomendado para Windows)

El proyecto incluye scripts automatizados en la raíz para facilitar la ejecución y evitar la apertura manual de consolas:

### Para Iniciar:
Haz doble clic sobre el archivo:
```text
ARRANCAR.bat
```
Este script realiza automáticamente:
1. Verifica si el servicio MySQL está activo en el puerto `3306` (si está detenido, intenta levantarlo).
2. Abre la consola del **Backend** en Spring Boot configurado en el puerto `8085`.
3. Abre la consola del **Frontend** en React/Vite en el puerto `5174`.
4. Espera a que los servicios estén listos y abre tu navegador por defecto en `http://localhost:5174`.

### Para Detener:
Haz doble clic sobre el archivo:
```text
DETENER.bat
```
Cierra de forma limpia todas las ventanas y procesos asociados a los puertos `5174` y `8085`.

---

## ⚙️ 4. Método Manual por Línea de Comandos

Si prefieres ejecutar los componentes de manera manual en terminales separadas:

### Terminal 1: Backend (Spring Boot)
```powershell
cd backend
$env:SERVER_PORT="8085"
.\mvnw.cmd spring-boot:run
```
*El backend quedará escuchando en `http://localhost:8085`.*

### Terminal 2: Frontend (React 19 + Vite)
```powershell
cd frontend
npm install
npm run dev
```
*El frontend quedará sirviendo en `http://localhost:5174`.*

---

## 🔍 5. Verificación de Funcionamiento

1. Abre en tu navegador web:
   * **Frontend:** [http://localhost:5174](http://localhost:5174)
   * **Diagnóstico Backend:** [http://localhost:8085/api/health](http://localhost:8085/api/health)
2. Debes visualizar la pantalla principal con la barra lateral, el carrusel de publicaciones y el tablero Kanban operativo.

---

## ⚠️ 6. Solución de Problemas Frecuentes

* **Error HTTP 502 (Bad Gateway):**
  * *Causa:* El frontend está encendido pero el backend en Spring Boot aún se está iniciando o falló al conectar con MySQL.
  * *Solución:* Espera unos 30 segundos a que Hibernate termine de validar la base de datos o verifica que MySQL esté corriendo en el puerto 3306.
* **Puerto en Uso:**
  * Si el puerto 8085 o 5174 se encuentra ocupado por otra aplicación, ejecuta `DETENER.bat` o cambia el puerto en `vite.config.js` y `application.properties`.
