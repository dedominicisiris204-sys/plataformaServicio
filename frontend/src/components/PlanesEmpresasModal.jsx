import React, { useState } from "react";

export default function PlanesEmpresasModal({ abierto, alCerrar, usuario }) {
  const [rubro, setRubro] = useState("Construcción y Reformas");
  const [tamano, setTamano] = useState("pyme");
  const [planSeleccionado, setPlanSeleccionado] = useState("constructora");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [cuit, setCuit] = useState("");
  const [suscrito, setSuscrito] = useState(false);

  if (!abierto) return null;

  const planes = [
    {
      id: "pyme",
      nombre: "Plan PyME & Comercio",
      precio: 12000,
      periodo: "/mes",
      badge: "Ideal Comercios y Oficinas",
      caracteristicas: [
        "Hasta 5 búsquedas laborales activas",
        "Contacto directo con profesionales verificados",
        "Presupuestos digitales sin límite",
        "Soporte por email 24/7"
      ]
    },
    {
      id: "constructora",
      nombre: "Plan Constructora & Obras",
      precio: 28000,
      periodo: "/mes",
      badge: "Más Elegido · Empresas de Servicios",
      destacado: true,
      caracteristicas: [
        "Búsquedas y contrataciones ilimitadas",
        "Contratación directa de cuadrillas completas",
        "Alertas prioritarias por zona y cercanía",
        "Factura A con detalle de servicios",
        "Garantía extendida de cumplimiento"
      ]
    },
    {
      id: "corporativo",
      nombre: "Plan Corporativo / Industria",
      precio: 55000,
      periodo: "/mes",
      badge: "Grandes Obras & Franquicias",
      caracteristicas: [
        "Múltiples sucursales y administradores",
        "Licitaciones privadas de presupuestos",
        "Auditoría técnica de matriculados",
        "Ejecutivo de cuentas dedicado",
        "Descuento preferencial en comisiones"
      ]
    }
  ];

  const planActual = planes.find(p => p.id === planSeleccionado) || planes[1];

  const handleSuscribir = (e) => {
    e.preventDefault();
    if (!nombreEmpresa.trim()) {
      alert("Por favor ingresa el nombre de la empresa.");
      return;
    }
    setSuscrito(true);
  };

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-container" style={{ maxWidth: 760 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>🏢 Planes Mensuales para Empresas</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
              Contrata personal calificado, cuadrillas y servicios técnicos con cuota mensual deducible.
            </p>
          </div>
          <button className="btn-close-modal" onClick={alCerrar}>✕</button>
        </div>

        {!suscrito ? (
          <form onSubmit={handleSuscribir} className="modal-body" style={{ gap: 20 }}>
            {/* Datos de la empresa */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 12 }}>
              <div className="modal-field">
                <label>Nombre Comercial / Razón Social</label>
                <input
                  type="text"
                  placeholder="Ej: Construcciones del Sur S.A."
                  value={nombreEmpresa}
                  onChange={e => setNombreEmpresa(e.target.value)}
                  required
                />
              </div>

              <div className="modal-field">
                <label>Rubro Principal</label>
                <select value={rubro} onChange={e => setRubro(e.target.value)}>
                  <option value="Construcción y Reformas">🏗️ Construcción & Reformas</option>
                  <option value="Mantenimiento e Instalaciones">⚡ Mantenimiento & Energía</option>
                  <option value="Inmobiliaria y Consorcios">🏢 Inmobiliarias & Consorcios</option>
                  <option value="Comercio y Retail">🏪 Comercio & Franquicias</option>
                  <option value="Industria y Logística">🏭 Industria & Logística</option>
                </select>
              </div>

              <div className="modal-field">
                <label>CUIT / Identificación Fiscal</label>
                <input
                  type="text"
                  placeholder="30-71234567-9"
                  value={cuit}
                  onChange={e => setCuit(e.target.value)}
                />
              </div>
            </div>

            {/* Selector de Planes */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", display: "block", marginBottom: 10 }}>
                Selecciona la escala mensual que mejor se adapte a tu actividad:
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
                {planes.map((p) => {
                  const esActivo = planSeleccionado === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setPlanSeleccionado(p.id)}
                      style={{
                        border: esActivo ? "2px solid var(--primary)" : "1px solid var(--border)",
                        background: esActivo ? "var(--primary-light)" : "var(--surface)",
                        borderRadius: 14,
                        padding: 16,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "all 0.2s ease",
                        position: "relative"
                      }}
                    >
                      {p.destacado && (
                        <span
                          style={{
                            position: "absolute",
                            top: -10,
                            right: 14,
                            background: "var(--primary)",
                            color: "white",
                            fontSize: 10,
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: 20
                          }}
                        >
                          RECOMENDADO
                        </span>
                      )}

                      <div>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>{p.badge}</span>
                        <h4 style={{ margin: "6px 0 8px", fontSize: 16, color: "var(--text)" }}>{p.nombre}</h4>
                        <div style={{ fontSize: 22, fontWeight: 900, color: "var(--primary)", marginBottom: 12 }}>
                          ${p.precio.toLocaleString()}
                          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>{p.periodo}</span>
                        </div>

                        <ul style={{ paddingLeft: 18, margin: 0, fontSize: 12, color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: 6 }}>
                          {p.caracteristicas.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        style={{
                          marginTop: 16,
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "none",
                          background: esActivo ? "var(--primary)" : "var(--surface-soft)",
                          color: esActivo ? "white" : "var(--text)",
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: "pointer"
                        }}
                      >
                        {esActivo ? "✓ Plan Seleccionado" : "Elegir este Plan"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: 6 }}>
              <button type="button" className="btn-modal-cancel" onClick={alCerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn-modal-submit">
                Suscribir Empresa (${planActual.precio.toLocaleString()} ARS/mes) →
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-body" style={{ textAlign: "center", padding: "30px 20px", gap: 16 }}>
            <div style={{ fontSize: 54 }}>🎉</div>
            <h3 style={{ margin: 0, fontSize: 22, color: "var(--text)" }}>
              ¡Suscripción Empresarial Activada!
            </h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 14, maxWidth: 480, marginInline: "auto" }}>
              La empresa <strong>{nombreEmpresa}</strong> ha sido dada de alta en el <strong>{planActual.nombre}</strong> con cuota de <strong>${planActual.precio.toLocaleString()} ARS/mes</strong> para el rubro <em>{rubro}</em>.
            </p>
            <div style={{ background: "var(--surface-soft)", border: "1px dashed var(--border)", borderRadius: 12, padding: 14, maxWidth: 450, marginInline: "auto", fontSize: 12.5, color: "var(--text-muted)" }}>
              ✔ Facturación automática el día 1 de cada mes<br />
              ✔ Búsquedas y publicaciones destacadas habilitadas<br />
              ✔ Acceso ilimitado al catálogo de especialistas certificados
            </div>
            <button
              type="button"
              className="btn-modal-submit"
              onClick={alCerrar}
              style={{ marginInline: "auto", minWidth: 180, marginTop: 10 }}
            >
              Listo, continuar en la plataforma
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
