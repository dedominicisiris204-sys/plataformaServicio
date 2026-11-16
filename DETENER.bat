@echo off
chcp 65001 >nul
title Detener Plataforma de Servicios
color 0c

echo.
echo =======================================================
echo    DETENIENDO SERVICIOS DE LA PLATAFORMA
echo =======================================================
echo.

:: 1. Detener procesos en puerto 5174 (Frontend Vite)
echo [*] Buscando procesos en puerto 5174 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5174') do (
    echo Deteniendo PID %%a...
    taskkill /f /pid %%a >nul 2>&1
)

:: 2. Detener procesos en puerto 8085 (Backend Spring Boot)
echo [*] Buscando procesos en puerto 8085 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8085') do (
    echo Deteniendo PID %%a...
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo [OK] Procesos de frontend (5174) y backend (8085) liberados.
echo =======================================================
echo Presiona cualquier tecla para salir...
pause >nul
