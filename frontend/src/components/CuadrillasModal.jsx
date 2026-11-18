import React, { useState } from "react";

export default function CuadrillasModal({ abierto, alCerrar, usuario }) {
  const [tab, setTab] = useState("ver"); // "ver" o "crear"
  const [cuadrillas, setCuadrillas] = useState([
    {
      id: 1,
      nombre: "Cuadrilla Integral Obras Norte",
      lider: "Carlos Benítez (Maestro Mayor)",
      zona: "Zona Norte / Gran Bs As",
      rubros: ["Albañilería", "Plomería", "Electricidad"],
      integrantes: [
        { nombre: "Carlos Benítez", especialidad: "Albañil / Constructor", verificado: true },
        { nombre: "Martín Sosa", especialidad: "Electricista Matriculado", verificado: true },
        { nombre: "Juan Roldán", especialidad: "Plomero / Gasista", verificado: true }
      ],
      trabajosRealizados: 18,
      calificacion: 4.9,
      tarifaJornada: 120000,
      disponibilidad: "Inmediata"
    },
    {
      id: 2,
      nombre: "Equipo Reformas Express & Acabados",
      lider: "Laura Fernández (Diseño y Obra)",
      zona: "Capital Federal y Alrededores",
      rubros: ["Pintura", "Durlock", "Carpintería"],
      integrantes: [
        { nombre: "Laura Fernández", especialidad: "Coordinadora de Obra", verificado: true },
        { nombre: "Esteban Quiroga", especialidad: "Pintor Profesional", verificado: true },
        { nombre: "Diego Morales", especialidad: "Instalador Durlock / Yesero", verificado: true }
      ],
      trabajosRealizados: 12,
      calificacion: 4.8,
      tarifaJornada: 95000,
      disponibilidad: "A partir de la próxima semana"
    }
  ]);

  // Formulario nueva cuadrilla
  const [nombreNueva, setNombreNueva] = useState("");
  const [zonaNueva, setZonaNueva] = useState("Zona Centro y Alrededores");
  const [rubroPrincipal, setRubroPrincipal] = useState("Construcción y Refacciones");
  const [integrantesTexto, setIntegrantesTexto] = useState("");
  const [tarifaEstimada, setTarifaEstimada] = useState("");

  if (!abierto) return null;

  const handleCrearCuadrilla = (e) => {
    e.preventDefault();
    if (!nombreNueva.trim()) {
      alert("Por favor ingresa un nombre para tu cuadrilla.");
      return;
    }

    const miembrosArray = integrantesTexto
      .split("\n")
      .filter(l => l.trim())
      .map(m => {
        const partes = m.split("-");
        return {
          nombre: partes[0]?.trim() || "Colega Profesional",
          especialidad: partes[1]?.trim() || "Especialista de Oficio",
          verificado: true
        };
      });

    if (miembrosArray.length === 0) {
      miembrosArray.push(
        { nombre: usuario?.nombre || "Tú (Líder)", especialidad: "Coordinador de Cuadrilla", verificado: true },
        { nombre: "Compañero Convocado", especialidad: "Técnico Auxiliar", verificado: true }
      );
    } else {
      miembrosArray.unshift({
        nombre: usuario?.nombre || "Tú (Líder)",
        especialidad: rubroPrincipal,
        verificado: true
      });
    }

    const nueva = {
      id: Date.now(),
      nombre: nombreNueva,
      lider: `${usuario?.nombre || "Tú"} (Líder)`,
      zona: zonaNueva,
      rubros: [rubroPrincipal, "Servicios Combinados"],
      integrantes: miembrosArray,
      trabajosRealizados: 1,
      calificacion: 5.0,
      tarifaJornada: Number(tarifaEstimada) || 90000,
      disponibilidad: "Inmediata"
    };

    setCuadrillas([nueva, ...cuadrillas]);
    setTab("ver");
    alert(`¡Cuadrilla "${nombreNueva}" creada con éxito! Ahora empresas y clientes pueden contratarlos como equipo integral.`);
  };

  return (
    <div className="modal-overlay" onClick={alCerrar} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 1100 }}>
      <div
        className="modal-container"
        style={{
          maxWidth: 780,
          width: "100%",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          overflow: "hidden"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ flexShrink: 0, padding: "16px 22px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 19 }}>👥 Cuadrillas & Equipos de Trabajo</h2>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--text-muted)" }}>
              Asóciate con otros profesionales para tomar obras grandes, cotizar en conjunto y ganar más.
            </p>
          </div>
          <button className="btn-close-modal" onClick={alCerrar}>✕</button>
        </div>

        {/* Pestañas */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--surface)", padding: "0 20px" }}>
          <button
            type="button"
            onClick={() => setTab("ver")}
            style={{
              padding: "12px 18px",
              background: "none",
              border: "none",
              borderBottom: tab === "ver" ? "3px solid var(--primary)" : "3px solid transparent",
              color: tab === "ver" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 13
            }}
          >
            🔍 Cuadrillas Disponibles ({cuadrillas.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("crear")}
            style={{
              padding: "12px 18px",
              background: "none",
              border: "none",
              borderBottom: tab === "crear" ? "3px solid var(--primary)" : "3px solid transparent",
              color: tab === "crear" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 13
            }}
          >
            ➕ Formar mi Cuadrilla / Equipo
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="modal-body" style={{ overflowY: "auto", flex: 1, minHeight: 0, padding: "20px" }}>
          {tab === "ver" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "var(--surface-soft)", padding: "12px 16px", borderRadius: 12, fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>💼 <strong>¿Tienes una obra o reforma grande?</strong> Contrata un equipo consolidado en lugar de contratar oficio por oficio.</span>
                <button
                  type="button"
                  onClick={() => setTab("crear")}
                  className="btn-modal-submit"
                  style={{ padding: "7px 14px", fontSize: 12, whiteSpace: "nowrap" }}
                >
                  + Armar mi Equipo
                </button>
              </div>

              {cuadrillas.map(c => (
                <div
                  key={c.id}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 17, color: "var(--text)" }}>{c.nombre}</h3>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                        Coordinador: <strong>{c.lider}</strong> · 📍 {c.zona}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Jornada Equipo Estimada</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: "var(--primary)" }}>
                        ${c.tarifaJornada.toLocaleString()} ARS
                      </div>
                    </div>
                  </div>

                  {/* Integrantes y oficios */}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6 }}>
                      Especialistas en esta cuadrilla:
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {c.integrantes.map((m, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: "var(--surface-soft)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: 20,
                            padding: "4px 10px",
                            fontSize: 12,
                            color: "var(--text)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4
                          }}
                        >
                          👤 <strong>{m.nombre}</strong> ({m.especialidad})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: 10, fontSize: 12 }}>
                    <span style={{ color: "var(--text-muted)" }}>
                      ⭐ <strong>{c.calificacion}</strong> ({c.trabajosRealizados} obras completadas) · Disponibilidad: <span style={{ color: "#16a34a", fontWeight: 700 }}>{c.disponibilidad}</span>
                    </span>
                    <button
                      type="button"
                      className="btn-modal-submit"
                      style={{ padding: "7px 14px", fontSize: 12 }}
                      onClick={() => alert(`¡Solicitud enviada a ${c.nombre}! El coordinador te responderá por la mensajería interna con el presupuesto del equipo.`)}
                    >
                      🤝 Contratar Cuadrilla Completa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCrearCuadrilla} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "var(--primary-light)", border: "1px solid var(--primary)", padding: "12px 16px", borderRadius: 12, fontSize: 13, color: "var(--text)" }}>
                🚀 <strong>¿Cómo funciona una cuadrilla?</strong> Como profesional puedes asociarte con otros trabajadores (ej: plomero + albañil + electricista). Al postularse juntos, pueden tomar reformas completas, cobran presupuestos más altos y la app les calcula a cada uno su ganancia neta.
              </div>

              <div className="modal-field">
                <label>Nombre de la Cuadrilla o Equipo de Trabajo</label>
                <input
                  type="text"
                  placeholder="Ej: Grupo Refacciones & Obras Centro"
                  value={nombreNueva}
                  onChange={e => setNombreNueva(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="modal-field">
                  <label>Tu Especialidad / Rubro Principal</label>
                  <select value={rubroPrincipal} onChange={e => setRubroPrincipal(e.target.value)}>
                    <option value="Albañilería y Obras">🧱 Albañilería & Obras</option>
                    <option value="Plomería e Instalaciones">🔧 Plomería & Gas</option>
                    <option value="Electricidad Integral">⚡ Electricidad</option>
                    <option value="Pintura y Acabados">🎨 Pintura & Durlock</option>
                    <option value="Carpintería y Muebles">🚪 Carpintería</option>
                  </select>
                </div>

                <div className="modal-field">
                  <label>Zona de Cobertura</label>
                  <input
                    type="text"
                    value={zonaNueva}
                    onChange={e => setZonaNueva(e.target.value)}
                    placeholder="Ej: Gran Buenos Aires / Córdoba Capital"
                  />
                </div>
              </div>

              <div className="modal-field">
                <label>Colegas / Integrantes a convocar (Escribe un colega por línea con formato: Nombre - Especialidad)</label>
                <textarea
                  rows={3}
                  placeholder={`Ejemplo:\nMartín Gómez - Plomero Matriculado\nLucas Benítez - Electricista`}
                  value={integrantesTexto}
                  onChange={e => setIntegrantesTexto(e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label>Tarifa de Jornada Estimada del Equipo Completo ($ ARS)</label>
                <input
                  type="number"
                  placeholder="Ej: 110000"
                  value={tarifaEstimada}
                  onChange={e => setTarifaEstimada(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button type="button" className="btn-modal-cancel" onClick={() => setTab("ver")}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-submit">
                  ✓ Publicar y Registrar Cuadrilla
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
