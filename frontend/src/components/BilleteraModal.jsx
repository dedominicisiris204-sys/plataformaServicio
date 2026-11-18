import React, { useState, useEffect } from "react";

export default function BilleteraModal({ abierto, alCerrar, usuario }) {
  const [saldoDisponible, setSaldoDisponible] = useState(() => {
    const guardado = localStorage.getItem("billetera_saldo");
    return guardado !== null ? Number(guardado) : 135000;
  });

  const [saldoEnCustodia, setSaldoEnCustodia] = useState(45000);
  const [totalRetirado, setTotalRetirado] = useState(() => {
    const guardado = localStorage.getItem("billetera_retirado");
    return guardado !== null ? Number(guardado) : 90000;
  });

  const [mostrarFormRetiro, setMostrarFormRetiro] = useState(false);
  const [montoRetiro, setMontoRetiro] = useState("");
  const [aliasCbu, setAliasCbu] = useState("");
  const [titularCuenta, setTitularCuenta] = useState(usuario?.nombre || "Carlos Benítez");
  const [bancoBilletera, setBancoBilletera] = useState("Mercado Pago");
  const [mensajeExito, setMensajeExito] = useState("");

  const [movimientos, setMovimientos] = useState(() => {
    const guardado = localStorage.getItem("billetera_movimientos");
    if (guardado) {
      try { return JSON.parse(guardado); } catch { }
    }
    return [
      {
        id: "MOV-891",
        fecha: "17/11/2026",
        concepto: "Reparación de cañerías y grifería monocomando",
        cliente: "Laura Martínez",
        montoBruto: 50000,
        comision10: 5000,
        montoNeto: 45000,
        estado: "Acreditado"
      },
      {
        id: "MOV-890",
        fecha: "15/11/2026",
        concepto: "Instalación de disyuntor diferencial y térmicas",
        cliente: "Esteban Rossi",
        montoBruto: 60000,
        comision10: 6000,
        montoNeto: 54000,
        estado: "Acreditado"
      },
      {
        id: "MOV-889",
        fecha: "12/11/2026",
        concepto: "Pintura de ambiente estándar y enduido",
        cliente: "María Elena Gómez",
        montoBruto: 40000,
        comision10: 4000,
        montoNeto: 36000,
        estado: "Acreditado"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("billetera_saldo", String(saldoDisponible));
    localStorage.setItem("billetera_retirado", String(totalRetirado));
    localStorage.setItem("billetera_movimientos", JSON.stringify(movimientos));
  }, [saldoDisponible, totalRetirado, movimientos]);

  if (!abierto) return null;

  const handleRetiro = (e) => {
    e.preventDefault();
    const monto = Number(montoRetiro);
    if (!monto || monto <= 0) {
      alert("Por favor ingresa un monto válido a retirar.");
      return;
    }
    if (monto > saldoDisponible) {
      alert("El monto ingresado supera tu saldo disponible.");
      return;
    }
    if (!aliasCbu.trim()) {
      alert("Por favor ingresa tu Alias, CBU o CVU de destino.");
      return;
    }

    const nroOperacion = `RET-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setSaldoDisponible(prev => prev - monto);
    setTotalRetirado(prev => prev + monto);

    const nuevoMov = {
      id: nroOperacion,
      fecha: new Date().toLocaleDateString("es-AR"),
      concepto: `Retiro de fondos a ${bancoBilletera} (${aliasCbu.trim()})`,
      cliente: "Transferencia a Cuenta Propia",
      montoBruto: -monto,
      comision10: 0,
      montoNeto: -monto,
      estado: "Transferido"
    };

    setMovimientos(prev => [nuevoMov, ...prev]);
    setMensajeExito(`¡Transferencia de $${monto.toLocaleString()} ARS procesada a tu cuenta de ${bancoBilletera} (${aliasCbu.trim()})! Comprobante: #${nroOperacion}`);
    setMontoRetiro("");
    setMostrarFormRetiro(false);
  };

  return (
    <div className="modal-overlay" onClick={alCerrar} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 1200 }}>
      <div
        className="modal-container"
        style={{
          maxWidth: 680,
          width: "100%",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          overflow: "hidden"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="modal-header" style={{ padding: "18px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg, #16a34a, #059669)",
                display: "grid",
                placeItems: "center",
                color: "white",
                fontSize: 22
              }}
            >
              💰
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, color: "var(--text)" }}>Mi Billetera & Saldos</h3>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Cobros de trabajos con comisión del 10% descontada y retiros a tu CBU/Alias
              </span>
            </div>
          </div>
          <button className="btn-close-modal" onClick={alCerrar}>✕</button>
        </div>

        {/* Cuerpo */}
        <div className="modal-body" style={{ overflowY: "auto", flex: 1, minHeight: 0, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          {mensajeExito && (
            <div
              style={{
                padding: "12px 16px",
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: 12,
                color: "#166534",
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <span>✅</span>
              <span>{mensajeExito}</span>
            </div>
          )}

          {/* Tarjetas de Saldos */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            <div
              style={{
                background: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
                color: "white",
                padding: "18px 20px",
                borderRadius: 16,
                boxShadow: "0 4px 14px rgba(22, 101, 52, 0.25)"
              }}
            >
              <span style={{ fontSize: 11.5, opacity: 0.9, textTransform: "uppercase", fontWeight: 700 }}>
                Saldo Disponible
              </span>
              <h2 style={{ fontSize: 28, margin: "6px 0 0", fontWeight: 900 }}>
                ${saldoDisponible.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600 }}>ARS</span>
              </h2>
              <span style={{ fontSize: 11, opacity: 0.85, marginTop: 4, display: "block" }}>
                Listo para transferir a tu cuenta bancaria
              </span>
            </div>

            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                padding: "18px 20px",
                borderRadius: 16
              }}
            >
              <span style={{ fontSize: 11.5, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                En Custodia (Trabajos en Curso)
              </span>
              <h2 style={{ fontSize: 24, margin: "6px 0 0", color: "#0284c7", fontWeight: 900 }}>
                ${saldoEnCustodia.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600 }}>ARS</span>
              </h2>
              <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
                Se libera cuando el cliente aprueba la entrega
              </span>
            </div>

            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                padding: "18px 20px",
                borderRadius: 16
              }}
            >
              <span style={{ fontSize: 11.5, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Total Retirado Histórico
              </span>
              <h2 style={{ fontSize: 24, margin: "6px 0 0", color: "var(--text)", fontWeight: 900 }}>
                ${totalRetirado.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600 }}>ARS</span>
              </h2>
              <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
                Cobrado y transferido a tu banco
              </span>
            </div>
          </div>

          {/* Botón Acción Retiro */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setMostrarFormRetiro(prev => !prev)}
              style={{
                flex: 1,
                padding: "12px 18px",
                background: "linear-gradient(135deg, #16a34a, #059669)",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 2px 10px rgba(22, 163, 74, 0.3)"
              }}
            >
              <span>🏦</span>
              <span>{mostrarFormRetiro ? "Cancelar Retiro" : "Solicitar Retiro a mi CBU / CVU / Alias"}</span>
            </button>
          </div>

          {/* Formulario de Retiro */}
          {mostrarFormRetiro && (
            <form
              onSubmit={handleRetiro}
              style={{
                background: "var(--surface-soft)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 14
              }}
            >
              <h4 style={{ margin: 0, fontSize: 15, color: "var(--text)" }}>
                💳 Datos de Transferencia Inmediata
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>
                    Monto a retirar ($ ARS)
                  </label>
                  <input
                    type="number"
                    max={saldoDisponible}
                    min={1000}
                    value={montoRetiro}
                    onChange={e => setMontoRetiro(e.target.value)}
                    placeholder={`Máximo: $${saldoDisponible.toLocaleString()}`}
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 14 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>
                    Billetera o Banco
                  </label>
                  <select
                    value={bancoBilletera}
                    onChange={e => setBancoBilletera(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 14 }}
                  >
                    <option value="Mercado Pago">Mercado Pago</option>
                    <option value="Ualá">Ualá</option>
                    <option value="Naranja X">Naranja X</option>
                    <option value="Banco Nación / Provincia">Banco Nación / Provincia</option>
                    <option value="Banco Santander / Galicia / BBVA">Banco Privado (Santander / Galicia)</option>
                    <option value="Otra Cuenta Bancaria">Otra Cuenta Bancaria</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>
                    Alias, CBU o CVU (22 dígitos)
                  </label>
                  <input
                    type="text"
                    value={aliasCbu}
                    onChange={e => setAliasCbu(e.target.value)}
                    placeholder="Ej: juan.plomero.mp o 00000031..."
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 14 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>
                    Titular de la cuenta
                  </label>
                  <input
                    type="text"
                    value={titularCuenta}
                    onChange={e => setTitularCuenta(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 14 }}
                  />
                </div>
              </div>

              <div style={{ background: "rgba(22, 163, 74, 0.08)", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(22, 163, 74, 0.2)", fontSize: 12, color: "var(--text-secondary)" }}>
                ⚡ <strong>Acreditación instantánea:</strong> La transferencia se procesa automáticamente sin costo de comisión adicional para vos.
              </div>

              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #059669)",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px",
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: "pointer"
                }}
              >
                Confirmar y Transferir Ahora →
              </button>
            </form>
          )}

          {/* Historial de Movimientos y Comisiones */}
          <div>
            <h4 style={{ margin: "0 0 12px", fontSize: 15, color: "var(--text)" }}>
              📋 Historial de Trabajos Cobrados y Retiros
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {movimientos.map((mov) => {
                const esRetiro = mov.montoNeto < 0;
                return (
                  <div
                    key={mov.id}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          background: esRetiro ? "#fee2e2" : "#dcfce7",
                          color: esRetiro ? "#dc2626" : "#16a34a",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 18,
                          fontWeight: 800
                        }}
                      >
                        {esRetiro ? "↗" : "↙"}
                      </div>
                      <div>
                        <strong style={{ fontSize: 13.5, color: "var(--text)", display: "block" }}>
                          {mov.concepto}
                        </strong>
                        <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                          {mov.fecha} · {mov.cliente} · Ref: {mov.id}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <strong
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: esRetiro ? "#dc2626" : "#16a34a"
                        }}
                      >
                        {esRetiro ? `-$${Math.abs(mov.montoNeto).toLocaleString()}` : `+$${mov.montoNeto.toLocaleString()}`} ARS
                      </strong>
                      {!esRetiro && (
                        <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>
                          (Retenido 10% plataforma: -${mov.comision10.toLocaleString()})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
