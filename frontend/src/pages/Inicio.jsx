import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PublicacionCard from "../components/PublicacionCard";
import { useToast } from "../context/ToastContext";
import {
  obtenerPublicaciones,
  crearPublicacion,
  marcarInteres,
  obtenerComentarios,
  crearComentario
} from "../conexionPersonas";

const categorias = [
  { icon: "⚡", nombre: "Electricidad", descripcion: "Instalaciones y reparaciones" },
  { icon: "🔧", nombre: "Plomería", descripcion: "Agua, cañerías y sanitarios" },
  { icon: "🧱", nombre: "Albañilería", descripcion: "Obras y construcción" },
  { icon: "🎨", nombre: "Pintura", descripcion: "Interior y exterior" },
  { icon: "🧹", nombre: "Limpieza", descripcion: "Hogares y comercios" },
  { icon: "🌳", nombre: "Jardinería", descripcion: "Parques y jardines" },
  { icon: "🪚", nombre: "Carpintería", descripcion: "Muebles y madera" },
  { icon: "🔨", nombre: "Reparaciones", descripcion: "Arreglos generales" }
];

export default function Inicio() {
  const navigate = useNavigate();
  const toast = useToast();

  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [usuario, setUsuario] = useState(null);
  const identidadUsuario = usuario?.nombre || usuario?.email || usuario?.username || usuario?.nombreUsuario;

  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [zonaFiltro, setZonaFiltro] = useState("Todas");

  // Creación de publicaciones
  const [contenidoNuevo, setContenidoNuevo] = useState("");
  const [tipoNuevo, setTipoNuevo] = useState("Servicio ofrecido");
  const [ubicacionNueva, setUbicacionNueva] = useState("");
  const [imagenBase64, setImagenBase64] = useState("");
  const [guardandoPublicacion, setGuardandoPublicacion] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");
  const [mensajeFormulario, setMensajeFormulario] = useState("");

  // Interacción en publicaciones
  const [cantidadesInteres, setCantidadesInteres] = useState({});
  const [comentariosPorPublicacion, setComentariosPorPublicacion] = useState({});
  const [comentariosAbiertos, setComentariosAbiertos] = useState({});
  const [comentarioNuevo, setComentarioNuevo] = useState({});
  const [procesandoInteres, setProcesandoInteres] = useState({});
  const [procesandoComentario, setProcesandoComentario] = useState({});

  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) {
      try {
        setUsuario(JSON.parse(guardado));
      } catch {
        localStorage.removeItem("usuario");
      }
    }
    cargar();
  }, []);

  async function cargar() {
    try {
      setCargando(true);
      setError("");
      const data = await obtenerPublicaciones();
      setPublicaciones(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("No pudimos conectar con las publicaciones del servidor.");
      setPublicaciones([]);
    } finally {
      setCargando(false);
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    toast.info("Sesión cerrada correctamente.");
  };

  const manejarMeGusta = async (publicacion) => {
    if (!usuario) {
      toast.info("Iniciá sesión para indicar que te interesa una publicación.");
      navigate("/login");
      return;
    }
    if (!identidadUsuario) {
      toast.warning("No se pudo identificar al usuario. Volvé a iniciar sesión.");
      return;
    }
    const id = publicacion.id;
    if (procesandoInteres[id]) return;
    setProcesandoInteres((prev) => ({ ...prev, [id]: true }));
    try {
      await marcarInteres(id, identidadUsuario);
      setCantidadesInteres((prev) => ({
        ...prev,
        [id]: (prev[id] ?? Number(publicacion.interesados || 0)) + 1
      }));
      toast.success("¡Registramos tu interés en esta publicación!");
    } catch (e) {
      const mensaje = String(e?.message || "");
      if (/ya marc|duplicad|409/i.test(mensaje)) {
        toast.info("Ya marcaste que te interesa esta publicación.");
      } else {
        toast.error("No se pudo registrar el interés: " + mensaje);
      }
    } finally {
      setProcesandoInteres((prev) => ({ ...prev, [id]: false }));
    }
  };

  const alternarComentarios = async (publicacion) => {
    const id = publicacion.id;
    const abrir = !comentariosAbiertos[id];
    setComentariosAbiertos((prev) => ({ ...prev, [id]: abrir }));
    if (abrir && !Array.isArray(comentariosPorPublicacion[id])) {
      try {
        const resultado = await obtenerComentarios(id);
        setComentariosPorPublicacion((prev) => ({
          ...prev,
          [id]: Array.isArray(resultado) ? resultado : []
        }));
      } catch (e) {
        toast.error("No se pudieron cargar los comentarios: " + (e?.message || ""));
        setComentariosPorPublicacion((prev) => ({ ...prev, [id]: [] }));
      }
    }
  };

  const enviarComentarioNuevo = async (publicacion) => {
    if (!usuario) {
      toast.info("Iniciá sesión para comentar.");
      navigate("/login");
      return;
    }
    const id = publicacion.id;
    const contenido = (comentarioNuevo[id] || "").trim();
    if (!contenido) {
      toast.warning("Escribí un comentario antes de enviarlo.");
      return;
    }
    if (procesandoComentario[id]) return;
    setProcesandoComentario((prev) => ({ ...prev, [id]: true }));
    try {
      const nuevo = await crearComentario(id, identidadUsuario || "Usuario", contenido);
      setComentariosPorPublicacion((prev) => ({
        ...prev,
        [id]: [...(Array.isArray(prev[id]) ? prev[id] : []), nuevo]
      }));
      setComentarioNuevo((prev) => ({ ...prev, [id]: "" }));
      toast.success("¡Comentario publicado!");
    } catch (e) {
      toast.error("No se pudo publicar el comentario: " + (e?.message || ""));
    } finally {
      setProcesandoComentario((prev) => ({ ...prev, [id]: false }));
    }
  };

  async function crearPublicacionNueva() {
    const contenido = contenidoNuevo.trim();
    if (!contenido) {
      setErrorFormulario("Escribí una descripción para publicar.");
      return;
    }
    const autor = identidadUsuario;
    if (!autor) {
      setErrorFormulario("Iniciá sesión para crear una publicación.");
      return;
    }

    setGuardandoPublicacion(true);
    setErrorFormulario("");
    setMensajeFormulario("");

    try {
      await crearPublicacion({
        autor,
        contenido,
        tipo: tipoNuevo,
        ubicacion: ubicacionNueva.trim(),
        imagenBase64: imagenBase64 || null
      });

      setContenidoNuevo("");
      setTipoNuevo("Servicio ofrecido");
      setUbicacionNueva("");
      setImagenBase64("");
      setMensajeFormulario("¡Publicación guardada correctamente!");
      toast.success("¡Tu publicación ya está visible para la comunidad!");
      await cargar();
    } catch (e) {
      console.error("Error al crear publicación:", e);
      setErrorFormulario(e.message || "No se pudo guardar la publicación.");
      toast.error("No se pudo guardar la publicación.");
    } finally {
      setGuardandoPublicacion(false);
    }
  }

  const seleccionarCategoria = (nombre) => {
    setCategoriaActiva(nombre);
    document.getElementById("publicaciones")?.scrollIntoView({ behavior: "smooth" });
  };

  const publicacionesFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    const zona = zonaFiltro.toLowerCase().trim();

    return publicaciones.filter((p) => {
      const contenido = (p.contenido || "").toLowerCase();
      const autor = (p.autor || "").toLowerCase();
      const tipo = (p.tipo || "").toLowerCase();
      const ubicacion = (p.ubicacion || "").toLowerCase();

      const coincideBusqueda =
        !texto ||
        contenido.includes(texto) ||
        autor.includes(texto) ||
        tipo.includes(texto) ||
        ubicacion.includes(texto);

      const coincideCategoria =
        categoriaActiva === "Todos" ||
        tipo.includes(categoriaActiva.toLowerCase());

      const coincideZona =
        zona === "todas" ||
        !zona ||
        ubicacion.includes(zona);

      return coincideBusqueda && coincideCategoria && coincideZona;
    });
  }, [publicaciones, busqueda, categoriaActiva, zonaFiltro]);

  return (
    <div className="app">
      <div className="site-background"></div>

      <Navbar
        usuario={usuario}
        onCerrarSesion={cerrarSesion}
        zonaSeleccionada={zonaFiltro}
        onCambiarZona={setZonaFiltro}
      />

      <main>
        {/* HERO */}
        <section id="inicio" className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span>✦</span> Conectamos personas con profesionales
            </div>
            <h1>
              Tu próximo trabajo o profesional,
              <span> a un solo lugar.</span>
            </h1>
            <p>
              Encontrá especialistas de confianza para solucionar cualquier necesidad en tu hogar o empresa, o publicá tus servicios para conseguir nuevos clientes.
            </p>
            <div className="hero-actions-group">
              <a href="#publicaciones" className="btn-primary">
                Ver publicaciones →
              </a>
              <a href="#servicios" className="btn-secondary">
                Explorar servicios
              </a>
            </div>
          </div>
        </section>

        {/* SERVICIOS / CATEGORÍAS */}
        <section id="servicios" className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORÁ POR ÁREA</span>
              <h2>Oficios y Servicios más solicitados</h2>
              <p>Hacé clic en cualquier categoría para filtrar publicaciones activas.</p>
            </div>
          </div>

          <div className="category-grid">
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

        {/* PUBLICACIONES */}
        <section id="publicaciones" className="section publications-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">COMUNIDAD</span>
              <h2>Publicaciones recientes</h2>
              <p>Personas que buscan ayuda y profesionales que ofrecen sus servicios.</p>
            </div>
          </div>

          {/* FORMULARIO CREAR PUBLICACIÓN */}
          <div className="create-publication" style={{ marginBottom: "24px", padding: "20px", border: "1px solid var(--border-color, #ddd)", borderRadius: "14px", background: "var(--card-bg, #fff)" }}>
            <h3>Crear una publicación</h3>
            <form onSubmit={(e) => { e.preventDefault(); crearPublicacionNueva(); }}>
              <label htmlFor="tipo-publicacion">Tipo de publicación</label>
              <select
                id="tipo-publicacion"
                value={tipoNuevo}
                onChange={(e) => setTipoNuevo(e.target.value)}
                disabled={guardandoPublicacion}
                style={{ display: "block", width: "100%", margin: "8px 0 14px", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color, #ccc)" }}
              >
                <option>Servicio ofrecido</option>
                <option>Oferta de trabajo</option>
                <option>Perfil de trabajador</option>
                <option>Solicitud de servicio</option>
                <option>Emprendimiento</option>
              </select>

              <label htmlFor="contenido-publicacion">Descripción</label>
              <textarea
                id="contenido-publicacion"
                value={contenidoNuevo}
                onChange={(e) => setContenidoNuevo(e.target.value)}
                placeholder="Contá qué servicio ofrecés o qué necesitás..."
                required
                maxLength={5000}
                rows={4}
                disabled={guardandoPublicacion}
                style={{ display: "block", width: "100%", boxSizing: "border-box", margin: "8px 0 14px", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-color, #ccc)" }}
              />

              <label htmlFor="ubicacion-publicacion">Ubicación</label>
              <input
                id="ubicacion-publicacion"
                value={ubicacionNueva}
                onChange={(e) => setUbicacionNueva(e.target.value)}
                placeholder="Ej.: Córdoba Capital, Buenos Aires, etc."
                maxLength={150}
                disabled={guardandoPublicacion}
                style={{ display: "block", width: "100%", boxSizing: "border-box", margin: "8px 0 14px", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color, #ccc)" }}
              />

              <label htmlFor="imagen-publicacion">Fotografía (opcional, máx. 2 MB)</label>
              <input
                id="imagen-publicacion"
                type="file"
                accept="image/*"
                disabled={guardandoPublicacion}
                style={{ display: "block", margin: "8px 0 14px" }}
                onChange={(e) => {
                  const archivo = e.target.files?.[0];
                  setImagenBase64("");
                  setErrorFormulario("");
                  if (!archivo) return;
                  if (!archivo.type.startsWith("image/")) {
                    setErrorFormulario("Seleccioná un archivo de imagen.");
                    e.target.value = "";
                    return;
                  }
                  if (archivo.size > 2 * 1024 * 1024) {
                    setErrorFormulario("La imagen supera el límite de 2 MB.");
                    e.target.value = "";
                    return;
                  }
                  const lector = new FileReader();
                  lector.onload = () => {
                    if (typeof lector.result === "string") setImagenBase64(lector.result);
                  };
                  lector.readAsDataURL(archivo);
                }}
              />

              {imagenBase64 && (
                <img src={imagenBase64} alt="Vista previa" style={{ display: "block", maxWidth: "100%", maxHeight: "200px", objectFit: "contain", marginBottom: "14px", borderRadius: "8px" }} />
              )}

              {errorFormulario && <p role="alert" style={{ color: "#b42318", margin: "8px 0" }}>{errorFormulario}</p>}
              {mensajeFormulario && <p role="status" style={{ color: "#16803c", margin: "8px 0" }}>{mensajeFormulario}</p>}

              <button type="submit" className="btn-primary" disabled={guardandoPublicacion}>
                {guardandoPublicacion ? "Guardando..." : "Publicar"}
              </button>
            </form>
          </div>

          {/* FILTROS Y BÚSQUEDA */}
          <div className="filter-bar">
            <div className="filter-search">
              🔎
              <input
                placeholder="Buscar publicaciones..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <select
              value={categoriaActiva}
              onChange={(e) => setCategoriaActiva(e.target.value)}
            >
              <option>Todos</option>
              {categorias.map((cat) => (
                <option key={cat.nombre}>{cat.nombre}</option>
              ))}
            </select>

            <button className="refresh-button" onClick={cargar} title="Actualizar publicaciones">
              ↻
            </button>
          </div>

          {/* GRID DE RESULTADOS */}
          {cargando ? (
            <div className="empty-state">
              <div className="spinner"></div>
              <h3>Cargando publicaciones...</h3>
              <p>Conectando con la base de datos.</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div>⚠️</div>
              <h3>No pudimos cargar las publicaciones</h3>
              <p>{error}</p>
              <button className="btn-primary" onClick={cargar}>Reintentar</button>
            </div>
          ) : publicacionesFiltradas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No encontramos publicaciones</h3>
              <p>Probá cambiando los términos de búsqueda o de categoría.</p>
            </div>
          ) : (
            <div className="publication-grid">
              {publicacionesFiltradas.map((publicacion) => (
                <PublicacionCard
                  key={publicacion.id}
                  publicacion={publicacion}
                  usuario={usuario}
                  onMeGusta={manejarMeGusta}
                  onAlternarComentarios={alternarComentarios}
                  onEnviarComentario={enviarComentarioNuevo}
                  cantidadesInteres={cantidadesInteres}
                  comentariosPorPublicacion={comentariosPorPublicacion}
                  comentariosAbiertos={comentariosAbiertos}
                  comentarioNuevo={comentarioNuevo}
                  setComentarioNuevo={setComentarioNuevo}
                  procesandoInteres={procesandoInteres}
                  procesandoComentario={procesandoComentario}
                />
              ))}
            </div>
          )}
        </section>

        {/* CÓMO FUNCIONA */}
        <section id="como-funciona" className="how-section">
          <div className="section-heading centered">
            <span className="eyebrow">SIMPLE Y RÁPIDO</span>
            <h2>¿Cómo funciona?</h2>
            <p>Encontrá ayuda o conseguí nuevos clientes en pocos pasos.</p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-icon">🔎</div>
              <h3>Buscá</h3>
              <p>Encontrá el servicio que necesitás o explorá los oficios destacados.</p>
            </div>
            <div className="step">
              <div className="step-number">02</div>
              <div className="step-icon">👤</div>
              <h3>Conocé</h3>
              <p>Revisá el perfil público del profesional, su experiencia y portafolio.</p>
            </div>
            <div className="step">
              <div className="step-number">03</div>
              <div className="step-icon">💬</div>
              <h3>Contactá</h3>
              <p>Iniciá un chat directo para acordar fecha, presupuesto y detalles.</p>
            </div>
            <div className="step">
              <div className="step-number">04</div>
              <div className="step-icon">⭐</div>
              <h3>Valorá</h3>
              <p>Dejá tu reseña y compartí tu experiencia con la comunidad.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div>
            <span className="eyebrow">¿TENÉS UN OFICIO?</span>
            <h2>Mostrá lo que sabés hacer.</h2>
            <p>Creá tu perfil profesional, publicá tus servicios y encontrá nuevas oportunidades.</p>
          </div>
          <button className="btn-light" onClick={() => navigate("/registro")}>
            Empezar ahora →
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
