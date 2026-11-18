import React, { useEffect, useState, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  obtenerConversacion,
  enviarMensaje,
  obtenerTodosLosMensajes,
  eliminarMensaje,
  obtenerUsuarios
} from "../conexionPersonas";
import Sidebar from "../components/Sidebar";

const RESPUESTAS_RAPIDAS = [
  "👋 Hola, ¿tenés disponibilidad para esta semana?",
  "💼 Hola, me gustaría pedirte un presupuesto.",
  "📍 ¿En qué zona estás trabajando actualmente?",
  "⭐ Vi tus calificaciones de 5 estrellas y me gustaría coordinar.",
  "✅ Perfecto, coordinamos los detalles."
];

const EMOJIS_RAPIDOS = ["😊", "👍", "💼", "🛠️", "📍", "⭐", "✅", "👋", "🙌", "💬"];

export default function Mensajes() {
  const navigate = useNavigate();
  const location = useLocation();
  const mensajesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sesión del usuario
  const [usuario, setUsuario] = useState(() => {
    try {
      const guardado = localStorage.getItem("usuario");
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      localStorage.removeItem("usuario");
      return null;
    }
  });

  // Tema Claro / Oscuro
  const [tema, setTema] = useState(() => {
    return localStorage.getItem("tema") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    document.body.setAttribute("data-theme", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);

  const toggleTema = () => {
    setTema((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Barra lateral
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  // Estados de mensajería
  const [receptor, setReceptor] = useState(location.state?.receptor || "");
  const [mensajes, setMensajes] = useState([]);
  const [contenido, setContenido] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  // Directorio y conversaciones
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([]);
  const [todosLosMensajes, setTodosLosMensajes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pestanaDirectorio, setPestanaDirectorio] = useState("chats"); // "chats" | "contactos"
  const [mostrarEmojis, setMostrarEmojis] = useState(false);

  // Nuevas funciones avanzadas de mensajería
  const [mensajeCitado, setMensajeCitado] = useState(null); // { id, emisor, contenido }
  const [mostrarPresupuesto, setMostrarPresupuesto] = useState(false);
  const [presupuestoForm, setPresupuestoForm] = useState({
    servicio: "",
    monto: "",
    plazo: "En el día · Garantía escrita"
  });
  const [busquedaEnChat, setBusquedaEnChat] = useState("");
  const [mostrarBuscadorChat, setMostrarBuscadorChat] = useState(false);
  const [imagenAdjunta, setImagenAdjunta] = useState("");
  const [imagenFullscreen, setImagenFullscreen] = useState(null);
  const fileInputRef = useRef(null);
  const [publicacionContexto, setPublicacionContexto] = useState(
    location.state?.publicacionContexto || null
  );

  const emisor =
    usuario?.nombre || usuario?.email || usuario?.username || usuario?.nombreUsuario || "";

  // Desplazar al último mensaje
  const scrollAlFinal = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollAlFinal();
  }, [mensajes]);

  // Si viene con receptor desde una publicación o enlace
  useEffect(() => {
    if (location.state?.receptor) {
      setReceptor(location.state.receptor);
    }
    if (location.state?.publicacionContexto) {
      setPublicacionContexto(location.state.publicacionContexto);
    }
  }, [location.state]);

  // 1. Cargar usuarios del sistema y mensajes generales
  const cargarDirectorio = async () => {
    try {
      const [listaUsuarios, listaMensajes] = await Promise.allSettled([
        obtenerUsuarios(),
        obtenerTodosLosMensajes()
      ]);

      if (listaUsuarios.status === "fulfilled" && Array.isArray(listaUsuarios.value)) {
        setUsuariosRegistrados(listaUsuarios.value);
      }
      if (listaMensajes.status === "fulfilled" && Array.isArray(listaMensajes.value)) {
        setTodosLosMensajes(listaMensajes.value);
      }
    } catch (e) {
      console.error("Error al cargar directorio:", e);
    }
  };

  useEffect(() => {
    if (usuario) {
      cargarDirectorio();
    }
  }, [usuario]);

  // Polling cada 3.5 segundos para tener sincronización en vivo
  useEffect(() => {
    if (!usuario || !emisor) return;

    const intervalo = setInterval(() => {
      cargarDirectorio();
      if (receptor && emisor) {
        obtenerConversacion(emisor, receptor)
          .then((resultado) => {
            if (Array.isArray(resultado)) {
              setMensajes(resultado);
            }
          })
          .catch(() => {});
      }
    }, 3500);

    return () => clearInterval(intervalo);
  }, [usuario, emisor, receptor]);

  // 2. Cargar conversación activa cuando cambia el receptor
  useEffect(() => {
    if (!emisor || !receptor) {
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
          console.error(e);
          setError("No se pudieron cargar los mensajes. Verifica que el backend esté activo.");
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, [emisor, receptor]);

  const seleccionarImagenChat = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("La imagen no debe superar los 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenAdjunta(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 3. Enviar mensaje (soporta cita de mensaje, presupuesto estructurado y fotos)
  const manejarEnviar = async (e, textoPersonalizado) => {
    if (e && e.preventDefault) e.preventDefault();
    let texto = (textoPersonalizado || contenido).trim();

    if (!textoPersonalizado && imagenAdjunta) {
      texto = texto ? `[IMG_CHAT]:${imagenAdjunta}\n${texto}` : `[IMG_CHAT]:${imagenAdjunta}`;
    }

    if (!emisor) {
      navigate("/login");
      return;
    }
    if (!receptor || !texto || enviando) return;

    // Si está respondiendo/citando un mensaje específico del chat
    if (!textoPersonalizado && mensajeCitado) {
      const fragmento = (mensajeCitado.contenido || "").replace(/\r?\n/g, " ").slice(0, 90);
      texto = `❝ @${mensajeCitado.emisor}: "${fragmento}"\n↳ ${texto}`;
    }

    setEnviando(true);
    setError("");

    try {
      const nuevo = await enviarMensaje(emisor, receptor, texto);
      setMensajes((actuales) => [...actuales, nuevo]);
      setContenido("");
      setImagenAdjunta("");
      setMensajeCitado(null);
      setMostrarEmojis(false);
      cargarDirectorio();
      setTimeout(scrollAlFinal, 80);
      inputRef.current?.focus();
    } catch (e) {
      console.error(e);
      setError(e.message || "No se pudo enviar el mensaje.");
    } finally {
      setEnviando(false);
    }
  };

  const enviarPresupuestoRapido = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!presupuestoForm.servicio.trim() || !presupuestoForm.monto.trim()) return;
    const textoPresupuesto =
      `📋 PRESUPUESTO PROFESIONAL\n` +
      `🛠️ Trabajo: ${presupuestoForm.servicio.trim()}\n` +
      `💰 Valor estimado: $${presupuestoForm.monto.trim()}\n` +
      `⏱️ Disponibilidad: ${presupuestoForm.plazo.trim() || "A coordinar"}`;

    await manejarEnviar(null, textoPresupuesto);
    setPresupuestoForm({ servicio: "", monto: "", plazo: "En el día · Garantía escrita" });
    setMostrarPresupuesto(false);
  };

  // 4. Eliminar mensaje
  const manejarEliminarMensaje = async (id) => {
    if (!window.confirm("¿Deseas eliminar este mensaje?")) return;
    try {
      await eliminarMensaje(id);
      setMensajes((prev) => prev.filter((m) => m.id !== id));
      cargarDirectorio();
    } catch {
      alert("No se pudo eliminar el mensaje.");
    }
  };

  // 5. Lista procesada de chats activos (agrupando por usuario con el que se conversó)
  const listaConversaciones = useMemo(() => {
    if (!emisor) return [];
    const mapa = new Map();

    // Recorremos los mensajes para extraer el último de cada persona
    (todosLosMensajes || []).forEach((msg) => {
      const otro = msg.emisor === emisor ? msg.receptor : msg.receptor === emisor ? msg.emisor : null;
      if (!otro || otro === emisor) return;

      const existente = mapa.get(otro);
      if (!existente || new Date(msg.fechaEnvio) > new Date(existente.fechaEnvio)) {
        mapa.set(otro, {
          nombre: otro,
          ultimoMensaje: msg.contenido,
          fechaEnvio: msg.fechaEnvio,
          esMio: msg.emisor === emisor
        });
      }
    });

    const arr = Array.from(mapa.values());
    arr.sort((a, b) => new Date(b.fechaEnvio) - new Date(a.fechaEnvio));
    return arr;
  }, [todosLosMensajes, emisor]);

  // Filtrado de chats y contactos por búsqueda
  const conversacionesFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return listaConversaciones;
    return listaConversaciones.filter((c) => c.nombre.toLowerCase().includes(q));
  }, [listaConversaciones, busqueda]);

  const contactosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return (usuariosRegistrados || []).filter((u) => {
      const nom = (u.nombre || "").toLowerCase();
      const em = (u.email || "").toLowerCase();
      const ofi = (u.perfil?.oficio || "").toLowerCase();
      const esMio = nom === emisor.toLowerCase() || em === emisor.toLowerCase();
      if (esMio) return false;

      return !q || nom.includes(q) || em.includes(q) || ofi.includes(q);
    });
  }, [usuariosRegistrados, busqueda, emisor]);

  // Si no está autenticado, redirigir a Login
  if (!usuario) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--background-site)",
          color: "var(--text)",
          padding: 24
        }}
      >
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            background: "var(--surface-card)",
            border: "1px solid var(--border)",
            borderRadius: 24,
            padding: 36,
            textAlign: "center",
            boxShadow: "var(--card-shadow)"
          }}
        >
          <div style={{ fontSize: 50, marginBottom: 12 }}>🔒</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Inicia Sesión Primero</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.5 }}>
            Para acceder al Centro de Mensajería y chatear con los profesionales y clientes,
            necesitas iniciar sesión en tu cuenta.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              width: "100%",
              padding: "12px 20px",
              background: "linear-gradient(135deg, #0d9488, #2563eb)",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer"
            }}
          >
            Iniciar Sesión
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className={`chat-layout-root ${receptor ? "chat-has-active-conversation" : "chat-show-conversation-list"}`}>
      <style>{`
        .chat-layout-root {
          display: flex;
          height: 100dvh;
          min-height: 0;
          width: 100%;
          max-width: 100vw;
          overflow: hidden;
          background: var(--background-site);
          color: var(--text);
          font-family: inherit;
        }

        .chat-main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          min-width: 0;
        }

        .chat-topbar {
          height: 64px;
          min-height: 64px;
          background: var(--topbar-bg);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 22px;
          z-index: 30;
        }

        .chat-container-split {
          flex: 1;
          display: flex;
          overflow: hidden;
          height: calc(100vh - 64px);
        }

        /* Panel Izquierdo: Lista de Chats y Contactos */
        .chat-sidebar-pane {
          width: 360px;
          min-width: 320px;
          max-width: 400px;
          background: var(--chat-sidebar-bg);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .chat-search-wrap {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chat-search-input {
          width: 100%;
          padding: 9px 14px;
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text);
          font-size: 13.5px;
          outline: none;
        }
        .chat-search-input:focus {
          border-color: var(--primary);
        }

        .chat-tabs-wrap {
          display: flex;
          gap: 6px;
          background: var(--surface-soft);
          padding: 4px;
          border-radius: 10px;
        }

        .chat-tab-btn {
          flex: 1;
          padding: 6px 10px;
          font-size: 12.5px;
          font-weight: 700;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .chat-tab-btn.active {
          background: var(--surface-card);
          color: var(--primary);
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .chat-conversations-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .conversation-card-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 1px solid transparent;
          text-align: left;
          background: transparent;
          width: 100%;
        }
        .conversation-card-item:hover {
          background: var(--surface-hover);
        }
        .conversation-card-item.selected {
          background: var(--primary-light);
          border-color: rgba(13, 148, 136, 0.25);
        }

        .chat-avatar-circle {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0d9488, #2563eb);
          color: white;
          display: grid;
          place-items: center;
          font-weight: 800;
          font-size: 16px;
          position: relative;
        }

        .online-status-dot {
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: 11px;
          height: 11px;
          background: #22c55e;
          border: 2px solid var(--surface-card);
          border-radius: 50%;
        }

        /* Panel Derecho: Ventana de Conversación Activa */
        .chat-window-pane {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--chat-bg);
          position: relative;
        }

        .chat-conversation-header {
          height: 64px;
          padding: 0 20px;
          background: var(--surface-card);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
        }

        .chat-messages-timeline {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bubble-row {
          display: flex;
          width: 100%;
        }
        .bubble-row.sent {
          justify-content: flex-end;
        }
        .bubble-row.received {
          justify-content: flex-start;
        }

        .chat-bubble {
          max-width: 72%;
          padding: 11px 16px;
          border-radius: 18px;
          font-size: 14.5px;
          line-height: 1.5;
          position: relative;
          word-break: break-word;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .chat-bubble.sent {
          background: var(--chat-bubble-sent);
          color: var(--chat-bubble-sent-text);
          border-bottom-right-radius: 4px;
        }

        .chat-bubble.received {
          background: var(--chat-bubble-received);
          color: var(--chat-bubble-received-text);
          border: 1px solid var(--chat-bubble-received-border);
          border-bottom-left-radius: 4px;
        }

        .bubble-meta {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 5px;
          margin-top: 4px;
          font-size: 11px;
          opacity: 0.85;
        }

        .bubble-delete-btn {
          opacity: 0;
          background: transparent;
          border: none;
          color: inherit;
          cursor: pointer;
          font-size: 12px;
          padding: 0 4px;
          transition: opacity 0.15s ease;
        }
        .chat-bubble:hover .bubble-delete-btn {
          opacity: 0.9;
        }

        /* Chips de Respuestas Rápidas */
        .chat-quick-replies-bar {
          padding: 8px 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          background: var(--surface-soft);
          border-top: 1px solid var(--border);
        }

        .quick-reply-chip {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: var(--surface-card);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .quick-reply-chip:hover {
          background: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        /* Barra de Envío */
        .chat-input-bar {
          padding: 12px 18px;
          background: var(--surface-card);
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chat-text-input {
          flex: 1;
          padding: 12px 18px;
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: 24px;
          color: var(--text);
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .chat-text-input:focus {
          border-color: var(--primary);
        }

        .btn-chat-send {
          padding: 11px 22px;
          border-radius: 24px;
          border: none;
          background: linear-gradient(135deg, #0d9488, #2563eb);
          color: white;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.3);
        }
        .btn-chat-send:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(13, 148, 136, 0.4);
        }
        .btn-chat-send:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Selector de emojis flotante */
        .emoji-selector-popover {
          padding: 8px 14px;
          display: flex;
          gap: 8px;
          background: var(--surface-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          margin-bottom: 6px;
        }

        .mobile-chat-back { display: none; }

        @media (max-width: 760px) {
          .chat-layout-root { height: 100dvh; overflow: hidden; }
          .chat-layout-root > .dashboard-sidebar { display: none !important; }
          .chat-main-area { width: 100%; height: 100dvh; min-width: 0; }
          .chat-topbar { height: 54px; min-height: 54px; padding: 0 12px; }
          .chat-topbar > * { min-width: 0; }
          .chat-container-split { position: relative; height: calc(100dvh - 54px); min-height: 0; }
          .chat-sidebar-pane, .chat-window-pane { width: 100%; min-width: 0; max-width: none; height: 100%; }
          .chat-sidebar-pane, .chat-window-pane { flex: 1 1 100%; }
          .chat-has-active-conversation .chat-sidebar-pane { display: none; }
          .chat-show-conversation-list .chat-window-pane { display: none; }
          .chat-search-wrap { padding: 12px; }
          .conversation-card-item { padding: 11px 10px; }
          .chat-conversation-header { height: auto; min-height: 62px; padding: 8px 10px; gap: 8px; }
          .chat-conversation-header > div:first-of-type { gap: 8px !important; min-width: 0; }
          .chat-conversation-header > div:first-of-type > div:last-child { min-width: 0; }
          .chat-conversation-header > div:first-of-type span { display: none; }
          .chat-conversation-header > div:last-child { justify-content: flex-end; flex-wrap: nowrap !important; gap: 4px !important; max-width: 58%; overflow-x: auto; }
          .chat-conversation-header > div:last-child button { flex: 0 0 auto; padding: 6px 7px !important; font-size: 10px !important; white-space: nowrap; }
          .mobile-chat-back { display: inline-flex; align-items: center; justify-content: center; flex: 0 0 36px; height: 36px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-soft); color: var(--text); font-size: 18px; }
          .chat-messages-timeline { padding: 14px 10px; }
          .chat-bubble { max-width: 88%; padding: 10px 12px; font-size: 14px; }
          .chat-quick-replies-bar { padding: 8px 10px; }
          .chat-input-bar { padding: 9px 10px max(9px, env(safe-area-inset-bottom)); gap: 7px; }
          .chat-text-input { min-width: 0; padding: 11px 14px; }
          .btn-chat-send { padding: 11px 14px; }
        }

        @media (max-width: 400px) {
          .chat-topbar { padding: 0 8px; }
          .chat-topbar span { font-size: 11px !important; }
          .chat-avatar-circle { width: 38px !important; height: 38px !important; min-width: 38px !important; }
        }
      `}</style>

      {/* 1. Sidebar lateral completo del sistema */}
      <Sidebar
        seccionActiva="mensajes"
        setSeccionActiva={(sec) => navigate(`/?sec=${sec}`)}
        abrirModalPublicar={() => navigate("/?sec=publicaciones&publicar=1")}
        usuario={usuario}
        onCerrarSesion={() => {
          localStorage.removeItem("usuario");
          navigate("/login");
        }}
        notificacionesNoLeidas={3}
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto}
        tema={tema}
        toggleTema={toggleTema}
      />

      {/* 2. Área principal de Mensajería */}
      <div className="chat-main-area">
        {/* Topbar Superior */}
        <header className="chat-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {!sidebarAbierto && (
              <button
                type="button"
                onClick={() => setSidebarAbierto(true)}
                title="Abrir menú lateral"
                style={{
                  background: "linear-gradient(135deg, #0d9488, #2563eb)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 800
                }}
              >
                ☰ Menú
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                background: "var(--surface-soft)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                padding: "6px 12px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              ← Volver al Inicio
            </button>

            <h1 style={{ fontSize: 17, fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <span>💬</span> Centro de Mensajes y Consultas
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              onClick={toggleTema}
              className="btn-theme-toggle"
              title={tema === "dark" ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
            >
              <span>{tema === "dark" ? "☀️" : "🌙"}</span>
              <span>{tema === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--surface-soft)",
                padding: "5px 12px",
                borderRadius: 999,
                border: "1px solid var(--border)"
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0d9488, #2563eb)",
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 12,
                  fontWeight: 800
                }}
              >
                {(usuario.nombre || "U").charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{usuario.nombre}</span>
              <span style={{ fontSize: 10, color: "#16a34a", fontWeight: 700 }}>● Conectado</span>
            </div>
          </div>
        </header>

        {/* Contenedor Dividido: Chats + Ventana de Conversación */}
        <div className="chat-container-split">
          {/* Panel Izquierdo: Lista de Chats y Directorio */}
          <aside className="chat-sidebar-pane">
            <div className="chat-search-wrap">
              <input
                type="text"
                className="chat-search-input"
                placeholder="🔍 Buscar persona, oficio o mensaje..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <div className="chat-tabs-wrap">
                <button
                  type="button"
                  className={`chat-tab-btn ${pestanaDirectorio === "chats" ? "active" : ""}`}
                  onClick={() => setPestanaDirectorio("chats")}
                >
                  Conversaciones ({listaConversaciones.length})
                </button>
                <button
                  type="button"
                  className={`chat-tab-btn ${pestanaDirectorio === "contactos" ? "active" : ""}`}
                  onClick={() => setPestanaDirectorio("contactos")}
                >
                  Directorio ({contactosFiltrados.length})
                </button>
              </div>
            </div>

            <div className="chat-conversations-list">
              {/* VISTA 1: CHATS ACTIVOS */}
              {pestanaDirectorio === "chats" && (
                <>
                  {conversacionesFiltradas.length === 0 ? (
                    <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
                      <p style={{ fontSize: 13.5, margin: "0 0 12px 0" }}>
                        No hay conversaciones activas aún.
                      </p>
                      <button
                        type="button"
                        onClick={() => setPestanaDirectorio("contactos")}
                        style={{
                          background: "var(--primary-light)",
                          border: "1px solid var(--primary)",
                          color: "var(--primary)",
                          padding: "7px 14px",
                          borderRadius: 10,
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        Ver Especialistas Disponibles
                      </button>
                    </div>
                  ) : (
                    conversacionesFiltradas.map((conv) => {
                      const esSeleccionado = receptor === conv.nombre;
                      return (
                        <button
                          key={conv.nombre}
                          type="button"
                          className={`conversation-card-item ${esSeleccionado ? "selected" : ""}`}
                          onClick={() => setReceptor(conv.nombre)}
                        >
                          <div className="chat-avatar-circle">
                            {conv.nombre.charAt(0).toUpperCase()}
                            <span className="online-status-dot"></span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <strong
                                style={{
                                  fontSize: 14,
                                  color: "var(--text)",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis"
                                }}
                              >
                                {conv.nombre}
                              </strong>
                              {conv.fechaEnvio && (
                                <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 6 }}>
                                  {new Date(conv.fechaEnvio).toLocaleTimeString("es-AR", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </span>
                              )}
                            </div>
                            <p
                              style={{
                                margin: "3px 0 0",
                                fontSize: 12.5,
                                color: "var(--text-secondary)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                            >
                              {conv.esMio && <span style={{ color: "var(--primary)" }}>Vos: </span>}
                              {(conv.ultimoMensaje || "").startsWith("[IMG_CHAT]:") ? "📷 Foto adjunta" : conv.ultimoMensaje}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </>
              )}

              {/* VISTA 2: DIRECTORIO DE CONTACTOS Y PROFESIONALES */}
              {pestanaDirectorio === "contactos" && (
                <>
                  {contactosFiltrados.length === 0 ? (
                    <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                      <p style={{ fontSize: 13.5 }}>No se encontraron personas con ese nombre.</p>
                    </div>
                  ) : (
                    contactosFiltrados.map((u) => {
                      const nombreContacto = u.nombre || u.email;
                      const esSeleccionado = receptor === nombreContacto;
                      return (
                        <button
                          key={u.id}
                          type="button"
                          className={`conversation-card-item ${esSeleccionado ? "selected" : ""}`}
                          onClick={() => {
                            setReceptor(nombreContacto);
                            setPestanaDirectorio("chats");
                          }}
                        >
                          <div className="chat-avatar-circle">
                            {nombreContacto.charAt(0).toUpperCase()}
                            <span className="online-status-dot"></span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong
                              style={{
                                fontSize: 14,
                                color: "var(--text)",
                                display: "block",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                            >
                              {nombreContacto}
                            </strong>
                            <span
                              style={{
                                fontSize: 11.5,
                                color: "var(--primary)",
                                fontWeight: 600,
                                display: "block"
                              }}
                            >
                              {u.perfil?.oficio || "Especialista / Profesional"}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: 11.5,
                              padding: "4px 8px",
                              background: "var(--surface-soft)",
                              borderRadius: 6,
                              color: "var(--text-muted)"
                            }}
                          >
                            Chatear 💬
                          </span>
                        </button>
                      );
                    })
                  )}
                </>
              )}
            </div>
          </aside>

          {/* Panel Derecho: Ventana de Conversación Activa */}
          <main className="chat-window-pane">
            {!receptor ? (
              <div
                style={{
                  flex: 1,
                  display: "grid",
                  placeItems: "center",
                  padding: 32,
                  textAlign: "center"
                }}
              >
                <div style={{ maxWidth: 440 }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #0d9488, #2563eb)",
                      color: "white",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 36,
                      margin: "0 auto 20px",
                      boxShadow: "0 8px 24px rgba(13, 148, 136, 0.3)"
                    }}
                  >
                    💬
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
                    Tus Mensajes y Conversaciones
                  </h2>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 14, marginBottom: 20 }}>
                    Selecciona una conversación de la lista lateral o haz clic en cualquier especialista
                    del Directorio para coordinar presupuestos, trabajos o valoraciones.
                  </p>
                  <button
                    type="button"
                    onClick={() => setPestanaDirectorio("contactos")}
                    style={{
                      background: "linear-gradient(135deg, #0d9488, #2563eb)",
                      color: "white",
                      border: "none",
                      padding: "10px 22px",
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer"
                    }}
                  >
                    Explorar Contactos Disponibles →
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Cabecera del Chat Activo */}
                <div className="chat-conversation-header">
                  <button type="button" className="mobile-chat-back" onClick={() => setReceptor("")} aria-label="Volver a conversaciones">←</button>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="chat-avatar-circle" style={{ width: 42, height: 42, minWidth: 42 }}>
                      {receptor.charAt(0).toUpperCase()}
                      <span className="online-status-dot"></span>
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 800, color: "var(--text)" }}>
                        {receptor}
                      </h3>
                      <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                        ● En línea · Disponible para consultas
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => setMostrarBuscadorChat(prev => !prev)}
                      style={{
                        background: mostrarBuscadorChat ? "var(--primary-light)" : "var(--surface-soft)",
                        border: "1px solid var(--border)",
                        color: mostrarBuscadorChat ? "var(--primary)" : "var(--text)",
                        padding: "6px 11px",
                        borderRadius: 8,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                      title="Buscar dentro de esta conversación"
                    >
                      🔍 Buscar
                    </button>
                    <button
                      type="button"
                      onClick={() => setMostrarPresupuesto(prev => !prev)}
                      style={{
                        background: mostrarPresupuesto ? "var(--primary-light)" : "var(--surface-soft)",
                        border: "1px solid var(--primary)",
                        color: "var(--primary)",
                        padding: "6px 12px",
                        borderRadius: 8,
                        fontSize: 12.5,
                        fontWeight: 800,
                        cursor: "pointer"
                      }}
                      title="Armar y enviar presupuesto rápido"
                    >
                      📋 Enviar Presupuesto
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/perfil?autor=${encodeURIComponent(receptor)}&tab=reputacion`)}
                      style={{
                        background: "#fffbeb",
                        border: "1px solid #fde68a",
                        color: "#b45309",
                        padding: "6px 12px",
                        borderRadius: 8,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                      title="Calificar con estrellas de 1 al 5"
                    >
                      ⭐ Calificar (1-5)
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/perfil?autor=${encodeURIComponent(receptor)}`)}
                      style={{
                        background: "var(--surface-soft)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                        padding: "6px 12px",
                        borderRadius: 8,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                      title="Ver Perfil del usuario"
                    >
                      👤 Ver Perfil
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCargando(true);
                        obtenerConversacion(emisor, receptor)
                          .then((res) => setMensajes(Array.isArray(res) ? res : []))
                          .finally(() => setCargando(false));
                      }}
                      style={{
                        background: "var(--surface-soft)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                        padding: "6px 10px",
                        borderRadius: 8,
                        fontSize: 12.5,
                        cursor: "pointer"
                      }}
                      title="Actualizar conversación"
                    >
                      🔄
                    </button>
                  </div>
                </div>

                {/* Barra de búsqueda interna en la conversación */}
                {mostrarBuscadorChat && (
                  <div
                    style={{
                      padding: "8px 20px",
                      background: "var(--surface-soft)",
                      borderBottom: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    <span>🔍</span>
                    <input
                      type="text"
                      autoFocus
                      value={busquedaEnChat}
                      onChange={(e) => setBusquedaEnChat(e.target.value)}
                      placeholder="Filtrar mensajes o presupuestos en este chat..."
                      style={{
                        flex: 1,
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--surface-card)",
                        color: "var(--text)",
                        fontSize: 12.5,
                        outline: "none"
                      }}
                    />
                    {busquedaEnChat && (
                      <button
                        type="button"
                        onClick={() => setBusquedaEnChat("")}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--text-muted)",
                          fontSize: 12,
                          cursor: "pointer"
                        }}
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                )}

                {/* Banner de Publicación Vinculada si vino desde Contactar */}
                {publicacionContexto && (
                  <div
                    style={{
                      margin: "10px 20px 0",
                      padding: "10px 14px",
                      borderRadius: 12,
                      background: "var(--primary-light)",
                      border: "1px solid rgba(13, 148, 136, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap"
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "var(--primary)", textTransform: "uppercase" }}>
                        📌 Consulta por publicación #{publicacionContexto.id} · {publicacionContexto.tipo}
                      </span>
                      <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {publicacionContexto.contenido}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => {
                          manejarEnviar(
                            null,
                            `👋 Hola ${receptor}, te contacto por tu publicación de ${publicacionContexto.tipo}: "${(publicacionContexto.contenido || "").slice(0, 70)}..." ¿Sigue disponible?`
                          );
                          setPublicacionContexto(null);
                        }}
                        style={{
                          background: "linear-gradient(135deg, #0d9488, #2563eb)",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 12px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        Consultar por este aviso ➤
                      </button>
                      <button
                        type="button"
                        onClick={() => setPublicacionContexto(null)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          fontSize: 14
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* Feed de Mensajes */}
                <div className="chat-messages-timeline">
                  {cargando && (
                    <div style={{ textAlign: "center", padding: 20, color: "var(--text-muted)" }}>
                      Cargando mensajes de la conversación...
                    </div>
                  )}

                  {!cargando && mensajes.length === 0 && (
                    <div
                      style={{
                        margin: "auto",
                        maxWidth: 380,
                        textAlign: "center",
                        background: "var(--surface-card)",
                        border: "1px solid var(--border)",
                        borderRadius: 16,
                        padding: 24,
                        boxShadow: "var(--shadow-sm)"
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
                      <h4 style={{ margin: "0 0 6px 0", fontSize: 16, fontWeight: 700 }}>
                        Inicia la conversación con {receptor}
                      </h4>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
                        Puedes consultar disponibilidad, solicitar presupuestos para oficios o enviar una respuesta rápida.
                      </p>
                    </div>
                  )}

                  {mensajes
                    .filter((m) =>
                      !busquedaEnChat.trim() ||
                      (m.contenido || "").toLowerCase().includes(busquedaEnChat.toLowerCase())
                    )
                    .map((m) => {
                    const esMio = m.emisor === emisor;
                    const esPresupuesto = (m.contenido || "").startsWith("📋 PRESUPUESTO PROFESIONAL");
                    return (
                      <div key={m.id} className={`bubble-row ${esMio ? "sent" : "received"}`}>
                        <div className={`chat-bubble ${esMio ? "sent" : "received"}`}>
                          {!esMio && (
                            <strong
                              style={{
                                display: "block",
                                fontSize: 12,
                                fontWeight: 800,
                                color: "var(--primary)",
                                marginBottom: 3
                              }}
                            >
                              {m.emisor}
                            </strong>
                          )}
                          {(() => {
                            const raw = m.contenido || "";
                            if (raw.startsWith("[IMG_CHAT]:")) {
                              const salto = raw.indexOf("\n");
                              const urlFoto = salto !== -1 ? raw.slice(11, salto) : raw.slice(11);
                              const pieFoto = salto !== -1 ? raw.slice(salto + 1) : "";
                              return (
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                  <img
                                    src={urlFoto}
                                    alt="Foto enviada en chat"
                                    onClick={() => setImagenFullscreen(urlFoto)}
                                    title="Haz clic para ampliar"
                                    style={{
                                      maxWidth: 260,
                                      maxHeight: 240,
                                      borderRadius: 12,
                                      objectFit: "cover",
                                      cursor: "zoom-in",
                                      border: "1px solid rgba(255,255,255,0.2)"
                                    }}
                                  />
                                  {pieFoto && <div style={{ whiteSpace: "pre-wrap" }}>{pieFoto}</div>}
                                </div>
                              );
                            }
                            return <div style={{ whiteSpace: "pre-wrap" }}>{raw}</div>;
                          })()}

                          {esPresupuesto && !esMio && (
                            <button
                              type="button"
                              onClick={() =>
                                manejarEnviar(
                                  null,
                                  `✅ ¡Acepto el presupuesto enviado! Coordinemos día y horario para realizar el trabajo.`
                                )
                              }
                              style={{
                                marginTop: 8,
                                background: "#16a34a",
                                color: "white",
                                border: "none",
                                borderRadius: 8,
                                padding: "5px 12px",
                                fontSize: 12,
                                fontWeight: 800,
                                cursor: "pointer",
                                display: "inline-block"
                              }}
                            >
                              ✅ Aceptar Presupuesto
                            </button>
                          )}

                          <div className="bubble-meta">
                            {m.fechaEnvio && (
                              <span>
                                {new Date(m.fechaEnvio).toLocaleTimeString("es-AR", {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                            )}
                            {esMio && <span style={{ color: "#93c5fd", fontWeight: 700 }}>✓✓</span>}
                            <button
                              type="button"
                              className="bubble-delete-btn"
                              onClick={() => {
                                setMensajeCitado({
                                  id: m.id,
                                  emisor: m.emisor,
                                  contenido: m.contenido
                                });
                                inputRef.current?.focus();
                              }}
                              title="Responder a este mensaje"
                            >
                              ↩️
                            </button>
                            {esMio && (
                              <button
                                type="button"
                                className="bubble-delete-btn"
                                onClick={() => manejarEliminarMensaje(m.id)}
                                title="Eliminar mensaje"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={mensajesEndRef} />
                </div>

                {/* Respuestas Rápidas (Chips de 1 clic) */}
                <div className="chat-quick-replies-bar">
                  <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Atajos:
                  </span>
                  {RESPUESTAS_RAPIDAS.map((rapida, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="quick-reply-chip"
                      onClick={() => manejarEnviar(null, rapida)}
                      title="Enviar directamente"
                    >
                      {rapida}
                    </button>
                  ))}
                </div>

                {/* Modal/Panel flotante para armar Presupuesto Rápido */}
                {mostrarPresupuesto && (
                  <form
                    onSubmit={enviarPresupuestoRapido}
                    style={{
                      padding: "12px 18px",
                      background: "var(--surface-card)",
                      borderTop: "2px solid var(--primary)",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    <strong style={{ fontSize: 12.5, color: "var(--primary)", width: "100%" }}>
                      📋 Armar Presupuesto Rápido para {receptor}:
                    </strong>
                    <input
                      type="text"
                      required
                      placeholder="🛠️ Trabajo / Servicio (ej: Reparación de pérdida)"
                      value={presupuestoForm.servicio}
                      onChange={(e) => setPresupuestoForm(prev => ({ ...prev, servicio: e.target.value }))}
                      style={{
                        flex: 2,
                        minWidth: 180,
                        padding: "7px 11px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--surface-soft)",
                        color: "var(--text)",
                        fontSize: 12.5
                      }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="💰 Monto (ej: 35.000)"
                      value={presupuestoForm.monto}
                      onChange={(e) => setPresupuestoForm(prev => ({ ...prev, monto: e.target.value }))}
                      style={{
                        flex: 1,
                        minWidth: 110,
                        padding: "7px 11px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--surface-soft)",
                        color: "var(--text)",
                        fontSize: 12.5
                      }}
                    />
                    <input
                      type="text"
                      placeholder="⏱️ Plazo / Garantía"
                      value={presupuestoForm.plazo}
                      onChange={(e) => setPresupuestoForm(prev => ({ ...prev, plazo: e.target.value }))}
                      style={{
                        flex: 1,
                        minWidth: 140,
                        padding: "7px 11px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--surface-soft)",
                        color: "var(--text)",
                        fontSize: 12.5
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: "linear-gradient(135deg, #0d9488, #2563eb)",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        padding: "7px 14px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      Enviar Presupuesto
                    </button>
                    <button
                      type="button"
                      onClick={() => setMostrarPresupuesto(false)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        fontSize: 12,
                        cursor: "pointer"
                      }}
                    >
                      Cancelar
                    </button>
                  </form>
                )}

                {/* Vista previa cuando se está respondiendo/citando un mensaje del chat */}
                {mensajeCitado && (
                  <div
                    style={{
                      padding: "8px 18px",
                      background: "var(--primary-light)",
                      borderTop: "1px solid var(--border)",
                      borderLeft: "4px solid var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10
                    }}
                  >
                    <div style={{ fontSize: 12, color: "var(--text)", overflow: "hidden" }}>
                      <strong style={{ color: "var(--primary)", display: "block" }}>
                        ↩️ Respondiendo a {mensajeCitado.emisor}:
                      </strong>
                      <span style={{ color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                        {mensajeCitado.contenido}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMensajeCitado(null)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        fontSize: 14,
                        cursor: "pointer",
                        fontWeight: 700
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Vista previa de foto adjunta antes de enviar */}
                {imagenAdjunta && (
                  <div
                    style={{
                      padding: "10px 18px",
                      background: "var(--surface-soft)",
                      borderTop: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      gap: 12
                    }}
                  >
                    <img
                      src={imagenAdjunta}
                      alt="Adjunto"
                      style={{ height: 64, width: 64, objectFit: "cover", borderRadius: 10, border: "1px solid var(--primary)" }}
                    />
                    <div style={{ flex: 1, fontSize: 12.5, color: "var(--text)" }}>
                      <strong style={{ display: "block", color: "var(--primary)" }}>📷 Foto lista para enviar</strong>
                      <span>Puedes agregar un comentario opcional abajo o presionar Enviar.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImagenAdjunta("")}
                      style={{
                        background: "#fee2e2",
                        color: "#b91c1c",
                        border: "none",
                        borderRadius: 8,
                        padding: "5px 10px",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      ✕ Quitar
                    </button>
                  </div>
                )}

                {/* Barra de Redacción de Mensaje */}
                <div className="chat-input-bar">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={seleccionarImagenChat}
                    style={{ display: "none" }}
                  />
                  {mostrarEmojis && (
                    <div className="emoji-selector-popover">
                      {EMOJIS_RAPIDOS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setContenido((prev) => prev + emoji)}
                          style={{
                            background: "transparent",
                            border: "none",
                            fontSize: 20,
                            cursor: "pointer",
                            padding: "2px 4px"
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setMostrarEmojis((prev) => !prev)}
                    title="Insertar emojis rápidos"
                    style={{
                      background: "var(--surface-soft)",
                      border: "1px solid var(--border)",
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      fontSize: 18,
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center"
                    }}
                  >
                    😊
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Adjuntar foto o imagen al chat"
                    style={{
                      background: imagenAdjunta ? "var(--primary-light)" : "var(--surface-soft)",
                      border: `1px solid ${imagenAdjunta ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      fontSize: 18,
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center"
                    }}
                  >
                    📷
                  </button>

                  <form
                    onSubmit={(e) => manejarEnviar(e)}
                    style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      className="chat-text-input"
                      placeholder={`Escribe un mensaje para ${receptor}... (Enter para enviar)`}
                      value={contenido}
                      onChange={(e) => setContenido(e.target.value)}
                      maxLength={5000}
                    />

                    <button
                      type="submit"
                      className="btn-chat-send"
                      disabled={enviando || (!contenido.trim() && !imagenAdjunta)}
                    >
                      <span>{enviando ? "..." : "➤"}</span>
                      <span>{enviando ? "Enviando" : "Enviar"}</span>
                    </button>
                  </form>
                </div>
              </>
            )}

            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  padding: "10px 18px",
                  fontSize: 13,
                  borderTop: "1px solid #fecaca"
                }}
              >
                ⚠️ {error}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Visor de fotos del chat a pantalla completa */}
      {imagenFullscreen && (
        <div
          onClick={() => setImagenFullscreen(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(9, 13, 22, 0.88)",
            backdropFilter: "blur(8px)",
            display: "grid",
            placeItems: "center",
            padding: 24,
            cursor: "zoom-out"
          }}
        >
          <button
            type="button"
            onClick={() => setImagenFullscreen(null)}
            style={{
              position: "fixed",
              top: 20,
              right: 24,
              width: 42,
              height: 42,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              fontSize: 20,
              fontWeight: 800,
              cursor: "pointer"
            }}
          >
            ✕
          </button>
          <img
            src={imagenFullscreen}
            alt="Foto ampliada"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "92vw",
              maxHeight: "88vh",
              objectFit: "contain",
              borderRadius: 16,
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)"
            }}
          />
        </div>
      )}
    </div>
  );
}
