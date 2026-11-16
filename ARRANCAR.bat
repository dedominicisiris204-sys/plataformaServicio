@echo off
setlocal
chcp 65001 >nul
title Plataforma de Servicios y Oficios - Lanzador
color 0b

echo.
echo =======================================================
echo     PLATAFORMA DE SERVICIOS Y OFICIOS PROFESIONALES
echo =======================================================
echo.
echo [*] Directorio base: %~dp0
echo.

:: 1. Verificar servicio de MySQL
echo [1/3] Verificando base de datos MySQL en puerto 3306...
netstat -ano | findstr :3306 >nul
if %errorlevel% neq 0 (
    echo [!] MySQL no se detecta activo en puerto 3306.
    echo [*] Intentando iniciar servicio MySQL80 de Windows...
    net start MySQL80 >nul 2>&1
    timeout /t 2 >nul
    netstat -ano | findstr :3306 >nul
    if %errorlevel% neq 0 (
        echo [ADVERTENCIA] No se pudo iniciar MySQL en puerto 3306 automaticamente.
        echo Asegurate de que tu servicio MySQL este corriendo.
    ) else (
        echo [OK] MySQL iniciado correctamente.
    )
) else (
    echo [OK] Base de datos MySQL detectada y activa.
)
echo.

:: 2. Iniciar Backend (Spring Boot en puerto 8085)
echo [2/3] Iniciando Backend Spring Boot (puerto 8085)...
start "Backend - Plataforma de Servicios" /D "%~dp0backend" cmd /k "title Backend (Spring Boot :8085) && set SERVER_PORT=8085 && mvnw.cmd spring-boot:run"
echo [OK] Ventana del Backend abierta en puerto 8085.
echo.

:: 3. Iniciar Frontend (React / Vite en puerto 5174)
echo [3/3] Iniciando Frontend React Vite (puerto 5174)...
start "Frontend - Plataforma de Servicios" /D "%~dp0frontend" cmd /k "title Frontend (React/Vite :5174) && npm run dev"
echo [OK] Ventana del Frontend abierta en puerto 5174.
echo.

echo =======================================================
echo [EXITO] Ambas ventanas de Frontend y Backend han sido lanzadas.
echo.
echo  - Frontend Web: http://localhost:5174
echo  - Backend API:  http://localhost:8085
echo.
echo  Esperando unos segundos para abrir la web en el navegador...
echo =======================================================
echo.

timeout /t 6 >nul
start http://localhost:5174

echo Presiona cualquier tecla para cerrar este asistente...
pause >nul
