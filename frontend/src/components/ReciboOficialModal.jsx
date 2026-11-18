import React from "react";

export default function ReciboOficialModal({ abierto, alCerrar, datos }) {
  if (!abierto) return null;

  const info = datos || {
    nroRecibo: `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    fecha: new Date().toLocaleDateString("es-AR"),
    cliente: "Laura Martínez",
    cuitCliente: "27-35123456-4",
    profesional: "Carlos Benítez",
    matricula: "MAT-2024-8842-BA",
    rubro: "Plomería e Instalaciones",
    concepto: "Reparación integral de cañerías y cambio de grifería monocomando",
    montoManoDeObra: 45000,
    montoMateriales: 22000,
    comisionPlataforma: 4500,
    total: 67000,
    metodoPago: "Mercado Pago (Operación #MP-84910283)"
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={alCerrar} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 1200 }}>
      <div
        className="modal-container"
        style={{
          maxWidth: 680,
          width: "100%",
          maxHeight: "94vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          overflow: "hidden"
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header" style={{ padding: "16px 22px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18 }}>🧾 Comprobante Oficial de Servicio</h3>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Válido para constancia de pago y control contable</span>
          </div>
          <button className="btn-close-modal" onClick={alCerrar}>✕</button>
        </div>

        <div className="modal-body" style={{ overflowY: "auto", flex: 1, minHeight: 0, padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Documento Recibo */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)"
            }}
          >
            {/* Cabecera del comprobante */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid var(--border)", paddingBottom: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--primary-gradient)", color: "white", display: "grid", placeItems: "center", fontWeight: 900 }}>PS</div>
                  <strong style={{ fontSize: 16, color: "var(--text)" }}>PLATAFORMA DE SERVICIOS</strong>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                  Red Federal de Especialistas y Oficios Certificados
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  CUIT: 30-71689234-9 · IVA Responsable Inscripto
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--primary)" }}>RECIBO DE SERVICIO</div>
                <strong style={{ fontSize: 16, color: "var(--text)" }}>{info.nroRecibo}</strong>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>Fecha: {info.fecha}</div>
                <div style={{ display: "inline-block", background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: 8, fontSize: 10.5, fontWeight: 800, marginTop: 4 }}>
                  ✔ PAGADO / ACREDITADO
                </div>
              </div>
            </div>

            {/* Partes intervinientes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 12.5, background: "var(--surface-soft)", padding: 14, borderRadius: 12 }}>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Cliente / Contratante:</span>
                <strong style={{ color: "var(--text)", fontSize: 13.5 }}>{info.cliente}</strong>
                <div style={{ color: "var(--text-muted)", fontSize: 11.5 }}>CUIT/DNI: {info.cuitCliente}</div>
              </div>

              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Profesional Ejecutor:</span>
                <strong style={{ color: "var(--text)", fontSize: 13.5 }}>{info.profesional}</strong>
                <div style={{ color: "var(--primary)", fontSize: 11.5 }}>✔ Matrícula: {info.matricula}</div>
              </div>
            </div>

            {/* Concepto del trabajo */}
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>CONCEPTO DEL TRABAJO:</span>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text)", background: "var(--surface)", border: "1px solid var(--border-subtle)", padding: 10, borderRadius: 8 }}>
                {info.concepto} (Rubro: {info.rubro})
              </p>
            </div>

            {/* Tabla de liquidación */}
            <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface-soft)", fontSize: 11.5, fontWeight: 700 }}>
                <span>Detalle</span>
                <span>Subtotal</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", borderBottom: "1px solid var(--border-subtle)", fontSize: 12.5 }}>
                <span>Mano de obra técnica especializada</span>
                <strong>${info.montoManoDeObra.toLocaleString()} ARS</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", borderBottom: "1px solid var(--border-subtle)", fontSize: 12.5 }}>
                <span>Materiales e insumos aplicados</span>
                <strong>${info.montoMateriales.toLocaleString()} ARS</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", background: "var(--primary-light)", fontSize: 16, fontWeight: 900 }}>
                <span style={{ color: "var(--text)" }}>TOTAL ABONADO:</span>
                <span style={{ color: "var(--primary)" }}>${info.total.toLocaleString()} ARS</span>
              </div>
            </div>

            <div style={{ fontSize: 11.5, color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
              <span>Medio de Pago: <strong>{info.metodoPago}</strong></span>
              <span>Garantía escrita de 3 meses incluida</span>
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
            onClick={handleImprimir}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span>🖨️</span>
            <span>Imprimir / Guardar en PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
