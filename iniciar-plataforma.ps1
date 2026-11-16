$ErrorActionPreference = "Stop"

# Ruta dinamica del proyecto (independiente de donde este ubicada la carpeta)
$raiz = $PSScriptRoot
if (-not $raiz) {
    $raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
}
$backend = Join-Path $raiz "backend"
$frontend = Join-Path $raiz "frontend"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  PLATAFORMA DE SERVICIOS Y OFICIOS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "Directorio: $raiz`n" -ForegroundColor Gray

# 1. Comprobar y arrancar MySQL
$servicio = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($servicio -and $servicio.Status -ne "Running") {
    try {
        Write-Host "Iniciando servicio MySQL80..." -ForegroundColor Yellow
        Start-Service -Name "MySQL80"
    }
    catch {
        Write-Host "Aviso: No se pudo iniciar el servicio de Windows MySQL80 automáticamente." -ForegroundColor Yellow
    }
}

$mysqlListo = $false
for ($i = 0; $i -lt 15; $i++) {
    $puerto = Get-NetTCPConnection -State Listen -LocalPort 3306 -ErrorAction SilentlyContinue
    if ($puerto) {
        $mysqlListo = $true
        break
    }
    Start-Sleep -Seconds 1
}

if (-not $mysqlListo) {
    Write-Host "[ADVERTENCIA] No se detecta un servidor MySQL activo en el puerto 3306." -ForegroundColor Yellow
    Write-Host "Si tu base de datos usa otro puerto o contenedor, asegurate de tenerla lista.`n" -ForegroundColor Yellow
} else {
    Write-Host "MySQL detectado y disponible en el puerto 3306." -ForegroundColor Green
}

# 2. Iniciar React/Vite en puerto 5174 si no esta activo
$frontendActivo = Get-NetTCPConnection -State Listen -LocalPort 5174 -ErrorAction SilentlyContinue
if (-not $frontendActivo) {
    Write-Host "Iniciando React/Vite en una nueva ventana (puerto 5174)..." -ForegroundColor Yellow
    $comandoFrontend = "Set-Location -LiteralPath '$frontend'; npm run dev"
    Start-Process -FilePath "powershell.exe" -ArgumentList @(
        "-NoExit",
        "-ExecutionPolicy", "Bypass",
        "-Command", $comandoFrontend
    )
    Write-Host "Frontend lanzado (http://localhost:5174)." -ForegroundColor Green
} else {
    Write-Host "El puerto 5174 ya esta en uso; no se abrira otra instancia de React." -ForegroundColor Yellow
}

# 3. Si Spring Boot en puerto 8085 ya esta escuchando, no iniciarlo de nuevo
$backendActivo = Get-NetTCPConnection -State Listen -LocalPort 8085 -ErrorAction SilentlyContinue
if ($backendActivo) {
    Write-Host "`nEl backend ya esta escuchando en el puerto 8085." -ForegroundColor Green
    Write-Host "Frontend: http://localhost:5174"
    Write-Host "Backend:  http://localhost:8085"
    Start-Process "http://localhost:5174"
    Read-Host "`nPresiona Enter para cerrar esta ventana"
    exit 0
}

# 4. Iniciar backend usando application.properties en puerto 8085
Set-Location -LiteralPath $backend
$env:SERVER_PORT = "8085"
Write-Host "`nIniciando Spring Boot en puerto 8085. Esta ventana mostrara los registros..." -ForegroundColor Cyan
Write-Host "Frontend Web: http://localhost:5174" -ForegroundColor Green
Write-Host "Backend API:  http://localhost:8085`n" -ForegroundColor Green

Start-Sleep -Seconds 3
Start-Process "http://localhost:5174"

.\mvnw.cmd spring-boot:run

Write-Host "`nEl proceso del backend termino." -ForegroundColor Yellow
Read-Host "Presiona Enter para cerrar esta ventana"
