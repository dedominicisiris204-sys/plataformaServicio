import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerTodosLosMensajes } from "../conexionPersonas";

export default function NotificacionesView({
  publicaciones = [],
  usuario = null,
  onIrAPublicaciones
}) {
  const navigate = useNavigate();
  const [mensajesRecibidos, setMensajesRecibidos] = useState([]);
  const [leidasIds, setLeidasIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notificaciones_leidas") || "[]");
    } catch {
      return [];
    }
  });

  const identidad = (usuario?.nombre || usuario?.email || "").trim().toLowerCase();

  useEffect(() => {
    obtenerTodosLosMensajes()
      .then((lista) => {
        if (Array.isArray(lista)) {
          setMensajesRecibidos(lista);
        }
      })
      .catch(() => {});
  }, []);

  // Construir notificaciones reales combinando mensajes recibidos + interés en mis publicaciones + nuevas solicitudes
  const notificaciones = useMemo(() => {
    const items = [];

    // 1. Mensajes reales recibidos por el usuario actual
    (mensajesRecibidos || [])
      .filter((m) => (m.receptor || "").trim().toLowerCase() === identidad)
      .slice(-8)
      .reverse()
      .forEach((m) => {
        items.push({
          id: `msg_${m.id}`,
          icono: "💬",
          titulo: `Nuevo mensaje de ${m.emisor}`,
          descripcion: (m.contenido || "").startsWith("[IMG_CHAT]:")
            ? "📷 Te envió una foto en el chat."
            : m.contenido,
          tiempo: m.fechaEnvio
            ? new Date(m.fechaEnvio).toLocaleString("es-AR", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
              })
            : "Reciente",
          accionLabel: "Responder en Chat →",
          onClick: () => navigate("/mensajes", { state: { receptor: m.emisor } })
        });
      });

    // 2. Interés en publicaciones propias
    (publicaciones || [])
      .filter(
        (p) =>
          (p.autor || "").trim().toLowerCase() === identidad &&
          Number(p.interesados || 0) > 0
      )
      .forEach((p) => {
        items.push({
          id: `int_${p.id}_${p.interesados}`,
          icono: "❤️",
          titulo: `¡Tu publicación tiene ${p.interesados} interesado${p.interesados === 1 ? "" : "s"}!`,
          descripcion: `${p.tipo}: "${(p.contenido || "").slice(0, 80)}..."`,
          tiempo: "Activo en el muro",
          accionLabel: "Ver mi publicación →",
          onClick: () => {
            if (onIrAPublicaciones) onIrAPublicaciones();
          }
        });
      });

    // 3. Solicitudes recientes de otros usuarios en la plataforma
    (publicaciones || [])
      .filter((p) => (p.autor || "").trim().toLowerCase() !== identidad)
      .slice(0, 5)
      .forEach((p) => {
        const esPedido = (p.tipo || "").toLowerCase().includes("busco");
        items.push({
          id: `pub_${p.id}`,
          icono: esPedido ? "🚨" : "🛠️",
          titulo: esPedido
            ? `Nueva solicitud de trabajo: ${p.tipo}`
            : `Nuevo servicio publicado por ${p.autor}`,
          descripcion: `${p.contenido || ""} (${p.ubicacion || "Zona local"})`,
          tiempo: p.fecha
            ? new Date(p.fecha).toLocaleString("es-AR", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
              })
            : "Reciente",
          accionLabel: "Contactar →",
          onClick: () =>
            navigate("/mensajes", {
              state: {
                receptor: p.autor,
                publicacionContexto: {
                  id: p.id,
                  tipo: p.tipo,
                  contenido: p.contenido
                }
              }
            })
        });
      });

    if (items.length === 0) {
      items.push({
        id: "bienvenida_1",
        icono: "🎉",
        titulo: "¡Bienvenido/a a la Plataforma de Servicios!",
        descripcion:
          "Aquí verás tus alertas en tiempo real cuando recibas mensajes, presupuestos o interés en tus publicaciones.",
        tiempo: "Ahora",
        accionLabel: "Ir al Muro →",
        onClick: () => {
          if (onIrAPublicaciones) onIrAPublicaciones();
        }
      });
    }

    return items;
  }, [mensajesRecibidos, publicaciones, identidad, navigate, onIrAPublicaciones]);

  const marcarComoLeida = (id) => {
    setLeidasIds((prev) => {
      if (prev.includes(id)) return prev;
      const nuevo = [...prev, id];
      localStorage.setItem("notificaciones_leidas", JSON.stringify(nuevo));
      return nuevo;
    });
  };

  const marcarTodasLeidas = () => {
    const todos = notificaciones.map((n) => n.id);
    setLeidasIds(todos);
    localStorage.setItem("notificaciones_leidas", JSON.stringify(todos));
  };

  const noLeidas = notificaciones.filter((n) => !leidasIds.includes(n.id)).length;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div>
          <h2>🔔 Centro de Notificaciones en Tiempo Real</h2>
          <span style={{ fontSize: 13, color: "var(--text-muted, #64748b)" }}>
            Tienes {noLeidas} notificación{noLeidas === 1 ? "" : "es"} sin leer
          </span>
        </div>
        {noLeidas > 0 && (
          <button className="btn-mark-all" onClick={marcarTodasLeidas}>
            ✓ Marcar todas como leídas
          </button>
        )}
      </div>

      <div className="notifications-list">
        {notificaciones.map((n) => {
          const leida = leidasIds.includes(n.id);
          return (
            <div
              key={n.id}
              className={`notification-item ${leida ? "" : "unread"}`}
              onClick={() => marcarComoLeida(n.id)}
              style={{ cursor: "pointer", alignItems: "center" }}
            >
              <div className="notification-icon-wrap">{n.icono}</div>
              <div className="notification-content" style={{ flex: 1 }}>
                <div className="notification-title">{n.titulo}</div>
                <div className="notification-desc">{n.descripcion}</div>
                <div className="notification-time">{n.tiempo}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {n.accionLabel && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      marcarComoLeida(n.id);
                      if (n.onClick) n.onClick();
                    }}
                    style={{
                      background: "var(--primary-light, #eff6ff)",
                      color: "var(--primary, #0d9488)",
                      border: "1px solid rgba(13, 148, 136, 0.3)",
                      borderRadius: 8,
                      padding: "6px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {n.accionLabel}
                  </button>
                )}
                {!leida && (
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: "#0d9488"
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
