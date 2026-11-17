import React, { useState } from "react";
import { crearPublicacion } from "../conexionPersonas";

export default function CrearPublicacionModal({
  abierto,
  alCerrar,
  usuario,
  onPublicacionCreada,
  categorias = []
}) {
  const [autor, setAutor] = useState(usuario?.nombre || "");
  const [tipo, setTipo] = useState("Servicio ofrecido");
  const [categoria, setCategoria] = useState("Electricidad");
  const [ubicacion, setUbicacion] = useState("");
  const [contenido, setContenido] = useState("");
  const [esGuardia24hs, setEsGuardia24hs] = useState(false);
  const [imagenBase64, setImagenBase64] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  if (!abierto) return null;

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen no debe superar los 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contenido.trim()) {
      setError("Por favor escribe una descripción para la publicación.");
      return;
    }

    setEnviando(true);
    setError("");

    try {
      const tipoFinal = esGuardia24hs ? `🚨 Guardia 24hs - ${tipo} (${categoria})` : `${tipo} - ${categoria}`;
      const tagsFinales = [categoria, tipo];
      if (esGuardia24hs) {
        tagsFinales.push("urgencia", "guardia", "24hs");
      }

      const nuevaPublicacion = {
        autor: autor.trim() || (usuario?.nombre || "Usuario Anónimo"),
        autorUsuarioId: usuario?.id || null,
        tipo: tipoFinal,
        ubicacion: ubicacion.trim() || "No especificada",
        contenido: contenido.trim(),
        imagenBase64: imagenBase64 || null,
        tags: tagsFinales
      };

      const resultado = await crearPublicacion(nuevaPublicacion);
      if (onPublicacionCreada) {
        onPublicacionCreada(resultado);
      }
      // Reset form
      setContenido("");
      setUbicacion("");
      setImagenBase64("");
      setEsGuardia24hs(false);
      alCerrar();
    } catch (err) {
      console.error("Error al crear publicación:", err);
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✍️ Realizar Publicación</h2>
          <button className="btn-close-modal" onClick={alCerrar} title="Cerrar">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ padding: "10px 14px", background: "#fee2e2", color: "#b91c1c", borderRadius: 8, fontSize: 13 }}>
                {error}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="modal-field">
                <label>Tipo de Publicación</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="Servicio ofrecido">🛠️ Ofrezco Servicio</option>
                  <option value="Busco profesional">🙋 Busco / Necesito Contratar</option>
                </select>
              </div>

              <div className="modal-field">
                <label>Oficio / Rubro</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="Electricidad">⚡ Electricidad</option>
                  <option value="Plomería">🔧 Plomería</option>
                  <option value="Albañilería">🧱 Albañilería</option>
                  <option value="Pintura">🎨 Pintura</option>
                  <option value="Limpieza">🧹 Limpieza</option>
                  <option value="Jardinería">🌳 Jardinería</option>
                  <option value="Carpintería">🚪 Carpintería</option>
                  <option value="Reparaciones">🔨 Reparaciones Generales</option>
                </select>
              </div>
            </div>

            {/* Checkbox Urgencia 24hs */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: esGuardia24hs ? "#fee2e2" : "var(--surface-soft)",
                padding: "10px 14px",
                borderRadius: 10,
                border: esGuardia24hs ? "1px solid #ef4444" : "1px solid var(--border)",
                cursor: "pointer"
              }}
              onClick={() => setEsGuardia24hs(!esGuardia24hs)}
            >
              <input
                type="checkbox"
                checked={esGuardia24hs}
                onChange={e => setEsGuardia24hs(e.target.checked)}
                style={{ cursor: "pointer", width: 18, height: 18 }}
              />
              <div>
                <strong style={{ fontSize: 13, color: esGuardia24hs ? "#b91c1c" : "var(--text)" }}>
                  🚨 Disponible para Urgencias y Guardia 24hs
                </strong>
                <span style={{ display: "block", fontSize: 11, color: "var(--text-muted)" }}>
                  Tu publicación aparecerá con la insignia destacada de guardia inmediata.
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="modal-field">
                <label>Tu Nombre o Empresa</label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  required
                />
              </div>

              <div className="modal-field">
                <label>Ubicación / Ciudad</label>
                <input
                  type="text"
                  placeholder="Ej: Cruz del Eje, Centro..."
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-field">
              <label>Descripción del servicio o requerimiento</label>
              <textarea
                rows={4}
                placeholder="Detalla qué trabajo realizas, experiencia, disponibilidad horaria o qué problema necesitas resolver..."
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                required
              />
            </div>

            <div className="modal-field">
              <label>Adjuntar Foto / Imagen del Trabajo (Opcional)</label>
              <input type="file" accept="image/*" onChange={handleImagenChange} />
              {imagenBase64 && (
                <div style={{ marginTop: 8, position: "relative", width: "fit-content" }}>
                  <img
                    src={imagenBase64}
                    alt="Previsualización"
                    style={{ maxHeight: 120, borderRadius: 8, border: "1px solid var(--border)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setImagenBase64("")}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      cursor: "pointer",
                      fontSize: 12
                    }}
                  >✕</button>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-modal-cancel" onClick={alCerrar} disabled={enviando}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-submit" disabled={enviando}>
              {enviando ? "Publicando..." : "Publicar Ahora"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
