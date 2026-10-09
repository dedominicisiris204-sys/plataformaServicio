$ErrorActionPreference = "Stop"

$raiz = "C:\Users\Admin\Desktop\cosas de iris\plataformaServicio"
$backend = Join-Path $raiz "backend"
$frontend = Join-Path $raiz "frontend"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  PLATAFORMA DE SERVICIOS Y OFICIOS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Comprobar y arrancar MySQL
$servicio = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if (-not $servicio) {
    Write-Host "No se encontró el servicio MySQL80." -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

if ($servicio.Status -ne "Running") {
    try {
        Write-Host "Iniciando MySQL80..." -ForegroundColor Yellow
        Start-Service -Name "MySQL80"
    }
    catch {
        Write-Host "No pude iniciar MySQL80. Abre PowerShell como administrador y vuelve a intentarlo." -ForegroundColor Red
        Write-Host $_.Exception.Message
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

$mysqlListo = $false
for ($i = 0; $i -lt 30; $i++) {
    $puerto = Get-NetTCPConnection -State Listen -LocalPort 3306 -ErrorAction SilentlyContinue
    if ($puerto) {
        $mysqlListo = $true
        break
    }
    Start-Sleep -Seconds 1
}

if (-not $mysqlListo) {
    Write-Host "MySQL no está escuchando en el puerto 3306. No iniciaré el backend." -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}
Write-Host "MySQL está disponible en el puerto 3306." -ForegroundColor Green

# 2. Iniciar React si todavía no está ejecutándose
$frontendActivo = Get-NetTCPConnection -State Listen -LocalPort 5173 -ErrorAction SilentlyContinue
if (-not $frontendActivo) {
    Write-Host "Iniciando React/Vite en otra ventana..." -ForegroundColor Yellow
    $comandoFrontend = "Set-Location -LiteralPath '$frontend'; npm run dev"
    Start-Process -FilePath "powershell.exe" -ArgumentList @(
        "-NoExit",
        "-ExecutionPolicy", "Bypass",
        "-Command", $comandoFrontend
    )
} else {
    Write-Host "El puerto 5173 ya está en uso; no abriré otra instancia de React." -ForegroundColor Yellow
}

# 3. Si Spring Boot ya está escuchando, no iniciarlo de nuevo
$backendActivo = Get-NetTCPConnection -State Listen -LocalPort 8080 -ErrorAction SilentlyContinue
if ($backendActivo) {
    Write-Host "`nEl backend ya está escuchando en el puerto 8080." -ForegroundColor Green
    Write-Host "Frontend: http://localhost:5173"
    Write-Host "Backend:  http://localhost:8080"
    Read-Host "`nPresiona Enter para cerrar esta ventana"
    exit 0
}

# 4. Pedir la contraseña sin guardarla en el script
$segura = Read-Host "Ingresa la contraseña de root de MySQL" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($segura)

try {
    $env:SPRING_DATASOURCE_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
}

$env:SPRING_DATASOURCE_URL = "jdbc:mysql://localhost:3306/plataforma_servicios?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
$env:SPRING_DATASOURCE_USERNAME = "root"

try {
    Set-Location -LiteralPath $backend
    Write-Host "`nIniciando Spring Boot. Esta ventana mostrará los registros." -ForegroundColor Cyan
    Write-Host "Cuando aparezca 'Started PlataformaServiciosApplication', el backend estará iniciado." -ForegroundColor Cyan
    .\mvnw.cmd spring-boot:run
} finally {
    Remove-Item Env:SPRING_DATASOURCE_PASSWORD -ErrorAction SilentlyContinue
    Remove-Item Env:SPRING_DATASOURCE_URL -ErrorAction SilentlyContinue
    Remove-Item Env:SPRING_DATASOURCE_USERNAME -ErrorAction SilentlyContinue
}

Write-Host "`nEl proceso del backend terminó." -ForegroundColor Yellow
Read-Host "Presiona Enter para cerrar esta ventana"
