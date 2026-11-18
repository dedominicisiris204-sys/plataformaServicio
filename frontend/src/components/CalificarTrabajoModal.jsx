import React, { useState } from "react";

export default function CalificarTrabajoModal({ abierto, alCerrar, profesional = "Carlos Benítez", alGuardarResena }) {
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState(["Puntualidad impecable", "Calidad excelente"]);
  const [guardado, setGuardado] = useState(false);

  if (!abierto) return null;

  const ETIQUETAS_POSIBLES = [
    "Puntualidad impecable",
    "Limpieza en el lugar",
    "Calidad excelente",
    "Precio justo y claro",
    "Buen trato y respeto",
    "Terminó en el plazo acordado",
    "Matrícula comprobada"
  ];

  const alternarEtiqueta = (tag) => {
    if (etiquetasSeleccionadas.includes(tag)) {
      setEtiquetasSeleccionadas(etiquetasSeleccionadas.filter(t => t !== tag));
    } else {
      setEtiquetasSeleccionadas([...etiquetasSeleccionadas, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comentario.trim()) {
      alert("Por favor deja un breve comentario sobre tu experiencia.");
      return;
    }

    setGuardado(true);
    if (alGuardarResena) {
      alGuardarResena({
        profesional,
        estrellas,
        comentario,
        etiquetas: etiquetasSeleccionadas,
        fecha: new Date().toLocaleDateString("es-AR")
      });
    }
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
          <div>
            <h3 style={{ margin: 0, fontSize: 18 }}>⭐ Calificar Trabajo Concluido</h3>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Tu opinión verificada ayuda a toda la comunidad</span>
          </div>
          <button className="btn-close-modal" onClick={alCerrar}>✕</button>
        </div>

        {!guardado ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <div className="modal-body" style={{ overflowY: "auto", flex: 1, minHeight: 0, padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)", display: "block" }}>
                  ¿Cómo calificarías el servicio de <strong>{profesional}</strong>?
                </span>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEstrellas(star)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: 32,
                        cursor: "pointer",
                        color: star <= estrellas ? "#f59e0b" : "#cbd5e1",
                        transition: "transform 0.1s ease"
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <strong style={{ fontSize: 14, color: "#f59e0b", marginTop: 4, display: "block" }}>
                  {estrellas === 5 ? "¡Excelente! Altamente recomendado" : estrellas === 4 ? "Muy bueno" : estrellas === 3 ? "Aceptable" : "Regular"}
                </strong>
              </div>

              {/* Etiquetas positivas */}
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, display: "block", marginBottom: 8 }}>
                  Aspectos destacados del profesional:
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {ETIQUETAS_POSIBLES.map(tag => {
                    const activa = etiquetasSeleccionadas.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => alternarEtiqueta(tag)}
                        style={{
                          background: activa ? "var(--primary-light)" : "var(--surface-soft)",
                          border: activa ? "1px solid var(--primary)" : "1px solid var(--border)",
                          color: activa ? "var(--primary)" : "var(--text-muted)",
                          padding: "6px 12px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        {activa ? `✔ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="modal-field">
                <label>Comentario y detalle del trabajo</label>
                <textarea
                  rows={3}
                  placeholder="Cuéntale a otros clientes qué tal fue la experiencia, si cuidó los detalles..."
                  value={comentario}
                  onChange={e => setComentario(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-footer" style={{ padding: "14px 22px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" className="btn-modal-cancel" onClick={alCerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn-modal-submit">
                Publicar Reseña Verificada →
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-body" style={{ textAlign: "center", padding: "34px 24px", gap: 16 }}>
            <div style={{ fontSize: 48 }}>🎉</div>
            <h3 style={{ margin: 0, fontSize: 20 }}>¡Muchas gracias por tu reseña!</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13.5 }}>
              Tu valoración de <strong>{estrellas} estrellas</strong> ya fue publicada en el perfil de {profesional} con el sello de <strong>✔ Contratación Verificada</strong>.
            </p>
            <button
              type="button"
              className="btn-modal-submit"
              onClick={alCerrar}
              style={{ marginInline: "auto", minWidth: 160, marginTop: 10 }}
            >
              Listo, cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
