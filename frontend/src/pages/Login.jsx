import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BotonVolver from "../components/BotonVolver";

const API = "/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function iniciarSesion(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completá todos los campos.");
      return;
    }

    try {
      setCargando(true);

      const response = await fetch(`${API}/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
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
    } catch (err) {
      console.error(err);
      setError("No pudimos conectar con el servidor. Verificá que Spring Boot esté funcionando.");
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
          <div className="auth-icon">🔐</div>
          <span className="eyebrow">BIENVENIDO/A</span>
          <h1>Iniciar sesión</h1>
          <p className="auth-description">
            Entrá a tu cuenta para encontrar profesionales, publicar servicios y comunicarte con la comunidad.
          </p>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={iniciarSesion}>
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <label>Contraseña</label>
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
              {cargando ? "Ingresando..." : "Iniciar sesión →"}
            </button>
          </form>

          <div className="auth-divider">
            <span>o</span>
          </div>

          <p className="auth-footer-text">
            ¿Todavía no tenés una cuenta?{" "}
            <Link to="/registro">Crear cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
