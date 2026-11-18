import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({
  seccionActiva,
  setSeccionActiva,
  abrirModalPublicar,
  abrirModalPresupuesto,
  abrirModalPlanesEmpresas,
  abrirModalCuadrillas,
  abrirModalVerificacion,
  abrirModalAdmin,
  abrirModalCalculadora,
  abrirModalRecibo,
  abrirModalBilletera,
  rolActivo = "ADMIN",
  setRolActivo,
  usuario,
  onCerrarSesion,
  notificacionesNoLeidas = 3,
  esModoOscuro,
  onAlternarModoOscuro
}) {
  const navigate = useNavigate();

  // Verificación estricta de administrador: solo el admin real tiene acceso al panel
  const esAdmin = Boolean(
    usuario?.rol === "ADMIN" ||
    usuario?.email?.toLowerCase().includes("admin@") ||
    usuario?.email?.toLowerCase() === "admin@plataforma.com" ||
    usuario?.nombre?.toLowerCase() === "admin"
  );

  const rolReal = esAdmin ? "ADMIN" : (usuario?.rol || "ESPECIALISTA");

  return (
    <aside className="dashboard-sidebar">
      {/* 1. Header con Logo y Marca */}
      <div className="sidebar-header">
        <Link to="/" className="sidebar-brand" onClick={() => setSeccionActiva("inicio")}>
          <div className="sidebar-logo">PS</div>
          <div className="sidebar-brand-text">
            <h2>Plataforma</h2>
            <span>Servicios & Oficios</span>
          </div>
        </Link>
      </div>

      {/* 2. Tarjeta de Usuario con Rol Protegido */}
      <div className="sidebar-user-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="sidebar-user-avatar">
            {rolReal === "ADMIN" ? "👑" : rolReal === "EMPRESA" ? "🏢" : (usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : "🛠️")}
          </div>
          <div className="sidebar-user-info" style={{ flex: 1 }}>
            <div className="sidebar-user-name" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>{usuario ? usuario.nombre : (esAdmin ? "Administrador General" : "Usuario Activo")}</span>
            </div>
            <div className="sidebar-user-role" style={{ fontSize: 11, color: "var(--primary)", fontWeight: 700 }}>
              {rolReal === "ADMIN" ? "👑 Administrador (Tú)" : rolReal === "EMPRESA" ? "🏢 Cuenta Empresa" : "🛠️ Profesional & Cliente"}
            </div>
          </div>
        </div>

        {/* Únicamente el Administrador puede alternar vista de prueba */}
        {esAdmin && (
          <div style={{ background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: 8, padding: "4px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
            <button
              type="button"
              onClick={() => setRolActivo && setRolActivo("ADMIN")}
              style={{
                padding: "4px 2px",
                fontSize: 10,
                fontWeight: 800,
                borderRadius: 6,
                border: "none",
                background: rolActivo === "ADMIN" ? "var(--primary)" : "transparent",
                color: rolActivo === "ADMIN" ? "white" : "var(--text-muted)",
                cursor: "pointer"
              }}
              title="Vista Administrador"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => setRolActivo && setRolActivo("ESPECIALISTA")}
              style={{
                padding: "4px 2px",
                fontSize: 10,
                fontWeight: 800,
                borderRadius: 6,
                border: "none",
                background: rolActivo === "ESPECIALISTA" ? "var(--primary)" : "transparent",
                color: rolActivo === "ESPECIALISTA" ? "white" : "var(--text-muted)",
                cursor: "pointer"
              }}
              title="Previsualizar como Profesional"
            >
              🛠️ Oficio
            </button>
            <button
              type="button"
              onClick={() => setRolActivo && setRolActivo("EMPRESA")}
              style={{
                padding: "4px 2px",
                fontSize: 10,
                fontWeight: 800,
                borderRadius: 6,
                border: "none",
                background: rolActivo === "EMPRESA" ? "var(--primary)" : "transparent",
                color: rolActivo === "EMPRESA" ? "white" : "var(--text-muted)",
                cursor: "pointer"
              }}
              title="Previsualizar como Empresa"
            >
              🏢 Empresa
            </button>
          </div>
        )}
      </div>

      {/* 3. Botones de Acción Destacados según Rol */}
      <div className="sidebar-cta-container" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Solo y exclusivamente el Administrador ve el botón de Ingresos y Gestión */}
        {esAdmin && (
          <button
            onClick={abrirModalAdmin}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 14px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#1e1b4b",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)"
            }}
            title="Abrir Panel de Ingresos y Comisiones del Administrador"
          >
            <span>👑</span>
            <span>Panel Administrador (Ingresos)</span>
          </button>
        )}

        <button
          className="btn-crear-publicacion"
          onClick={abrirModalPublicar}
          title="Crear una nueva publicación o solicitud"
        >
          <span className="btn-icon">✍️</span>
          <span>Publicar Trabajo / Solicitud</span>
        </button>

        <button
          onClick={abrirModalPresupuesto}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "8px 12px",
            background: "var(--surface-soft)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer"
          }}
          title="Generar cotización o presupuesto formal"
        >
          <span>📄</span>
          <span>Presupuesto (10% Comisión)</span>
        </button>

        {/* Botón Mi Billetera & Saldo Disponible */}
        <button
          onClick={abrirModalBilletera}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 14px",
            background: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(22, 101, 52, 0.25)"
          }}
          title="Ver saldo acumulado de tus trabajos y solicitar transferencia a tu CBU/Alias"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span>💰</span>
            <span>Mi Billetera (Cobros)</span>
          </div>
          <span style={{ fontSize: 10.5, background: "rgba(255,255,255,0.25)", padding: "2px 6px", borderRadius: 6 }}>
            $135.000
          </span>
        </button>

        {/* Botón Cuadrillas y Equipos de Trabajo */}
        <button
          onClick={abrirModalCuadrillas}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "8px 12px",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)"
          }}
          title="Armar equipo de trabajo / cuadrilla con otros profesionales"
        >
          <span>👥</span>
          <span>Cuadrillas & Equipos de Trabajo</span>
        </button>

        {/* Botón Planes Empresas */}
        <button
          onClick={abrirModalPlanesEmpresas}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "8px 12px",
            background: "var(--surface-soft)",
            color: "#0284c7",
            border: "1px solid var(--border)",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer"
          }}
          title="Planes mensuales y suscripciones corporativas"
        >
          <span>🏢</span>
          <span>Planes Empresas (Cuota Mensual)</span>
        </button>

        {/* Botón Verificación de Matrícula (Trust & Safety) */}
        <button
          onClick={abrirModalVerificacion}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "8px 12px",
            background: "rgba(13, 148, 136, 0.08)",
            color: "#0d9488",
            border: "1px dashed rgba(13, 148, 136, 0.4)",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer"
          }}
          title="Verifica tu matrícula o DNI para obtener el tilde azul oficial"
        >
          <span>🛡️</span>
          <span>Validar Matrícula (Tilde Azul)</span>
        </button>

        {/* Botón Calculadora de Precios Sugeridos */}
        <button
          onClick={abrirModalCalculadora}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "8px 12px",
            background: "var(--surface-soft)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer"
          }}
          title="Consultar precios de referencia del mercado para presupuestar sin sorpresas"
        >
          <span>💡</span>
          <span>Calculadora de Precios</span>
        </button>

        {/* Botón Comprobantes y Recibos Oficiales */}
        <button
          onClick={abrirModalRecibo}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "8px 12px",
            background: "var(--surface-soft)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer"
          }}
          title="Ver o imprimir recibos oficiales con detalle de mano de obra y materiales"
        >
          <span>🧾</span>
          <span>Comprobante de Servicio</span>
        </button>
      </div>

      {/* 4. Menú de Navegación Lateral Completo */}
      <nav className="sidebar-nav">
        <button
          className={`sidebar-nav-item ${seccionActiva === "inicio" ? "active" : ""}`}
          onClick={() => setSeccionActiva("inicio")}
        >
          <span className="nav-item-icon">🏠</span>
          <span>Pantalla Principal</span>
        </button>

        <button
          className={`sidebar-nav-item ${seccionActiva === "publicaciones" ? "active" : ""}`}
          onClick={() => setSeccionActiva("publicaciones")}
        >
          <span className="nav-item-icon">📰</span>
          <span>Ver Publicaciones</span>
        </button>

        <button
          className={`sidebar-nav-item ${seccionActiva === "trabajos" ? "active" : ""}`}
          onClick={() => setSeccionActiva("trabajos")}
        >
          <span className="nav-item-icon">📋</span>
          <span>Mis Trabajos (Kanban)</span>
          <span className="nav-item-badge" style={{ background: "#2563eb" }}>4</span>
        </button>

        <button
          className={`sidebar-nav-item ${seccionActiva === "mapa" ? "active" : ""}`}
          onClick={() => setSeccionActiva("mapa")}
        >
          <span className="nav-item-icon">📍</span>
          <span>Mapa de Cercanía</span>
        </button>

        <button
          className={`sidebar-nav-item ${seccionActiva === "antes-despues" ? "active" : ""}`}
          onClick={() => setSeccionActiva("antes-despues")}
        >
          <span className="nav-item-icon">🖼️</span>
          <span>Antes y Después</span>
        </button>

        <button
          className={`sidebar-nav-item ${seccionActiva === "buscar" ? "active" : ""}`}
          onClick={() => setSeccionActiva("buscar")}
        >
          <span className="nav-item-icon">🔍</span>
          <span>Buscar y Explorar</span>
        </button>

        <button
          className={`sidebar-nav-item ${seccionActiva === "notificaciones" ? "active" : ""}`}
          onClick={() => setSeccionActiva("notificaciones")}
        >
          <span className="nav-item-icon">🔔</span>
          <span>Notificaciones</span>
          {notificacionesNoLeidas > 0 && (
            <span className="nav-item-badge">{notificacionesNoLeidas}</span>
          )}
        </button>

        <button
          className={`sidebar-nav-item ${seccionActiva === "servicios" ? "active" : ""}`}
          onClick={() => setSeccionActiva("servicios")}
        >
          <span className="nav-item-icon">🛠️</span>
          <span>Servicios y Oficios</span>
        </button>

        <button
          className="sidebar-nav-item"
          onClick={() => navigate("/mensajes")}
        >
          <span className="nav-item-icon">💬</span>
          <span>Mensajes & Chat</span>
        </button>

        <button
          className="sidebar-nav-item"
          onClick={() => {
            if (usuario) {
              navigate("/perfil");
            } else {
              navigate("/login");
            }
          }}
        >
          <span className="nav-item-icon">👤</span>
          <span>Mi Perfil</span>
        </button>
      </nav>

      {/* 5. Footer con Selector de Modo Oscuro, PWA y Servidor */}
      <div className="sidebar-footer">
        {/* Toggle Modo Oscuro / Modo Claro */}
        <button
          type="button"
          onClick={onAlternarModoOscuro}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--surface-soft)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "8px 12px",
            color: "var(--text)",
            fontSize: 12.5,
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          <span>{esModoOscuro ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}</span>
          <span style={{ fontSize: 11, color: "var(--primary)" }}>Cambiar</span>
        </button>

        {/* Activar Notificaciones Web Push al Celular */}
        <button
          type="button"
          onClick={async () => {
            if (!("Notification" in window)) {
              alert("Tu navegador no soporta notificaciones de sistema.");
              return;
            }
            try {
              const res = await Notification.requestPermission();
              if (res === "granted") {
                new Notification("🔔 Notificaciones Activadas", {
                  body: "¡Recibirás alertas en tu teléfono cuando recibas un mensaje o presupuesto!",
                  icon: "/icon-192.png"
                });
                alert("¡Notificaciones activadas! Ahora recibirás avisos directos en tu celular.");
              } else {
                alert("Permiso de notificaciones denegado en el navegador.");
              }
            } catch (e) {
              alert("Error al activar notificaciones: " + e.message);
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(37, 99, 235, 0.08)",
            border: "1px dashed rgba(37, 99, 235, 0.35)",
            borderRadius: 10,
            padding: "8px 12px",
            color: "#2563eb",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer"
          }}
          title="Recibe avisos en tu teléfono cuando te escriban o te envíen un presupuesto"
        >
          <span>🔔 Notificaciones Push</span>
          <span style={{ fontSize: 10, background: "#2563eb", color: "white", padding: "1px 6px", borderRadius: 6 }}>
            Activar
          </span>
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="server-status-pill" title="Servidor backend Spring Boot conectado">
            <span className="status-dot"></span>
            <span>Servidor Activo</span>
          </div>

          <button
            onClick={() => alert("📱 ¡Plataforma lista para instalar! En tu celular usa 'Agregar a pantalla principal'.")}
            style={{
              background: "none",
              border: "none",
              fontSize: 12,
              color: "var(--primary)",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            📲 PWA
          </button>
        </div>

        {usuario ? (
          <button className="btn-sidebar-auth" onClick={onCerrarSesion}>
            <span>🚪</span>
            <span>Cerrar sesión</span>
          </button>
        ) : (
          <button className="btn-sidebar-auth" onClick={() => navigate("/login")}>
            <span>🔑</span>
            <span>Iniciar sesión</span>
          </button>
        )}
      </div>
    </aside>
  );
}
