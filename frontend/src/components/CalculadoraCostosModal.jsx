import React, { useState } from "react";

export default function CalculadoraCostosModal({ abierto, alCerrar, alSolicitarCotizacion }) {
  const [rubro, setRubro] = useState("Plomería");
  const [tarea, setTarea] = useState("Reparación o cambio de canilla / grifería");

  if (!abierto) return null;

  const tareasPorRubro = {
    "Plomería": [
      { nombre: "Reparación o cambio de canilla / grifería", min: 18000, prom: 25000, max: 35000, tiempo: "1 a 2 horas", complejidad: "Baja" },
      { nombre: "Destapación de cañerías / desagües", min: 25000, prom: 35000, max: 50000, tiempo: "1 a 3 horas", complejidad: "Media" },
      { nombre: "Instalación o cambio de inodoro / bidet", min: 35000, prom: 48000, max: 65000, tiempo: "Medio día", complejidad: "Media" },
      { nombre: "Reparación o instalación de termotanque / calefón", min: 45000, prom: 65000, max: 90000, tiempo: "Medio día a 1 día", complejidad: "Alta" }
    ],
    "Electricidad": [
      { nombre: "Cambio de disyuntor o llave térmica", min: 22000, prom: 32000, max: 45000, tiempo: "1 a 2 horas", complejidad: "Media" },
      { nombre: "Instalación de luminarias / plafones LED", min: 15000, prom: 22000, max: 30000, tiempo: "1 hora", complejidad: "Baja" },
      { nombre: "Cableado completo por boca / circuito nuevo", min: 14000, prom: 20000, max: 28000, tiempo: "Por boca de conexión", complejidad: "Media" },
      { nombre: "Certificado de aptitud eléctrica / DCI", min: 55000, prom: 80000, max: 120000, tiempo: "1 a 2 días hábiles", complejidad: "Alta (Matriculado)" }
    ],
    "Pintura": [
      { nombre: "Pintura de ambiente estándar (hasta 12 m²)", min: 45000, prom: 65000, max: 90000, tiempo: "1 a 2 días", complejidad: "Media" },
      { nombre: "Pintura de departamento 2 ambientes completo", min: 140000, prom: 200000, max: 280000, tiempo: "3 a 5 días", complejidad: "Media-Alta" },
      { nombre: "Enduido y reparación de grietas por pared", min: 20000, prom: 30000, max: 45000, tiempo: "Medio día", complejidad: "Baja" },
      { nombre: "Impermeabilización de terraza / techos (m²)", min: 6500, prom: 9500, max: 14000, tiempo: "Por metro cuadrado", complejidad: "Media" }
    ],
    "Albañilería": [
      { nombre: "Levantamiento de pared de ladrillo hueco (m²)", min: 18000, prom: 26000, max: 36000, tiempo: "Por metro cuadrado", complejidad: "Media" },
      { nombre: "Colocación de cerámicos o porcelanato (m²)", min: 16000, prom: 24000, max: 35000, tiempo: "Por metro cuadrado", complejidad: "Alta" },
      { nombre: "Revoque grueso y fino (m²)", min: 14000, prom: 20000, max: 28000, tiempo: "Por metro cuadrado", complejidad: "Media" },
      { nombre: "Jornada de oficial albañil completa", min: 35000, prom: 45000, max: 60000, tiempo: "8 horas de trabajo", complejidad: "Profesional" }
    ],
    "Climatización": [
      { nombre: "Instalación básica aire split (hasta 3000 frigorías)", min: 75000, prom: 105000, max: 140000, tiempo: "2 a 4 horas", complejidad: "Alta (Matriculado)" },
      { nombre: "Carga de gas refrigerante R410 / R22", min: 45000, prom: 60000, max: 80000, tiempo: "1 a 2 horas", complejidad: "Media" },
      { nombre: "Desinstalación de equipo split con recupero de gas", min: 35000, prom: 48000, max: 65000, tiempo: "1 a 2 horas", complejidad: "Media" }
    ]
  };

  const listaTareas = tareasPorRubro[rubro] || tareasPorRubro["Plomería"];
  const tareaSeleccionada = listaTareas.find(t => t.nombre === tarea) || listaTareas[0];

  return (
    <div className="modal-overlay" onClick={alCerrar} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 1200 }}>
      <div
        className="modal-container"
        style={{
          maxWidth: 620,
          width: "100%",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          overflow: "hidden"
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header" style={{ padding: "16px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>💡</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 18 }}>Calculadora de Costos Orientativos</h3>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Precios de referencia de mercado actualizados en mano de obra
              </span>
            </div>
          </div>
          <button className="btn-close-modal" onClick={alCerrar}>✕</button>
        </div>

        <div className="modal-body" style={{ overflowY: "auto", flex: 1, minHeight: 0, padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="modal-field">
              <label>Rubro de Trabajo</label>
              <select
                value={rubro}
                onChange={e => {
                  setRubro(e.target.value);
                  setTarea(tareasPorRubro[e.target.value]?.[0]?.nombre || "");
                }}
              >
                {Object.keys(tareasPorRubro).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="modal-field">
              <label>Tarea Típica a Realizar</label>
              <select value={tarea} onChange={e => setTarea(e.target.value)}>
                {listaTareas.map(t => (
                  <option key={t.nombre} value={t.nombre}>{t.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tarjeta de precios orientativos */}
          <div
            style={{
              background: "var(--surface)",
              border: "2px solid var(--border)",
              borderRadius: 16,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 14
            }}
          >
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
              Rango Orientativo de Mano de Obra:
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: 10, textAlign: "center" }}>
              <div style={{ background: "var(--surface-soft)", padding: "12px 8px", borderRadius: 12 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Mínimo estimado</span>
                <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginTop: 4 }}>
                  ${tareaSeleccionada.min.toLocaleString()}
                </div>
              </div>

              <div style={{ background: "var(--primary-light)", border: "1px solid var(--primary)", padding: "12px 8px", borderRadius: 12 }}>
                <span style={{ fontSize: 11, color: "var(--primary)", fontWeight: 800 }}>⭐ Promedio sugerido</span>
                <div style={{ fontSize: 22, fontWeight: 900, color: "var(--primary)", marginTop: 4 }}>
                  ${tareaSeleccionada.prom.toLocaleString()}
                </div>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>ARS</span>
              </div>

              <div style={{ background: "var(--surface-soft)", padding: "12px 8px", borderRadius: 12 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Complejidad alta</span>
                <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginTop: 4 }}>
                  ${tareaSeleccionada.max.toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px dashed var(--border)", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--text-secondary)" }}>
              <span>⏱ Duración habitual: <strong>{tareaSeleccionada.tiempo}</strong></span>
              <span>🛠️ Dificultad: <strong>{tareaSeleccionada.complejidad}</strong></span>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 11.5, color: "#64748b" }}>
              💡 <em>Los valores son solo de referencia y pueden variar según materiales, urgencia o accesibilidad. Recuerda acordar el presupuesto formal antes de iniciar la obra.</em>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: "14px 22px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" className="btn-modal-cancel" onClick={alCerrar}>
            Cerrar
          </button>
          <button
            type="button"
            className="btn-modal-submit"
            onClick={() => {
              alCerrar();
              if (alSolicitarCotizacion) {
                alSolicitarCotizacion(tareaSeleccionada.nombre, tareaSeleccionada.prom);
              }
            }}
          >
            Pedir Cotización a Especialistas Cercanos →
          </button>
        </div>
      </div>
    </div>
  );
}
