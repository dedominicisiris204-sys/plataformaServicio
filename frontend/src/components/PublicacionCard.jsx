import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function PublicacionCard({
  publicacion,
  usuario,
  onMeGusta,
  onAlternarComentarios,
  onEnviarComentario,
  cantidadesInteres = {},
  comentariosPorPublicacion = {},
  comentariosAbiertos = {},
  comentarioNuevo = {},
  setComentarioNuevo,
  procesandoInteres = {},
  procesandoComentario = {}
}) {
  const navigate = useNavigate();
  const toast = useToast();

  const id = publicacion.id;
  const autor = publicacion.autor || "Usuario";
  const inicial = autor.charAt(0).toUpperCase();

  const fechaTexto = publicacion.fecha
    ? new Date(publicacion.fecha).toLocaleDateString("es-AR")
    : "Reciente";

  const abrirPerfilPublico = () => {
    if (publicacion.usuarioId) {
      navigate(`/perfil/${publicacion.usuarioId}`);
    } else {
      navigate(`/perfil?usuario=${encodeURIComponent(autor)}`);
    }
  };

  const contactar = () => {
    if (!usuario) {
      toast.info("Iniciá sesión para enviar mensajes a otros usuarios.");
      navigate("/login");
      return;
    }
    const receptor = publicacion.autor;
    const emisor = usuario.nombre || usuario.email || usuario.username || usuario.nombreUsuario;
    if (!receptor || !emisor) {
      toast.warning("No se pudo identificar a los usuarios de la conversación.");
      return;
    }
    if (receptor === emisor) {
      toast.info("No podés iniciar una conversación con tu propia publicación.");
      return;
    }
    navigate("/mensajes", { state: { receptor } });
  };

  return (
    <article className="publication-card">
      <div className="publication-header">
        <div
          className="publication-avatar"
          style={{ cursor: "pointer" }}
          onClick={abrirPerfilPublico}
          title={`Ver perfil de ${autor}`}
        >
          {inicial}
        </div>

        <div>
          <strong
            style={{ cursor: "pointer" }}
            onClick={abrirPerfilPublico}
            title={`Ver perfil de ${autor}`}
          >
            {autor}
          </strong>
          <span>{fechaTexto}</span>
        </div>
      </div>

      <div className="publication-body">
        {publicacion.imagenBase64 && (
          <img
            src={publicacion.imagenBase64}
            alt="Imagen de la publicación"
            loading="lazy"
            style={{
              display: "block",
              width: "100%",
              maxHeight: "320px",
              objectFit: "contain",
              borderRadius: "10px",
              marginBottom: "14px"
            }}
          />
        )}

        <span className="publication-type">
          {/empresa|contrat|busca personal|vacante/i.test(`${publicacion.tipo || ""} ${publicacion.contenido || ""}`)
            ? "EMPRESA · BUSCA PERSONAL"
            : /empleo|trabajo|postul|busco trabajo|se busca/i.test(`${publicacion.tipo || ""} ${publicacion.contenido || ""}`)
              ? "OPORTUNIDAD LABORAL"
              : "SERVICIO / OFICIO"}
        </span>

        <h3>{publicacion.contenido || "Nueva publicación"}</h3>

        {publicacion.ubicacion && (
          <p className="location">📍 {publicacion.ubicacion}</p>
        )}

        {Array.isArray(publicacion.tags) && publicacion.tags.length > 0 && (
          <div className="tags">
            {publicacion.tags.map((tag, index) => (
              <span key={index}>#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="publication-footer">
        <button
          type="button"
          className="contact-button"
          disabled={!!procesandoInteres[id]}
          onClick={() => onMeGusta && onMeGusta(publicacion)}
        >
          ❤️ Me interesa ({cantidadesInteres[id] ?? publicacion.interesados ?? 0})
        </button>

        <button
          type="button"
          className="contact-button"
          onClick={() => onAlternarComentarios && onAlternarComentarios(publicacion)}
        >
          💬 Comentarios ({comentariosPorPublicacion[id]?.length ?? publicacion.comentarios ?? 0})
        </button>

        <button
          type="button"
          className="contact-button"
          onClick={contactar}
        >
          Contactar
        </button>

        {comentariosAbiertos[id] && (
          <div className="comments-panel">
            <div className="comments-list">
              {(comentariosPorPublicacion[id] || []).map((comentario, indice) => (
                <div key={comentario.id ?? indice} className="comment-item">
                  <strong>{comentario.autor || comentario.usuario || "Usuario"}</strong>
                  <p>{comentario.contenido || comentario.texto || ""}</p>
                </div>
              ))}
              {comentariosPorPublicacion[id]?.length === 0 && (
                <p>Todavía no hay comentarios.</p>
              )}
            </div>

            <textarea
              value={comentarioNuevo[id] || ""}
              onChange={(evento) =>
                setComentarioNuevo &&
                setComentarioNuevo((prev) => ({
                  ...prev,
                  [id]: evento.target.value
                }))
              }
              placeholder="Escribí un comentario..."
              rows={2}
            />

            <button
              type="button"
              className="contact-button"
              disabled={!!procesandoComentario[id]}
              onClick={() => onEnviarComentario && onEnviarComentario(publicacion)}
            >
              {procesandoComentario[id] ? "Enviando..." : "Publicar comentario"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
