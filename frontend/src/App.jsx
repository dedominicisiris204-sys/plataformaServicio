import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

import { useEffect, useMemo, useState } from "react";
import Perfil from "./pages/Perfil";

import "./styles/global.css";
import "./styles/variables.css";
import "./styles/layout.css";
import "./styles/components.css";

const API = "/api";

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

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Inicio />} />

        <Route path="/login" element={<Login />} />

        <Route path="/registro" element={<Registro />} />

        <Route path="/perfil" element={<Perfil />} />

        <Route path="*" element={<Inicio />} />

      </Routes>

    </BrowserRouter>
  );
}


/* ============================================================
   BOTON VOLVER
============================================================ */

function BotonVolver() {

  const navigate = useNavigate();

  function volver() {

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  return (
    <button
      className="back-button"
      onClick={volver}
    >
      ← Volver
    </button>
  );
}


/* ============================================================
   LOGIN
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

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })

      });

      if (response.status === 401) {
        setError("El correo o la contraseña son incorrectos.");
        return;
      }

      if (!response.ok) {
        throw new Error("Error al iniciar sesión");
      }

      const textoLogin = await response.text();

      let usuario;

      try {
        usuario = JSON.parse(textoLogin);
      } catch {
        throw new Error("El servidor devolvió una respuesta de inicio de sesión no válida.");
      }

      localStorage.setItem("usuario", JSON.stringify(usuario));

      navigate("/");

      window.location.reload();

    } catch (error) {

      console.error(error);

      setError(
        "No pudimos conectar con el servidor. Verificá que Spring Boot esté funcionando."
      );

    } finally {

      setCargando(false);

    }
  }

  return (
    <div className="auth-page">

      <div className="auth-background"></div>

      <div className="auth-top">

        <Link to="/" className="brand auth-brand">

          <div className="brand-logo">
            PS
          </div>

          <div>
            <strong>Plataforma</strong>
            <span>Servicios & Oficios</span>
          </div>

        </Link>

        <BotonVolver />

      </div>


      <div className="auth-container">

        <div className="auth-card">

          <div className="auth-icon">
            🔐
          </div>

          <span className="eyebrow">
            BIENVENIDO/A
          </span>

          <h1>
            Iniciar sesión
          </h1>

          <p className="auth-description">
            Entrá a tu cuenta para encontrar profesionales,
            publicar servicios y comunicarte con la comunidad.
          </p>


          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}


          <form onSubmit={iniciarSesion}>

            <label>
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />


            <label>
              Contraseña
            </label>

            <input
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />


            <button
              className="btn-primary auth-submit"
              type="submit"
              disabled={cargando}
            >
              {cargando
                ? "Ingresando..."
                : "Iniciar sesión →"}
            </button>

          </form>


          <div className="auth-divider">
            <span>o</span>
          </div>


          <p className="auth-footer-text">

            ¿Todavía no tenés una cuenta?

            <Link to="/registro">
              Crear cuenta
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   REGISTRO
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

      setError(
        "Completá todos los campos."
      );

      return;
    }

    if (password.length < 6) {

      setError(
        "La contraseña debe tener al menos 6 caracteres."
      );

      return;
    }

    try {

      setCargando(true);

      const response = await fetch(`${API}/usuarios`, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "text/plain, application/json" }, body: JSON.stringify({
          nombre,
          email,
          password
        }) });

      if (response.status === 409) {

        setError(
          "Ese correo electrónico ya está registrado."
        );

        return;
      }

      if (!response.ok) { const detalle = await response.text(); console.error("RESPUESTA BACKEND REGISTRO:", detalle); throw new Error(detalle || `Error HTTP ${response.status}`); }

      const textoLogin = await response.text();

      let usuario;

      try {
        usuario = JSON.parse(textoLogin);
      } catch {
        throw new Error("El servidor devolvió una respuesta de inicio de sesión no válida.");
      }

      localStorage.setItem("usuario", JSON.stringify(usuario));

      setExito(
        "¡Cuenta creada correctamente!"
      );

      setTimeout(() => {

        navigate("/");

        window.location.reload();

      }, 700);

    } catch (error) {

      console.error(error);

      setError(error?.message || "No pudimos crear la cuenta.");

    } finally {

      setCargando(false);

    }
  }

  return (
    <div className="auth-page">

      <div className="auth-background"></div>

      <div className="auth-top">

        <Link to="/" className="brand auth-brand">

          <div className="brand-logo">
            PS
          </div>

          <div>
            <strong>Plataforma</strong>
            <span>Servicios & Oficios</span>
          </div>

        </Link>

        <BotonVolver />

      </div>


      <div className="auth-container">

        <div className="auth-card register-card">

          <div className="auth-icon">
            🛠️
          </div>

          <span className="eyebrow">
            SUMATE A LA COMUNIDAD
          </span>

          <h1>
            Crear cuenta
          </h1>

          <p className="auth-description">
            Registrate para ofrecer tus servicios,
            buscar profesionales y conectar con personas.
          </p>


          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}


          {exito && (
            <div className="auth-success">
              ✓ {exito}
            </div>
          )}


          <form onSubmit={registrar}>

            <label>
              Nombre completo
            </label>

            <input
              type="text"
              placeholder="Ej: Iris Gladys"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="name"
            />


            <label>
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />


            <label>
              Contraseña
            </label>

            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />


            <button
              className="btn-primary auth-submit"
              type="submit"
              disabled={cargando}
            >
              {cargando
                ? "Creando cuenta..."
                : "Crear mi cuenta →"}
            </button>

          </form>


          <p className="auth-footer-text">

            ¿Ya tenés una cuenta?

            <Link to="/login">
              Iniciar sesión
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   INICIO
============================================================ */

function Inicio() {

  const navigate = useNavigate();

  const [publicaciones, setPublicaciones] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");

  const [categoriaActiva, setCategoriaActiva] =
    useState("Todos");

  const [menuAbierto, setMenuAbierto] =
    useState(false);

  const [usuario, setUsuario] =
    useState(null);


  useEffect(() => {

    const guardado =
      localStorage.getItem("usuario");

    if (guardado) {

      try {

        setUsuario(
          JSON.parse(guardado)
        );

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

      const response =
        await fetch(`${API}/publicaciones`);

      if (!response.ok) {
        throw new Error(
          "No se pudieron cargar las publicaciones"
        );
      }

      const data =
        await response.json();

      setPublicaciones(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (e) {

      console.error(e);

      setError(
        "No pudimos conectar con las publicaciones del servidor."
      );

      setPublicaciones([]);

    } finally {

      setCargando(false);

    }
  }


  const publicacionesFiltradas =
    useMemo(() => {

      const texto =
        busqueda
          .toLowerCase()
          .trim();

      return publicaciones.filter((p) => {

        const contenido =
          (p.contenido || "")
            .toLowerCase();

        const autor =
          (p.autor || "")
            .toLowerCase();

        const tipo =
          (p.tipo || "")
            .toLowerCase();

        const ubicacion =
          (p.ubicacion || "")
            .toLowerCase();

        const coincideBusqueda =
          !texto ||
          contenido.includes(texto) ||
          autor.includes(texto) ||
          tipo.includes(texto) ||
          ubicacion.includes(texto);

        const coincideCategoria =
          categoriaActiva === "Todos" ||
          tipo.includes(
            categoriaActiva.toLowerCase()
          );

        return (
          coincideBusqueda &&
          coincideCategoria
        );

      });

    }, [
      publicaciones,
      busqueda,
      categoriaActiva
    ]);


  function seleccionarCategoria(nombre) {

    setCategoriaActiva(nombre);

    document
      .getElementById("publicaciones")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  }


  function cerrarSesion() {

    localStorage.removeItem("usuario");

    setUsuario(null);

    setMenuAbierto(false);

  }


  return (

    <div className="app">

      {/* FONDO */}

      <div className="site-background"></div>


      {/* NAVBAR */}

      <header className="navbar">

        <div className="navbar-inner">

          <Link
            to="/"
            className="brand"
          >

            <div className="brand-logo">
              PS
            </div>

            <div>
              <strong>
                Plataforma
              </strong>

              <span>
                Servicios & Oficios
              </span>
            </div>

          </Link>


          <nav className="nav-links">

            <a href="#inicio">
              Inicio
            </a>

            <a href="#servicios">
              Servicios
            </a>

            <a href="#publicaciones">
              Publicaciones
            </a>

            <a href="#como-funciona">
              Cómo funciona
            </a>

          </nav>


          <div className="navbar-actions">

            {usuario ? (

              <div className="user-menu">

                <button
                  className="avatar-button"
                  onClick={() =>
                    setMenuAbierto(
                      !menuAbierto
                    )
                  }
                >
                  {(usuario.nombre || "U")
                    .charAt(0)
                    .toUpperCase()}
                </button>


                {menuAbierto && (

                  <div className="user-dropdown">

                    <strong>
                      {usuario.nombre}
                    </strong>

                    <span className="dropdown-email">
                      {usuario.email}
                    </span>

                    <button
                      onClick={() => {
                        setMenuAbierto(false);
                        navigate("/perfil");
                      }}
                    >
                      👤 Mi perfil
                    </button>

                    <button
                      onClick={() => {
                        setMenuAbierto(false);
                        alert(
                          "El chat será conectado en el próximo módulo."
                        );
                      }}
                    >
                      💬 Mensajes
                    </button>

                    <button
                      onClick={cerrarSesion}
                    >
                      🚪 Cerrar sesión
                    </button>

                  </div>

                )}

              </div>

            ) : (

              <>

                <button
                  className="btn-login"
                  onClick={() =>
                    navigate("/login")
                  }
                >
                  Iniciar sesión
                </button>

                <button
                  className="btn-primary"
                  onClick={() =>
                    navigate("/registro")
                  }
                >
                  Crear cuenta
                </button>

              </>

            )}

          </div>

        </div>

      </header>


      {/* HERO */}

      <main>

        <section
          id="inicio"
          className="hero"
        >

          <div className="hero-content">

            <div className="hero-badge">
              <span>✦</span>
              Conectamos personas con profesionales
            </div>


            <h1>
              Encontrá el profesional
              <span>
                {" "}que necesitás.
              </span>
            </h1>


            <p>
              Buscá servicios, descubrí trabajadores
              de confianza y contratá personas con
              experiencia cerca tuyo.
            </p>


            <div className="hero-search">

              <span>🔎</span>

              <input
                type="text"
                placeholder="¿Qué servicio estás buscando?"
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
              />

              <button
                onClick={() =>
                  document
                    .getElementById(
                      "publicaciones"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth"
                    })
                }
              >
                Buscar
              </button>

            </div>


            <div className="popular">

              <span>
                Popular:
              </span>

              {[
                "Electricidad",
                "Plomería",
                "Limpieza"
              ].map((item) => (

                <button
                  key={item}
                  onClick={() =>
                    seleccionarCategoria(item)
                  }
                >
                  {item}
                </button>

              ))}

            </div>

          </div>


          <div className="hero-visual">

            <div className="hero-card main-card">

              <div className="hero-card-top">
                <span className="online-dot"></span>
                Profesional disponible
              </div>

              <div className="professional-avatar">
                👨‍🔧
              </div>

              <h3>
                Profesional verificado
              </h3>

              <p>
                Electricidad · Reparaciones
              </p>

              <div className="rating">
                ★★★★★ <span>4.9</span>
              </div>

              <div className="hero-card-location">
                📍 Cerca de tu ubicación
              </div>

            </div>

          </div>

        </section>


        {/* STATS */}

        <section className="stats">

          <div>
            <strong>
              +2.500
            </strong>

            <span>
              Profesionales
            </span>
          </div>

          <div>
            <strong>
              +1.200
            </strong>

            <span>
              Servicios publicados
            </span>
          </div>

          <div>
            <strong>
              4.8 ★
            </strong>

            <span>
              Valoración promedio
            </span>
          </div>

          <div>
            <strong>
              100%
            </strong>

            <span>
              Conectados localmente
            </span>
          </div>

        </section>


        {/* CATEGORIAS */}

        <section
          id="servicios"
          className="section"
        >

          <div className="section-heading">

            <div>

              <span className="eyebrow">
                EXPLORÁ
              </span>

              <h2>
                Encontrá el servicio que necesitás
              </h2>

              <p>
                Elegí una categoría y descubrí
                profesionales especializados.
              </p>

            </div>

          </div>


          <div className="category-grid">

            <button
              className={`category-card ${
                categoriaActiva === "Todos"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                seleccionarCategoria("Todos")
              }
            >

              <div className="category-icon">
                ✨
              </div>

              <strong>
                Todos
              </strong>

              <span>
                Ver todos los servicios
              </span>

            </button>


            {categorias.map((cat) => (

              <button
                className={`category-card ${
                  categoriaActiva === cat.nombre
                    ? "active"
                    : ""
                }`}
                key={cat.nombre}
                onClick={() =>
                  seleccionarCategoria(
                    cat.nombre
                  )
                }
              >

                <div className="category-icon">
                  {cat.icon}
                </div>

                <strong>
                  {cat.nombre}
                </strong>

                <span>
                  {cat.descripcion}
                </span>

              </button>

            ))}

          </div>

        </section>


        {/* PUBLICACIONES */}

        <section
          id="publicaciones"
          className="section publications-section"
        >

          <div className="section-heading">

            <div>

              <span className="eyebrow">
                COMUNIDAD
              </span>

              <h2>
                Publicaciones recientes
              </h2>

              <p>
                Personas que buscan ayuda y
                profesionales que ofrecen sus servicios.
              </p>

            </div>

          </div>


          <div className="filter-bar">

            <div className="filter-search">

              🔎

              <input
                placeholder="Buscar publicaciones..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
              />

            </div>


            <select
              value={categoriaActiva}
              onChange={(e) =>
                setCategoriaActiva(
                  e.target.value
                )
              }
            >

              <option>
                Todos
              </option>

              {categorias.map((cat) => (

                <option
                  key={cat.nombre}
                >
                  {cat.nombre}
                </option>

              ))}

            </select>


            <button
              className="refresh-button"
              onClick={
                cargarPublicaciones
              }
            >
              ↻
            </button>

          </div>


          {cargando ? (

            <div className="empty-state">

              <div className="spinner"></div>

              <h3>
                Cargando publicaciones...
              </h3>

              <p>
                Conectando con Plataforma de Servicios.
              </p>

            </div>

          ) : error ? (

            <div className="error-state">

              <div>
                ⚠️
              </div>

              <h3>
                No pudimos cargar las publicaciones
              </h3>

              <p>
                {error}
              </p>

              <button
                className="btn-primary"
                onClick={
                  cargarPublicaciones
                }
              >
                Reintentar
              </button>

            </div>

          ) : publicacionesFiltradas.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                📭
              </div>

              <h3>
                No encontramos publicaciones
              </h3>

              <p>
                Probá con otra búsqueda.
              </p>

            </div>

          ) : (

            <div className="publication-grid">

              {publicacionesFiltradas.map(
                (publicacion) => (

                  <article
                    className="publication-card"
                    key={publicacion.id}
                  >

                    <div className="publication-header">

                      <div className="publication-avatar">
                        {(publicacion.autor || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <strong>
                          {publicacion.autor ||
                            "Usuario"}
                        </strong>

                        <span>
                          {publicacion.fecha
                            ? new Date(
                                publicacion.fecha
                              ).toLocaleDateString(
                                "es-AR"
                              )
                            : "Reciente"}
                        </span>

                      </div>

                    </div>


                    <div className="publication-body">

                      <span className="publication-type">
                        {publicacion.tipo ||
                          "Servicio"}
                      </span>

                      <h3>
                        {publicacion.contenido ||
                          "Nueva publicación"}
                      </h3>

                      {publicacion.ubicacion && (

                        <p className="location">
                          📍 {publicacion.ubicacion}
                        </p>

                      )}

                      {Array.isArray(
                        publicacion.tags
                      ) &&
                        publicacion.tags.length > 0 && (

                          <div className="tags">

                            {publicacion.tags.map(
                              (tag, index) => (

                                <span key={index}>
                                  #{tag}
                                </span>

                              )
                            )}

                          </div>

                        )}

                    </div>


                    <div className="publication-footer">

                      <span>
                        ❤️ {publicacion.interesados || 0}
                      </span>

                      <span>
                        💬 {publicacion.comentarios || 0}
                      </span>

                      <button
                        className="contact-button"
                        onClick={() => {

                          if (!usuario) {
                            navigate("/login");
                            return;
                          }

                          alert(
                            "El sistema de mensajes será conectado en el próximo módulo."
                          );

                        }}
                      >
                        Contactar
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>


        {/* COMO FUNCIONA */}

        <section
          id="como-funciona"
          className="how-section"
        >

          <div className="section-heading centered">

            <span className="eyebrow">
              SIMPLE Y RÁPIDO
            </span>

            <h2>
              ¿Cómo funciona?
            </h2>

            <p>
              Encontrá ayuda o conseguí nuevos
              clientes en pocos pasos.
            </p>

          </div>


          <div className="steps">

            <div className="step">

              <div className="step-number">
                01
              </div>

              <div className="step-icon">
                🔎
              </div>

              <h3>
                Buscá
              </h3>

              <p>
                Encontrá el servicio que necesitás.
              </p>

            </div>


            <div className="step">

              <div className="step-number">
                02
              </div>

              <div className="step-icon">
                👤
              </div>

              <h3>
                Conocé
              </h3>

              <p>
                Revisá perfiles y experiencia.
              </p>

            </div>


            <div className="step">

              <div className="step-number">
                03
              </div>

              <div className="step-icon">
                💬
              </div>

              <h3>
                Contactá
              </h3>

              <p>
                Comunicate con el profesional.
              </p>

            </div>


            <div className="step">

              <div className="step-number">
                04
              </div>

              <div className="step-icon">
                ⭐
              </div>

              <h3>
                Valorá
              </h3>

              <p>
                Compartí tu experiencia.
              </p>

            </div>

          </div>

        </section>


        {/* CTA */}

        <section className="cta">

          <div>

            <span className="eyebrow">
              ¿TENÉS UN OFICIO?
            </span>

            <h2>
              Mostrá lo que sabés hacer.
            </h2>

            <p>
              Creá tu perfil, publicá tus servicios
              y encontrá nuevas oportunidades.
            </p>

          </div>


          <button
            className="btn-light"
            onClick={() =>
              navigate("/registro")
            }
          >
            Empezar ahora →
          </button>

        </section>

      </main>


      {/* FOOTER */}

      <footer className="footer">

        <div className="footer-inner">

          <div className="footer-brand">

            <div className="brand">

              <div className="brand-logo">
                PS
              </div>

              <div>

                <strong>
                  Plataforma
                </strong>

                <span>
                  Servicios & Oficios
                </span>

              </div>

            </div>

            <p>
              Conectamos personas,
              profesionales y oportunidades.
            </p>

          </div>


          <div className="footer-links">

            <div>

              <strong>
                Plataforma
              </strong>

              <a href="#servicios">
                Servicios
              </a>

              <a href="#publicaciones">
                Publicaciones
              </a>

              <a href="#como-funciona">
                Cómo funciona
              </a>

            </div>

            <div>

              <strong>
                Comunidad
              </strong>

              <a href="/login">
                Iniciar sesión
              </a>

              <a href="/registro">
                Crear cuenta
              </a>

            </div>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 Plataforma de Servicios y Oficios
          </span>

          <span>
            React + Spring Boot + MariaDB
          </span>

        </div>

      </footer>

    </div>
  );
}


export default App;
