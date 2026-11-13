import React, { Component, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { marcarInteres, obtenerComentarios, crearComentario } from "./conexionPersonas";
import Perfil from "./pages/Perfil";
import Mensajes from "./pages/Mensajes";
import Dashboard from "./pages/Dashboard";

import "./styles/global.css";
import "./styles/variables.css";
import "./styles/layout.css";
import "./styles/components.css";

const API = "/api";

// Categorías oficiales con iconos limpios UTF-8
const categorias = [
  { icon: "⚡", nombre: "Electricidad", descripcion: "Instalaciones, tableros y reparaciones" },
  { icon: "🔧", nombre: "Plomería", descripcion: "Agua, cañerías, gas y sanitarios" },
  { icon: "🧱", nombre: "Albañilería", descripcion: "Obras, remodelaciones y construcción" },
  { icon: "🎨", nombre: "Pintura", descripcion: "Pintura interior, exterior y revestimientos" },
  { icon: "🧹", nombre: "Limpieza", descripcion: "Hogares, oficinas y finales de obra" },
  { icon: "🌳", nombre: "Jardinería", descripcion: "Parques, poda y mantenimiento verde" },
  { icon: "🪚", nombre: "Carpintería", descripcion: "Muebles a medida, aberturas y arreglos" },
  { icon: "🔨", nombre: "Reparaciones", descripcion: "Arreglos generales del hogar y cerrajería" }
];

// Imágenes curadas de alta calidad para que todas las publicaciones tengan foto profesional
const IMAGENES_CATEGORIAS = {
  "Electricidad": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
  "Plomería": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
  "Albañilería": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
  "Pintura": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
  "Limpieza": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
  "Jardinería": "https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=800&q=80",
  "Carpintería": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  "Reparaciones": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  "Default": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80"
};

function obtenerImagenPublicacion(pub) {
  if (pub.imagenBase64 && pub.imagenBase64.trim()) {
    return pub.imagenBase64;
  }
  const texto = `${pub.tipo || ""} ${pub.contenido || ""}`.toLowerCase();
  for (const cat of Object.keys(IMAGENES_CATEGORIAS)) {
    if (texto.includes(cat.toLowerCase())) {
      return IMAGENES_CATEGORIAS[cat];
    }
  }
  return IMAGENES_CATEGORIAS["Default"];
}

// Error Boundary para evitar pantallas en blanco ante errores de renderizado
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary detectó un error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "60px 20px", textAlign: "center", maxWidth: "600px", margin: "60px auto", background: "var(--surface, #fff)", border: "1px solid var(--border, #ddd)", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛠️</div>
          <h2 style={{ fontSize: "22px", color: "var(--text, #111)", marginBottom: "10px" }}>Ocurrió un detalle al actualizar la vista</h2>
          <p style={{ color: "var(--text-muted, #666)", marginBottom: "24px", fontSize: "15px" }}>La plataforma sigue funcionando perfectamente. Hacé clic abajo para refrescar la pantalla.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => { this.setState({ hasError: false }); window.location.href = "/"; }}
          >
            Refrescar y volver al Inicio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [tema, setTema] = useState(() => localStorage.getItem("tema_app") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem("tema_app", tema);
  }, [tema]);

  const toggleTema = () => {
    setTema(prev => prev === "dark" ? "light" : "dark");
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio tema={tema} toggleTema={toggleTema} />} />
          <Route path="/dashboard" element={<Dashboard tema={tema} toggleTema={toggleTema} />} />
          <Route path="/login" element={<Login tema={tema} toggleTema={toggleTema} />} />
          <Route path="/registro" element={<Registro tema={tema} toggleTema={toggleTema} />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/mensajes" element={<Mensajes />} />
          <Route path="*" element={<Inicio tema={tema} toggleTema={toggleTema} />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function BotonVolver() {
  const navigate = useNavigate();
  return (
    <button className="back-button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}>
      ← Volver
    </button>
  );
}

/* ============================================================
   PANTALLA DE INICIO PRINCIPAL
============================================================ */
function Inicio({ tema, toggleTema }) {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const identidadUsuario = usuario?.nombre || usuario?.email || usuario?.username || usuario?.nombreUsuario;

  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Estados para creación de publicaciones
  const [contenidoNuevo, setContenidoNuevo] = useState("");
  const [tipoNuevo, setTipoNuevo] = useState("Servicio ofrecido");
  const [ubicacionNueva, setUbicacionNueva] = useState("");
  const [archivoFoto, setArchivoFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState("");
  const [guardandoPublicacion, setGuardandoPublicacion] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");
  const [mensajeFormulario, setMensajeFormulario] = useState("");

  // Paginación (HU-16)
  const [paginaActual, setPaginaActual] = useState(0);
  const [hayMasPaginas, setHayMasPaginas] = useState(false);
  const [cargandoMas, setCargandoMas] = useState(false);

  // Interacciones (Intereses y comentarios)
  const [cantidadesInteres, setCantidadesInteres] = useState({});
  const [comentariosPorPublicacion, setComentariosPorPublicacion] = useState({});
  const [comentariosAbiertos, setComentariosAbiertos] = useState({});
  const [comentarioNuevo, setComentarioNuevo] = useState({});
  const [procesandoInteres, setProcesandoInteres] = useState({});
  const [procesandoComentario, setProcesandoComentario] = useState({});

  // Solicitud de Presupuesto (HU-15)
  const [modalSolicitudAbierto, setModalSolicitudAbierto] = useState(false);
  const [solicitudTitulo, setSolicitudTitulo] = useState("");
  const [solicitudCategoria, setSolicitudCategoria] = useState("Electricidad");
  const [solicitudUbicacion, setSolicitudUbicacion] = useState("");
  const [solicitudPresupuesto, setSolicitudPresupuesto] = useState("");
  const [solicitudDescripcion, setSolicitudDescripcion] = useState("");
  const [enviandoSolicitud, setEnviandoSolicitud] = useState(false);
  const [mensajeSolicitud, setMensajeSolicitud] = useState("");
  const [errorSolicitud, setErrorSolicitud] = useState("");

  const [modalMisSolicitudes, setModalMisSolicitudes] = useState(false);
  const [misSolicitudes, setMisSolicitudes] = useState([]);
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(false);

  useEffect(() => {
    const sesion = localStorage.getItem("usuario");
    if (sesion) {
      try {
        setUsuario(JSON.parse(sesion));
      } catch {
        localStorage.removeItem("usuario");
      }
    }
    cargarPublicaciones(true, 0);
  }, []);

  async function cargarPublicaciones(reiniciar = true, numPagina = 0) {
    try {
      if (reiniciar) {
        setCargando(true);
        setPaginaActual(0);
      } else {
        setCargandoMas(true);
      }
      setError("");

      const response = await fetch(`${API}/publicaciones?page=${numPagina}&size=9`);
      if (!response.ok) {
        throw new Error("No se pudieron cargar las publicaciones");
      }
      const data = await response.json();

      if (data && Array.isArray(data.content)) {
        setPublicaciones(prev => reiniciar ? data.content : [...prev, ...data.content]);
        setHayMasPaginas(!data.last);
      } else if (Array.isArray(data)) {
        setPublicaciones(data);
        setHayMasPaginas(false);
      } else {
        setPublicaciones([]);
        setHayMasPaginas(false);
      }
    } catch (e) {
      console.error(e);
      setError("No pudimos conectar con el servidor de publicaciones.");
      if (reiniciar) setPublicaciones([]);
    } finally {
      setCargando(false);
      setCargandoMas(false);
    }
  }

  async function cargarMasPublicaciones() {
    const siguiente = paginaActual + 1;
    setPaginaActual(siguiente);
    await cargarPublicaciones(false, siguiente);
  }

  async function crearPublicacionNueva() {
    const contenido = contenidoNuevo.trim();
    if (!contenido) {
      setErrorFormulario("Escribí una descripción de tu servicio o necesidad.");
      return;
    }
    const autor = identidadUsuario;
    if (!autor) {
      setErrorFormulario("Iniciá sesión para publicar.");
      return;
    }

    setGuardandoPublicacion(true);
    setErrorFormulario("");
    setMensajeFormulario("");

    try {
      let urlFotoSubida = null;
      if (archivoFoto) {
        try {
          const fd = new FormData();
          fd.append("archivo", archivoFoto);
          const upRes = await fetch(`${API}/archivos/subir`, { method: "POST", body: fd });
          if (upRes.ok) {
            const upData = await upRes.json();
            urlFotoSubida = upData.url;
          }
        } catch (upErr) {
          console.warn("No se pudo subir la foto:", upErr);
        }
      }

      const response = await fetch(`${API}/publicaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          autor,
          contenido,
          tipo: tipoNuevo,
          ubicacion: ubicacionNueva.trim(),
          imagenBase64: urlFotoSubida || previewFoto || null
        })
      });

      if (!response.ok) {
        const det = await response.text();
        throw new Error(det || "Error al guardar");
      }

      setContenidoNuevo("");
      setTipoNuevo("Servicio ofrecido");
      setUbicacionNueva("");
      setArchivoFoto(null);
      setPreviewFoto("");
      setMensajeFormulario("¡Publicación guardada exitosamente!");
      await cargarPublicaciones(true, 0);
    } catch (e) {
      setErrorFormulario(e.message || "Error al publicar.");
    } finally {
      setGuardandoPublicacion(false);
    }
  }

  const manejarMeGusta = async (pub) => {
    if (!usuario) { navigate("/login"); return; }
    const id = pub.id;
    if (procesandoInteres[id]) return;
    setProcesandoInteres(prev => ({ ...prev, [id]: true }));
    try {
      await marcarInteres(id, identidadUsuario);
      setCantidadesInteres(prev => ({ ...prev, [id]: (prev[id] ?? Number(pub.interesados || 0)) + 1 }));
    } catch (e) {
      alert("Interés registrado.");
    } finally {
      setProcesandoInteres(prev => ({ ...prev, [id]: false }));
    }
  };

  const alternarComentarios = async (pub) => {
    const id = pub.id;
    const abrir = !comentariosAbiertos[id];
    setComentariosAbiertos(prev => ({ ...prev, [id]: abrir }));
    if (abrir && !Array.isArray(comentariosPorPublicacion[id])) {
      try {
        const res = await obtenerComentarios(id);
        setComentariosPorPublicacion(prev => ({ ...prev, [id]: Array.isArray(res) ? res : [] }));
      } catch {
        setComentariosPorPublicacion(prev => ({ ...prev, [id]: [] }));
      }
    }
  };

  const enviarComentario = async (pub) => {
    if (!usuario) { navigate("/login"); return; }
    const id = pub.id;
    const contenido = (comentarioNuevo[id] || "").trim();
    if (!contenido) return;
    if (procesandoComentario[id]) return;
    setProcesandoComentario(prev => ({ ...prev, [id]: true }));
    try {
      const nuevo = await crearComentario(id, identidadUsuario || "Usuario", contenido);
      setComentariosPorPublicacion(prev => ({ ...prev, [id]: [...(Array.isArray(prev[id]) ? prev[id] : []), nuevo] }));
      setComentarioNuevo(prev => ({ ...prev, [id]: "" }));
    } catch (e) {
      alert("No se pudo publicar el comentario: " + e.message);
    } finally {
      setProcesandoComentario(prev => ({ ...prev, [id]: false }));
    }
  };

  // Solicitud de Presupuestos (HU-15)
  async function enviarSolicitudPresupuesto(e) {
    e.preventDefault();
    if (!usuario) { navigate("/login"); return; }
    if (!solicitudTitulo.trim() || !solicitudDescripcion.trim()) {
      setErrorSolicitud("Completá el título y la descripción del servicio requerido.");
      return;
    }
    setEnviandoSolicitud(true);
    setErrorSolicitud("");
    setMensajeSolicitud("");
    try {
      const res = await fetch(`${API}/solicitudes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creadorUsuarioId: usuario.id,
          titulo: solicitudTitulo.trim(),
          categoria: solicitudCategoria,
          ubicacion: solicitudUbicacion.trim(),
          presupuesto: solicitudPresupuesto ? Number(solicitudPresupuesto) : null,
          descripcion: solicitudDescripcion.trim(),
          estado: "PENDIENTE"
        })
      });
      if (!res.ok) throw new Error("No se pudo enviar la solicitud");
      setMensajeSolicitud("¡Solicitud enviada con éxito! Los profesionales del rubro se pondrán en contacto.");
      setSolicitudTitulo("");
      setSolicitudDescripcion("");
      setSolicitudUbicacion("");
      setSolicitudPresupuesto("");
      setTimeout(() => {
        setModalSolicitudAbierto(false);
        setMensajeSolicitud("");
      }, 2200);
    } catch (err) {
      setErrorSolicitud(err.message || "Error al enviar solicitud.");
    } finally {
      setEnviandoSolicitud(false);
    }
  }

  async function abrirMisSolicitudes() {
    if (!usuario) { navigate("/login"); return; }
    setModalMisSolicitudes(true);
    setCargandoSolicitudes(true);
    try {
      const res = await fetch(`${API}/solicitudes/usuario/${usuario.id}`);
      if (res.ok) {
        const data = await res.json();
        setMisSolicitudes(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setMisSolicitudes([]);
    } finally {
      setCargandoSolicitudes(false);
    }
  }

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    setUsuario(null);
    setMenuAbierto(false);
  }

  // Filtrado robusto para evitar que la búsqueda quede en blanco
  const publicacionesFiltradas = useMemo(() => {
    const q = (busqueda || "").toLowerCase().trim();
    const cat = (categoriaActiva || "Todos").toLowerCase();
    const tipo = (filtroTipo || "Todos").toLowerCase();

    return publicaciones.filter(p => {
      const texto = `${p.contenido || ""} ${p.autor || ""} ${p.tipo || ""} ${p.ubicacion || ""}`.toLowerCase();
      const coincideQ = !q || texto.includes(q);
      const coincideCat = cat === "todos" || texto.includes(cat);
      const coincideTipo = tipo === "todos" || (p.tipo || "").toLowerCase().includes(tipo);
      return coincideQ && coincideCat && coincideTipo;
    });
  }, [publicaciones, busqueda, categoriaActiva, filtroTipo]);

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand-logo-container">
            <div className="brand-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
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
            <a href="#inicio">Inicio</a>
            <a href="#servicios">Servicios</a>
            <a href="#publicaciones">Publicaciones</a>
            {usuario && <Link to="/dashboard" style={{ color: "var(--primary)", fontWeight: "700" }}>📊 Dashboard</Link>}
          </nav>

          <div className="navbar-actions">
            {/* BOTÓN MODO OSCURO / CLARO */}
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTema}
              title="Cambiar tema claro / oscuro"
            >
              {tema === "dark" ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
            </button>

            {usuario ? (
              <div className="user-menu">
                <button className="avatar-button" onClick={() => setMenuAbierto(!menuAbierto)}>
                  {(usuario.nombre || "U").charAt(0).toUpperCase()}
                </button>

                {menuAbierto && (
                  <div className="user-dropdown">
                    <strong>{usuario.nombre}</strong>
                    <span className="dropdown-email">{usuario.email}</span>

                    <button onClick={() => { setMenuAbierto(false); navigate("/dashboard"); }} style={{ fontWeight: "700", color: "var(--primary)" }}>
                      📊 Mi Dashboard
                    </button>

                    <button onClick={() => { setMenuAbierto(false); navigate("/perfil"); }}>
                      👤 Mi Perfil
                    </button>

                    <button onClick={() => { setMenuAbierto(false); navigate("/mensajes"); }}>
                      💬 Mensajes
                    </button>

                    <button onClick={() => { setMenuAbierto(false); abrirMisSolicitudes(); }}>
                      📋 Mis Solicitudes
                    </button>

                    <button onClick={cerrarSesion}>
                      🚪 Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="btn-login" onClick={() => navigate("/login")}>
                  Iniciar sesión
                </button>
                <button className="btn-primary" onClick={() => navigate("/registro")}>
                  Crear cuenta
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION DE ALTO IMPACTO */}
      <section id="inicio" className="hero-wrapper-modern">
        <div className="hero-content-modern">
          <div className="hero-pill-badge">
            <span>✨ Plataforma N° 1 de Servicios y Oficios Profesionales</span>
          </div>

          <h1 className="hero-headline">
            Conectamos a <span className="hero-headline-highlight">profesionales calificados</span> con quienes los necesitan
          </h1>

          <p className="hero-subheadline">
            Encontrá electricistas, plomeros, carpinteros, pintores y más. Pedí presupuestos sin cargo y contratá con total tranquilidad.
          </p>

          {/* BUSCADOR FLOTANTE PROFESIONAL */}
          <div className="search-floating-card">
            <span style={{ fontSize: "20px", marginLeft: "12px" }}>🔍</span>
            <input
              type="text"
              className="search-input-field"
              placeholder="¿Qué servicio u oficio estás buscando? (Ej: Plomero, Pintura, Aire acondicionado...)"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("publicaciones")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            />
            <select
              className="search-select-field"
              value={categoriaActiva}
              onChange={(e) => setCategoriaActiva(e.target.value)}
            >
              <option value="Todos">Todas las categorías</option>
              {categorias.map(c => (
                <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>
            <button
              type="button"
              className="search-action-btn"
              onClick={() => document.getElementById("publicaciones")?.scrollIntoView({ behavior: "smooth" })}
            >
              Buscar
            </button>
          </div>

          {/* INSIGNIAS DE CONFIANZA */}
          <div className="hero-trust-grid">
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <div>
                <div className="trust-number">+1.500</div>
                <div className="trust-label">Profesionales Verificados</div>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <div>
                <div className="trust-number">&lt; 2 Horas</div>
                <div className="trust-label">Tiempo de Respuesta</div>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⭐</span>
              <div>
                <div className="trust-number">4.9 / 5</div>
                <div className="trust-label">Opiniones Verificadas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CATEGORÍAS */}
      <section id="servicios" className="section">
        <div className="section-heading">
          <span className="eyebrow">RUBROS DESTACADOS</span>
          <h2>Explorá por Oficios y Especialidades</h2>
          <p>Seleccioná una especialidad para ver los profesionales disponibles en tu zona.</p>
        </div>

        <div className="category-grid">
          {categorias.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              className="category-card"
              onClick={() => {
                setCategoriaActiva(cat.nombre);
                document.getElementById("publicaciones")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ textAlign: "left", cursor: "pointer", border: categoriaActiva === cat.nombre ? "2px solid var(--primary)" : "" }}
            >
              <div className="category-icon" style={{ fontSize: "28px", marginBottom: "8px" }}>{cat.icon}</div>
              <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>{cat.nombre}</h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{cat.descripcion}</p>
            </button>
          ))}
        </div>
      </section>

      {/* SECCIÓN DE PUBLICACIONES */}
      <section id="publicaciones" className="section publications-section">
        <div className="section-heading">
          <span className="eyebrow">CATÁLOGO Y COMUNIDAD</span>
          <h2>Publicaciones y Ofertas Recientes</h2>
          <p>Personas que buscan servicios y trabajadores ofreciendo su experiencia.</p>
        </div>

        {/* CHIPS DE CATEGORÍAS RÁPIDAS */}
        <div className="category-chips-scroll">
          <button
            type="button"
            className={`category-chip ${categoriaActiva === "Todos" ? "active" : ""}`}
            onClick={() => setCategoriaActiva("Todos")}
          >
            🌐 Todos los rubros
          </button>
          {categorias.map(cat => (
            <button
              key={cat.nombre}
              type="button"
              className={`category-chip ${categoriaActiva === cat.nombre ? "active" : ""}`}
              onClick={() => setCategoriaActiva(cat.nombre)}
            >
              <span>{cat.icon}</span> {cat.nombre}
            </button>
          ))}
        </div>

        {/* ACCIONES SUPERIORES Y FORMULARIO */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", marginBottom: "30px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "18px", margin: "0 0 4px", color: "var(--text)" }}>Publicar un Servicio o Pedido</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>Hacete visible para miles de personas en tu localidad.</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  if (!usuario) { navigate("/login"); return; }
                  setSolicitudTitulo("");
                  setSolicitudDescripcion("");
                  setModalSolicitudAbierto(true);
                }}
                style={{ fontSize: "14px", padding: "8px 16px" }}
              >
                📋 Solicitar Presupuesto Formal
              </button>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); crearPublicacionNueva(); }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "14px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Tipo de anuncio</label>
                <select
                  value={tipoNuevo}
                  onChange={(e) => setTipoNuevo(e.target.value)}
                  disabled={guardandoPublicacion}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-soft)", color: "var(--text)" }}
                >
                  <option>Servicio ofrecido</option>
                  <option>Oferta de trabajo</option>
                  <option>Perfil de trabajador</option>
                  <option>Solicitud de servicio</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Ubicación / Ciudad</label>
                <input
                  type="text"
                  placeholder="Ej: Córdoba Capital, Villa Carlos Paz..."
                  value={ubicacionNueva}
                  onChange={(e) => setUbicacionNueva(e.target.value)}
                  disabled={guardandoPublicacion}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-soft)", color: "var(--text)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Foto / Imagen (Opcional)</label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={guardandoPublicacion}
                  onChange={(e) => {
                    const arch = e.target.files?.[0];
                    if (!arch) return;
                    setArchivoFoto(arch);
                    setPreviewFoto(URL.createObjectURL(arch));
                  }}
                  style={{ width: "100%", fontSize: "13px", color: "var(--text-muted)" }}
                />
              </div>
            </div>

            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Descripción del servicio o propuesta</label>
            <textarea
              value={contenidoNuevo}
              onChange={(e) => setContenidoNuevo(e.target.value)}
              placeholder="Describí con detalle qué trabajo realizás, tu disponibilidad o qué reparación necesitás..."
              required
              rows={3}
              disabled={guardandoPublicacion}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-soft)", color: "var(--text)", marginBottom: "14px", boxSizing: "border-box" }}
            />

            {previewFoto && (
              <div style={{ marginBottom: "14px" }}>
                <img src={previewFoto} alt="Vista previa" style={{ maxHeight: "160px", borderRadius: "8px", objectFit: "cover" }} />
                <button type="button" onClick={() => { setArchivoFoto(null); setPreviewFoto(""); }} style={{ display: "block", fontSize: "12px", color: "#dc2626", background: "none", border: "none", cursor: "pointer", marginTop: "4px" }}>
                  ✕ Quitar imagen
                </button>
              </div>
            )}

            {errorFormulario && <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "12px" }}>{errorFormulario}</p>}
            {mensajeFormulario && <p style={{ color: "#16a34a", fontSize: "14px", marginBottom: "12px" }}>{mensajeFormulario}</p>}

            <button type="submit" className="btn-primary" disabled={guardandoPublicacion} style={{ padding: "10px 24px" }}>
              {guardandoPublicacion ? "Guardando publicación..." : "Publicar Anuncio"}
            </button>
          </form>
        </div>

        {/* LISTADO DE PUBLICACIONES ENRIQUECIDAS */}
        {cargando ? (
          <p style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>Cargando publicaciones verificadas...</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "#dc2626", padding: "40px" }}>{error}</p>
        ) : publicacionesFiltradas.length === 0 ? (
          /* ESTADO VACÍO PROFESIONAL */
          <div className="empty-results-box">
            <span className="empty-results-icon">🔍</span>
            <h3 className="empty-results-title">No encontramos publicaciones para tu búsqueda</h3>
            <p className="empty-results-desc">
              No hay publicaciones que coincidan con "{busqueda || categoriaActiva}". Probá cambiando los términos de búsqueda o explorá otras categorías.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => { setBusqueda(""); setCategoriaActiva("Todos"); setFiltroTipo("Todos"); }}
            >
              Ver todas las publicaciones
            </button>
          </div>
        ) : (
          <div className="publication-grid">
            {publicacionesFiltradas.map((pub) => {
              const imagenCard = obtenerImagenPublicacion(pub);
              const esEmpresa = /empresa|contrat|vacante/i.test(`${pub.tipo || ""} ${pub.contenido || ""}`);
              const esEmpleo = /empleo|trabajo|busco trabajo/i.test(`${pub.tipo || ""} ${pub.contenido || ""}`);

              return (
                <article className="publication-card-enhanced" key={pub.id}>
                  {/* FOTO DE PORTADA CON IMAGEN CURADA O SUBIDA */}
                  <div className="card-cover-container">
                    <img
                      src={imagenCard}
                      alt={pub.contenido || "Publicación"}
                      className="card-cover-img"
                      loading="lazy"
                    />
                    <span className={`card-badge-floating ${esEmpresa ? "empresa" : esEmpleo ? "empleo" : "servicio"}`}>
                      {pub.tipo || "Servicio"}
                    </span>
                  </div>

                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                      <div className="publication-avatar" style={{ width: "38px", height: "38px", borderRadius: "50%", background: "var(--primary-gradient)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>
                        {(pub.autor || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong style={{ display: "block", fontSize: "14px", color: "var(--text)" }}>{pub.autor || "Usuario"}</strong>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          {pub.fecha ? new Date(pub.fecha).toLocaleDateString("es-AR") : "Reciente"}
                        </span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: "16px", color: "var(--text)", margin: "0 0 10px", lineHeight: "1.4", flex: 1 }}>
                      {pub.contenido || "Nuevo servicio disponible"}
                    </h3>

                    {pub.ubicacion && (
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 16px" }}>
                        📍 {pub.ubicacion}
                      </p>
                    )}

                    {/* BOTONES DE ACCIÓN */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
                      <button
                        type="button"
                        className="contact-button"
                        disabled={!!procesandoInteres[pub.id]}
                        onClick={() => manejarMeGusta(pub)}
                        style={{ fontSize: "13px", padding: "8px 10px" }}
                      >
                        ❤️ Me interesa ({cantidadesInteres[pub.id] ?? pub.interesados ?? 0})
                      </button>

                      <button
                        type="button"
                        className="contact-button"
                        onClick={() => alternarComentarios(pub)}
                        style={{ fontSize: "13px", padding: "8px 10px" }}
                      >
                        💬 Comentar ({comentariosPorPublicacion[pub.id]?.length ?? pub.comentarios ?? 0})
                      </button>

                      <button
                        type="button"
                        className="contact-button"
                        onClick={() => {
                          if (!usuario) { navigate("/login"); return; }
                          setSolicitudTitulo("Presupuesto: " + (pub.contenido ? pub.contenido.slice(0, 45) + "..." : "Servicio"));
                          setSolicitudCategoria(pub.tipo?.includes("Plomer") ? "Plomería" : pub.tipo?.includes("Pint") ? "Pintura" : "Electricidad");
                          setSolicitudUbicacion(pub.ubicacion || "");
                          setModalSolicitudAbierto(true);
                        }}
                        style={{ fontSize: "13px", padding: "8px 10px", gridColumn: "span 2", background: "var(--primary-light)", color: "var(--primary)", borderColor: "var(--primary)" }}
                      >
                        📋 Pedir Presupuesto
                      </button>

                      <button
                        type="button"
                        className="contact-button"
                        onClick={() => {
                          if (!usuario) { navigate("/login"); return; }
                          const receptor = pub.autor;
                          const emisor = identidadUsuario;
                          if (receptor === emisor) { alert("No podés chatear con tu propia publicación."); return; }
                          navigate("/mensajes", { state: { receptor } });
                        }}
                        style={{ fontSize: "13px", padding: "8px 10px", gridColumn: "span 2" }}
                      >
                        ✉️ Contactar por Chat
                      </button>
                    </div>

                    {/* PANEL DE COMENTARIOS */}
                    {comentariosAbiertos[pub.id] && (
                      <div className="comments-panel" style={{ marginTop: "14px" }}>
                        <div className="comments-list">
                          {(comentariosPorPublicacion[pub.id] || []).map((c, i) => (
                            <div key={c.id ?? i} className="comment-item">
                              <strong>{c.autor || c.usuario || "Usuario"}</strong>
                              <p>{c.contenido || c.texto || ""}</p>
                            </div>
                          ))}
                          {comentariosPorPublicacion[pub.id]?.length === 0 && (
                            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Todavía no hay comentarios. ¡Sé el primero!</p>
                          )}
                        </div>
                        <textarea
                          value={comentarioNuevo[pub.id] || ""}
                          onChange={(e) => setComentarioNuevo(prev => ({ ...prev, [pub.id]: e.target.value }))}
                          placeholder="Escribí tu consulta..."
                          rows={2}
                          style={{ width: "100%", margin: "8px 0", padding: "8px", borderRadius: "6px", border: "1px solid var(--border)" }}
                        />
                        <button
                          type="button"
                          className="contact-button"
                          disabled={!!procesandoComentario[pub.id]}
                          onClick={() => enviarComentario(pub)}
                        >
                          {procesandoComentario[pub.id] ? "Enviando..." : "Publicar comentario"}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* BOTÓN CARGAR MÁS PUBLICACIONES */}
        {hayMasPaginas && (
          <div style={{ textAlign: "center", margin: "36px 0" }}>
            <button
              type="button"
              className="btn-primary"
              onClick={cargarMasPublicaciones}
              disabled={cargandoMas}
              style={{ padding: "12px 30px", fontSize: "15px" }}
            >
              {cargandoMas ? "Cargando más..." : "⬇️ Cargar más publicaciones"}
            </button>
          </div>
        )}
      </section>

      {/* MODAL SOLICITUD DE PRESUPUESTO (HU-15) */}
      {modalSolicitudAbierto && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "16px" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", maxWidth: "520px", width: "100%", padding: "26px", maxHeight: "90vh", overflowY: "auto", boxShadow: "var(--shadow-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ margin: 0, color: "var(--text)", fontSize: "20px" }}>📋 Solicitar Presupuesto Formal</h3>
              <button type="button" onClick={() => setModalSolicitudAbierto(false)} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "var(--text-muted)" }}>✕</button>
            </div>

            <form onSubmit={enviarSolicitudPresupuesto}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px" }}>Título del trabajo solicitado</label>
              <input
                type="text"
                value={solicitudTitulo}
                onChange={(e) => setSolicitudTitulo(e.target.value)}
                placeholder="Ej.: Reparación de instalación eléctrica en cocina"
                required
                maxLength={180}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-soft)", color: "var(--text)", marginBottom: "14px", boxSizing: "border-box" }}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px" }}>Rubro / Oficio</label>
                  <select
                    value={solicitudCategoria}
                    onChange={(e) => setSolicitudCategoria(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-soft)", color: "var(--text)" }}
                  >
                    {categorias.map(cat => (
                      <option key={cat.nombre} value={cat.nombre}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px" }}>Presupuesto Estimado ($)</label>
                  <input
                    type="number"
                    value={solicitudPresupuesto}
                    onChange={(e) => setSolicitudPresupuesto(e.target.value)}
                    placeholder="Ej: 25000"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-soft)", color: "var(--text)" }}
                  />
                </div>
              </div>

              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px" }}>Ubicación / Barrio</label>
              <input
                type="text"
                value={solicitudUbicacion}
                onChange={(e) => setSolicitudUbicacion(e.target.value)}
                placeholder="Ej.: Barrio General Paz, Córdoba"
                maxLength={150}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-soft)", color: "var(--text)", marginBottom: "14px", boxSizing: "border-box" }}
              />

              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px" }}>Descripción del trabajo</label>
              <textarea
                value={solicitudDescripcion}
                onChange={(e) => setSolicitudDescripcion(e.target.value)}
                placeholder="Explicá con claridad qué se necesita arreglar o instalar..."
                required
                rows={4}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-soft)", color: "var(--text)", marginBottom: "16px", boxSizing: "border-box" }}
              />

              {errorSolicitud && <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "12px" }}>{errorSolicitud}</p>}
              {mensajeSolicitud && <p style={{ color: "#16a34a", fontSize: "14px", marginBottom: "12px" }}>{mensajeSolicitud}</p>}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setModalSolicitudAbierto(false)} style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--text)" }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={enviandoSolicitud} style={{ padding: "10px 22px" }}>
                  {enviandoSolicitud ? "Enviando..." : "Enviar Solicitud"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MIS SOLICITUDES */}
      {modalMisSolicitudes && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "16px" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", maxWidth: "600px", width: "100%", padding: "26px", maxHeight: "90vh", overflowY: "auto", boxShadow: "var(--shadow-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ margin: 0, color: "var(--text)", fontSize: "20px" }}>📋 Mis Solicitudes de Presupuesto</h3>
              <button type="button" onClick={() => setModalMisSolicitudes(false)} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "var(--text-muted)" }}>✕</button>
            </div>

            {cargandoSolicitudes ? (
              <p style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>Cargando solicitudes...</p>
            ) : misSolicitudes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                <p>Todavía no enviaste ninguna solicitud de presupuesto.</p>
                <button type="button" className="btn-primary" onClick={() => { setModalMisSolicitudes(false); setModalSolicitudAbierto(true); }} style={{ marginTop: "12px" }}>
                  Crear primera solicitud
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {misSolicitudes.map(sol => (
                  <div key={sol.id} style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "14px", background: "var(--surface-soft)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <strong style={{ fontSize: "15px", color: "var(--text)" }}>{sol.titulo}</strong>
                      <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "6px", background: sol.estado === "ACEPTADA" ? "#dcfce7" : sol.estado === "RECHAZADA" ? "#fee2e2" : "#fef9c3", color: sol.estado === "ACEPTADA" ? "#166534" : sol.estado === "RECHAZADA" ? "#991b1b" : "#854d0e" }}>
                        {sol.estado || "PENDIENTE"}
                      </span>
                    </div>
                    <p style={{ margin: "4px 0", color: "var(--text-secondary)", fontSize: "13px" }}>{sol.descripcion}</p>
                    <div style={{ display: "flex", gap: "14px", fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
                      {sol.categoria && <span>🔧 {sol.categoria}</span>}
                      {sol.ubicacion && <span>📍 {sol.ubicacion}</span>}
                      {sol.presupuesto && <span>💰 Estimado: ${sol.presupuesto}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer" style={{ borderTop: "1px solid var(--border)", padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
        <p>© 2026 ServiRed - Plataforma de Servicios & Oficios. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

/* ============================================================
   PANTALLA DE LOGIN
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
      setError("Completá tu correo electrónico y contraseña.");
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
      const data = await response.json();
      localStorage.setItem("usuario", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      setError("No pudimos conectar con el servidor. Verificá que Spring Boot esté funcionando.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: "420px", margin: "60px auto", padding: "30px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}>
        <BotonVolver />
        <h2 style={{ fontSize: "24px", margin: "16px 0 6px", color: "var(--text)" }}>Iniciar Sesión</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>Ingresá a tu cuenta de ServiRed</p>

        <form onSubmit={iniciarSesion}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-soft)", color: "var(--text)", marginBottom: "14px", boxSizing: "border-box" }}
          />

          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-soft)", color: "var(--text)", marginBottom: "18px", boxSizing: "border-box" }}
          />

          {error && <p style={{ color: "#dc2626", fontSize: "13px", marginBottom: "14px" }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={cargando} style={{ width: "100%", padding: "12px", fontSize: "15px" }}>
            {cargando ? "Iniciando..." : "Ingresar"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text-muted)", marginTop: "20px" }}>
          ¿No tenés una cuenta? <Link to="/registro" style={{ color: "var(--primary)", fontWeight: "600" }}>Registrate acá</Link>
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   PANTALLA DE REGISTRO
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
      setError("Por favor completá todos los campos.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setCargando(true);
      const res = await fetch(`${API}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password })
      });

      if (res.status === 409) {
        setError("Ese correo electrónico ya está registrado.");
        return;
      }
      if (!res.ok) {
        const det = await res.text();
        throw new Error(det || "Error al registrarse");
      }

      setExito("¡Cuenta creada correctamente! Redirigiendo al inicio de sesión...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "No se pudo crear la cuenta.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: "440px", margin: "60px auto", padding: "30px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}>
        <BotonVolver />
        <h2 style={{ fontSize: "24px", margin: "16px 0 6px", color: "var(--text)" }}>Crear una Cuenta</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>Unite a la mayor comunidad de servicios y oficios</p>

        <form onSubmit={registrar}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Nombre Completo o Empresa</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej.: Juan Pérez"
            required
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-soft)", color: "var(--text)", marginBottom: "14px", boxSizing: "border-box" }}
          />

          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-soft)", color: "var(--text)", marginBottom: "14px", boxSizing: "border-box" }}
          />

          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Contraseña (mínimo 6 caracteres)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-soft)", color: "var(--text)", marginBottom: "18px", boxSizing: "border-box" }}
          />

          {error && <p style={{ color: "#dc2626", fontSize: "13px", marginBottom: "14px" }}>{error}</p>}
          {exito && <p style={{ color: "#16a34a", fontSize: "13px", marginBottom: "14px" }}>{exito}</p>}

          <button type="submit" className="btn-primary" disabled={cargando} style={{ width: "100%", padding: "12px", fontSize: "15px" }}>
            {cargando ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text-muted)", marginTop: "20px" }}>
          ¿Ya tenés una cuenta? <Link to="/login" style={{ color: "var(--primary)", fontWeight: "600" }}>Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default App;
