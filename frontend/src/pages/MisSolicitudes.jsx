import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, responseMessage } from "../apiFetch";
import { useToast } from "../hooks/useToast";

export default function MisSolicitudes() {
  const [usuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem("usuario") || "null"); }
    catch { localStorage.removeItem("usuario"); localStorage.removeItem("token"); return null; }
  });
  const navigate = useNavigate();
  const toast = useToast();
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [estrellas, setEstrellas] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [enviadas, setEnviadas] = useState({});
  const esProfesional = usuario?.rol === "ROL_PROFESIONAL";

  const cargar = useCallback(async () => {
    if (!usuario?.id) { navigate("/login"); return; }
    try {
      const lado = esProfesional ? "profesional" : "cliente";
      const r = await apiFetch(`/api/solicitudes/${lado}/${usuario.id}`);
      if (!r.ok) throw new Error(await responseMessage(r));
      setSolicitudes(await r.json());
    } catch (e) { toast.error(e.message); }
    finally { setCargando(false); }
  }, [usuario, esProfesional, navigate, toast]);

  useEffect(() => { const timer = setTimeout(() => { void cargar(); }, 0); return () => clearTimeout(timer); }, [cargar]);

  async function cambiarEstado(id, estado) {
    try {
      const r = await apiFetch(`/api/solicitudes/${id}/estado`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ estado }) });
      if (!r.ok) throw new Error(await responseMessage(r));
      toast.success(`Solicitud ${estado.toLowerCase()}.`);
      await cargar();
    } catch (e) { toast.error(e.message); }
  }

  async function calificar(s) {
    try {
      const r = await apiFetch("/api/resenas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contratacionId: s.contratacionId, puntuacion: estrellas[s.id] || 5, comentario: comentarios[s.id] || "" }) });
      if (!r.ok) throw new Error(await responseMessage(r));
      setEnviadas(prev => ({ ...prev, [s.id]: true }));
      toast.success("Gracias por compartir tu opinión.");
    } catch (e) { toast.error(e.message); }
  }

  if (!usuario) return null;
  return <main style={{ maxWidth: 900, margin: "36px auto", padding: 20 }}>
    <button onClick={() => navigate(-1)}>← Volver</button>
    <h1>{esProfesional ? "Solicitudes recibidas" : "Mis solicitudes y trabajos"}</h1>
    {cargando ? <p role="status">Cargando solicitudes…</p> : solicitudes.length === 0 ? <section className="card"><p>No tenés solicitudes todavía.</p></section> : solicitudes.map(s => <article key={s.id} className="card" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}><h2>{s.titulo}</h2><strong>{s.estado}</strong></div>
      <p>{s.descripcion}</p>
      <p>{s.ubicacion && `📍 ${s.ubicacion} · `}{s.fechaEstimada && `Fecha estimada: ${s.fechaEstimada}`}</p>
      {esProfesional && s.estado === "PENDIENTE" && <div style={{ display: "flex", gap: 8 }}><button onClick={() => cambiarEstado(s.id, "ACEPTADA")}>Aceptar</button><button onClick={() => cambiarEstado(s.id, "RECHAZADA")}>Rechazar</button></div>}
      {esProfesional && s.estado === "ACEPTADA" && <button onClick={() => cambiarEstado(s.id, "COMPLETADA")}>Marcar trabajo completado</button>}
      {!esProfesional && s.estado === "COMPLETADA" && s.contratacionId && !enviadas[s.id] && <section style={{ marginTop: 16 }}>
        <h3>Calificar el servicio</h3>
        <div aria-label="Elegí una calificación" style={{ display: "flex", gap: 4, fontSize: 26 }}>
          {[1, 2, 3, 4, 5].map(n => <button key={n} type="button" aria-label={`${n} estrellas`} aria-pressed={(estrellas[s.id] || 5) === n} onClick={() => setEstrellas(prev => ({ ...prev, [s.id]: n }))} style={{ color: n <= (estrellas[s.id] || 5) ? "#e7a92f" : "#9ca3af", background: "none", border: 0, cursor: "pointer" }}>★</button>)}
        </div>
        <textarea value={comentarios[s.id] || ""} maxLength={2000} onChange={e => setComentarios(prev => ({ ...prev, [s.id]: e.target.value }))} placeholder="Dejá una reseña (opcional)" />
        <button onClick={() => calificar(s)}>Enviar reseña</button>
      </section>}
      {!esProfesional && enviadas[s.id] && <p role="status">Reseña enviada. ¡Gracias!</p>}
    </article>)}
  </main>;
}
