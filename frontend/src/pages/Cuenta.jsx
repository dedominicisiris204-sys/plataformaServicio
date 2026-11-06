import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, responseMessage } from "../apiFetch";
import { useToast } from "../hooks/useToast";

export default function Cuenta() {
  const navigate = useNavigate();
  const toast = useToast();
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem("usuario") || "null"); }
    catch { localStorage.removeItem("usuario"); localStorage.removeItem("token"); return null; }
  });
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [password, setPassword] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [confirmarBaja, setConfirmarBaja] = useState(false);

  useEffect(() => { if (!usuario) navigate("/login"); }, [usuario, navigate]);

  async function guardar(e) {
    e.preventDefault();
    if (!nombre.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || (password && password.length < 6)) {
      toast.warning("Revisá el nombre, el correo y la longitud mínima de la contraseña (6 caracteres).");
      return;
    }
    setGuardando(true);
    try {
      const r = await apiFetch(`/api/usuarios/${usuario.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim(), email: email.trim(), ...(password ? { password } : {}) })
      });
      if (!r.ok) throw new Error(await responseMessage(r));
      const actualizado = await r.json();
      const sesion = { ...usuario, id: actualizado.id, nombre: actualizado.nombre, email: actualizado.email, rol: actualizado.rol };
      localStorage.setItem("usuario", JSON.stringify(sesion));
      if (actualizado.token) localStorage.setItem("token", actualizado.token);
      setUsuario(sesion);
      setPassword("");
      toast.success("Tus datos se actualizaron correctamente.");
    } catch (err) { toast.error(err.message); }
    finally { setGuardando(false); }
  }

  async function eliminarCuenta() {
    try {
      const r = await apiFetch(`/api/usuarios/${usuario.id}`, { method: "DELETE" });
      if (!r.ok) throw new Error(await responseMessage(r));
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      toast.success("La cuenta se eliminó correctamente.");
      navigate("/");
    } catch (err) { toast.error(err.message); }
    finally { setConfirmarBaja(false); }
  }

  if (!usuario) return null;
  return <main style={{ maxWidth: 680, margin: "40px auto", padding: 24 }}>
    <button type="button" onClick={() => navigate(-1)}>← Volver</button>
    <h1>Mi cuenta</h1>
    <form onSubmit={guardar} className="card" style={{ display: "grid", gap: 14 }}>
      <label>Nombre<input required maxLength={100} value={nombre} onChange={e => setNombre(e.target.value)} /></label>
      <label>Correo electrónico<input required type="email" maxLength={100} value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Nueva contraseña (opcional)<input type="password" minLength={6} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} /></label>
      <button className="btn-primary" disabled={guardando}>{guardando ? "Guardando…" : "Guardar cambios"}</button>
    </form>
    <section className="card" style={{ marginTop: 20, border: "1px solid #fecaca" }}>
      <h2>Eliminar cuenta</h2><p>Esta acción elimina tu cuenta y los datos asociados.</p>
      <button className="btn-danger" onClick={() => setConfirmarBaja(true)}>Eliminar mi cuenta</button>
    </section>
    {confirmarBaja && <div role="presentation" style={{ position: "fixed", inset: 0, background: "#0008", display: "grid", placeItems: "center", zIndex: 10000 }}>
      <div role="dialog" aria-modal="true" aria-labelledby="confirmar-baja" className="card" style={{ maxWidth: 440, margin: 20 }}>
        <h2 id="confirmar-baja">¿Eliminar tu cuenta?</h2><p>No vas a poder deshacer esta acción.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={() => setConfirmarBaja(false)}>Cancelar</button><button className="btn-danger" onClick={eliminarCuenta}>Sí, eliminar</button>
        </div>
      </div>
    </div>}
  </main>;
}
