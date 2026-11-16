import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "/api";

export default function Login({ onLoginExitoso, tema: temaProp, toggleTema: toggleTemaProp }) {
  const navigate = useNavigate();

  /* ── Tema propio (si se usa fuera del Dashboard) ── */
  const [temaLocal, setTemaLocal] = useState(
    () => temaProp || localStorage.getItem("tema") || "light"
  );
  const tema = temaProp ?? temaLocal;
  const toggleTema = toggleTemaProp ?? (() => {
    setTemaLocal(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("tema", next);
      document.documentElement.setAttribute("data-theme", next);
      document.body.setAttribute("data-theme", next);
      return next;
    });
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    document.body.setAttribute("data-theme", tema);
  }, [tema]);

  /* ── Formulario ── */
  const [form, setForm] = useState({ email: "", password: "" });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const cambiar = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const manejarLogin = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError("Por favor completá todos los campos.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      const res = await fetch(`${API}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), password: form.password })
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Error ${res.status}`);
      }
      const data = await res.json();
      localStorage.setItem("usuario", JSON.stringify(data));
      if (onLoginExitoso) {
        onLoginExitoso(data);
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg = String(err.message || "");
      if (/401|credencial|contrase|invalid/i.test(msg)) {
        setError("Email o contrasena incorrectos. Verifica tus datos.");
      } else if (/network|fetch/i.test(msg)) {
        setError("No se pudo conectar al servidor. Verifica tu conexion.");
      } else {
        setError(msg || "Error al iniciar sesion. Intentalo nuevamente.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--background-site);
          background-attachment: fixed;
          color: var(--text);
          transition: background 0.25s ease, color 0.25s ease;
        }

        .login-topbar {
          height: 60px;
          background: var(--topbar-bg);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .login-topbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 15px;
          color: var(--text);
          text-decoration: none;
        }

        .login-topbar-logo {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0d9488, #2563eb);
          color: white;
          display: grid;
          place-items: center;
          font-weight: 900;
          font-size: 13px;
        }

        .login-topbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-login-theme {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 13px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface-soft);
          color: var(--text);
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-login-theme:hover {
          background: var(--surface-hover);
        }

        .btn-login-register {
          padding: 7px 15px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface-card);
          color: var(--text);
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.15s ease;
        }
        .btn-login-register:hover {
          background: var(--surface-hover);
        }

        .login-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .login-wrapper {
          width: 100%;
          max-width: 460px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .login-hero-text {
          text-align: center;
        }

        .login-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--primary-light);
          color: var(--primary);
          border: 1px solid rgba(13, 148, 136, 0.25);
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin-bottom: 14px;
        }

        .login-hero-text h1 {
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 900;
          margin: 0 0 8px;
          color: var(--text);
          letter-spacing: -0.5px;
        }

        .login-hero-text p {
          font-size: 14.5px;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.6;
        }

        .login-card {
          background: var(--surface-card);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 36px 32px;
          box-shadow: var(--card-shadow);
        }

        .login-card h2 {
          font-size: 20px;
          font-weight: 800;
          margin: 0 0 6px;
          color: var(--text);
        }

        .login-card-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0 0 26px;
        }

        .login-field {
          display: grid;
          gap: 7px;
          margin-bottom: 18px;
        }

        .login-field label {
          font-size: 12.5px;
          font-weight: 800;
          color: var(--text-secondary);
        }

        .login-field input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--input-bg);
          color: var(--text);
          font-size: 14.5px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .login-field input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.14);
        }

        .login-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 15px;
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 600;
          margin-bottom: 18px;
          line-height: 1.4;
        }

        .btn-login-submit {
          width: 100%;
          padding: 13px 20px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #0d9488, #2563eb);
          color: white;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 6px 20px rgba(13, 148, 136, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(13, 148, 136, 0.4);
        }

        .btn-login-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          color: var(--text-muted);
          font-size: 12px;
        }

        .login-divider::before,
        .login-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .login-footer-links {
          text-align: center;
          font-size: 13px;
          color: var(--text-muted);
        }

        .login-footer-links a {
          color: var(--primary);
          font-weight: 700;
          text-decoration: none;
        }

        .login-footer-links a:hover {
          text-decoration: underline;
        }

        .login-benefits {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .login-benefit-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 11px 13px;
          font-size: 12.5px;
          color: var(--text-secondary);
          font-weight: 600;
        }
      `}</style>

      <div className="login-page">
        {/* TOPBAR */}
        <header className="login-topbar">
          <Link to="/" className="login-topbar-brand">
            <div className="login-topbar-logo">PS</div>
            <span>Plataforma de Servicios</span>
          </Link>

          <div className="login-topbar-actions">
            <button
              type="button"
              className="btn-login-theme"
              onClick={toggleTema}
              title={tema === "dark" ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
            >
              <span>{tema === "dark" ? "☀️" : "🌙"}</span>
              <span>{tema === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
            </button>

            <Link to="/registro" className="btn-login-register">
              Crear cuenta →
            </Link>
          </div>
        </header>

        {/* BODY */}
        <div className="login-body">
          <div className="login-wrapper">
            {/* Texto hero */}
            <div className="login-hero-text">
              <div className="login-hero-badge">
                ✦ Conectamos profesionales con la comunidad
              </div>
              <h1>Bienvenido/a de vuelta</h1>
              <p>
                Inicia sesion para ver trabajos, publicar servicios y conectarte con profesionales verificados.
              </p>
            </div>

            {/* Card del formulario */}
            <div className="login-card">
              <h2>🔐 Iniciar Sesion</h2>
              <p className="login-card-subtitle">
                Ingresa con tu email y contrasena registrados
              </p>

              {error && (
                <div className="login-error">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={manejarLogin} noValidate>
                <div className="login-field">
                  <label htmlFor="login-email">Correo electronico</label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={cambiar}
                    placeholder="tucorreo@email.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="login-field">
                  <label htmlFor="login-password">Contrasena</label>
                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={cambiar}
                    placeholder="Tu contrasena"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-login-submit"
                  disabled={cargando}
                >
                  {cargando ? (
                    <span>Iniciando sesion...</span>
                  ) : (
                    <span>Ingresar a la Plataforma</span>
                  )}
                </button>
              </form>

              <div className="login-divider">o bien</div>

              <div className="login-footer-links">
                No tenes cuenta?{" "}
                <Link to="/registro">Registrate gratis aqui</Link>
              </div>
            </div>

            {/* Beneficios de la plataforma */}
            <div className="login-benefits">
              <div className="login-benefit-item">
                <span>🛠️</span>
                <span>Publica tus servicios</span>
              </div>
              <div className="login-benefit-item">
                <span>🔍</span>
                <span>Encuentra profesionales</span>
              </div>
              <div className="login-benefit-item">
                <span>⭐</span>
                <span>Valora del 1 al 5</span>
              </div>
              <div className="login-benefit-item">
                <span>💬</span>
                <span>Chatea en tiempo real</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
