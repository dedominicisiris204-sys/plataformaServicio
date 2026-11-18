import React, { useState } from "react";

export default function MercadoPagoModal({ abierto, alCerrar, concepto = "Seña de Trabajo", monto = 15000, destinatario = "Profesional Verificado", alCompletarPago }) {
  const [metodo, setMetodo] = useState("mercadopago"); // "mercadopago", "tarjeta", "transferencia"
  const [procesando, setProcesando] = useState(false);
  const [pagado, setPagado] = useState(false);
  const [idOperacion, setIdOperacion] = useState("");

  if (!abierto) return null;

  const montoNum = Number(monto) || 0;
  // Comisión del 10% de la plataforma ya incluida
  const comisionPlataforma = Math.round(montoNum * 0.10);
  const netoDestinatario = montoNum - comisionPlataforma;

  const handlePagar = (e) => {
    e.preventDefault();
    setProcesando(true);

    setTimeout(() => {
      const opId = `MP-${Math.floor(100000000 + Math.random() * 900000000)}`;
      setIdOperacion(opId);
      setProcesando(false);
      setPagado(true);

      if (alCompletarPago) {
        alCompletarPago({
          operacionId: opId,
          monto: montoNum,
          comision: comisionPlataforma,
          neto: netoDestinatario,
          concepto,
          destinatario,
          fecha: new Date().toISOString()
        });
      }
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={alCerrar} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 1200 }}>
      <div
        className="modal-container"
        style={{
          maxWidth: 520,
          width: "100%",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 158, 227, 0.35)"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Mercado Pago Branding */}
        <div
          style={{
            background: "linear-gradient(135deg, #009ee3 0%, #007eb5 100%)",
            color: "white",
            padding: "18px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 26 }}>💳</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, color: "white", fontWeight: 800 }}>Mercado Pago Checkout</h3>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
                Pago Blindado y Protegido · Plataforma de Servicios
              </span>
            </div>
          </div>
          <button className="btn-close-modal" onClick={alCerrar} style={{ color: "white" }}>✕</button>
        </div>

        {!pagado ? (
          <form onSubmit={handlePagar} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <div className="modal-body" style={{ overflowY: "auto", flex: 1, minHeight: 0, padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Resumen del cobro */}
              <div style={{ background: "var(--surface-soft)", border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700 }}>Concepto a abonar:</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginTop: 2 }}>{concepto}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                  Destinatario: <strong>{destinatario}</strong>
                </div>

                <div style={{ borderTop: "1px dashed var(--border)", marginTop: 12, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Total a pagar con Mercado Pago:</span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: "#009ee3" }}>
                    ${montoNum.toLocaleString()} ARS
                  </span>
                </div>

                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, display: "flex", justifyContent: "space-between" }}>
                  <span>🛡 Incluye comisión de plataforma (10%):</span>
                  <span>${comisionPlataforma.toLocaleString()}</span>
                </div>
              </div>

              {/* Selector de métodos de pago */}
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 800, color: "var(--text)", display: "block", marginBottom: 8 }}>
                  Selecciona tu forma de pago segura:
                </label>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label
                    style={{
                      border: metodo === "mercadopago" ? "2px solid #009ee3" : "1px solid var(--border)",
                      background: metodo === "mercadopago" ? "rgba(0, 158, 227, 0.08)" : "var(--surface)",
                      borderRadius: 12,
                      padding: "12px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12
                    }}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      checked={metodo === "mercadopago"}
                      onChange={() => setMetodo("mercadopago")}
                    />
                    <div>
                      <strong style={{ fontSize: 13, color: "var(--text)", display: "block" }}>
                        Dinero en cuenta de Mercado Pago
                      </strong>
                      <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Acreditación instantánea sin comisiones extra</span>
                    </div>
                  </label>

                  <label
                    style={{
                      border: metodo === "tarjeta" ? "2px solid #009ee3" : "1px solid var(--border)",
                      background: metodo === "tarjeta" ? "rgba(0, 158, 227, 0.08)" : "var(--surface)",
                      borderRadius: 12,
                      padding: "12px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12
                    }}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      checked={metodo === "tarjeta"}
                      onChange={() => setMetodo("tarjeta")}
                    />
                    <div>
                      <strong style={{ fontSize: 13, color: "var(--text)", display: "block" }}>
                        Tarjeta de Débito o Crédito (Visa / Mastercard)
                      </strong>
                      <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Hasta 3 cuotas sin interés según banco</span>
                    </div>
                  </label>

                  <label
                    style={{
                      border: metodo === "transferencia" ? "2px solid #009ee3" : "1px solid var(--border)",
                      background: metodo === "transferencia" ? "rgba(0, 158, 227, 0.08)" : "var(--surface)",
                      borderRadius: 12,
                      padding: "12px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12
                    }}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      checked={metodo === "transferencia"}
                      onChange={() => setMetodo("transferencia")}
                    />
                    <div>
                      <strong style={{ fontSize: 13, color: "var(--text)", display: "block" }}>
                        Transferencia Bancaria / CVU
                      </strong>
                      <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Acreditación inmediata con comprobante</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Aviso antifraude y de seguridad */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 12, fontSize: 12, color: "#166534", display: "flex", gap: 8, alignItems: "center" }}>
                <span>🔒</span>
                <span>
                  <strong>Garantía de Satisfacción:</strong> Tu dinero queda en custodia segura por la plataforma y se libera al trabajador cuando el trabajo finalice correctamente.
                </span>
              </div>
            </div>

            <div style={{ flexShrink: 0, padding: "14px 22px", borderTop: "1px solid var(--border)", background: "var(--surface)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" className="btn-modal-cancel" onClick={alCerrar} disabled={procesando}>
                Cancelar
              </button>
              <button
                type="submit"
                disabled={procesando}
                style={{
                  background: "#009ee3",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 22px",
                  fontSize: 14,
                  fontWeight: 900,
                  cursor: procesando ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 4px 14px rgba(0, 158, 227, 0.4)"
                }}
              >
                {procesando ? (
                  <span>Procesando pago seguro...</span>
                ) : (
                  <span>Pagar ${montoNum.toLocaleString()} ARS con Mercado Pago →</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-body" style={{ textAlign: "center", padding: "34px 24px", gap: 16 }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", fontSize: 36, display: "grid", placeItems: "center", margin: "0 auto" }}>
              ✓
            </div>
            <h3 style={{ margin: 0, fontSize: 22, color: "var(--text)" }}>¡Pago Aprobado con Éxito!</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13.5 }}>
              La transacción ha sido procesada correctamente mediante <strong>Mercado Pago</strong>.
            </p>

            <div style={{ background: "var(--surface-soft)", border: "1px dashed var(--border)", borderRadius: 12, padding: 16, textAlign: "left", fontSize: 12.5, display: "flex", flexDirection: "column", gap: 6 }}>
              <div>Operación ID: <strong>{idOperacion}</strong></div>
              <div>Concepto: <strong>{concepto}</strong></div>
              <div>Monto Pagado: <strong>${montoNum.toLocaleString()} ARS</strong></div>
              <div>Retención de Plataforma (10%): <strong>${comisionPlataforma.toLocaleString()} ARS</strong></div>
              <div>Neto para el Profesional: <strong>${netoDestinatario.toLocaleString()} ARS</strong></div>
              <div style={{ color: "#16a34a", fontWeight: 700, marginTop: 4 }}>✔ Comprobante enviado por el chat seguro</div>
            </div>

            <button
              type="button"
              className="btn-modal-submit"
              onClick={alCerrar}
              style={{ marginInline: "auto", minWidth: 180, marginTop: 10 }}
            >
              Cerrar y volver al Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
