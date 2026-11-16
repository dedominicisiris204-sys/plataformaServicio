# Guía de Arranque Rápido y Solución de Problemas

Esta guía explica cómo iniciar la **Plataforma de Servicios y Oficios** con un solo clic o mediante la consola de comandos, así como resolver los problemas comunes de configuración.

---

## 1. Arranque con Un Solo Clic (Recomendado)

En la carpeta principal del escritorio (`PROYECTO_PLATAFORMA_SERVICIOS`), simplemente haz **doble clic** sobre:

```text
ARRANCAR.bat
```

### ¿Qué hace automáticamente este script?
1. **Comprueba MySQL**: Detecta si el motor MySQL está escuchando en el puerto `3306`. Si el servicio `MySQL80` de Windows está pausado, intenta iniciarlo.
2. **Inicia el Frontend**: Abre una ventana de consola dedicada y levanta Vite en el puerto `5173`.
3. **Inicia el Backend**: Abre una ventana de consola dedicada y compila/ejecuta Spring Boot en el puerto `8080`.
4. **Abre el Navegador**: Espera unos instantes a que los servidores estén listos y abre automáticamente la aplicación web en `http://localhost:5173`.

---

## 2. Detención de Servicios con Un Solo Clic

Para apagar la aplicación de forma limpia y liberar los puertos `5173` y `8080`, haz **doble clic** sobre:

```text
DETENER.bat
```

---

## 3. Arranque Manual mediante Consola

Si prefieres ejecutar cada componente por separado para depuración:

### Paso 1: Base de Datos MySQL
Verifica que el servicio esté activo:
```powershell
Get-Service MySQL80
```
Si está detenido:
```powershell
Start-Service MySQL80
```

### Paso 2: Backend (Spring Boot)
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
El backend estará disponible en `http://localhost:8080`.

### Paso 3: Frontend (React / Vite)
```powershell
cd frontend
npm run dev
```
La interfaz web estará disponible en `http://localhost:5173`.

---

## 4. Preguntas Frecuentes y Solución de Problemas

### Error: "Port 8080 already in use" o "Port 5173 already in use"
Ejecuta el archivo `DETENER.bat` para cerrar las instancias anteriores que hayan quedado abiertas en segundo plano.

### Error de Conexión a Base de Datos (`Communications link failure`)
1. Verifica que MySQL esté corriendo: abre el Administrador de Tareas > Servicios > `MySQL80`.
2. Revisa la contraseña en `backend/src/main/resources/application.properties` en la clave `spring.datasource.password`.
