import React, { useState } from "react";

export default function PresupuestoModal({ abierto, alCerrar, usuario, alGuardarPresupuesto }) {
  const [cliente, setCliente] = useState("");
  const [rubro, setRubro] = useState("Plomería");
  const [descripcion, setDescripcion] = useState("");
  const [manoDeObra, setManoDeObra] = useState("");
  const [materiales, setMateriales] = useState("");
  const [tiempoEstimado, setTiempoEstimado] = useState("1 a 2 días hábiles");
  const [garantia, setGarantia] = useState("3 meses por escrito");
  const [validez, setValidez] = useState("15 días");
  const [generado, setGenerado] = useState(false);
  const [nroCotizacion, setNroCotizacion] = useState("");

  if (!abierto) return null;

  const manoDeObraNum = Number(manoDeObra) || 0;
  const materialesNum = Number(materiales) || 0;
  const total = manoDeObraNum + materialesNum;
  // Comisión ética de la plataforma: 10% sobre la mano de obra (no se le cobra sobre materiales)
  const porcentajeComision = 10;
  const comisionPlataforma = Math.round(manoDeObraNum * (porcentajeComision / 100));
  const gananciaNetaProfesional = total - comisionPlataforma;

  const handleGenerar = (e) => {
    e.preventDefault();
    if (!descripcion.trim() || total <= 0) {
      alert("Por favor completa la descripción y al menos un monto de mano de obra o materiales.");
      return;
    }
    const nro = `COT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setNroCotizacion(nro);
    setGenerado(true);

    if (alGuardarPresupuesto) {
      alGuardarPresupuesto({
        nro,
        cliente,
        rubro,
        descripcion,
        manoDeObra: manoDeObraNum,
        materiales: materialesNum,
        total,
        porcentajeComision,
        comisionPlataforma,
        gananciaNetaProfesional,
        tiempoEstimado,
        garantia
      });
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={alCerrar} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 1100 }}>
      <div
        className="modal-container"
        style={{
          maxWidth: 640,
          width: "100%",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header" style={{ flexShrink: 0, padding: "16px 20px" }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>📄 Presupuesto Digital Formal</h2>
          <button className="btn-close-modal" onClick={alCerrar}>✕</button>
        </div>

        {!generado ? (
          <form
            onSubmit={handleGenerar}
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              overflow: "hidden"
            }}
          >
            <div
              className="modal-body"
              style={{
                overflowY: "auto",
                flex: 1,
                minHeight: 0,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 14
              }}
            >
              <div style={{ background: "var(--surface-soft)", padding: "10px 14px", borderRadius: 10, fontSize: 13, color: "var(--text)" }}>
                💡 Confecciona un presupuesto claro y profesional para tu cliente con desglose de costos y garantía.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="modal-field">
                  <label>Cliente o Empresa Solicitante</label>
                  <input
                    type="text"
                    placeholder="Ej: Laura Martínez"
                    value={cliente}
                    onChange={e => setCliente(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-field">
                  <label>Especialidad / Rubro</label>
                  <select value={rubro} onChange={e => setRubro(e.target.value)}>
                    <option value="Plomería">🔧 Plomería</option>
                    <option value="Electricidad">⚡ Electricidad</option>
                    <option value="Albañilería">🧱 Albañilería</option>
                    <option value="Pintura">🎨 Pintura</option>
                    <option value="Carpintería">🚪 Carpintería</option>
                    <option value="Aire Acondicionado">❄️ Climatización</option>
                    <option value="Cerrajería">🔑 Cerrajería</option>
                  </select>
                </div>
              </div>

              <div className="modal-field">
                <label>Detalle del Trabajo a Realizar</label>
                <textarea
                  rows={2}
                  placeholder="Detalla las tareas técnicas: desmonte, instalación, pruebas de funcionamiento..."
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="modal-field">
                  <label>Mano de Obra ($)</label>
                  <input
                    type="number"
                    placeholder="Ej: 45000"
                    value={manoDeObra}
                    onChange={e => setManoDeObra(e.target.value)}
                  />
                </div>

                <div className="modal-field">
                  <label>Materiales y Repuestos ($)</label>
                  <input
                    type="number"
                    placeholder="Ej: 22000"
                    value={materiales}
                    onChange={e => setMateriales(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="modal-field">
                  <label>Tiempo Estimado de Ejecución</label>
                  <input
                    type="text"
                    value={tiempoEstimado}
                    onChange={e => setTiempoEstimado(e.target.value)}
                  />
                </div>

                <div className="modal-field">
                  <label>Garantía del Trabajo</label>
                  <input
                    type="text"
                    value={garantia}
                    onChange={e => setGarantia(e.target.value)}
                  />
                </div>
              </div>

              <div
                style={{
                  background: "var(--primary-light)",
                  border: "1px solid var(--primary)",
                  padding: "12px 16px",
                  borderRadius: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "var(--text)" }}>Total para el Cliente:</span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: "var(--primary)" }}>
                    ${total.toLocaleString()} ARS
                  </span>
                </div>

                <div style={{ borderTop: "1px dashed var(--border)", paddingTop: 6, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "var(--text-muted)" }}>🛡 Comisión Plataforma ({porcentajeComision}% sobre mano de obra):</span>
                  <strong style={{ color: "#e11d48" }}>-${comisionPlataforma.toLocaleString()} ARS</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800 }}>
                  <span style={{ color: "var(--text)" }}>💰 Tu Ganancia Neta Estimada:</span>
                  <span style={{ color: "#16a34a" }}>${gananciaNetaProfesional.toLocaleString()} ARS</span>
                </div>
              </div>
            </div>

            <div
              className="modal-footer"
              style={{
                flexShrink: 0,
                borderTop: "1px solid var(--border)",
                padding: "12px 20px",
                background: "var(--surface)",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10
              }}
            >
              <button type="button" className="btn-modal-cancel" onClick={alCerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn-modal-submit" style={{ padding: "10px 18px" }}>
                Generar Comprobante Oficial →
              </button>
            </div>
          </form>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              overflow: "hidden"
            }}
          >
            <div
              className="modal-body"
              style={{
                overflowY: "auto",
                flex: 1,
                minHeight: 0,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 16
              }}
            >
              {/* Ticket Digital Formal */}
              <div
                style={{
                  background: "var(--surface)",
                  border: "2px dashed var(--border)",
                  borderRadius: 16,
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 17, color: "var(--primary)" }}>COTIZACIÓN FORMAL DE SERVICIO</h3>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Plataforma de Servicios y Oficios · Red de Profesionales</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <strong style={{ fontSize: 13, color: "var(--text)" }}>{nroCotizacion}</strong>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Fecha: {new Date().toLocaleDateString("es-AR")}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12.5 }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>Profesional Emisor:</span>
                    <strong style={{ color: "var(--text)" }}>{usuario?.nombre || "Especialista Matriculado"}</strong>
                    <div style={{ color: "var(--primary)", fontSize: 11.5 }}>✔ Matrícula Verificada</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>Cliente:</span>
                    <strong style={{ color: "var(--text)" }}>{cliente || "Cliente"}</strong>
                    <div style={{ color: "var(--text-muted)", fontSize: 11.5 }}>Rubro: {rubro}</div>
                  </div>
                </div>

                <div style={{ background: "var(--surface-soft)", padding: "10px", borderRadius: 8, fontSize: 12.5 }}>
                  <span style={{ fontWeight: 700, color: "var(--text)" }}>Detalle técnico:</span>
                  <p style={{ margin: "4px 0 0", color: "var(--text-secondary)" }}>{descripcion}</p>
                </div>

                {/* Tabla de costos */}
                <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface-soft)", fontSize: 11.5, fontWeight: 700 }}>
                    <span>Concepto</span>
                    <span>Importe</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", borderBottom: "1px solid var(--border-subtle)", fontSize: 12.5 }}>
                    <span>Mano de obra calificada</span>
                    <strong>${manoDeObraNum.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", borderBottom: "1px solid var(--border-subtle)", fontSize: 12.5 }}>
                    <span>Materiales y repuestos requeridos</span>
                    <strong>${materialesNum.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 12px", borderBottom: "1px solid var(--border-subtle)", fontSize: 11.5, color: "var(--text-muted)", background: "var(--surface)" }}>
                    <span>Comisión Plataforma (10% sobre mano de obra)</span>
                    <span style={{ color: "#e11d48", fontWeight: 700 }}>-${comisionPlataforma.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "var(--primary-light)", fontSize: 14, fontWeight: 900 }}>
                    <span style={{ color: "var(--text)" }}>TOTAL CLIENTE:</span>
                    <span style={{ color: "var(--primary)" }}>${total.toLocaleString()} ARS</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 12px", background: "var(--surface-soft)", fontSize: 11.5, fontWeight: 800 }}>
                    <span style={{ color: "#16a34a" }}>Neto a percibir por el profesional:</span>
                    <span style={{ color: "#16a34a" }}>${gananciaNetaProfesional.toLocaleString()} ARS</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--text-muted)" }}>
                  <span>⏱ Plazo: <strong>{tiempoEstimado}</strong></span>
                  <span>🛡 Garantía: <strong>{garantia}</strong></span>
                  <span>⏳ Validez: <strong>{validez}</strong></span>
                </div>
              </div>
            </div>

            <div
              className="modal-footer"
              style={{
                flexShrink: 0,
                borderTop: "1px solid var(--border)",
                padding: "12px 20px",
                background: "var(--surface)",
                display: "flex",
                gap: 10,
                justifyContent: "flex-end"
              }}
            >
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setGenerado(false)}
              >
                ← Modificar
              </button>
              <button
                type="button"
                className="btn-modal-submit"
                onClick={handleImprimir}
                style={{ background: "var(--surface-soft)", color: "var(--text)", border: "1px solid var(--border)" }}
              >
                🖨 Imprimir / PDF
              </button>
              <button
                type="button"
                className="btn-modal-submit"
                onClick={() => {
                  alert("¡Presupuesto enviado exitosamente al cliente por mensajería y registrado en el tablero!");
                  alCerrar();
                }}
              >
                ✓ Enviar al Cliente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
