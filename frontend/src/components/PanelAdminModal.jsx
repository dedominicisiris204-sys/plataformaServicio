import React, { useState } from "react";

export default function PanelAdminModal({ abierto, alCerrar, usuario }) {
  const [comisiones, setComisiones] = useState([
    { id: 101, fecha: "18/11/2026", profesional: "Carlos Benítez", cliente: "Laura Martínez", rubro: "Plomería", montoTotal: 45000, comision: 4500, estado: "COBRADA" },
    { id: 102, fecha: "17/11/2026", profesional: "Martín Sosa", cliente: "Roberto Rossi", rubro: "Electricidad", montoTotal: 30000, comision: 3000, estado: "COBRADA" },
    { id: 103, fecha: "16/11/2026", profesional: "Cuadrilla Integral Obras", cliente: "Edificio Palmeras", rubro: "Albañilería", montoTotal: 180000, comision: 18000, estado: "PENDIENTE" },
    { id: 104, fecha: "15/11/2026", profesional: "Diego Morales", cliente: "Mariana Paz", rubro: "Pintura", montoTotal: 60000, comision: 6000, estado: "COBRADA" }
  ]);

  const [empresasSuscritas, setEmpresasSuscritas] = useState([
    { id: 1, nombre: "Construcciones del Plata S.A.", rubro: "Construcción", plan: "Constructora & Obras", cuota: 28000, estado: "AL DIA", proxCobro: "01/12/2026" },
    { id: 2, nombre: "Retail & Franquicias Sur", rubro: "Comercio", plan: "PyME & Comercio", cuota: 12000, estado: "AL DIA", proxCobro: "01/12/2026" },
    { id: 3, nombre: "Desarrolladora Urbana Green", rubro: "Inmobiliaria", plan: "Corporativo / Industria", cuota: 55000, estado: "AL DIA", proxCobro: "01/12/2026" }
  ]);

  if (!abierto) return null;

  const totalComisionesCobradas = comisiones
    .filter(c => c.estado === "COBRADA")
    .reduce((acc, c) => acc + c.comision, 0);

  const totalComisionesPendientes = comisiones
    .filter(c => c.estado === "PENDIENTE")
    .reduce((acc, c) => acc + c.comision, 0);

  const totalCuotasEmpresas = empresasSuscritas
    .reduce((acc, e) => acc + e.cuota, 0);

  const ingresoTotalMensual = totalComisionesCobradas + totalCuotasEmpresas;

  const handleMarcarCobrada = (id) => {
    setComisiones(comisiones.map(c => c.id === id ? { ...c, estado: "COBRADA" } : c));
  };

  return (
    <div className="modal-overlay" onClick={alCerrar} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 1100 }}>
      <div
        className="modal-container"
        style={{
          maxWidth: 860,
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
        <div className="modal-header" style={{ flexShrink: 0, padding: "16px 24px", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>👑</span>
            <div>
              <h2 style={{ margin: 0, fontSize: 19, color: "white" }}>Panel de Control del Administrador</h2>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                Gestión Financiera de la Plataforma · Ingresos por Comisiones (10%) y Abonos Empresariales
              </span>
            </div>
          </div>
          <button className="btn-close-modal" onClick={alCerrar} style={{ color: "white" }}>✕</button>
        </div>

        {/* Cuerpo Scrollable */}
        <div className="modal-body" style={{ overflowY: "auto", flex: 1, minHeight: 0, padding: "20px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Tarjetas de Métricas Principales */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700 }}>💰 Ingreso Total Estimado</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#16a34a", marginTop: 4 }}>
                ${ingresoTotalMensual.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Comisiones + Cuotas empresas</div>
            </div>

            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700 }}>⚡ Comisiones 10% Cobradas</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "var(--primary)", marginTop: 4 }}>
                ${totalComisionesCobradas.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: "#e11d48", marginTop: 2 }}>
                +${totalComisionesPendientes.toLocaleString()} pendientes
              </div>
            </div>

            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700 }}>🏢 Cuotas Empresas / Mes</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#0284c7", marginTop: 4 }}>
                ${totalCuotasEmpresas.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>3 empresas suscriptas activas</div>
            </div>
          </div>

          {/* Sección 1: Registro de Comisiones por Trabajo */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16, color: "var(--text)" }}>
                🛠️ Comisiones por Trabajos Concretados (10% sobre mano de obra)
              </h3>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{comisiones.length} operaciones registradas</span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "var(--surface-soft)", borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: "8px 10px" }}>Fecha</th>
                    <th style={{ padding: "8px 10px" }}>Profesional</th>
                    <th style={{ padding: "8px 10px" }}>Cliente</th>
                    <th style={{ padding: "8px 10px" }}>Rubro</th>
                    <th style={{ padding: "8px 10px" }}>Total Trabajo</th>
                    <th style={{ padding: "8px 10px" }}>Tu Ganancia (10%)</th>
                    <th style={{ padding: "8px 10px" }}>Estado</th>
                    <th style={{ padding: "8px 10px" }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {comisiones.map(c => (
                    <tr key={c.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "10px" }}>{c.fecha}</td>
                      <td style={{ padding: "10px", fontWeight: 700 }}>{c.profesional}</td>
                      <td style={{ padding: "10px" }}>{c.cliente}</td>
                      <td style={{ padding: "10px" }}>{c.rubro}</td>
                      <td style={{ padding: "10px" }}>${c.montoTotal.toLocaleString()}</td>
                      <td style={{ padding: "10px", fontWeight: 800, color: "#16a34a" }}>${c.comision.toLocaleString()}</td>
                      <td style={{ padding: "10px" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 800,
                            background: c.estado === "COBRADA" ? "#dcfce7" : "#fee2e2",
                            color: c.estado === "COBRADA" ? "#166534" : "#991b1b"
                          }}
                        >
                          {c.estado}
                        </span>
                      </td>
                      <td style={{ padding: "10px" }}>
                        {c.estado === "PENDIENTE" ? (
                          <button
                            type="button"
                            onClick={() => handleMarcarCobrada(c.id)}
                            style={{
                              padding: "4px 8px",
                              fontSize: 11,
                              background: "var(--primary)",
                              color: "white",
                              border: "none",
                              borderRadius: 6,
                              cursor: "pointer"
                            }}
                          >
                            Marcar Cobrada
                          </button>
                        ) : (
                          <span style={{ color: "#16a34a", fontSize: 13 }}>✔ Registrado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sección 2: Empresas Suscriptas con Cuota Mensual */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16, color: "var(--text)" }}>
                🏢 Empresas Activas con Cuota Mensual Fija
              </h3>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Cobro recurrente mensual</span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "var(--surface-soft)", borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: "8px 10px" }}>Empresa</th>
                    <th style={{ padding: "8px 10px" }}>Rubro</th>
                    <th style={{ padding: "8px 10px" }}>Plan Asignado</th>
                    <th style={{ padding: "8px 10px" }}>Cuota Mensual</th>
                    <th style={{ padding: "8px 10px" }}>Próximo Vencimiento</th>
                    <th style={{ padding: "8px 10px" }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {empresasSuscritas.map(e => (
                    <tr key={e.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "10px", fontWeight: 700 }}>{e.nombre}</td>
                      <td style={{ padding: "10px" }}>{e.rubro}</td>
                      <td style={{ padding: "10px" }}>{e.plan}</td>
                      <td style={{ padding: "10px", fontWeight: 800, color: "#0284c7" }}>${e.cuota.toLocaleString()} ARS</td>
                      <td style={{ padding: "10px" }}>{e.proxCobro}</td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ background: "#dcfce7", color: "#166534", padding: "3px 8px", borderRadius: 12, fontSize: 11, fontWeight: 800 }}>
                          {e.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ flexShrink: 0, padding: "14px 24px", borderTop: "1px solid var(--border)", background: "var(--surface)", display: "flex", justifyContent: "flex-end" }}>
          <button type="button" className="btn-modal-submit" onClick={alCerrar} style={{ minWidth: 120 }}>
            Cerrar Panel Admin
          </button>
        </div>
      </div>
    </div>
  );
}
