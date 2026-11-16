import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

import { marcarInteres, obtenerComentarios, crearComentario } from "./conexionPersonas";
import Sidebar from "./components/Sidebar";
import PublicacionCard from "./components/PublicacionCard";
import CrearPublicacionModal from "./components/CrearPublicacionModal";
import PresupuestoModal from "./components/PresupuestoModal";
import TrabajosKanbanView from "./components/TrabajosKanbanView";
import MapaCercaniaView from "./components/MapaCercaniaView";
import AntesDespuesView from "./components/AntesDespuesView";
import BuscarView from "./components/BuscarView";
import NotificacionesView from "./components/NotificacionesView";
import ToastNotification from "./components/ToastNotification";
import Perfil from "./pages/Perfil";
import Mensajes from "./pages/Mensajes";

import "./styles/global.css";
import "./styles/variables.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/dashboard.css";

const API = "/api";

const categorias = [
  { icon: "⚡", nombre: "Electricidad", descripcion: "Instalaciones, cableado y reparaciones eléctricas" },
  { icon: "🔧", nombre: "Plomería", descripcion: "Agua, cañerías, grifería y sanitarios" },
  { icon: "🧱", nombre: "Albañilería", descripcion: "Obras, revoques, pisos y construcción" },
  { icon: "🎨", nombre: "Pintura", descripcion: "Pintura de interiores, fachadas y empapelados" },
  { icon: "🧹", nombre: "Limpieza", descripcion: "Limpieza profunda para hogares y oficinas" },
  { icon: "🌳", nombre: "Jardinería", descripcion: "Mantenimiento de jardines, poda y césped" },
  { icon: "🚪", nombre: "Carpintería", descripcion: "Muebles a medida, puertas y arreglos en madera" },
  { icon: "🔨", nombre: "Reparaciones", descripcion: "Arreglos generales del hogar y mantenimiento" }
];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/mensajes" element={<Mensajes />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

/* ============================================================
   BOTÓN VOLVER
============================================================ */
function BotonVolver() {
  const navigate = useNavigate();
  return (
    <button
      className="back-button"
      onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
    >
      ← Volver
    </button>
  );
}

/* ============================================================
   DASHBOARD PRINCIPAL COMPLETO CON TODAS LAS NOVEDADES
============================================================ */
function Dashboard() {
  const navigate = useNavigate();

  // Sección activa: "inicio", "publicaciones", "trabajos", "mapa", "antes-despues", "buscar", "notificaciones", "servicios"
  const [seccionActiva, setSeccionActiva] = useState("inicio");
  const [modalPublicarAbierto, setModalPublicarAbierto] = useState(false);
  const [modalPresupuestoAbierto, setModalPresupuestoAbierto] = useState(false);

  // Modo Oscuro / Claro
  const [esModoOscuro, setEsModoOscuro] = useState(() => {
    return localStorage.getItem("modoOscuro") === "true";
  });

  // Filtro de Urgencias 24hs
  const [filtroSoloUrgencias, setFiltroSoloUrgencias] = useState(false);

  // Estados de usuario
  const [usuario, setUsuario] = useState(null);
  const identidadUsuario = usuario?.nombre || usuario?.email || usuario?.username;

  // Estados de publicaciones
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");

  // Interacciones (Me gusta y comentarios)
  const [cantidadesInteres, setCantidadesInteres] = useState({});
  const [comentariosPorPublicacion, setComentariosPorPublicacion] = useState({});
  const [comentariosAbiertos, setComentariosAbiertos] = useState({});
  const [comentarioNuevo, setComentarioNuevo] = useState({});
  const [procesandoInteres, setProcesandoInteres] = useState({});
  const [procesandoComentario, setProcesandoComentario] = useState({});

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", esModoOscuro ? "dark" : "light");
    localStorage.setItem("modoOscuro", String(esModoOscuro));
  }, [esModoOscuro]);

  const alternarModoOscuro = () => {
    setEsModoOscuro(prev => !prev);
  };

  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) {
      try {
        setUsuario(JSON.parse(guardado));
      } catch {
        localStorage.removeItem("usuario");
      }
    }
    cargarPublicaciones();
  }, []);

  async function cargarPublicaciones() {
    try {
      setCargando(true);
      setError("");
      const respuesta = await fetch(`${API}/publicaciones`);
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status} al cargar publicaciones`);
      }
      const data = await respuesta.json();
      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];
      setPublicaciones(lista);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las publicaciones del servidor.");
    } finally {
      setCargando(false);
    }
  }

  const manejarMeGusta = async (publicacion) => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    const id = publicacion.id;
    if (procesandoInteres[id]) return;
    setProcesandoInteres(prev => ({ ...prev, [id]: true }));

    try {
      await marcarInteres(id, identidadUsuario || "Usuario");
      setCantidadesInteres(prev => ({
        ...prev,
        [id]: (prev[id] ?? Number(publicacion.interesados || 0)) + 1
      }));
    } catch (e) {
      const msg = String(e?.message || "");
      if (/ya marc|duplicad|409/i.test(msg)) {
        alert("Ya indicaste que te interesa esta publicación.");
      } else {
        alert("No se pudo registrar el interés: " + msg);
      }
    } finally {
      setProcesandoInteres(prev => ({ ...prev, [id]: false }));
    }
  };

  const alternarComentarios = async (publicacion) => {
    const id = publicacion.id;
    const abrir = !comentariosAbiertos[id];
    setComentariosAbiertos(prev => ({ ...prev, [id]: abrir }));

    if (abrir && !Array.isArray(comentariosPorPublicacion[id])) {
      try {
        const resultado = await obtenerComentarios(id);
        setComentariosPorPublicacion(prev => ({
          ...prev,
          [id]: Array.isArray(resultado) ? resultado : []
        }));
      } catch (e) {
        setComentariosPorPublicacion(prev => ({ ...prev, [id]: [] }));
      }
    }
  };

  const enviarComentario = async (publicacion) => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    const id = publicacion.id;
    const contenido = (comentarioNuevo[id] || "").trim();
    if (!contenido) return;

    if (procesandoComentario[id]) return;
    setProcesandoComentario(prev => ({ ...prev, [id]: true }));

    try {
      const nuevo = await crearComentario(id, identidadUsuario || "Usuario", contenido);
      setComentariosPorPublicacion(prev => ({
        ...prev,
        [id]: [...(Array.isArray(prev[id]) ? prev[id] : []), nuevo]
      }));
      setComentarioNuevo(prev => ({ ...prev, [id]: "" }));
    } catch (e) {
      alert("Error al enviar el comentario: " + (e?.message || ""));
    } finally {
      setProcesandoComentario(prev => ({ ...prev, [id]: false }));
    }
  };

  const seleccionarCategoria = (nombre) => {
    setCategoriaActiva(nombre);
    if (seccionActiva === "inicio") {
      document.getElementById("publicaciones")?.scrollIntoView({ behavior: "smooth" });
    } else {
      setSeccionActiva("publicaciones");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    window.location.reload();
  };

  const publicacionesFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    return publicaciones.filter(p => {
      const contenido = (p.contenido || "").toLowerCase();
      const autor = (p.autor || "").toLowerCase();
      const tipo = (p.tipo || "").toLowerCase();
      const ubicacion = (p.ubicacion || "").toLowerCase();

      const coincideTexto =
        !texto ||
        contenido.includes(texto) ||
        autor.includes(texto) ||
        tipo.includes(texto) ||
        ubicacion.includes(texto);

      const coincideCategoria =
        categoriaActiva === "Todos" ||
        tipo.includes(categoriaActiva.toLowerCase());

      const coincideUrgencia = !filtroSoloUrgencias || tipo.includes("urgencia") || tipo.includes("guardia") || (p.tags || []).some(t => /urgencia|guardia|24hs/i.test(t));

      return coincideTexto && coincideCategoria && coincideUrgencia;
    });
  }, [publicaciones, busqueda, categoriaActiva, filtroSoloUrgencias]);

  return (
    <div className="dashboard-container">
      {/* FONDO ORIGINAL RESTAURADO */}
      <div className="site-background"></div>

      {/* 1. BARRA LATERAL (SIDEBAR) */}
      <Sidebar
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
        abrirModalPublicar={() => setModalPublicarAbierto(true)}
        abrirModalPresupuesto={() => setModalPresupuestoAbierto(true)}
        usuario={usuario}
        onCerrarSesion={cerrarSesion}
        notificacionesNoLeidas={3}
        esModoOscuro={esModoOscuro}
        onAlternarModoOscuro={alternarModoOscuro}
      />

      {/* 2. ÁREA DE CONTENIDO */}
      <div className="dashboard-main">
        {/* Topbar Superior */}
        <header className="dashboard-topbar">
          <div className="topbar-title">
            <h1>
              {seccionActiva === "inicio" && "🏠 Pantalla Principal"}
              {seccionActiva === "publicaciones" && "📰 Muro de Publicaciones"}
              {seccionActiva === "trabajos" && "📋 Mis Trabajos (Kanban)"}
              {seccionActiva === "mapa" && "📍 Mapa de Especialistas Cercanos"}
              {seccionActiva === "antes-despues" && "🖼️ Portafolio Antes y Después"}
              {seccionActiva === "buscar" && "🔍 Explorar y Buscar Servicios"}
              {seccionActiva === "notificaciones" && "🔔 Centro de Notificaciones"}
              {seccionActiva === "servicios" && "🛠️ Especialidades y Oficios"}
            </h1>
          </div>

          <div className="topbar-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="¿Qué servicio buscas? Ej: plomería, electricista..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                if (seccionActiva !== "inicio" && seccionActiva !== "publicaciones" && seccionActiva !== "buscar") {
                  setSeccionActiva("buscar");
                }
              }}
            />
          </div>

          <div className="topbar-actions">
            {/* Toggle Rápido de Urgencias */}
            <button
              onClick={() => {
                setFiltroSoloUrgencias(!filtroSoloUrgencias);
                if (seccionActiva !== "publicaciones" && seccionActiva !== "inicio") {
                  setSeccionActiva("publicaciones");
                }
              }}
              style={{
                background: filtroSoloUrgencias ? "#dc2626" : "var(--surface-soft)",
                color: filtroSoloUrgencias ? "white" : "#b91c1c",
                border: "1px solid #ef4444",
                padding: "8px 14px",
                borderRadius: 20,
                fontSize: 12.5,
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <span>🚨</span>
              <span>Guardia 24hs</span>
            </button>

            <button
              className="btn-crear-publicacion"
              style={{ padding: "8px 16px", fontSize: 13 }}
              onClick={() => setModalPublicarAbierto(true)}
            >
              + Publicar
            </button>

            {usuario ? (
              <button
                className="avatar-button"
                onClick={() => navigate("/perfil")}
                title={`Perfil de ${usuario.nombre}`}
              >
                {(usuario.nombre || "U").charAt(0).toUpperCase()}
              </button>
            ) : (
              <button
                className="btn-modal-submit"
                style={{ padding: "8px 16px", fontSize: 13 }}
                onClick={() => navigate("/login")}
              >
                Ingresar
              </button>
            )}
          </div>
        </header>

        {/* ========================================================
            SECCIÓN A: PANTALLA PRINCIPAL COMPLETA
        ======================================================== */}
        {seccionActiva === "inicio" && (
          <div className="dashboard-body" style={{ maxWidth: 1200 }}>
            {/* HERO SECTION */}
            <section id="inicio" className="hero" style={{ paddingTop: 24 }}>
              <div className="hero-content">
                <div className="hero-badge">
                  <span>✦</span>
                  Conectamos personas con profesionales matriculados
                </div>

                <h1>
                  Tu próximo trabajo o profesional,
                  <span> a un solo lugar.</span>
                </h1>

                <p>
                  Encontrá oportunidades laborales, mostrá tu experiencia, contratá especialistas verificados con presupuesto formal o pedí guardia 24hs.
                </p>

                <div className="home-intent-actions">
                  <button
                    type="button"
                    className="intent-card intent-card-primary"
                    onClick={() => {
                      setBusqueda("");
                      setCategoriaActiva("Todos");
                      document.getElementById("publicaciones")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span className="intent-icon">↗</span>
                    <span className="intent-copy">
                      <strong>Buscar trabajo</strong>
                      <small>Explorá oportunidades y publicaciones</small>
                    </span>
                    <span className="intent-arrow">→</span>
                  </button>

                  <button
                    type="button"
                    className="intent-card"
                    onClick={() => setSeccionActiva("mapa")}
                  >
                    <span className="intent-icon">📍</span>
                    <span className="intent-copy">
                      <strong>Mapa de Cercanía</strong>
                      <small>Ver profesionales cerca de mí</small>
                    </span>
                    <span className="intent-arrow">→</span>
                  </button>
                </div>

                <div className="hero-search">
                  <span>🔍</span>
                  <input
                    type="text"
                    placeholder="¿Qué servicio estás buscando?"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <button
                    onClick={() =>
                      document.getElementById("publicaciones")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Buscar
                  </button>
                </div>

                <div className="popular">
                  <span>Popular:</span>
                  {["Electricidad", "Plomería", "Pintura", "Limpieza"].map((item) => (
                    <button key={item} onClick={() => seleccionarCategoria(item)}>
                      {item}
                    </button>
                  ))}
                  <button
                    onClick={() => setFiltroSoloUrgencias(true)}
                    style={{ background: "#fee2e2", color: "#b91c1c", borderColor: "#f87171" }}
                  >
                    🚨 Guardia 24hs
                  </button>
                </div>
              </div>

              {/* HERO VISUAL CARD */}
              <div className="hero-visual">
                <div className="hero-card main-card">
                  <div className="hero-card-top">
                    <span className="online-dot"></span>
                    Profesional disponible ahora
                  </div>
                  <div className="professional-avatar">👨‍🔧</div>
                  <h3>Profesional verificado</h3>
                  <p>Electricidad · Reparaciones</p>
                  <div className="rating">
                    ★★★★★ <span>4.9</span>
                  </div>
                  <div className="hero-card-location">
                    📍 Cerca de tu ubicación (Cruz del Eje)
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 6, justifyContent: "center" }}>
                    <span style={{ fontSize: 11, background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: 8, fontWeight: 700 }}>
                      ✔ Matrícula Verificada
                    </span>
                    <span style={{ fontSize: 11, background: "#fee2e2", color: "#b91c1c", padding: "2px 8px", borderRadius: 8, fontWeight: 700 }}>
                      🚨 Guardia 24hs
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* STATS SECTION */}
            <section className="stats">
              <div>
                <strong>+2.500</strong>
                <span>Profesionales</span>
              </div>
              <div>
                <strong>+1.200</strong>
                <span>Servicios publicados</span>
              </div>
              <div>
                <strong>4.8 ★</strong>
                <span>Valoración verificada</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Conectados localmente</span>
              </div>
            </section>

            {/* ACCESOS DIRECTOS A LAS NUEVAS CAPACIDADES */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, margin: "24px 0" }}>
              <div
                onClick={() => setSeccionActiva("trabajos")}
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "18px 20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div style={{ fontSize: 28 }}>📋</div>
                <div>
                  <strong style={{ display: "block", fontSize: 15, color: "var(--text)" }}>Mis Trabajos (Kanban)</strong>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Seguimiento de pedidos y estados</span>
                </div>
              </div>

              <div
                onClick={() => setSeccionActiva("mapa")}
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "18px 20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div style={{ fontSize: 28 }}>📍</div>
                <div>
                  <strong style={{ display: "block", fontSize: 15, color: "var(--text)" }}>Mapa de Cercanía</strong>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Ver especialistas a &lt; 5 km</span>
                </div>
              </div>

              <div
                onClick={() => setSeccionActiva("antes-despues")}
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "18px 20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div style={{ fontSize: 28 }}>🖼️</div>
                <div>
                  <strong style={{ display: "block", fontSize: 15, color: "var(--text)" }}>Galería Antes y Después</strong>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Evidencia real de transformaciones</span>
                </div>
              </div>

              <div
                onClick={() => setModalPresupuestoAbierto(true)}
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "18px 20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div style={{ fontSize: 28 }}>📄</div>
                <div>
                  <strong style={{ display: "block", fontSize: 15, color: "var(--text)" }}>Presupuestos Digitales</strong>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Generar cotización formal en PDF</span>
                </div>
              </div>
            </div>

            {/* CATEGORIAS DESTACADAS */}
            <section id="servicios" className="section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">EXPLORÁ</span>
                  <h2>Encontrá el servicio que necesitás</h2>
                  <p>Elegí una categoría y descubrí profesionales especializados.</p>
                </div>
              </div>

              <div className="category-grid">
                <button
                  className={`category-card ${categoriaActiva === "Todos" ? "active" : ""}`}
                  onClick={() => seleccionarCategoria("Todos")}
                >
                  <div className="category-icon">✨</div>
                  <strong>Todos</strong>
                  <span>Ver todos los servicios</span>
                </button>

                {categorias.map((cat) => (
                  <button
                    className={`category-card ${categoriaActiva === cat.nombre ? "active" : ""}`}
                    key={cat.nombre}
                    onClick={() => seleccionarCategoria(cat.nombre)}
                  >
                    <div className="category-icon">{cat.icon}</div>
                    <strong>{cat.nombre}</strong>
                    <span>{cat.descripcion}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* SECCIÓN DE PUBLICACIONES */}
            <section id="publicaciones" className="section publications-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">COMUNIDAD</span>
                  <h2>Publicaciones recientes</h2>
                  <p>Personas que buscan ayuda y profesionales que ofrecen sus servicios.</p>
                </div>
              </div>

              {/* Caja rápida para crear publicación */}
              <div className="quick-post-card">
                <div className="quick-post-input-box">
                  <div className="quick-post-avatar">
                    {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : "✍️"}
                  </div>
                  <button
                    className="quick-post-trigger"
                    onClick={() => setModalPublicarAbierto(true)}
                  >
                    ¿Qué trabajo necesitas u ofreces hoy? Haz clic aquí para publicar...
                  </button>
                </div>
                <div className="quick-post-actions">
                  <button
                    type="button"
                    className="quick-action-btn"
                    onClick={() => setModalPublicarAbierto(true)}
                  >
                    🛠️ Ofrecer servicio
                  </button>
                  <button
                    type="button"
                    className="quick-action-btn"
                    onClick={() => setModalPublicarAbierto(true)}
                  >
                    🙋 Contratar especialista
                  </button>
                  <button
                    type="button"
                    className="quick-action-btn"
                    onClick={() => setModalPresupuestoAbierto(true)}
                  >
                    📄 Enviar presupuesto
                  </button>
                </div>
              </div>

              {/* Barra de Filtros con Urgencia */}
              <div className="feed-filter-bar">
                <button
                  type="button"
                  className={`feed-filter-chip ${categoriaActiva === "Todos" && !filtroSoloUrgencias ? "active" : ""}`}
                  onClick={() => { setCategoriaActiva("Todos"); setFiltroSoloUrgencias(false); }}
                >
                  Todas ({publicaciones.length})
                </button>

                <button
                  type="button"
                  className={`feed-filter-chip ${filtroSoloUrgencias ? "active" : ""}`}
                  style={filtroSoloUrgencias ? { background: "#dc2626", borderColor: "#dc2626" } : { color: "#b91c1c", borderColor: "#fca5a5" }}
                  onClick={() => setFiltroSoloUrgencias(!filtroSoloUrgencias)}
                >
                  🚨 Solo Guardia 24hs
                </button>

                {categorias.map(cat => (
                  <button
                    key={cat.nombre}
                    type="button"
                    className={`feed-filter-chip ${categoriaActiva === cat.nombre && !filtroSoloUrgencias ? "active" : ""}`}
                    onClick={() => { setCategoriaActiva(cat.nombre); setFiltroSoloUrgencias(false); }}
                  >
                    {cat.icon} {cat.nombre}
                  </button>
                ))}
              </div>

              {/* Listado de Publicaciones */}
              {cargando ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                  <p>Cargando publicaciones desde el servidor...</p>
                </div>
              ) : error ? (
                <div style={{ background: "#fee2e2", color: "#b91c1c", padding: 16, borderRadius: 12 }}>
                  {error}
                </div>
              ) : publicacionesFiltradas.length === 0 ? (
                <div style={{ background: "var(--surface-card)", padding: 40, borderRadius: 16, textAlign: "center", border: "1px solid var(--border)" }}>
                  <p style={{ fontSize: 16, color: "var(--text-muted)", margin: 0 }}>
                    No hay publicaciones para el filtro seleccionado.
                  </p>
                  <button
                    className="btn-crear-publicacion"
                    style={{ margin: "16px auto 0", width: "fit-content" }}
                    onClick={() => setModalPublicarAbierto(true)}
                  >
                    + Realizar la primera publicación
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {publicacionesFiltradas.map((publicacion) => (
                    <PublicacionCard
                      key={publicacion.id}
                      publicacion={publicacion}
                      usuario={usuario}
                      identidadUsuario={identidadUsuario}
                      procesandoInteres={procesandoInteres}
                      cantidadesInteres={cantidadesInteres}
                      manejarMeGusta={manejarMeGusta}
                      comentariosAbiertos={comentariosAbiertos}
                      alternarComentarios={alternarComentarios}
                      comentariosPorPublicacion={comentariosPorPublicacion}
                      comentarioNuevo={comentarioNuevo}
                      setComentarioNuevo={setComentarioNuevo}
                      procesandoComentario={procesandoComentario}
                      enviarComentario={enviarComentario}
                      alPedirPresupuesto={() => setModalPresupuestoAbierto(true)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* SECCIÓN CÓMO FUNCIONA */}
            <section id="como-funciona" className="how-section" style={{ marginTop: 40 }}>
              <div className="section-heading centered">
                <span className="eyebrow">SIMPLE Y RÁPIDO</span>
                <h2>¿Cómo funciona?</h2>
                <p>Encontrá ayuda o conseguí nuevos clientes en pocos pasos.</p>
              </div>

              <div className="steps">
                <div className="step">
                  <div className="step-number">01</div>
                  <div className="step-icon">🔍</div>
                  <h3>Buscá o Geolocalizá</h3>
                  <p>Encontrá el servicio que necesitás en el mapa o publicá tu requerimiento.</p>
                </div>

                <div className="step">
                  <div className="step-number">02</div>
                  <div className="step-icon">📄</div>
                  <h3>Cotizá con Presupuesto</h3>
                  <p>Recibí cotizaciones formales con desglose de mano de obra y materiales.</p>
                </div>

                <div className="step">
                  <div className="step-number">03</div>
                  <div className="step-icon">📋</div>
                  <h3>Seguimiento Kanban</h3>
                  <p>Gestioná los estados del trabajo hasta su entrega final.</p>
                </div>

                <div className="step">
                  <div className="step-number">04</div>
                  <div className="step-icon">⭐</div>
                  <h3>Calificación Verificada</h3>
                  <p>Calificá con estrellas para consolidar la reputación del profesional.</p>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer style={{ marginTop: 60, padding: "30px 0", borderTop: "1px solid var(--border-subtle)", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              <p>Plataforma de Servicios y Oficios © 2026 · Red Comunitaria con Presupuestos Formales y Geocercanía.</p>
            </footer>
          </div>
        )}

        {/* ========================================================
            SECCIÓN B: VER PUBLICACIONES (FEED ENFOCADO)
        ======================================================== */}
        {seccionActiva === "publicaciones" && (
          <div className="dashboard-body">
            {/* Barra de Filtros con Urgencia */}
            <div className="feed-filter-bar">
              <button
                type="button"
                className={`feed-filter-chip ${categoriaActiva === "Todos" && !filtroSoloUrgencias ? "active" : ""}`}
                onClick={() => { setCategoriaActiva("Todos"); setFiltroSoloUrgencias(false); }}
              >
                Todas ({publicaciones.length})
              </button>

              <button
                type="button"
                className={`feed-filter-chip ${filtroSoloUrgencias ? "active" : ""}`}
                style={filtroSoloUrgencias ? { background: "#dc2626", borderColor: "#dc2626" } : { color: "#b91c1c", borderColor: "#fca5a5" }}
                onClick={() => setFiltroSoloUrgencias(!filtroSoloUrgencias)}
              >
                🚨 Solo Guardia 24hs
              </button>

              {categorias.map(cat => (
                <button
                  key={cat.nombre}
                  type="button"
                  className={`feed-filter-chip ${categoriaActiva === cat.nombre && !filtroSoloUrgencias ? "active" : ""}`}
                  onClick={() => { setCategoriaActiva(cat.nombre); setFiltroSoloUrgencias(false); }}
                >
                  {cat.icon} {cat.nombre}
                </button>
              ))}
            </div>

            {/* Lista */}
            {cargando ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                <p>Cargando publicaciones...</p>
              </div>
            ) : error ? (
              <div style={{ background: "#fee2e2", color: "#b91c1c", padding: 16, borderRadius: 12 }}>
                {error}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {publicacionesFiltradas.map((publicacion) => (
                  <PublicacionCard
                    key={publicacion.id}
                    publicacion={publicacion}
                    usuario={usuario}
                    identidadUsuario={identidadUsuario}
                    procesandoInteres={procesandoInteres}
                    cantidadesInteres={cantidadesInteres}
                    manejarMeGusta={manejarMeGusta}
                    comentariosAbiertos={comentariosAbiertos}
                    alternarComentarios={alternarComentarios}
                    comentariosPorPublicacion={comentariosPorPublicacion}
                    comentarioNuevo={comentarioNuevo}
                    setComentarioNuevo={setComentarioNuevo}
                    procesandoComentario={procesandoComentario}
                    enviarComentario={enviarComentario}
                    alPedirPresupuesto={() => setModalPresupuestoAbierto(true)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            SECCIÓN C: MIS TRABAJOS (KANBAN FLIGHT)
        ======================================================== */}
        {seccionActiva === "trabajos" && (
          <div className="dashboard-body">
            <TrabajosKanbanView
              usuario={usuario}
              alAbrirPresupuesto={() => setModalPresupuestoAbierto(true)}
            />
          </div>
        )}

        {/* ========================================================
            SECCIÓN D: MAPA DE CERCANÍA Y GEOLOCALIZACIÓN
        ======================================================== */}
        {seccionActiva === "mapa" && (
          <div className="dashboard-body">
            <MapaCercaniaView
              alAbrirPresupuesto={() => setModalPresupuestoAbierto(true)}
            />
          </div>
        )}

        {/* ========================================================
            SECCIÓN E: ANTES Y DESPUÉS (PORTAFOLIO)
        ======================================================== */}
        {seccionActiva === "antes-despues" && (
          <div className="dashboard-body">
            <AntesDespuesView />
          </div>
        )}

        {/* ========================================================
            SECCIÓN F: BUSCAR Y EXPLORAR
        ======================================================== */}
        {seccionActiva === "buscar" && (
          <div className="dashboard-body">
            <BuscarView
              publicaciones={publicaciones}
              categorias={categorias}
              abrirModalPublicar={() => setModalPublicarAbierto(true)}
            />
          </div>
        )}

        {/* ========================================================
            SECCIÓN G: NOTIFICACIONES
        ======================================================== */}
        {seccionActiva === "notificaciones" && (
          <div className="dashboard-body">
            <NotificacionesView />
          </div>
        )}

        {/* ========================================================
            SECCIÓN H: SERVICIOS Y OFICIOS
        ======================================================== */}
        {seccionActiva === "servicios" && (
          <div className="dashboard-body">
            <div style={{ background: "var(--surface-card)", padding: 28, borderRadius: 16, border: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
                Catálogo de Especialidades y Rubros
              </h2>
              <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: 14 }}>
                Selecciona una especialidad para filtrar directamente las publicaciones y profesionales de ese rubro.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                {categorias.map(cat => (
                  <div
                    key={cat.nombre}
                    onClick={() => {
                      setCategoriaActiva(cat.nombre);
                      setSeccionActiva("publicaciones");
                    }}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: 20,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      background: "var(--surface-soft)"
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 10 }}>{cat.icon}</div>
                    <strong style={{ fontSize: 16, display: "block", color: "var(--text)" }}>{cat.nombre}</strong>
                    <span style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4, display: "block" }}>{cat.descripcion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TOASTS NOTIFICACIONES PUSH FLOTANTES */}
      <ToastNotification onNavegarASeccion={setSeccionActiva} />

      {/* MODAL PARA REALIZAR PUBLICACIÓN */}
      <CrearPublicacionModal
        abierto={modalPublicarAbierto}
        alCerrar={() => setModalPublicarAbierto(false)}
        usuario={usuario}
        categorias={categorias}
        onPublicacionCreada={(nueva) => {
          setPublicaciones(prev => [nueva, ...prev]);
          setSeccionActiva("publicaciones");
        }}
      />

      {/* MODAL PARA GENERAR PRESUPUESTO FORMAL */}
      <PresupuestoModal
        abierto={modalPresupuestoAbierto}
        alCerrar={() => setModalPresupuestoAbierto(false)}
        usuario={usuario}
        alGuardarPresupuesto={(cotizacion) => {
          setSeccionActiva("trabajos");
        }}
      />
    </div>
  );
}

/* ============================================================
   VISTA DE LOGIN
============================================================ */
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function iniciarSesion(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Completa tu correo electrónico y contraseña.");
      return;
    }

    try {
      setCargando(true);
      const response = await fetch(`${API}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (response.status === 401) {
        setError("El correo o la contraseña son incorrectos.");
        return;
      }
      if (!response.ok) {
        throw new Error("Error al iniciar sesión");
      }

      const usuario = await response.json();
      localStorage.setItem("usuario", JSON.stringify(usuario));
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("No pudimos conectar con el servidor. Verifica que el backend esté activo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-background"></div>
      <div className="auth-top">
        <Link to="/" className="brand auth-brand">
          <div className="brand-logo">PS</div>
          <div>
            <strong>Plataforma</strong>
            <span>Servicios & Oficios</span>
          </div>
        </Link>
        <BotonVolver />
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-icon">🔑</div>
          <span className="eyebrow">BIENVENIDO/A</span>
          <h1>Iniciar sesión</h1>
          <p className="auth-description">
            Ingresa a tu cuenta para encontrar profesionales, publicar servicios y comunicarte con la comunidad.
          </p>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={iniciarSesion}>
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="btn-primary auth-submit" type="submit" disabled={cargando}>
              {cargando ? "Ingresando..." : "Iniciar sesión →"}
            </button>
          </form>

          <p className="auth-footer-text">
            ¿Todavía no tienes cuenta? <Link to="/registro">Crear cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   VISTA DE REGISTRO
============================================================ */
function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  async function registrar(e) {
    e.preventDefault();
    setError("");
    setExito("");

    if (!nombre || !email || !password) {
      setError("Completa todos los campos.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setCargando(true);
      const response = await fetch(`${API}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password })
      });

      if (response.status === 409) {
        setError("Ese correo electrónico ya está registrado.");
        return;
      }
      if (!response.ok) {
        throw new Error("No pudimos crear la cuenta.");
      }

      setExito("¡Cuenta creada correctamente! Redirigiendo al inicio de sesión...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.error(err);
      setError(err?.message || "No pudimos crear la cuenta.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-background"></div>
      <div className="auth-top">
        <Link to="/" className="brand auth-brand">
          <div className="brand-logo">PS</div>
          <div>
            <strong>Plataforma</strong>
            <span>Servicios & Oficios</span>
          </div>
        </Link>
        <BotonVolver />
      </div>

      <div className="auth-container">
        <div className="auth-card register-card">
          <div className="auth-icon">🛠️</div>
          <span className="eyebrow">SUMATE A LA COMUNIDAD</span>
          <h1>Crear cuenta</h1>
          <p className="auth-description">
            Regístrate para ofrecer tus servicios, buscar profesionales y conectar con clientes.
          </p>

          {error && <div className="auth-error">⚠️ {error}</div>}
          {exito && <div className="auth-success">✓ {exito}</div>}

          <form onSubmit={registrar}>
            <label>Nombre completo</label>
            <input
              type="text"
              placeholder="Ej: Iris Gladys"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="btn-primary auth-submit" type="submit" disabled={cargando}>
              {cargando ? "Creando cuenta..." : "Crear mi cuenta →"}
            </button>
          </form>

          <p className="auth-footer-text">
            ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
