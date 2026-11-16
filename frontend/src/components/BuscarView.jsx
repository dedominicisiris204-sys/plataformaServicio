import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function BuscarView({
  publicaciones = [],
  categorias = [],
  abrirModalPublicar,
  onEliminarPublicacion,
  usuario
}) {
  const navigate = useNavigate();
  const [termino, setTermino] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [ubicacionFiltro, setUbicacionFiltro] = useState("");
  const [confirmandoId, setConfirmandoId] = useState(null);

  const resultados = useMemo(() => {
    const texto = termino.toLowerCase().trim();
    const ubi = ubicacionFiltro.toLowerCase().trim();

    return publicaciones.filter(p => {
      const contenido = (p.contenido || "").toLowerCase();
      const autor = (p.autor || "").toLowerCase();
      const tipo = (p.tipo || "").toLowerCase();
      const ubicacion = (p.ubicacion || "").toLowerCase();

      const coincideTexto =
        !texto ||
        contenido.includes(texto) ||
        autor.includes(texto) ||
        tipo.includes(texto);

      const coincideCategoria =
        categoriaSeleccionada === "Todos" ||
        tipo.includes(categoriaSeleccionada.toLowerCase());

      const coincideUbicacion = !ubi || ubicacion.includes(ubi);

      return coincideTexto && coincideCategoria && coincideUbicacion;
    });
  }, [publicaciones, termino, categoriaSeleccionada, ubicacionFiltro]);

  return (
    <div className="search-panel-container">
      {/* Caja de Búsqueda */}
      <div className="search-box-card">
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>
          🔍 Buscar Oficios, Especialistas y Trabajos
        </h2>

        <div className="search-input-group">
          <input
            type="text"
            className="search-main-input"
            placeholder="¿Qué servicio buscas? Ej: plomero, electricista, pintura..."
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
          />
          <input
            type="text"
            className="search-main-input"
            placeholder="📍 Ciudad o zona..."
            style={{ maxWidth: 220 }}
            value={ubicacionFiltro}
            onChange={(e) => setUbicacionFiltro(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
            Filtrar por Especialidad:
          </span>
        </div>

        <div className="categories-pills-wrap">
          <button
            type="button"
            className={`category-pill ${categoriaSeleccionada === "Todos" ? "selected" : ""}`}
            onClick={() => setCategoriaSeleccionada("Todos")}
          >
            Todos
          </button>
          {categorias.map(cat => (
            <button
              key={cat.nombre}
              type="button"
              className={`category-pill ${categoriaSeleccionada === cat.nombre ? "selected" : ""}`}
              onClick={() => setCategoriaSeleccionada(cat.nombre)}
            >
              <span>{cat.icon}</span>
              <span>{cat.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
            Resultados encontrados ({resultados.length})
          </h3>
          {resultados.length === 0 && (
            <button
              onClick={abrirModalPublicar}
              style={{
                background: "linear-gradient(135deg, #0d9488, #2563eb)",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              + Publicar este requerimiento
            </button>
          )}
        </div>

        {resultados.length === 0 ? (
          <div style={{ background: "var(--surface-card)", padding: 30, borderRadius: 16, textAlign: "center", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 16, color: "var(--text-muted)", margin: 0 }}>
              No se encontraron resultados para los filtros seleccionados.
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
              Prueba con otras palabras o crea una nueva publicación buscando este especialista.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {resultados.map(p => (
              <div
                key={p.id}
                style={{
                  background: "var(--surface-card)",
                  padding: "18px 20px",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    <span
                      style={{
                        background: "var(--primary-light)",
                        color: "var(--primary)",
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700
                      }}
                    >
                      {p.tipo || "Servicio"}
                    </span>
                    <strong style={{ fontSize: 15, color: "var(--text)" }}>{p.autor}</strong>
                    {p.ubicacion && (
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>📍 {p.ubicacion}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "6px 0 12px 0", lineHeight: 1.5 }}>
                    {p.contenido}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                      ID: #{p.id} • ❤️ {p.interesados || 0} interesados
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/mensajes", {
                          state: {
                            receptor: p.autor,
                            publicacionContexto: {
                              id: p.id,
                              tipo: p.tipo || "Servicio",
                              contenido: p.contenido,
                              ubicacion: p.ubicacion
                            }
                          }
                        })
                      }
                      style={{
                        background: "linear-gradient(135deg, #0d9488, #2563eb)",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        padding: "5px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      ✉️ Contactar
                    </button>

                    {onEliminarPublicacion && (
                      confirmandoId === p.id ? (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <button
                            type="button"
                            onClick={async () => {
                              await onEliminarPublicacion(p.id);
                              setConfirmandoId(null);
                            }}
                            style={{
                              background: "#dc2626",
                              color: "white",
                              border: "none",
                              borderRadius: 6,
                              padding: "4px 9px",
                              fontSize: 11.5,
                              fontWeight: 700,
                              cursor: "pointer"
                            }}
                          >
                            Sí, borrar
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmandoId(null)}
                            style={{
                              background: "var(--surface-soft)",
                              color: "var(--text)",
                              border: "1px solid var(--border)",
                              borderRadius: 6,
                              padding: "4px 8px",
                              fontSize: 11.5,
                              cursor: "pointer"
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmandoId(p.id)}
                          style={{
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#dc2626",
                            borderRadius: 8,
                            padding: "5px 10px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      )
                    )}
                  </div>
                </div>

                {p.imagenBase64 && (
                  <img
                    src={p.imagenBase64}
                    alt="Trabajo"
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "1px solid var(--border)" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
