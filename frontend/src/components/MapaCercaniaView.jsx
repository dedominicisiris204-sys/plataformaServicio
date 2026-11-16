import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MapaCercaniaView({ alAbrirPresupuesto }) {
  const navigate = useNavigate();
  const [radioKm, setRadioKm] = useState(5);
  const [rubroSeleccionado, setRubroSeleccionado] = useState("Todos");
  const [soloGuardia, setSoloGuardia] = useState(false);
  const [profesionalActivo, setProfesionalActivo] = useState(null);

  const especialistas = [
    {
      id: 1,
      nombre: "Juan Carlos Pérez",
      rubro: "Plomería",
      icono: "🔧",
      distanciaKm: 0.8,
      distanciaTexto: "A 800 metros",
      direccion: "Barrio Centro, Cruz del Eje",
      telefono: "3549-412345",
      calificacion: 4.9,
      resenas: 38,
      guardia24hs: true,
      matriculado: true,
      disponible: true,
      x: 48, // Coordenadas % en el mapa visual
      y: 42
    },
    {
      id: 2,
      nombre: "Roberto Gómez",
      rubro: "Electricidad",
      icono: "⚡",
      distanciaKm: 1.4,
      distanciaTexto: "A 1.4 km",
      direccion: "Av. Sarmiento 450",
      telefono: "3549-556677",
      calificacion: 5.0,
      resenas: 54,
      guardia24hs: true,
      matriculado: true,
      disponible: true,
      x: 62,
      y: 35
    },
    {
      id: 3,
      nombre: "Esteban Rossi",
      rubro: "Pintura",
      icono: "🎨",
      distanciaKm: 2.7,
      distanciaTexto: "A 2.7 km",
      direccion: "Barrio San Martín",
      telefono: "3549-889900",
      calificacion: 4.8,
      resenas: 27,
      guardia24hs: false,
      matriculado: false,
      disponible: true,
      x: 32,
      y: 65
    },
    {
      id: 4,
      nombre: "Diego Fernández",
      rubro: "Carpintería",
      icono: "🚪",
      distanciaKm: 4.1,
      distanciaTexto: "A 4.1 km",
      direccion: "Zona Estación",
      telefono: "3549-112233",
      calificacion: 4.9,
      resenas: 19,
      guardia24hs: false,
      matriculado: true,
      disponible: false,
      x: 75,
      y: 70
    },
    {
      id: 5,
      nombre: "Claudio Morales",
      rubro: "Cerrajería",
      icono: "🔑",
      distanciaKm: 1.1,
      distanciaTexto: "A 1.1 km",
      direccion: "Calle Mitre 820",
      telefono: "3549-994411",
      calificacion: 4.9,
      resenas: 62,
      guardia24hs: true,
      matriculado: true,
      disponible: true,
      x: 41,
      y: 52
    }
  ];

  const especialistasFiltrados = especialistas.filter(e => {
    const cumpleRadio = e.distanciaKm <= radioKm;
    const cumpleRubro = rubroSeleccionado === "Todos" || e.rubro === rubroSeleccionado;
    const cumpleGuardia = !soloGuardia || e.guardia24hs;
    return cumpleRadio && cumpleRubro && cumpleGuardia;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Encabezado y Filtros de Cercanía */}
      <div
        style={{
          background: "var(--surface-card)",
          borderRadius: 16,
          padding: "20px 24px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--text)" }}>
              📍 Mapa de Especialistas Cercanos en Tiempo Real
            </h2>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13.5 }}>
              Encuentra profesionales cerca de tu domicilio en Cruz del Eje y zonas aledañas.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Radio:</span>
            {[2, 5, 10, 25].map(km => (
              <button
                key={km}
                onClick={() => setRadioKm(km)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: 700,
                  border: "1px solid var(--border)",
                  background: radioKm === km ? "var(--primary)" : "var(--surface-soft)",
                  color: radioKm === km ? "white" : "var(--text)",
                  cursor: "pointer"
                }}
              >
                {km} km
              </button>
            ))}
          </div>
        </div>

        {/* Filtros de Rubro y Guardia */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, borderTop: "1px solid var(--border-subtle)", paddingTop: 14 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Todos", "Plomería", "Electricidad", "Pintura", "Carpintería", "Cerrajería"].map(r => (
              <button
                key={r}
                onClick={() => setRubroSeleccionado(r)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "1px solid var(--border)",
                  background: rubroSeleccionado === r ? "var(--primary-light)" : "var(--surface)",
                  color: rubroSeleccionado === r ? "var(--primary)" : "var(--text)",
                  cursor: "pointer"
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
              color: "#b91c1c",
              background: "#fee2e2",
              padding: "6px 14px",
              borderRadius: 20,
              cursor: "pointer"
            }}
          >
            <input
              type="checkbox"
              checked={soloGuardia}
              onChange={e => setSoloGuardia(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            🚨 Solo con Guardia / Urgencia 24hs
          </label>
        </div>
      </div>

      {/* Contenedor del Mapa y Panel Lateral */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18, alignItems: "start" }}>
        {/* Mapa Interactivo Estilizado */}
        <div
          style={{
            position: "relative",
            height: "520px",
            background: "radial-gradient(circle at 50% 50%, rgba(13, 148, 136, 0.08) 0%, rgba(15, 23, 42, 0.04) 70%), #e2e8f0",
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)"
          }}
        >
          {/* Grilla visual tipo mapa con calles */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.25 }}>
            <line x1="0" y1="200" x2="100%" y2="200" stroke="#475569" strokeWidth="4" />
            <line x1="0" y1="360" x2="100%" y2="360" stroke="#475569" strokeWidth="3" />
            <line x1="300" y1="0" x2="300" y2="100%" stroke="#475569" strokeWidth="5" />
            <line x1="550" y1="0" x2="550" y2="100%" stroke="#475569" strokeWidth="3" />
            <circle cx="50%" cy="50%" r="90" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="6" />
            <circle cx="50%" cy="50%" r="180" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="6" />
          </svg>

          {/* Tu Ubicación Central */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 20
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#2563eb",
                border: "3px solid white",
                boxShadow: "0 0 16px #2563eb"
              }}
            />
            <span
              style={{
                background: "rgba(15, 23, 42, 0.9)",
                color: "white",
                padding: "3px 8px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                marginTop: 4,
                whiteSpace: "nowrap"
              }}
            >
              📍 Tu Ubicación (Cruz del Eje)
            </span>
          </div>

          {/* Marcadores de Especialistas */}
          {especialistasFiltrados.map(e => (
            <div
              key={e.id}
              onClick={() => setProfesionalActivo(e)}
              style={{
                position: "absolute",
                top: `${e.y}%`,
                left: `${e.x}%`,
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                zIndex: 30,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.15s ease"
              }}
              onMouseEnter={evt => evt.currentTarget.style.transform = "translate(-50%, -50%) scale(1.15)"}
              onMouseLeave={evt => evt.currentTarget.style.transform = "translate(-50%, -50%) scale(1)"}
            >
              {e.guardia24hs && (
                <span
                  style={{
                    background: "#dc2626",
                    color: "white",
                    fontSize: 9,
                    fontWeight: 900,
                    padding: "1px 5px",
                    borderRadius: 4,
                    marginBottom: 2,
                    animation: "pulse 1.5s infinite"
                  }}
                >
                  24HS
                </span>
              )}

              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: profesionalActivo?.id === e.id ? "var(--primary)" : "white",
                  color: profesionalActivo?.id === e.id ? "white" : "var(--text)",
                  border: "2px solid var(--primary)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 20
                }}
              >
                {e.icono}
              </div>

              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  marginTop: 3,
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                }}
              >
                {e.nombre.split(" ")[0]} ({e.distanciaTexto})
              </div>
            </div>
          ))}

          {/* Leyenda inferior */}
          <div
            style={{
              position: "absolute",
              bottom: 14,
              left: 14,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(6px)",
              padding: "8px 14px",
              borderRadius: 10,
              fontSize: 12,
              color: "#334155",
              border: "1px solid #cbd5e1"
            }}
          >
            Especialistas encontrados en {radioKm} km: <strong>{especialistasFiltrados.length} activos</strong>
          </div>
        </div>

        {/* Panel Lateral de Detalles */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {profesionalActivo ? (
            <div
              style={{
                background: "var(--surface-card)",
                borderRadius: 16,
                padding: "20px",
                border: "2px solid var(--primary)",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>
                  {profesionalActivo.icono} {profesionalActivo.rubro}
                </span>
                <button
                  onClick={() => setProfesionalActivo(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                >
                  ✕
                </button>
              </div>

              <h3 style={{ margin: 0, fontSize: 17, color: "var(--text)" }}>
                {profesionalActivo.nombre}
              </h3>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {profesionalActivo.matriculado && (
                  <span style={{ background: "#e0f2fe", color: "#0369a1", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
                    ✔ Matrícula Verificada
                  </span>
                )}
                {profesionalActivo.guardia24hs && (
                  <span style={{ background: "#fee2e2", color: "#b91c1c", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
                    🚨 Guardia 24hs
                  </span>
                )}
              </div>

              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                <div>📍 {profesionalActivo.direccion}</div>
                <div style={{ fontWeight: 700, color: "var(--text)", marginTop: 4 }}>
                  🚗 {profesionalActivo.distanciaTexto} (Tiempo estimado: ~5 min)
                </div>
                <div style={{ marginTop: 4, color: "#f59e0b", fontWeight: 700 }}>
                  ★ {profesionalActivo.calificacion} ({profesionalActivo.resenas} reseñas verificadas)
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => navigate("/mensajes", { state: { receptor: profesionalActivo.nombre } })}
                  className="btn-modal-submit"
                  style={{ width: "100%", padding: "10px", fontSize: 13 }}
                >
                  💬 Iniciar Chat Inmediato
                </button>
                <button
                  onClick={() => alAbrirPresupuesto && alAbrirPresupuesto()}
                  className="btn-modal-cancel"
                  style={{ width: "100%", padding: "8px", fontSize: 12.5 }}
                >
                  📄 Pedir Presupuesto Formal
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "var(--surface-card)",
                borderRadius: 16,
                padding: "20px",
                border: "1px solid var(--border)",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 13
              }}
            >
              👈 Haz clic en cualquier marcador del mapa para ver los datos del especialista, matrícula y contactarlo.
            </div>
          )}

          {/* Lista rápida de profesionales en el radio */}
          <div
            style={{
              background: "var(--surface-card)",
              borderRadius: 16,
              padding: "16px",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              maxHeight: "340px",
              overflowY: "auto"
            }}
          >
            <strong style={{ fontSize: 13.5, color: "var(--text)" }}>Profesionales en tu zona ({especialistasFiltrados.length})</strong>
            {especialistasFiltrados.map(e => (
              <div
                key={e.id}
                onClick={() => setProfesionalActivo(e)}
                style={{
                  padding: "10px",
                  borderRadius: 10,
                  background: profesionalActivo?.id === e.id ? "var(--primary-light)" : "var(--surface)",
                  border: "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <strong style={{ fontSize: 13, color: "var(--text)", display: "block" }}>{e.nombre}</strong>
                  <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{e.icono} {e.rubro}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "var(--primary)" }}>{e.distanciaTexto}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
