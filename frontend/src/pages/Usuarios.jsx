import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiFetch, responseMessage } from "../apiFetch";
import { useToast } from "../hooks/useToast";

const API = "/api";

export default function Usuarios() {
  const navigate = useNavigate();
  const toast = useToast();

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("TODOS");
  const [usuarioActual, setUsuarioActual] = useState(() => {
    try { return JSON.parse(localStorage.getItem("usuario") || "null"); }
    catch { localStorage.removeItem("usuario"); localStorage.removeItem("token"); return null; }
  });
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [tamanoPagina, setTamanoPagina] = useState(20);
  const [confirmarBaja, setConfirmarBaja] = useState(null);

  const cargarUsuarios = useCallback(async (page = pagina, q = busqueda, size = tamanoPagina) => {
    setCargando(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), size: String(size) });
      if (q.trim()) params.set("q", q.trim());
      const respuesta = await apiFetch(`${API}/usuarios?${params}`);
      if (!respuesta.ok) {
        throw new Error(await responseMessage(respuesta, `Error HTTP ${respuesta.status}`));
      }
      const data = await respuesta.json();
      setUsuarios(Array.isArray(data) ? data : data.content || []);
      setPagina(data.number ?? page);
      setTotalPaginas(data.totalPages ?? 1);
    } catch (e) {
      console.error("Error al cargar usuarios:", e);
      setError("No pudimos conectar con el servidor para obtener los usuarios.");
      setUsuarios([]);
    } finally {
      setCargando(false);
    }
  }, [pagina, busqueda, tamanoPagina]);

  useEffect(() => { const timer = setTimeout(() => cargarUsuarios(pagina, busqueda, tamanoPagina), 250); return () => clearTimeout(timer); }, [cargarUsuarios, pagina, busqueda, tamanoPagina]);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuarioActual(null);
  };

  async function eliminarUsuario() {
    const objetivo = confirmarBaja;
    if (!objetivo) return;
    try {
      const r = await apiFetch(`${API}/usuarios/${objetivo.id}`, { method: "DELETE" });
      if (!r.ok) throw new Error(await responseMessage(r));
      toast.success("La cuenta se eliminó correctamente.");
      setConfirmarBaja(null);
      if (String(objetivo.id) === String(usuarioActual?.id)) {
        localStorage.removeItem("usuario"); localStorage.removeItem("token"); navigate("/"); return;
      }
      await cargarUsuarios();
    } catch (e) { toast.error(e.message); }
  }

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
              Consultá las cuentas registradas y filtrá por nombre o correo.
            </p>
          </div>

          <button className="btn-primary" onClick={() => cargarUsuarios()} disabled={cargando}>
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
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>Filas
            <select value={tamanoPagina} onChange={e => { setPagina(0); setTamanoPagina(Number(e.target.value)); }}><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select>
          </label>
        </div>

        {/* ESTADO DE CARGA */}
        {cargando && (
          <div className="empty-state" style={{ padding: "60px 20px" }}>
            <div className="spinner"></div>
            <h3>Cargando lista de usuarios...</h3>
            <p>Conectando con la base de datos.</p>
          </div>
        )}

        {!cargando && !error && <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, margin: 20 }}>
          <button disabled={pagina <= 0} onClick={() => setPagina(p => Math.max(0, p - 1))}>Anterior</button>
          <span>Página {pagina + 1} de {Math.max(totalPaginas, 1)}</span>
          <button disabled={pagina + 1 >= totalPaginas} onClick={() => setPagina(p => p + 1)}>Siguiente</button>
        </div>}

        {/* ESTADO DE ERROR */}
        {!cargando && error && (
          <div className="error-state" style={{ padding: "40px" }}>
            <div>⚠️</div>
            <h3>No pudimos cargar los usuarios</h3>
            <p>{error}</p>
            <button className="btn-primary" onClick={() => cargarUsuarios()}>Reintentar</button>
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
                            {usuarioActual?.rol === "ROL_ADMIN" && <button type="button" className="btn-danger" onClick={() => setConfirmarBaja({ id: u.id, nombre: u.nombre })}>Eliminar</button>}
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

      {confirmarBaja && <div role="presentation" style={{ position: "fixed", inset: 0, background: "#0008", display: "grid", placeItems: "center", zIndex: 10000 }}>
        <section role="dialog" aria-modal="true" aria-labelledby="confirmar-eliminar-usuario" className="card" style={{ maxWidth: 440, margin: 20 }}>
          <h2 id="confirmar-eliminar-usuario">¿Eliminar a {confirmarBaja.nombre}?</h2>
          <p>Se borrará la cuenta y sus datos asociados.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button onClick={() => setConfirmarBaja(null)}>Cancelar</button><button className="btn-danger" onClick={eliminarUsuario}>Sí, eliminar</button></div>
        </section>
      </div>}

      <Footer />
    </div>
  );
}
