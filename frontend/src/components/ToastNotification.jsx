import React, { useEffect, useState } from "react";

export default function ToastNotification({ onNavegarASeccion }) {
  const [toasts, setToasts] = useState([
    {
      id: 1,
      tipo: "presupuesto",
      titulo: "📄 Nuevo Presupuesto Recibido",
      mensaje: "Juan Pérez te envió una cotización de Plomería por $35.000.",
      accion: "trabajos",
      tiempo: "Recién"
    }
  ]);

  useEffect(() => {
    // Simular un aviso de urgencia a los 8 segundos para mostrar la experiencia interactiva
    const timer = setTimeout(() => {
      setToasts(prev => [
        {
          id: 2,
          tipo: "urgencia",
          titulo: "🚨 Guardia 24hs Cercana",
          mensaje: "Roberto Gómez (Electricista) está disponible ahora a 1.4 km de tu casa.",
          accion: "mapa",
          tiempo: "Ahora"
        },
        ...prev
      ]);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const cerrarToast = (id, e) => {
    e.stopPropagation();
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 9999,
        maxWidth: 360
      }}
    >
      {toasts.map(t => (
        <div
          key={t.id}
          onClick={() => {
            if (onNavegarASeccion && t.accion) {
              onNavegarASeccion(t.accion);
            }
          }}
          style={{
            background: "var(--surface)",
            border: t.tipo === "urgencia" ? "2px solid #ef4444" : "1px solid var(--border)",
            borderRadius: 14,
            padding: "14px 16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            cursor: "pointer",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            animation: "slideInRight 0.3s ease-out"
          }}
        >
          <div style={{ fontSize: 24, lineHeight: 1 }}>
            {t.tipo === "urgencia" ? "🚨" : "🔔"}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: 13, color: "var(--text)" }}>{t.titulo}</strong>
              <button
                onClick={(e) => cerrarToast(t.id, e)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, padding: 0 }}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>
              {t.mensaje}
            </p>
            <span style={{ fontSize: 10.5, color: "var(--primary)", fontWeight: 700, marginTop: 4, display: "inline-block" }}>
              Haz clic para ver detalles →
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
