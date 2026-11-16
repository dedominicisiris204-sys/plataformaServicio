import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({
  seccionActiva,
  setSeccionActiva,
  abrirModalPublicar,
  abrirModalPresupuesto,
  usuario,
  onCerrarSesion,
  notificacionesNoLeidas = 3,
  esModoOscuro,
  onAlternarModoOscuro
}) {
  const navigate = useNavigate();

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

      {/* 2. Tarjeta de Usuario Rápida */}
      <div className="sidebar-user-card">
        <div className="sidebar-user-avatar">
          {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : "👤"}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">
            {usuario ? usuario.nombre : "Invitado"}
          </div>
          <div className="sidebar-user-role">
            {usuario ? (usuario.email || "Usuario activo") : "Iniciar sesión"}
          </div>
        </div>
      </div>

      {/* 3. Botones de Acción Destacados */}
      <div className="sidebar-cta-container" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          className="btn-crear-publicacion"
          onClick={abrirModalPublicar}
          title="Crear una nueva publicación o solicitud"
        >
          <span className="btn-icon">✍️</span>
          <span>Realizar Publicación</span>
        </button>

        <button
          onClick={abrirModalPresupuesto}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "9px 14px",
            background: "var(--surface-soft)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 700,
            cursor: "pointer"
          }}
          title="Generar cotización o presupuesto formal"
        >
          <span>📄</span>
          <span>Crear Presupuesto</span>
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
