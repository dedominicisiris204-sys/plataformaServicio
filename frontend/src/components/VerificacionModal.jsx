import React, { useState } from "react";

export default function VerificacionModal({ abierto, alCerrar, usuario, alVerificar }) {
  const [matricula, setMatricula] = useState("");
  const [entidad, setEntidad] = useState("Colegio de Técnicos / COPIME");
  const [dni, setDni] = useState("");
  const [rubro, setRubro] = useState("Electricidad");
  const [procesando, setProcesando] = useState(false);
  const [verificado, setVerificado] = useState(false);

  if (!abierto) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!matricula.trim() || !dni.trim()) {
      alert("Por favor completa tu DNI y número de matrícula.");
      return;
    }

    setProcesando(true);
    setTimeout(() => {
      setProcesando(false);
      setVerificado(true);
      if (alVerificar) {
        alVerificar({
          matricula,
          entidad,
          dni,
          rubro,
          verificado: true
        });
      }
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={alCerrar} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 1200 }}>
      <div
        className="modal-container"
        style={{
          maxWidth: 540,
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
            <span style={{ fontSize: 22 }}>🛡️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 18 }}>Verificación Oficial de Matrícula</h3>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Obtén el sello azul de confianza en tu perfil y publicaciones</span>
            </div>
          </div>
          <button className="btn-close-modal" onClick={alCerrar}>✕</button>
        </div>

        {!verificado ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <div className="modal-body" style={{ overflowY: "auto", flex: 1, minHeight: 0, padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: 12, borderRadius: 12, fontSize: 12.5, color: "#1e40af" }}>
                ⭐ <strong>Beneficios de la Verificación:</strong> Los clientes contratan hasta 3 veces más a profesionales verificados porque tienen la seguridad de que son matriculados reales.
              </div>

              <div className="modal-field">
                <label>Número de DNI</label>
                <input
                  type="text"
                  placeholder="Ej: 38.123.456"
                  value={dni}
                  onChange={e => setDni(e.target.value)}
                  required
                />
              </div>

              <div className="modal-field">
                <label>Oficio / Especialidad Principal</label>
                <select value={rubro} onChange={e => setRubro(e.target.value)}>
                  <option value="Electricidad">⚡ Electricista Matriculado</option>
                  <option value="Plomería y Gas">🔧 Gasista / Plomero Matriculado</option>
                  <option value="Albañilería y Construcción">🧱 Maestro Mayor de Obra / Constructor</option>
                  <option value="Climatización y Refrigeración">❄️ Técnico Matriculado en Refrigeración</option>
                  <option value="Cerrajería y Seguridad">🔑 Cerrajero Calificado</option>
                </select>
              </div>

              <div className="modal-field">
                <label>Entidad Emisora de la Matrícula</label>
                <select value={entidad} onChange={e => setEntidad(e.target.value)}>
                  <option value="Colegio de Técnicos / COPIME">Colegio de Técnicos / COPIME</option>
                  <option value="ENARGAS / Distribuidora de Gas">ENARGAS / Distribuidora de Gas Oficial</option>
                  <option value="APSE / Seguridad Eléctrica">APSE / Seguridad Eléctrica</option>
                  <option value="Consejo Profesional de Ingeniería">Consejo Profesional de Ingeniería</option>
                  <option value="Certificación Técnica UTN / Escuela de Oficios">Certificación Técnica Oficial UTN / CFP</option>
                </select>
              </div>

              <div className="modal-field">
                <label>Número de Registro / Matrícula Profesional</label>
                <input
                  type="text"
                  placeholder="Ej: MAT-2024-8842-BA"
                  value={matricula}
                  onChange={e => setMatricula(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-footer" style={{ padding: "14px 22px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" className="btn-modal-cancel" onClick={alCerrar} disabled={procesando}>
                Cancelar
              </button>
              <button type="submit" className="btn-modal-submit" disabled={procesando}>
                {procesando ? "Validando en registro..." : "Verificar y Activar Tilde Azul →"}
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-body" style={{ textAlign: "center", padding: "34px 24px", gap: 16 }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#e0f2fe", color: "#0284c7", fontSize: 36, display: "grid", placeItems: "center", margin: "0 auto" }}>
              ✔
            </div>
            <h3 style={{ margin: 0, fontSize: 22, color: "var(--text)" }}>¡Matrícula Verificada con Éxito!</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13.5 }}>
              Tu registro <strong>{matricula}</strong> ({entidad}) ha sido validado.
            </p>
            <div style={{ background: "var(--surface-soft)", padding: 12, borderRadius: 10, fontSize: 12.5, color: "#0369a1", fontWeight: 700 }}>
              ✔ Tilde azul activado en todas tus publicaciones y cotizaciones
            </div>
            <button
              type="button"
              className="btn-modal-submit"
              onClick={alCerrar}
              style={{ marginInline: "auto", minWidth: 160, marginTop: 10 }}
            >
              Listo, continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
