import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BotonVolver from "../components/BotonVolver";
import { responseMessage } from "../apiFetch";

const API = "/api";

export default function Registro() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("ROL_CLIENTE");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  async function registrar(e) {
    e.preventDefault();
    setError("");
    setExito("");

    if (!nombre || !email || !password) {
      setError("Completá todos los campos.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Ingresá un correo electrónico válido.");
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
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/plain, application/json"
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
          rol
        })
      });

      if (response.status === 409) {
        setError("Ese correo electrónico ya está registrado.");
        return;
      }

      if (!response.ok) {
        throw new Error(await responseMessage(response, `Error HTTP ${response.status}`));
      }

      setExito("¡Cuenta creada correctamente! Ahora iniciá sesión.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
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
            Registrate para ofrecer tus servicios, buscar profesionales y conectar con personas.
          </p>

          {error && <div className="auth-error">⚠️ {error}</div>}
          {exito && <div className="auth-success">✓ {exito}</div>}

          <form onSubmit={registrar}>
            <label>Nombre completo</label>
            <input
              type="text"
              placeholder="Tu nombre y apellido"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="name"
              required
              maxLength={100}
            />

            <label>Tipo de cuenta</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginBottom: "14px",
                borderRadius: "8px",
                border: "1px solid var(--border-color, #ccc)"
              }}
            >
              <option value="ROL_CLIENTE">👤 Busco contratar servicios (Cliente)</option>
              <option value="ROL_PROFESIONAL">🔨 Ofrezco servicios profesionales (Especialista)</option>
            </select>

            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              maxLength={100}
            />

            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
            />

            <button
              className="btn-primary auth-submit"
              type="submit"
              disabled={cargando}
            >
              {cargando ? "Creando cuenta..." : "Crear mi cuenta →"}
            </button>
          </form>

          <p className="auth-footer-text">
            ¿Ya tenés una cuenta?{" "}
            <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
