import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "/api";

export default function Dashboard({ tema, toggleTema }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [pestañaActiva, setPestañaActiva] = useState("publicaciones");

  const [misPublicaciones, setMisPublicaciones] = useState([]);
  const [misSolicitudes, setMisSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensajeAccion, setMensajeAccion] = useState("");

  useEffect(() => {
    const sesion = localStorage.getItem("usuario");
    if (!sesion) {
      navigate("/login");
      return;
    }
    try {
      const u = JSON.parse(sesion);
      setUsuario(u);
      cargarDatosDashboard(u);
    } catch {
      localStorage.removeItem("usuario");
      navigate("/login");
    }
  }, [navigate]);

  async function cargarDatosDashboard(u) {
    setCargando(true);
    try {
      // 1. Cargar publicaciones del usuario
      const resPubs = await fetch(`${API}/publicaciones`);
      if (resPubs.ok) {
        const todas = await resPubs.json();
        const lista = Array.isArray(todas) ? todas : (todas.content || []);
        const nombreU = (u.nombre || u.email || "").toLowerCase();
        const filtradas = lista.filter(p => (p.autor || "").toLowerCase() === nombreU || p.creadorUsuarioId === u.id);
        setMisPublicaciones(filtradas);
      }

      // 2. Cargar solicitudes de presupuesto del usuario
      if (u.id) {
        const resSol = await fetch(`${API}/solicitudes/usuario/${u.id}`);
        if (resSol.ok) {
          const sols = await resSol.json();
          setMisSolicitudes(Array.isArray(sols) ? sols : []);
        }
      }
    } catch (e) {
      console.error("Error al cargar datos de dashboard:", e);
    } finally {
      setCargando(false);
    }
  }

  async function eliminarPublicacion(id) {
    if (!window.confirm("¿Seguro que querés eliminar esta publicación?")) return;
    try {
      const res = await fetch(`${API}/publicaciones/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMisPublicaciones(prev => prev.filter(p => p.id !== id));
        setMensajeAccion("Publicación eliminada correctamente.");
        setTimeout(() => setMensajeAccion(""), 3000);
      }
    } catch (e) {
      alert("No se pudo eliminar la publicación: " + e.message);
    }
  }

  async function cambiarEstadoSolicitud(id, nuevoEstado) {
    try {
      const res = await fetch(`${API}/solicitudes/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (res.ok) {
        setMisSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s));
        setMensajeAccion(`Solicitud marcada como ${nuevoEstado}.`);
        setTimeout(() => setMensajeAccion(""), 3000);
      }
    } catch (e) {
      alert("No se pudo actualizar la solicitud: " + e.message);
    }
  }

  return (
    <div className="app">
      {/* NAVBAR SUPERIOR */}
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand-logo-container">
            <div className="brand-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div className="brand-text-wrap">
              <span className="brand-title">ServiRed</span>
              <span className="brand-subtitle">Plataforma de Servicios</span>
            </div>
          </Link>

          <nav className="nav-links">
            <Link to="/">Inicio</Link>
            <Link to="/#publicaciones">Publicaciones</Link>
            <Link to="/mensajes">Mensajes</Link>
            <Link to="/perfil">Mi Perfil</Link>
          </nav>

          <div className="navbar-actions">
            {toggleTema && (
              <button type="button" className="theme-toggle-btn" onClick={toggleTema} title="Cambiar tema claro / oscuro">
                {tema === "dark" ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
              </button>
            )}
            <Link to="/" className="btn-secondary" style={{ padding: "8px 16px", fontSize: "14px" }}>
              ← Volver al Inicio
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL DASHBOARD */}
      <main className="dashboard-page">
        {/* CABECERA BIENVENIDA */}
        <div className="dashboard-header">
          <div className="dashboard-user-info">
            <h1>Panel de Control de {usuario?.nombre || "Usuario"} 👋</h1>
            <p>Gestioná tus servicios, solicitudes de presupuesto, publicaciones y estado de cuenta.</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "6px 14px", borderRadius: "999px", fontWeight: "700", fontSize: "13px" }}>
              Cuenta Activa
            </span>
            <Link to="/perfil" className="btn-primary" style={{ padding: "10px 18px", fontSize: "14px" }}>
              Editar Perfil
            </Link>
          </div>
        </div>

        {mensajeAccion && (
          <div style={{ background: "var(--success-light)", color: "var(--success)", border: "1px solid var(--success)", padding: "12px 18px", borderRadius: "10px", marginBottom: "24px", fontWeight: "600" }}>
            ✓ {mensajeAccion}
          </div>
        )}

        {/* MÉTRICAS CLAVE (KPIS) */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon-wrap">📢</div>
            <div className="kpi-data">
              <strong>{misPublicaciones.length}</strong>
              <span>Mis Publicaciones</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>📋</div>
            <div className="kpi-data">
              <strong>{misSolicitudes.length}</strong>
              <span>Presupuestos Solicitados</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>⭐</div>
            <div className="kpi-data">
              <strong>5.0</strong>
              <span>Reputación Promedio</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>💬</div>
            <div className="kpi-data">
              <strong>Activo</strong>
              <span>Chat de Mensajes</span>
            </div>
          </div>
        </div>

        {/* PESTAÑAS DE NAVEGACIÓN */}
        <div className="dashboard-nav-tabs">
          <button
            type="button"
            className={`dashboard-tab-btn ${pestañaActiva === "publicaciones" ? "active" : ""}`}
            onClick={() => setPestañaActiva("publicaciones")}
          >
            📢 Mis Publicaciones ({misPublicaciones.length})
          </button>
          <button
            type="button"
            className={`dashboard-tab-btn ${pestañaActiva === "solicitudes" ? "active" : ""}`}
            onClick={() => setPestañaActiva("solicitudes")}
          >
            📋 Mis Solicitudes de Presupuesto ({misSolicitudes.length})
          </button>
          <button
            type="button"
            className={`dashboard-tab-btn ${pestañaActiva === "accesos" ? "active" : ""}`}
            onClick={() => setPestañaActiva("accesos")}
          >
            ⚡ Accesos Rápidos
          </button>
        </div>

        {/* PESTAÑA: MIS PUBLICACIONES */}
        {pestañaActiva === "publicaciones" && (
          <div className="dashboard-card-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", margin: 0 }}>Publicaciones creadas por mí</h2>
              <Link to="/#publicaciones" className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                + Crear Nueva Publicación
              </Link>
            </div>

            {cargando ? (
              <p style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>Cargando tus publicaciones...</p>
            ) : misPublicaciones.length === 0 ? (
              <div className="empty-results-box">
                <span className="empty-results-icon">📢</span>
                <h3 className="empty-results-title">No tenés publicaciones activas</h3>
                <p className="empty-results-desc">Publicá los servicios que ofrecés o las necesidades que tengas para que la comunidad te contacte.</p>
                <Link to="/#publicaciones" className="btn-primary">
                  Crear mi primera publicación
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "18px" }}>
                {misPublicaciones.map(pub => (
                  <div key={pub.id} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", background: "var(--surface-soft)" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", background: "var(--primary-light)", color: "var(--primary)", padding: "3px 8px", borderRadius: "4px" }}>
                      {pub.tipo || "Servicio"}
                    </span>
                    <h3 style={{ fontSize: "16px", margin: "10px 0 6px", color: "var(--text)" }}>{pub.contenido}</h3>
                    {pub.ubicacion && <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 12px" }}>📍 {pub.ubicacion}</p>}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>❤️ {pub.interesados || 0} interesados</span>
                      <button
                        type="button"
                        onClick={() => eliminarPublicacion(pub.id)}
                        style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: SOLICITUDES DE PRESUPUESTO */}
        {pestañaActiva === "solicitudes" && (
          <div className="dashboard-card-panel">
            <h2 style={{ fontSize: "18px", marginBottom: "18px" }}>Historial de Solicitudes y Presupuestos</h2>
            {cargando ? (
              <p style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>Cargando solicitudes...</p>
            ) : misSolicitudes.length === 0 ? (
              <div className="empty-results-box">
                <span className="empty-results-icon">📋</span>
                <h3 className="empty-results-title">No tenés solicitudes de presupuesto</h3>
                <p className="empty-results-desc">Cuando solicites un presupuesto a un profesional o te envíen uno, aparecerá detallado aquí.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {misSolicitudes.map(sol => (
                  <div key={sol.id} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "18px", background: "var(--surface-soft)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <strong style={{ fontSize: "16px", color: "var(--text)" }}>{sol.titulo}</strong>
                      <span style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        background: sol.estado === "ACEPTADA" ? "#dcfce7" : sol.estado === "RECHAZADA" ? "#fee2e2" : "#fef9c3",
                        color: sol.estado === "ACEPTADA" ? "#166534" : sol.estado === "RECHAZADA" ? "#991b1b" : "#854d0e"
                      }}>
                        {sol.estado || "PENDIENTE"}
                      </span>
                    </div>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "4px 0 12px" }}>{sol.descripcion}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                      <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
                        {sol.categoria && <span>🔧 {sol.categoria}</span>}
                        {sol.ubicacion && <span>📍 {sol.ubicacion}</span>}
                        {sol.presupuesto && <span>💰 Estimado: ${sol.presupuesto}</span>}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {sol.estado === "PENDIENTE" && (
                          <>
                            <button
                              type="button"
                              onClick={() => cambiarEstadoSolicitud(sol.id, "ACEPTADA")}
                              style={{ background: "#dcfce7", color: "#166534", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}
                            >
                              ✓ Aceptar
                            </button>
                            <button
                              type="button"
                              onClick={() => cambiarEstadoSolicitud(sol.id, "RECHAZADA")}
                              style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}
                            >
                              ✕ Rechazar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: ACCESOS RÁPIDOS */}
        {pestañaActiva === "accesos" && (
          <div className="dashboard-card-panel">
            <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>Accesos Directos a la Plataforma</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <Link to="/perfil" style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", background: "var(--surface-soft)", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>👤</div>
                <strong style={{ display: "block", color: "var(--text)", marginBottom: "4px" }}>Editar Mi Perfil</strong>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Completá tu experiencia, oficios y fotos.</span>
              </Link>

              <Link to="/mensajes" style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", background: "var(--surface-soft)", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>💬</div>
                <strong style={{ display: "block", color: "var(--text)", marginBottom: "4px" }}>Bandeja de Mensajes</strong>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Conversá directamente con clientes y trabajadores.</span>
              </Link>

              <Link to="/#publicaciones" style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", background: "var(--surface-soft)", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
                <strong style={{ display: "block", color: "var(--text)", marginBottom: "4px" }}>Explorar Servicios</strong>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Buscá profesionales en tu zona.</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
