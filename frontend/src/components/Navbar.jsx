import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ usuario, onCerrarSesion, zonaSeleccionada, onCambiarZona }) {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <div className="brand-logo">PS</div>
          <div>
            <strong>Plataforma</strong>
            <span>Servicios & Oficios</span>
          </div>
        </Link>

        <nav className="nav-links">
          <a href="/#inicio">Inicio</a>
          <a href="/#servicios">Servicios</a>
          <a href="/#publicaciones">Publicaciones</a>
          <a href="/#como-funciona">Cómo funciona</a>
          <Link to="/usuarios">Usuarios</Link>
        </nav>

        {onCambiarZona && (
          <div className="zone-selector" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px" }}>📍</span>
            <select
              value={zonaSeleccionada || "Todas"}
              onChange={(e) => onCambiarZona(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid var(--border-color, #ccc)",
                backgroundColor: "var(--card-bg, #fff)",
                color: "inherit",
                fontSize: "13px"
              }}
            >
              <option value="Todas">Todas las zonas</option>
              <option value="Córdoba">Córdoba</option>
              <option value="Buenos Aires">Buenos Aires</option>
              <option value="Rosario">Rosario</option>
              <option value="Mendoza">Mendoza</option>
              <option value="Santa Fe">Santa Fe</option>
            </select>
          </div>
        )}

        <div className="navbar-actions">
          {usuario ? (
            <div className="user-menu">
              <button
                className="avatar-button"
                onClick={() => setMenuAbierto(!menuAbierto)}
              >
                {(usuario.nombre || "U").charAt(0).toUpperCase()}
              </button>

              {menuAbierto && (
                <div className="user-dropdown">
                  <strong>{usuario.nombre}</strong>
                  <span className="dropdown-email">{usuario.email}</span>
                  {usuario.rol && (
                    <span style={{ fontSize: "11px", color: "var(--primary, #0284c7)", fontWeight: "600", textTransform: "uppercase" }}>
                      {usuario.rol.replace("ROL_", "")}
                    </span>
                  )}

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
                      navigate("/mensajes");
                    }}
                  >
                    💬 Mensajes
                  </button>

                  <button
                    onClick={() => {
                      setMenuAbierto(false);
                      navigate("/usuarios");
                    }}
                  >
                    👥 Panel de usuarios
                  </button>

                  <button
                    onClick={() => {
                      setMenuAbierto(false);
                      onCerrarSesion();
                    }}
                  >
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
  );
}
