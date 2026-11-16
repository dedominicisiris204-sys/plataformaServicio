import React, { useState } from "react";

export default function TrabajosKanbanView({ usuario, alAbrirPresupuesto }) {
  const [trabajos, setTrabajos] = useState([
    {
      id: "TRB-101",
      titulo: "Instalación de Termotanque 80L",
      cliente: "Carlos Benítez",
      profesional: "Juan Pérez (Plomero)",
      rubro: "Plomería",
      icono: "🔧",
      monto: 35000,
      estado: "presupuesto", // presupuesto, en_curso, finalizado, calificado
      fecha: "16 Nov 2026",
      prioridad: "Alta",
      notas: "Cambio de cañerías de entrada y salida, prueba de presión."
    },
    {
      id: "TRB-102",
      titulo: "Reemplazo de Tablero Eléctrico Principal",
      cliente: "Mariana Costa",
      profesional: "Roberto Gómez (Electricista)",
      rubro: "Electricidad",
      icono: "⚡",
      monto: 58000,
      estado: "en_curso",
      fecha: "15 Nov 2026",
      prioridad: "Urgente",
      notas: "Colocación de disyuntor diferencial y 4 llaves térmicas nuevas."
    },
    {
      id: "TRB-103",
      titulo: "Pintura Látex en Living y Comedor (45 m²)",
      cliente: "Silvia Domínguez",
      profesional: "Esteban Rossi (Pintor)",
      rubro: "Pintura",
      icono: "🎨",
      monto: 72000,
      estado: "finalizado",
      fecha: "12 Nov 2026",
      prioridad: "Media",
      notas: "Lijado, enduido de fisuras y 2 manos de látex lavable."
    },
    {
      id: "TRB-104",
      titulo: "Reparación y Ajuste de Puerta Corrediza",
      cliente: "Andrés Molina",
      profesional: "Diego Fernández (Carpintero)",
      rubro: "Carpintería",
      icono: "🚪",
      monto: 24000,
      estado: "calificado",
      fecha: "08 Nov 2026",
      prioridad: "Normal",
      calificacion: 5,
      resena: "Excelente trabajo y puntualidad. Quedó perfecta."
    }
  ]);

  const [modalNuevoTrabajo, setModalNuevoTrabajo] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoCliente, setNuevoCliente] = useState(usuario?.nombre || "Mi Hogar");
  const [nuevoRubro, setNuevoRubro] = useState("Plomería");
  const [nuevoMonto, setNuevoMonto] = useState("");
  const [nuevaPrioridad, setNuevaPrioridad] = useState("Normal");
  const [nuevasNotas, setNuevasNotas] = useState("");

  const columnas = [
    { key: "presupuesto", titulo: "🟡 Presupuesto Solicitado", badge: "badge-warning" },
    { key: "en_curso", titulo: "🔵 Aceptado / En Curso", badge: "badge-primary" },
    { key: "finalizado", titulo: "🟢 Finalizado (Listo p/ Calificar)", badge: "badge-success" },
    { key: "calificado", titulo: "🟣 Calificado / Cerrado", badge: "badge-secondary" }
  ];

  const siguienteEstado = {
    presupuesto: "en_curso",
    en_curso: "finalizado",
    finalizado: "calificado"
  };

  const anteriorEstado = {
    en_curso: "presupuesto",
    finalizado: "en_curso",
    calificado: "finalizado"
  };

  const moverEstado = (id, direccion) => {
    setTrabajos(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nuevoEst = direccion === "adelante" ? siguienteEstado[t.estado] : anteriorEstado[t.estado];
          return nuevoEst ? { ...t, estado: nuevoEst } : t;
        }
        return t;
      })
    );
  };

  const handleCrearTrabajo = (e) => {
    e.preventDefault();
    if (!nuevoTitulo.trim()) return;

    const iconosRubro = {
      Plomería: "🔧",
      Electricidad: "⚡",
      Albañilería: "🧱",
      Pintura: "🎨",
      Limpieza: "🧹",
      Jardinería: "🌳",
      Carpintería: "🚪",
      Reparaciones: "🔨"
    };

    const nuevo = {
      id: `TRB-${Math.floor(100 + Math.random() * 900)}`,
      titulo: nuevoTitulo.trim(),
      cliente: nuevoCliente.trim(),
      profesional: "Pendiente de asignación",
      rubro: nuevoRubro,
      icono: iconosRubro[nuevoRubro] || "🛠️",
      monto: Number(nuevoMonto) || 0,
      estado: "presupuesto",
      fecha: "Hoy",
      prioridad: nuevaPrioridad,
      notas: nuevasNotas.trim() || "Sin observaciones adicionales."
    };

    setTrabajos(prev => [nuevo, ...prev]);
    setNuevoTitulo("");
    setNuevoMonto("");
    setNuevasNotas("");
    setModalNuevoTrabajo(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Encabezado */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          background: "var(--surface-card)",
          padding: "20px 24px",
          borderRadius: 16,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: "var(--text)" }}>
            📋 Seguimiento de Trabajos y Contrataciones
          </h2>
          <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13.5 }}>
            Flujo de estados en tiempo real (Inspirado en el patrón de gestión modular de Odonto).
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => alAbrirPresupuesto && alAbrirPresupuesto()}
            className="btn-crear-publicacion"
            style={{ padding: "10px 16px", fontSize: 13, background: "var(--surface-soft)", color: "var(--text)", border: "1px solid var(--border)" }}
          >
            📄 Crear Presupuesto Digital
          </button>
          <button
            onClick={() => setModalNuevoTrabajo(true)}
            className="btn-crear-publicacion"
            style={{ padding: "10px 18px", fontSize: 13 }}
          >
            + Nuevo Trabajo
          </button>
        </div>
      </div>

      {/* Tablero Kanban */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          alignItems: "flex-start"
        }}
      >
        {columnas.map(col => {
          const itemsColumna = trabajos.filter(t => t.estado === col.key);
          return (
            <div
              key={col.key}
              style={{
                background: "var(--surface-card)",
                borderRadius: 16,
                border: "1px solid var(--border)",
                padding: "16px",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: 450
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: 10,
                  borderBottom: "1px solid var(--border-subtle)"
                }}
              >
                <strong style={{ fontSize: 14, color: "var(--text)" }}>{col.titulo}</strong>
                <span
                  style={{
                    background: "var(--surface-soft)",
                    color: "var(--text)",
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 700
                  }}
                >
                  {itemsColumna.length}
                </span>
              </div>

              {itemsColumna.length === 0 ? (
                <div
                  style={{
                    padding: "30px 10px",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: 12.5,
                    border: "1px dashed var(--border)",
                    borderRadius: 12
                  }}
                >
                  No hay trabajos en este estado
                </div>
              ) : (
                itemsColumna.map(t => (
                  <div
                    key={t.id}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 12,
                      padding: 14,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)" }}>
                        {t.icono} {t.rubro}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 6,
                          background: t.prioridad === "Urgente" ? "#fee2e2" : "#f1f5f9",
                          color: t.prioridad === "Urgente" ? "#b91c1c" : "var(--text-muted)"
                        }}
                      >
                        {t.prioridad}
                      </span>
                    </div>

                    <strong style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.3 }}>
                      {t.titulo}
                    </strong>

                    <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {t.notas}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, paddingTop: 4 }}>
                      <span style={{ color: "var(--text-muted)" }}>Cliente: <strong>{t.cliente}</strong></span>
                      <span style={{ fontWeight: 800, color: "var(--text)" }}>
                        {t.monto ? `$${t.monto.toLocaleString()}` : "A convenir"}
                      </span>
                    </div>

                    {t.calificacion && (
                      <div style={{ fontSize: 12, color: "#f59e0b", background: "#fef3c7", padding: "4px 8px", borderRadius: 6 }}>
                        {"★".repeat(t.calificacion)} <em>"{t.resena}"</em>
                      </div>
                    )}

                    {/* Botones de Cambio de Estado */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: 8,
                        marginTop: 4,
                        borderTop: "1px solid var(--border-subtle)",
                        gap: 6
                      }}
                    >
                      {t.estado !== "presupuesto" && (
                        <button
                          type="button"
                          onClick={() => moverEstado(t.id, "atras")}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-muted)",
                            fontSize: 11,
                            cursor: "pointer",
                            padding: "4px 6px"
                          }}
                        >
                          ← Volver
                        </button>
                      )}

                      {t.estado !== "calificado" && (
                        <button
                          type="button"
                          onClick={() => moverEstado(t.id, "adelante")}
                          style={{
                            background: "var(--primary-light)",
                            color: "var(--primary)",
                            border: "1px solid var(--primary)",
                            borderRadius: 6,
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: "pointer",
                            padding: "4px 10px",
                            marginLeft: "auto"
                          }}
                        >
                          {t.estado === "presupuesto" && "Aceptar Trabajo →"}
                          {t.estado === "en_curso" && "Marcar Finalizado ✓"}
                          {t.estado === "finalizado" && "Calificar Servicio ⭐"}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Nuevo Trabajo */}
      {modalNuevoTrabajo && (
        <div className="modal-overlay" onClick={() => setModalNuevoTrabajo(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Registrar Nuevo Trabajo</h2>
              <button className="btn-close-modal" onClick={() => setModalNuevoTrabajo(false)}>✕</button>
            </div>
            <form onSubmit={handleCrearTrabajo}>
              <div className="modal-body">
                <div className="modal-field">
                  <label>Título del Servicio o Reparación</label>
                  <input
                    type="text"
                    placeholder="Ej: Cambio de caños en cocina"
                    value={nuevoTitulo}
                    onChange={e => setNuevoTitulo(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="modal-field">
                    <label>Especialidad / Rubro</label>
                    <select value={nuevoRubro} onChange={e => setNuevoRubro(e.target.value)}>
                      <option value="Plomería">🔧 Plomería</option>
                      <option value="Electricidad">⚡ Electricidad</option>
                      <option value="Albañilería">🧱 Albañilería</option>
                      <option value="Pintura">🎨 Pintura</option>
                      <option value="Carpintería">🚪 Carpintería</option>
                      <option value="Limpieza">🧹 Limpieza</option>
                      <option value="Jardinería">🌳 Jardinería</option>
                      <option value="Reparaciones">🔨 Reparaciones</option>
                    </select>
                  </div>

                  <div className="modal-field">
                    <label>Prioridad</label>
                    <select value={nuevaPrioridad} onChange={e => setNuevaPrioridad(e.target.value)}>
                      <option value="Normal">Normal</option>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                      <option value="Urgente">🚨 Urgente (Guardia 24hs)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="modal-field">
                    <label>Cliente o Solicitante</label>
                    <input
                      type="text"
                      value={nuevoCliente}
                      onChange={e => setNuevoCliente(e.target.value)}
                    />
                  </div>

                  <div className="modal-field">
                    <label>Presupuesto Estimado ($)</label>
                    <input
                      type="number"
                      placeholder="Ej: 30000"
                      value={nuevoMonto}
                      onChange={e => setNuevoMonto(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-field">
                  <label>Descripción / Observaciones</label>
                  <textarea
                    rows={3}
                    placeholder="Detalles sobre materiales, horarios acordados o especificaciones del trabajo..."
                    value={nuevasNotas}
                    onChange={e => setNuevasNotas(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalNuevoTrabajo(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-submit">
                  Guardar en Tablero
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
