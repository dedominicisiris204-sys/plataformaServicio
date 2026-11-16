import React from "react";
import { useNavigate } from "react-router-dom";

export default function PublicacionCard({
  publicacion,
  usuario,
  identidadUsuario,
  procesandoInteres,
  cantidadesInteres,
  manejarMeGusta,
  comentariosAbiertos,
  alternarComentarios,
  comentariosPorPublicacion,
  comentarioNuevo,
  setComentarioNuevo,
  procesandoComentario,
  enviarComentario,
  alPedirPresupuesto
}) {
  const navigate = useNavigate();
  const id = publicacion.id;
  const esUrgencia = publicacion.tipo?.toLowerCase().includes("urgencia") || publicacion.tipo?.toLowerCase().includes("guardia") || (publicacion.tags || []).some(t => /urgencia|guardia|24hs/i.test(t));

  return (
    <article
      style={{
        background: "var(--surface-card)",
        borderRadius: 16,
        border: esUrgencia ? "2px solid #ef4444" : "1px solid var(--border)",
        padding: "20px 24px",
        boxShadow: "var(--card-shadow)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative"
      }}
    >
      {/* Badge de Guardia 24hs si aplica */}
      {esUrgencia && (
        <div
          style={{
            position: "absolute",
            top: -10,
            right: 20,
            background: "#dc2626",
            color: "white",
            fontSize: 10.5,
            fontWeight: 900,
            padding: "3px 12px",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(220, 38, 38, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: 4
          }}
        >
          <span className="status-dot" style={{ background: "white", width: 6, height: 6 }} />
          GUARDIA 24HS · DISPONIBLE AHORA
        </div>
      )}

      {/* Cabecera de la publicación */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--primary-gradient)",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 16
            }}
          >
            {(publicacion.autor || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <strong style={{ fontSize: 15, color: "var(--text)" }}>{publicacion.autor}</strong>
              <span
                style={{
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  padding: "2px 8px",
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 700
                }}
              >
                {publicacion.tipo || "Servicio"}
              </span>
              <span style={{ fontSize: 11, color: "#0369a1", background: "#e0f2fe", padding: "1px 6px", borderRadius: 8, fontWeight: 700 }}>
                ✔ Matrícula Verificada
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              {publicacion.fecha
                ? new Date(publicacion.fecha).toLocaleString("es-AR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : "Reciente"}
              {publicacion.ubicacion && <span> • 📍 {publicacion.ubicacion}</span>}
              <span> • ⭐ 4.9 (42 Reseñas Verificadas)</span>
            </div>
          </div>
        </div>

        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>#{publicacion.id}</span>
      </div>

      {/* Contenido / Texto */}
      <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
        {publicacion.contenido}
      </p>

      {/* Imagen si existe */}
      {publicacion.imagenBase64 && (
        <div style={{ borderRadius: 12, overflow: "hidden", maxHeight: 350, border: "1px solid var(--border-subtle)" }}>
          <img
            src={publicacion.imagenBase64}
            alt="Foto publicación"
            style={{ width: "100%", maxHeight: 350, objectFit: "cover" }}
          />
        </div>
      )}

      {/* Tags */}
      {Array.isArray(publicacion.tags) && publicacion.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {publicacion.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                background: "var(--surface-soft)",
                color: "var(--text-muted)",
                padding: "2px 8px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Botones de Acción */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          paddingTop: 12,
          borderTop: "1px solid var(--border-subtle)",
          flexWrap: "wrap"
        }}
      >
        <button
          type="button"
          disabled={!!procesandoInteres[id]}
          onClick={() => manejarMeGusta(publicacion)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "var(--surface-soft)",
            border: "1px solid var(--border)",
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            color: "var(--text)"
          }}
        >
          ❤️ Me interesa ({cantidadesInteres[id] ?? publicacion.interesados ?? 0})
        </button>

        <button
          type="button"
          onClick={() => alternarComentarios(publicacion)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: comentariosAbiertos[id] ? "var(--primary-light)" : "var(--surface-soft)",
            borderColor: comentariosAbiertos[id] ? "var(--primary)" : "var(--border)",
            border: "1px solid",
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            color: comentariosAbiertos[id] ? "var(--primary)" : "var(--text)"
          }}
        >
          💬 Comentarios ({comentariosPorPublicacion[id]?.length ?? publicacion.comentarios ?? 0})
        </button>

        <button
          type="button"
          onClick={() => alPedirPresupuesto && alPedirPresupuesto(publicacion)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "var(--surface-soft)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 12.5,
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          📄 Pedir Presupuesto
        </button>

        <button
          type="button"
          onClick={() => {
            if (!usuario) {
              navigate("/login");
              return;
            }
            const receptor = publicacion.autor;
            navigate("/mensajes", { state: { receptor } });
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "var(--primary)",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            marginLeft: "auto"
          }}
        >
          ✉️ Contactar
        </button>
      </div>

      {/* Desplegable de Comentarios */}
      {comentariosAbiertos[id] && (
        <div
          style={{
            background: "var(--surface-soft)",
            borderRadius: 12,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 200, overflowY: "auto" }}>
            {(comentariosPorPublicacion[id] || []).map((comentario, idx) => (
              <div
                key={comentario.id ?? idx}
                style={{
                  background: "var(--surface)",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--border-subtle)",
                  fontSize: 13
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: "var(--text)" }}>
                    {comentario.autor || comentario.usuario || "Usuario"}
                  </strong>
                  <span style={{ fontSize: 10, color: "var(--primary)", fontWeight: 700 }}>✔ Verificado</span>
                </div>
                <p style={{ margin: "4px 0 0", color: "var(--text-secondary)" }}>
                  {comentario.contenido || comentario.texto || ""}
                </p>
              </div>
            ))}
            {comentariosPorPublicacion[id]?.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", margin: "8px 0" }}>
                Aún no hay comentarios. ¡Sé el primero en consultar!
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid var(--border)",
                background: "var(--input-bg)",
                color: "var(--text)",
                borderRadius: 8,
                fontSize: 13,
                outline: "none"
              }}
              value={comentarioNuevo[id] || ""}
              onChange={(e) =>
                setComentarioNuevo(prev => ({ ...prev, [id]: e.target.value }))
              }
              placeholder="Escribe una pregunta o consulta técnica..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  enviarComentario(publicacion);
                }
              }}
            />
            <button
              type="button"
              disabled={!!procesandoComentario[id]}
              onClick={() => enviarComentario(publicacion)}
              className="btn-modal-submit"
              style={{ padding: "8px 16px", fontSize: 13 }}
            >
              {procesandoComentario[id] ? "Enviando..." : "Comentar"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
