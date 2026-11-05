import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API = "/api";

export default function Usuarios() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("TODOS");
  const [usuarioActual, setUsuarioActual] = useState(null);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem("usuario");
      if (guardado) setUsuarioActual(JSON.parse(guardado));
    } catch {
      localStorage.removeItem("usuario");
    }
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    setCargando(true);
    setError("");
    try {
      const respuesta = await fetch(`${API}/usuarios`);
      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }
      const data = await respuesta.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al cargar usuarios:", e);
      setError("No pudimos conectar con el servidor para obtener los usuarios.");
      setUsuarios([]);
    } finally {
      setCargando(false);
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuarioActual(null);
  };

  const usuariosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return usuarios.filter((u) => {
      const nombre = (u.nombre || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const rol = (u.rol || "ROL_CLIENTE").toUpperCase();

      const coincideTexto = !q || nombre.includes(q) || email.includes(q);
      const coincideRol = filtroRol === "TODOS" || rol === filtroRol;

      return coincideTexto && coincideRol;
    });
  }, [usuarios, busqueda, filtroRol]);

  return (
    <div className="app">
      <div className="site-background"></div>
      <Navbar usuario={usuarioActual} onCerrarSesion={cerrarSesion} />

      <main style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span className="eyebrow">ADMINISTRACIÓN & COMUNIDAD</span>
            <h1 style={{ margin: "6px 0", fontSize: "28px" }}>Directorio de Usuarios</h1>
            <p style={{ color: "var(--text-muted, #666)", margin: 0 }}>
              Consultá y gestioná las cuentas registradas en la plataforma ({usuarios.length} en total).
            </p>
          </div>

          <button className="btn-primary" onClick={cargarUsuarios} disabled={cargando}>
            {cargando ? "Actualizando..." : "↻ Refrescar datos"}
          </button>
        </div>

        {/* BARRA DE FILTROS */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            marginBottom: "24px",
            flexWrap: "wrap",
            padding: "16px",
            background: "var(--card-bg, #fff)",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
          }}
        >
          <div style={{ flex: "1 1 280px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🔎</span>
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border-color, #ccc)"
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Filtrar por rol:</span>
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border-color, #ccc)",
                backgroundColor: "inherit"
              }}
            >
              <option value="TODOS">Todos los roles</option>
              <option value="ROL_CLIENTE">Clientes</option>
              <option value="ROL_PROFESIONAL">Profesionales</option>
              <option value="ROL_ADMIN">Administradores</option>
            </select>
          </div>
        </div>

        {/* ESTADO DE CARGA */}
        {cargando && (
          <div className="empty-state" style={{ padding: "60px 20px" }}>
            <div className="spinner"></div>
            <h3>Cargando lista de usuarios...</h3>
            <p>Conectando con la base de datos.</p>
          </div>
        )}

        {/* ESTADO DE ERROR */}
        {!cargando && error && (
          <div className="error-state" style={{ padding: "40px" }}>
            <div>⚠️</div>
            <h3>No pudimos cargar los usuarios</h3>
            <p>{error}</p>
            <button className="btn-primary" onClick={cargarUsuarios}>Reintentar</button>
          </div>
        )}

        {/* TABLA DE USUARIOS */}
        {!cargando && !error && (
          <div style={{ overflowX: "auto", background: "var(--card-bg, #fff)", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-color, #eee)", background: "rgba(0,0,0,0.02)" }}>
                  <th style={{ padding: "14px 18px", fontSize: "13px", color: "var(--text-muted, #777)" }}>ID</th>
                  <th style={{ padding: "14px 18px", fontSize: "13px", color: "var(--text-muted, #777)" }}>USUARIO</th>
                  <th style={{ padding: "14px 18px", fontSize: "13px", color: "var(--text-muted, #777)" }}>CORREO ELECTRÓNICO</th>
                  <th style={{ padding: "14px 18px", fontSize: "13px", color: "var(--text-muted, #777)" }}>ROL</th>
                  <th style={{ padding: "14px 18px", fontSize: "13px", color: "var(--text-muted, #777)" }}>REGISTRO</th>
                  <th style={{ padding: "14px 18px", fontSize: "13px", color: "var(--text-muted, #777)", textAlign: "center" }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                      No se encontraron usuarios coincidentes con tu búsqueda.
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((u) => {
                    const inicial = (u.nombre || "U").charAt(0).toUpperCase();
                    const rolNombre = (u.rol || "ROL_CLIENTE").replace("ROL_", "");
                    const esProfesional = rolNombre === "PROFESIONAL";
                    const esAdmin = rolNombre === "ADMIN";

                    return (
                      <tr key={u.id} style={{ borderBottom: "1px solid var(--border-color, #eee)" }}>
                        <td style={{ padding: "14px 18px", fontWeight: "bold", color: "#888" }}>#{u.id}</td>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "50%",
                                background: esProfesional ? "var(--primary, #0284c7)" : esAdmin ? "#7c3aed" : "#64748b",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                fontSize: "14px"
                              }}
                            >
                              {inicial}
                            </div>
                            <strong style={{ fontSize: "14px" }}>{u.nombre}</strong>
                          </div>
                        </td>
                        <td style={{ padding: "14px 18px", color: "var(--text-muted, #555)" }}>{u.email}</td>
                        <td style={{ padding: "14px 18px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 10px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "600",
                              background: esProfesional ? "#e0f2fe" : esAdmin ? "#f3e8ff" : "#f1f5f9",
                              color: esProfesional ? "#0369a1" : esAdmin ? "#6b21a8" : "#475569"
                            }}
                          >
                            {rolNombre}
                          </span>
                        </td>
                        <td style={{ padding: "14px 18px", fontSize: "13px", color: "#777" }}>
                          {u.fechaRegistro || "Reciente"}
                        </td>
                        <td style={{ padding: "14px 18px", textAlign: "center" }}>
                          <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                            <button
                              type="button"
                              className="contact-button"
                              style={{ padding: "6px 12px", fontSize: "12px" }}
                              onClick={() => navigate(`/perfil/${u.id}`)}
                            >
                              Ver Perfil
                            </button>
                            <button
                              type="button"
                              className="contact-button"
                              style={{ padding: "6px 12px", fontSize: "12px" }}
                              onClick={() => navigate("/mensajes", { state: { receptor: u.nombre } })}
                            >
                              💬 Chat
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
