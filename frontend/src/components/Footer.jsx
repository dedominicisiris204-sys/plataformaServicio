import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand">
            <div className="brand-logo">PS</div>
            <div>
              <strong>Plataforma</strong>
              <span>Servicios & Oficios</span>
            </div>
          </div>
          <p>
            Conectamos personas, profesionales y oportunidades.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <strong>Plataforma</strong>
            <a href="#servicios">Servicios</a>
            <a href="#publicaciones">Publicaciones</a>
            <a href="#como-funciona">Cómo funciona</a>
          </div>

          <div>
            <strong>Comunidad</strong>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/registro">Crear cuenta</Link>
            <Link to="/usuarios">Comunidad de usuarios</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Plataforma de Servicios y Oficios</span>
        <span>React + Spring Boot + MySQL</span>
      </div>
    </footer>
  );
}
