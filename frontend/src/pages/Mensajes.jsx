import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { obtenerConversacion, enviarMensaje } from "../conexionPersonas";

export default function Mensajes() {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(null);
  const [receptor, setReceptor] = useState(location.state?.receptor || "");
  const [mensajes, setMensajes] = useState([]);
  const [contenido, setContenido] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const emisor = usuario?.nombre || usuario?.email ||
    usuario?.username || usuario?.nombreUsuario || "";

  useEffect(() => {
    try {
      const guardado = localStorage.getItem("usuario");
      if (guardado) setUsuario(JSON.parse(guardado));
    } catch {
      localStorage.removeItem("usuario");
      setError("No se pudo leer la sesión. Iniciá sesión nuevamente.");
    }
  }, []);

  useEffect(() => {
    setReceptor(location.state?.receptor || "");
  }, [location.state]);

  useEffect(() => {
    if (!emisor || !receptor || emisor === receptor) {
      setMensajes([]);
      return;
    }

    let cancelado = false;

    async function cargar() {
      setCargando(true);
      setError("");
      try {
        const resultado = await obtenerConversacion(emisor, receptor);
        if (!cancelado) {
          setMensajes(Array.isArray(resultado) ? resultado : []);
        }
      } catch (e) {
        if (!cancelado) {
          setError("No se pudo cargar la conversación. Verificá el backend.");
          console.error(e);
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargar();
    return () => { cancelado = true; };
  }, [emisor, receptor]);

  async function enviar(e) {
    e.preventDefault();
    const texto = contenido.trim();

    if (!emisor) {
      navigate("/login");
      return;
    }

    if (!receptor || emisor === receptor || !texto || enviando) return;

    setEnviando(true);
    setError("");

    try {
      const nuevo = await enviarMensaje(emisor, receptor, texto);
      setMensajes(actuales => [...actuales, nuevo]);
      setContenido("");
    } catch (e) {
      console.error(e);
      setError(e.message || "No se pudo enviar el mensaje.");
    } finally {
      setEnviando(false);
    }
  }

  if (!usuario) {
    return (
      <main style={{ maxWidth: 760, margin: "40px auto", padding: 24 }}>
        <h1>Mensajes</h1>
        <p>Iniciá sesión para acceder a tus conversaciones.</p>
        <button onClick={() => navigate("/login")}>Iniciar sesión</button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 760, margin: "32px auto", padding: 20 }}>
      <button type="button" onClick={() => navigate("/")}>← Volver al inicio</button>
      <h1>Mensajes</h1>

      {!receptor ? (
        <section style={{ padding: 20, border: "1px solid #ddd", borderRadius: 12 }}>
          <p>Para comenzar una conversación, volvé a las publicaciones y seleccioná Contactar.</p>
        </section>
      ) : (
        <>
          <h2>Conversación con {receptor}</h2>
          <section
            aria-live="polite"
            style={{
              minHeight: 220, maxHeight: 420, overflowY: "auto",
              padding: 16, border: "1px solid #ddd", borderRadius: 12,
              marginBottom: 16, display: "flex", flexDirection: "column", gap: 10
            }}
          >
            {cargando && <p>Cargando mensajes...</p>}
            {!cargando && mensajes.length === 0 &&
              <p>Todavía no hay mensajes. Podés iniciar la conversación.</p>}

            {mensajes.map(m => (
              <article
                key={m.id}
                style={{
                  alignSelf: m.emisor === emisor ? "flex-end" : "flex-start",
                  maxWidth: "85%", padding: "10px 14px", borderRadius: 12,
                  background: m.emisor === emisor ? "#e4f3e8" : "#f0f0f0"
                }}
              >
                <strong>{m.emisor === emisor ? "Vos" : m.emisor}</strong>
                <p style={{ margin: "6px 0", whiteSpace: "pre-wrap" }}>{m.contenido}</p>
                {m.fechaEnvio && (
                  <small>{new Date(m.fechaEnvio).toLocaleString("es-AR")}</small>
                )}
              </article>
            ))}
          </section>

          <form onSubmit={enviar} style={{ display: "flex", gap: 8 }}>
            <input
              value={contenido}
              onChange={e => setContenido(e.target.value)}
              placeholder="Escribí tu mensaje..."
              aria-label="Mensaje"
              maxLength={5000}
              required
              style={{ flex: 1, minWidth: 0, padding: 12 }}
            />
            <button type="submit" disabled={enviando || !contenido.trim()}>
              {enviando ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </>
      )}

      {error && <p role="alert" style={{ color: "#b42318" }}>{error}</p>}
    </main>
  );
}