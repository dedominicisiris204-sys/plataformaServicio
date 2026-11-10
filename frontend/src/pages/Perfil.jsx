import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "/api";

const perfilInicial = {
  fotoPerfil: "",
  oficio: "",
  descripcion: "",
  servicios: "",
  experiencia: "",
  estudios: "",
  habilidades: "",
  zonaTrabajo: "",
  horarios: "",
  calificacionPromedio: 0
};

const obtenerUsuario = () => {
  try {
    return JSON.parse(localStorage.getItem("usuario") || "null");
  } catch {
    return null;
  }
};

const texto = (valor, alternativo = "—") =>
  valor !== null && valor !== undefined && String(valor).trim()
    ? String(valor)
    : alternativo;

const nombreVisible = (usuario) => {
  if (!usuario) return "Profesional";
  return usuario.nombre || usuario.nombreCompleto || usuario.email || "Profesional";
};

function Avatar({ nombre, foto, grande = false }) {
  const inicial =
    texto(nombre, "P").trim().charAt(0).toUpperCase() || "P";

  return (
    <div className={`avatar ${grande ? "avatar-grande" : ""}`}>
      {foto ? (
        <img src={foto} alt={nombre} />
      ) : (
        <span>{inicial}</span>
      )}
    </div>
  );
}

function Modal({ titulo, children, cerrar }) {
  return (
    <div className="modal-fondo" onMouseDown={cerrar}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{titulo}</h3>
          <button className="cerrar-modal" onClick={cerrar}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Campo({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="campo">
      <span>{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function Area({ label, value, onChange, placeholder }) {
  return (
    <label className="campo campo-area">
      <span>{label}</span>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows="5"
      />
    </label>
  );
}

export default function Perfil() {
  const navigate = useNavigate();

  const usuario = useMemo(() => obtenerUsuario(), []);
  const usuarioId = usuario?.id;

  const [perfil, setPerfil] = useState(perfilInicial);
  const [perfilId, setPerfilId] = useState(null);

  const [servicios, setServicios] = useState([]);
  const [experiencias, setExperiencias] = useState([]);
  const [formaciones, setFormaciones] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [portafolio, setPortafolio] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);

  const [pestana, setPestana] = useState("resumen");
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [modal, setModal] = useState(null);

  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: "",
    descripcion: "",
    precioDesde: "",
    precioHasta: "",
    modalidad: "",
    activo: true
  });

  const [nuevaExperiencia, setNuevaExperiencia] = useState({
    puesto: "",
    empresa: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    actual: false
  });

  const [nuevaFormacion, setNuevaFormacion] = useState({
    titulo: "",
    institucion: "",
    fechaInicio: "",
    fechaFin: "",
    descripcion: ""
  });

  const [nuevaHabilidad, setNuevaHabilidad] = useState({
    nombre: "",
    nivel: "Intermedio"
  });

  const [nuevoPortfolio, setNuevoPortfolio] = useState({
    titulo: "",
    descripcion: "",
    imagenUrl: "",
    categoria: "",
    fecha: ""
  });

  const [nuevaDisponibilidad, setNuevaDisponibilidad] = useState({
    dia: "Lunes",
    horaInicio: "08:00",
    horaFin: "17:00",
    disponible: true
  });

  useEffect(() => {
    if (!usuarioId) {
      navigate("/login");
      return;
    }

    cargarTodo();
  }, [usuarioId]);

  const request = async (url, opciones = {}) => {
    const respuesta = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(opciones.headers || {})
      },
      ...opciones
    });

    if (!respuesta.ok) {
      const cuerpo = await respuesta.text().catch(() => "");
      throw new Error(cuerpo || `Error HTTP ${respuesta.status}`);
    }

    if (respuesta.status === 204) return null;

    const tipo = respuesta.headers.get("content-type") || "";

    if (tipo.includes("application/json")) {
      return respuesta.json();
    }

    return respuesta.text();
  };

  const cargarColeccion = async (url, setter) => {
    try {
      const data = await request(url);
      setter(Array.isArray(data) ? data : []);
    } catch {
      setter([]);
    }
  };

  const cargarTodo = async () => {
    setCargando(true);
    setError("");

    try {
      const data = await request(`${API}/perfiles/usuario/${usuarioId}`);

      if (data) {
        setPerfil({
          ...perfilInicial,
          ...data
        });

        if (data.idPerfil) {
          setPerfilId(data.idPerfil);

          await Promise.all([
            cargarColeccion(
              `${API}/servicios-profesionales/perfil/${data.idPerfil}`,
              setServicios
            ),
            cargarColeccion(
              `${API}/experiencias/perfil/${data.idPerfil}`,
              setExperiencias
            ),
            cargarColeccion(
              `${API}/formaciones/perfil/${data.idPerfil}`,
              setFormaciones
            ),
            cargarColeccion(
              `${API}/habilidades-profesionales/perfil/${data.idPerfil}`,
              setHabilidades
            ),
            cargarColeccion(
              `${API}/portafolio/perfil/${data.idPerfil}`,
              setPortafolio
            ),
            cargarColeccion(
              `${API}/disponibilidades/perfil/${data.idPerfil}`,
              setDisponibilidades
            )
          ]);
        }
      }
    } catch (e) {
      if (!String(e.message).includes("204")) {
        setError("No se pudo cargar el perfil. Verificá que el backend esté ejecutándose en el puerto 8080.");
      }
    } finally {
      setCargando(false);
    }
  };

  const guardarPerfil = async () => {
    setGuardando(true);
    setMensaje("");
    setError("");

    try {
      const guardado = await request(
        `${API}/perfiles/usuario/${usuarioId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            fotoPerfil: perfil.fotoPerfil || "",
            oficio: perfil.oficio || "",
            descripcion: perfil.descripcion || "",
            servicios: perfil.servicios || "",
            experiencia: perfil.experiencia || "",
            estudios: perfil.estudios || "",
            habilidades: perfil.habilidades || "",
            zonaTrabajo: perfil.zonaTrabajo || "",
            horarios: perfil.horarios || ""
          })
        }
      );

      if (guardado) {
        setPerfil({
          ...perfilInicial,
          ...guardado
        });

        setPerfilId(guardado.idPerfil || perfilId);
      }

      setMensaje("Perfil actualizado correctamente.");
      setEditando(false);

      setTimeout(() => setMensaje(""), 3000);
    } catch (e) {
      setError(`No se pudo guardar el perfil: ${e.message}`);
    } finally {
      setGuardando(false);
    }
  };

  const agregar = async (tipo, datos, cerrar) => {
    if (!perfilId) {
      setError("Primero guardá la información principal del perfil.");
      return;
    }

    const urls = {
      servicio: `${API}/servicios-profesionales/perfil/${perfilId}`,
      experiencia: `${API}/experiencias/perfil/${perfilId}`,
      formacion: `${API}/formaciones/perfil/${perfilId}`,
      habilidad: `${API}/habilidades-profesionales/perfil/${perfilId}`,
      portfolio: `${API}/portafolio/perfil/${perfilId}`,
      disponibilidad: `${API}/disponibilidades/perfil/${perfilId}`
    };

    const setters = {
      servicio: setServicios,
      experiencia: setExperiencias,
      formacion: setFormaciones,
      habilidad: setHabilidades,
      portfolio: setPortafolio,
      disponibilidad: setDisponibilidades
    };

    try {
      const creado = await request(urls[tipo], {
        method: "POST",
        body: JSON.stringify(datos)
      });

      if (creado) {
        setters[tipo]((lista) => [...lista, creado]);
      } else {
        await cargarTodo();
      }

      setMensaje("Información agregada correctamente.");
      setModal(null);
      cerrar?.();
    } catch (e) {
      setError(`No se pudo agregar la información: ${e.message}`);
    }
  };

  const eliminar = async (tipo, id) => {
    const urls = {
      servicio: `${API}/servicios-profesionales/${id}`,
      experiencia: `${API}/experiencias/${id}`,
      formacion: `${API}/formaciones/${id}`,
      habilidad: `${API}/habilidades-profesionales/${id}`,
      portfolio: `${API}/portafolio/${id}`,
      disponibilidad: `${API}/disponibilidades/${id}`
    };

    const setters = {
      servicio: setServicios,
      experiencia: setExperiencias,
      formacion: setFormaciones,
      habilidad: setHabilidades,
      portfolio: setPortafolio,
      disponibilidad: setDisponibilidades
    };

    if (!window.confirm("¿Querés eliminar este elemento?")) return;

    try {
      await request(urls[tipo], { method: "DELETE" });
      setters[tipo]((lista) =>
        lista.filter((item) => {
          const itemId =
            item.id ??
            item.idServicio ??
            item.idExperiencia ??
            item.idFormacion ??
            item.idHabilidad ??
            item.idPortafolio ??
            item.idDisponibilidad;

          return itemId !== id;
        })
      );
    } catch (e) {
      setError(`No se pudo eliminar: ${e.message}`);
    }
  };

  const actualizar = (campo, valor) => {
    setPerfil((actual) => ({
      ...actual,
      [campo]: valor
    }));
  };

  const porcentaje = useMemo(() => {
    const campos = [
      perfil.oficio,
      perfil.descripcion,
      perfil.servicios,
      perfil.experiencia,
      perfil.estudios,
      perfil.habilidades,
      perfil.zonaTrabajo,
      perfil.horarios,
      perfil.fotoPerfil
    ];

    return Math.round(
      (campos.filter((campo) => String(campo || "").trim()).length /
        campos.length) *
        100
    );
  }, [perfil]);

  const iniciales = nombreVisible(usuario)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();

  if (cargando) {
    return (
      <div className="perfil-cargando">
        <div className="spinner"></div>
        <h2>Cargando perfil profesional...</h2>
        <p>Preparando tu espacio profesional.</p>
      </div>
    );
  }

  return (
    <div className="perfil-page">

      <style>{`
        * {
          box-sizing: border-box;
        }

        .perfil-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37,99,235,.13), transparent 30%),
            radial-gradient(circle at 90% 10%, rgba(124,58,237,.12), transparent 30%),
            #f5f7fb;
          color: #182235;
          padding-bottom: 60px;
        }

        .perfil-topbar {
          height: 72px;
          background: #0b1730;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5%;
          box-shadow: 0 4px 18px rgba(5,15,35,.18);
        }

        .marca {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          letter-spacing: .3px;
        }

        .marca-logo {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg,#2563eb,#06b6d4);
          box-shadow: 0 8px 22px rgba(37,99,235,.35);
        }

        .volver {
          color: #dce7ff;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
        }

        .volver:hover {
          color: white;
        }

        .perfil-container {
          width: min(1180px, 94%);
          margin: 30px auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          border-radius: 26px;
          background:
            linear-gradient(120deg,#09162f 0%,#102b59 55%,#183f78 100%);
          color: white;
          padding: 34px;
          box-shadow: 0 18px 55px rgba(9,23,48,.20);
        }

        .hero::after {
          content: "";
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          right: -90px;
          top: -130px;
          background: rgba(255,255,255,.08);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(245,190,65,.14);
          border: 1px solid rgba(245,190,65,.4);
          color: #ffd56a;
          border-radius: 999px;
          padding: 7px 13px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.2px;
          margin-bottom: 22px;
        }

        .hero-main {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .avatar {
          flex: 0 0 auto;
          width: 58px;
          height: 58px;
          border-radius: 18px;
          overflow: hidden;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg,#2563eb,#06b6d4);
          color: white;
          font-size: 22px;
          font-weight: 900;
          border: 3px solid rgba(255,255,255,.45);
          box-shadow: 0 10px 28px rgba(0,0,0,.22);
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-grande {
          width: 116px;
          height: 116px;
          border-radius: 30px;
          font-size: 40px;
        }

        .hero h1 {
          margin: 0 0 7px;
          font-size: clamp(28px,4vw,44px);
          letter-spacing: -.8px;
        }

        .hero-oficio {
          font-size: 18px;
          color: #c8d8f5;
          margin-bottom: 14px;
        }

        .hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          color: #dce7ff;
          font-size: 13px;
        }

        .meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 999px;
          padding: 7px 11px;
        }

        .disponible {
          color: #a7f3d0;
        }

        .hero-actions {
          margin-left: auto;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .btn {
          border: 0;
          border-radius: 12px;
          padding: 11px 17px;
          cursor: pointer;
          font-weight: 800;
          font-size: 13px;
          transition: .2s ease;
        }

        .btn:hover {
          transform: translateY(-1px);
        }

        .btn-gold {
          background: linear-gradient(135deg,#f4c95d,#e7a92f);
          color: #182235;
        }

        .btn-light {
          background: white;
          color: #12213d;
        }

        .btn-outline {
          background: transparent;
          color: white;
          border: 1px solid rgba(255,255,255,.3);
        }

        .btn-blue {
          background: #2563eb;
          color: white;
        }

        .btn-danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 14px;
          margin-top: 20px;
        }

        .stat {
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.1);
          padding: 15px;
          border-radius: 16px;
        }

        .stat strong {
          display: block;
          font-size: 22px;
        }

        .stat span {
          font-size: 11px;
          color: #bfd0ed;
          text-transform: uppercase;
          letter-spacing: .6px;
        }

        .completitud {
          margin-top: 20px;
          background: rgba(255,255,255,.08);
          padding: 14px;
          border-radius: 15px;
        }

        .completitud-top {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .barra {
          height: 7px;
          background: rgba(255,255,255,.12);
          border-radius: 99px;
          overflow: hidden;
        }

        .barra span {
          display: block;
          height: 100%;
          background: linear-gradient(90deg,#22c55e,#a3e635);
          border-radius: inherit;
        }

        .contenido {
          margin-top: 22px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .card {
          background: white;
          border: 1px solid #e5eaf2;
          border-radius: 22px;
          padding: 25px;
          box-shadow: 0 8px 30px rgba(20,38,70,.06);
        }

        .tabs {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          padding: 8px;
          background: white;
          border: 1px solid #e5eaf2;
          border-radius: 18px;
          box-shadow: 0 8px 25px rgba(20,38,70,.05);
        }

        .tab {
          border: 0;
          background: transparent;
          color: #60708a;
          padding: 11px 17px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .tab.activo {
          color: #fff;
          background: #102b59;
          box-shadow: 0 5px 15px rgba(16,43,89,.2);
        }

        .section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .section-title h2 {
          margin: 0;
          font-size: 21px;
          color: #11223f;
        }

        .section-title p {
          margin: 4px 0 0;
          color: #77859b;
          font-size: 13px;
        }

        .sobre-grid {
          display: grid;
          grid-template-columns: 1.35fr .65fr;
          gap: 20px;
        }

        .descripcion {
          color: #516078;
          line-height: 1.8;
          white-space: pre-wrap;
        }

        .info-list {
          display: grid;
          gap: 10px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 12px 0;
          border-bottom: 1px solid #edf0f5;
          font-size: 13px;
        }

        .info-row span:first-child {
          color: #8190a5;
        }

        .info-row strong {
          text-align: right;
          color: #23324b;
        }

        .grid-items {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 15px;
        }

        .item {
          border: 1px solid #e8edf4;
          border-radius: 17px;
          padding: 18px;
          background: #fbfcfe;
          position: relative;
        }

        .item h3 {
          margin: 0 0 7px;
          color: #162945;
          font-size: 16px;
        }

        .item p {
          margin: 6px 0;
          color: #69778c;
          font-size: 13px;
          line-height: 1.55;
        }

        .item small {
          color: #8b98aa;
        }

        .item-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }

        .mini-delete {
          border: 0;
          color: #b42318;
          background: #fff0ef;
          padding: 6px 9px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
        }

        .timeline {
          position: relative;
          padding-left: 25px;
        }

        .timeline::before {
          content: "";
          position: absolute;
          left: 6px;
          top: 5px;
          bottom: 5px;
          width: 2px;
          background: #dce5f3;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 22px;
        }

        .timeline-item::before {
          content: "";
          position: absolute;
          left: -23px;
          top: 5px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #2563eb;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #bfdbfe;
        }

        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .skill {
          padding: 9px 13px;
          border-radius: 999px;
          background: #eef4ff;
          color: #1d4ed8;
          font-weight: 800;
          font-size: 12px;
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 15px;
        }

        .portfolio {
          overflow: hidden;
          border: 1px solid #e5eaf2;
          border-radius: 17px;
          background: white;
        }

        .portfolio-img {
          height: 150px;
          background: linear-gradient(135deg,#dbeafe,#e0e7ff);
          display: grid;
          place-items: center;
          overflow: hidden;
        }

        .portfolio-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .portfolio-body {
          padding: 15px;
        }

        .portfolio-body h3 {
          margin: 0 0 5px;
          font-size: 15px;
        }

        .portfolio-body p {
          color: #6d7b90;
          font-size: 12px;
          line-height: 1.5;
        }

        .empty {
          text-align: center;
          padding: 35px 15px;
          color: #8a97a9;
          border: 1px dashed #d7deea;
          border-radius: 17px;
        }

        .empty strong {
          display: block;
          color: #43516a;
          margin-bottom: 5px;
        }

        .form-card {
          background: #fbfcfe;
          border: 1px solid #e5eaf2;
          border-radius: 18px;
          padding: 20px;
          margin-top: 15px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 15px;
        }

        .campo {
          display: grid;
          gap: 7px;
        }

        .campo span {
          font-size: 12px;
          font-weight: 800;
          color: #42516a;
        }

        .campo input,
        .campo textarea,
        .campo select {
          width: 100%;
          border: 1px solid #dce3ee;
          border-radius: 11px;
          padding: 11px 12px;
          font: inherit;
          color: #24334d;
          background: white;
          outline: none;
        }

        .campo textarea {
          resize: vertical;
        }

        .campo input:focus,
        .campo textarea:focus,
        .campo select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,.1);
        }

        .campo-area {
          grid-column: 1/-1;
        }

        .acciones {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 18px;
        }

        .alerta {
          margin-bottom: 15px;
          padding: 12px 15px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
        }

        .alerta-ok {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .alerta-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .modal-fondo {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(7,15,31,.62);
          backdrop-filter: blur(5px);
          display: grid;
          place-items: center;
          padding: 20px;
        }

        .modal {
          width: min(650px,100%);
          max-height: 90vh;
          overflow: auto;
          background: white;
          border-radius: 22px;
          padding: 25px;
          box-shadow: 0 30px 80px rgba(0,0,0,.3);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .modal-header h3 {
          margin: 0;
          color: #142541;
        }

        .cerrar-modal {
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 10px;
          background: #f1f4f8;
          font-size: 22px;
          cursor: pointer;
        }

        .perfil-cargando {
          min-height: 100vh;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 8px;
          background: #f5f7fb;
          color: #20304a;
        }

        .spinner {
          width: 42px;
          height: 42px;
          border: 4px solid #dbe5f5;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .hero-main {
            align-items: flex-start;
            flex-direction: column;
          }

          .hero-actions {
            margin-left: 0;
          }

          .stats {
            grid-template-columns: repeat(2,1fr);
          }

          .sobre-grid {
            grid-template-columns: 1fr;
          }

          .portfolio-grid {
            grid-template-columns: repeat(2,1fr);
          }
        }

        @media (max-width: 650px) {
          .perfil-topbar {
            padding: 0 4%;
          }

          .perfil-container {
            width: 94%;
            margin-top: 18px;
          }

          .hero,
          .card {
            padding: 20px;
            border-radius: 19px;
          }

          .grid-items,
          .form-grid,
          .portfolio-grid {
            grid-template-columns: 1fr;
          }

          .stats {
            grid-template-columns: 1fr 1fr;
          }

          .tabs {
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .tab {
            white-space: nowrap;
          }
        }
      `}</style>

      <header className="perfil-topbar">
        <div className="marca">
          <div className="marca-logo">PS</div>
          <span>Plataforma Servicios & Oficios</span>
        </div>

        <Link to="/" className="volver">
          ← Volver al inicio
        </Link>
      </header>

      <main className="perfil-container">

        <section className="hero">
          <div className="hero-badge">
            ✦ PROFESIONAL DESTACADO
          </div>

          <div className="hero-main">
            <Avatar
              nombre={nombreVisible(usuario)}
              foto={perfil.fotoPerfil}
              grande
            />

            <div>
              <h1>{nombreVisible(usuario)}</h1>

              <div className="hero-oficio">
                {texto(perfil.oficio, "Profesional independiente")}
              </div>

              <div className="hero-meta">
                <span className="meta-pill">
                  ✉ {texto(usuario?.email)}
                </span>

                <span className="meta-pill">
                  📍 {texto(perfil.zonaTrabajo, "Zona de trabajo no definida")}
                </span>

                <span className="meta-pill disponible">
                  ● Disponible para trabajar
                </span>

                <span className="meta-pill">
                  ★ {Number(perfil.calificacionPromedio || 0).toFixed(1)}
                </span>
              </div>
            </div>

            <div className="hero-actions">
              <button
                className="btn btn-gold"
                onClick={() => setEditando(true)}
              >
                ✎ Editar perfil
              </button>

              <button
                className="btn btn-light"
                onClick={() => setMensaje("La función de contacto quedará conectada al módulo de Mensajes.")}
              >
                ✉ Contactar
              </button>

              <button
                className="btn btn-outline"
                onClick={() => setMensaje("La contratación quedará vinculada al módulo de servicios.")}
              >
                Contratar
              </button>
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <strong>{servicios.length}</strong>
              <span>Servicios</span>
            </div>

            <div className="stat">
              <strong>{experiencias.length}</strong>
              <span>Experiencias</span>
            </div>

            <div className="stat">
              <strong>{portafolio.length}</strong>
              <span>Trabajos publicados</span>
            </div>

            <div className="stat">
              <strong>{habilidades.length}</strong>
              <span>Habilidades</span>
            </div>
          </div>

          <div className="completitud">
            <div className="completitud-top">
              <span>Completitud del perfil profesional</span>
              <strong>{porcentaje}%</strong>
            </div>

            <div className="barra">
              <span style={{ width: `${porcentaje}%` }}></span>
            </div>
          </div>
        </section>

        <div className="contenido">

          {mensaje && (
            <div className="alerta alerta-ok">
              ✓ {mensaje}
            </div>
          )}

          {error && (
            <div className="alerta alerta-error">
              ⚠ {error}
            </div>
          )}

          <nav className="tabs">
            <button
              className={`tab ${pestana === "resumen" ? "activo" : ""}`}
              onClick={() => setPestana("resumen")}
            >
              Resumen
            </button>

            <button
              className={`tab ${pestana === "servicios" ? "activo" : ""}`}
              onClick={() => setPestana("servicios")}
            >
              Servicios
            </button>

            <button
              className={`tab ${pestana === "experiencia" ? "activo" : ""}`}
              onClick={() => setPestana("experiencia")}
            >
              Experiencia
            </button>

            <button
              className={`tab ${pestana === "portafolio" ? "activo" : ""}`}
              onClick={() => setPestana("portafolio")}
            >
              Portafolio
            </button>

            <button
              className={`tab ${pestana === "reputacion" ? "activo" : ""}`}
              onClick={() => setPestana("reputacion")}
            >
              Reputación
            </button>
          </nav>

          {pestana === "resumen" && (
            <>
              <section className="sobre-grid">

                <div className="card">
                  <div className="section-title">
                    <div>
                      <h2>Presentación profesional</h2>
                      <p>La primera impresión para tus futuros clientes.</p>
                    </div>

                    <button
                      className="btn btn-blue"
                      onClick={() => setEditando(true)}
                    >
                      Editar
                    </button>
                  </div>

                  <div className="descripcion">
                    {texto(
                      perfil.descripcion,
                      "Todavía no agregaste una presentación profesional. Contales a tus clientes quién sos, qué hacés y qué te diferencia."
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="section-title">
                    <div>
                      <h2>Información</h2>
                      <p>Datos visibles para clientes.</p>
                    </div>
                  </div>

                  <div className="info-list">
                    <div className="info-row">
                      <span>Oficio</span>
                      <strong>{texto(perfil.oficio)}</strong>
                    </div>

                    <div className="info-row">
                      <span>Zona</span>
                      <strong>{texto(perfil.zonaTrabajo)}</strong>
                    </div>

                    <div className="info-row">
                      <span>Horarios</span>
                      <strong>{texto(perfil.horarios)}</strong>
                    </div>

                    <div className="info-row">
                      <span>Formación</span>
                      <strong>{texto(perfil.estudios)}</strong>
                    </div>
                  </div>
                </div>

              </section>

              <section className="card">
                <div className="section-title">
                  <div>
                    <h2>Servicios que ofrecés</h2>
                    <p>Mostrá claramente qué pueden contratar tus clientes.</p>
                  </div>

                  <button
                    className="btn btn-blue"
                    onClick={() => setPestana("servicios")}
                  >
                    Ver servicios
                  </button>
                </div>

                <div className="descripcion">
                  {texto(
                    perfil.servicios,
                    "Agregá los servicios profesionales que ofrecés."
                  )}
                </div>
              </section>

              <section className="card">
                <div className="section-title">
                  <div>
                    <h2>Habilidades</h2>
                    <p>Competencias que ayudan a diferenciarte.</p>
                  </div>
                </div>

                <div className="skills">
                  {habilidades.length > 0 ? (
                    habilidades.map((h, i) => (
                      <span className="skill" key={h.id || h.idHabilidad || i}>
                        {texto(h.nombre || h.habilidad || h.descripcion, "Habilidad")}
                      </span>
                    ))
                  ) : (
                    <span className="skill">
                      {texto(perfil.habilidades, "Todavía no agregaste habilidades")}
                    </span>
                  )}
                </div>
              </section>
            </>
          )}

          {pestana === "servicios" && (
            <section className="card">
              <div className="section-title">
                <div>
                  <h2>Servicios profesionales</h2>
                  <p>Tu catálogo de servicios para clientes.</p>
                </div>

                <button
                  className="btn btn-blue"
                  onClick={() => setModal("servicio")}
                >
                  + Agregar servicio
                </button>
              </div>

              {servicios.length === 0 ? (
                <div className="empty">
                  <strong>Tu catálogo está esperando su primer servicio.</strong>
                  Agregá lo que ofrecés para empezar a mostrar tu propuesta profesional.
                </div>
              ) : (
                <div className="grid-items">
                  {servicios.map((s, i) => {
                    const id = s.id ?? s.idServicio;

                    return (
                      <div className="item" key={id || i}>
                        <h3>{texto(s.nombre || s.titulo, "Servicio profesional")}</h3>

                        <p>
                          {texto(
                            s.descripcion,
                            "Servicio profesional ofrecido."
                          )}
                        </p>

                        {(s.precioDesde || s.precioHasta) && (
                          <p>
                            <strong>
                              ${texto(s.precioDesde, "—")}
                              {s.precioHasta ? ` - $${s.precioHasta}` : ""}
                            </strong>
                          </p>
                        )}

                        {s.modalidad && <small>Modalidad: {s.modalidad}</small>}

                        {id && (
                          <div className="item-actions">
                            <button
                              className="mini-delete"
                              onClick={() => eliminar("servicio", id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {pestana === "experiencia" && (
            <section className="card">
              <div className="section-title">
                <div>
                  <h2>Experiencia laboral</h2>
                  <p>Construí confianza mostrando tu recorrido profesional.</p>
                </div>

                <button
                  className="btn btn-blue"
                  onClick={() => setModal("experiencia")}
                >
                  + Agregar experiencia
                </button>
              </div>

              {experiencias.length === 0 ? (
                <div className="empty">
                  <strong>Tu trayectoria profesional aparecerá aquí.</strong>
                  Agregá tus experiencias laborales.
                </div>
              ) : (
                <div className="timeline">
                  {experiencias.map((e, i) => {
                    const id = e.id ?? e.idExperiencia;

                    return (
                      <div className="timeline-item" key={id || i}>
                        <h3>
                          {texto(
                            e.puesto || e.cargo || e.titulo,
                            "Experiencia profesional"
                          )}
                        </h3>

                        <p>
                          {texto(e.empresa || e.organizacion, "Trabajo independiente")}
                        </p>

                        <small>
                          {texto(e.fechaInicio, "")}
                          {e.fechaInicio || e.fechaFin ? " → " : ""}
                          {e.actual ? "Actualidad" : texto(e.fechaFin, "")}
                        </small>

                        <p>{texto(e.descripcion)}</p>

                        {id && (
                          <button
                            className="mini-delete"
                            onClick={() => eliminar("experiencia", id)}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="form-card">
                <div className="section-title">
                  <div>
                    <h2>Formación</h2>
                    <p>Estudios, cursos y capacitación profesional.</p>
                  </div>

                  <button
                    className="btn btn-blue"
                    onClick={() => setModal("formacion")}
                  >
                    + Agregar formación
                  </button>
                </div>

                {formaciones.length === 0 ? (
                  <div className="empty">
                    No hay formaciones cargadas todavía.
                  </div>
                ) : (
                  <div className="grid-items">
                    {formaciones.map((f, i) => {
                      const id = f.id ?? f.idFormacion;

                      return (
                        <div className="item" key={id || i}>
                          <h3>
                            {texto(f.titulo || f.nombre, "Formación")}
                          </h3>

                          <p>
                            {texto(
                              f.institucion || f.organizacion,
                              "Institución"
                            )}
                          </p>

                          <p>{texto(f.descripcion)}</p>

                          {id && (
                            <button
                              className="mini-delete"
                              onClick={() => eliminar("formacion", id)}
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          )}

          {pestana === "portafolio" && (
            <section className="card">
              <div className="section-title">
                <div>
                  <h2>Portafolio profesional</h2>
                  <p>Mostrá trabajos realizados y proyectos destacados.</p>
                </div>

                <button
                  className="btn btn-blue"
                  onClick={() => setModal("portfolio")}
                >
                  + Agregar trabajo
                </button>
              </div>

              {portafolio.length === 0 ? (
                <div className="empty">
                  <strong>Tu portafolio todavía está vacío.</strong>
                  Mostrá fotografías y proyectos para generar confianza.
                </div>
              ) : (
                <div className="portfolio-grid">
                  {portafolio.map((p, i) => {
                    const id = p.id ?? p.idPortafolio;

                    return (
                      <article className="portfolio" key={id || i}>
                        <div className="portfolio-img">
                          {p.imagenUrl || p.foto ? (
                            <img
                              src={p.imagenUrl || p.foto}
                              alt={p.titulo || "Trabajo"}
                            />
                          ) : (
                            <span style={{ fontSize: 35 }}>▣</span>
                          )}
                        </div>

                        <div className="portfolio-body">
                          <h3>
                            {texto(p.titulo || p.nombre, "Trabajo profesional")}
                          </h3>

                          <p>{texto(p.descripcion)}</p>

                          {p.categoria && (
                            <small>{p.categoria}</small>
                          )}

                          {id && (
                            <div className="item-actions">
                              <button
                                className="mini-delete"
                                onClick={() => eliminar("portfolio", id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {pestana === "reputacion" && (
            <section className="card">
              <div className="section-title">
                <div>
                  <h2>Reputación profesional</h2>
                  <p>La confianza que construís con cada trabajo.</p>
                </div>
              </div>

              <div className="sobre-grid">
                <div className="card" style={{ background: "#fbfcfe" }}>
                  <div style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color: "#e7a92f"
                  }}>
                    ★ {Number(perfil.calificacionPromedio || 0).toFixed(1)}
                  </div>

                  <p className="descripcion">
                    Tu calificación promedio aparecerá aquí a medida que los
                    clientes contraten tus servicios y dejen valoraciones.
                  </p>
                </div>

                <div className="card" style={{ background: "#fbfcfe" }}>
                  <div className="info-list">
                    <div className="info-row">
                      <span>Trabajos</span>
                      <strong>{portafolio.length}</strong>
                    </div>

                    <div className="info-row">
                      <span>Servicios</span>
                      <strong>{servicios.length}</strong>
                    </div>

                    <div className="info-row">
                      <span>Experiencia</span>
                      <strong>{experiencias.length}</strong>
                    </div>

                    <div className="info-row">
                      <span>Perfil</span>
                      <strong>{porcentaje}% completo</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {editando && (
            <section className="card">
              <div className="section-title">
                <div>
                  <h2>Editar perfil profesional</h2>
                  <p>Presentate como un profesional listo para ser contratado.</p>
                </div>
              </div>

              <div className="form-grid">

                <Campo
                  label="Oficio o profesión"
                  value={perfil.oficio}
                  onChange={(v) => actualizar("oficio", v)}
                  placeholder="Ej.: Electricista profesional"
                />

                <Campo
                  label="Zona de trabajo"
                  value={perfil.zonaTrabajo}
                  onChange={(v) => actualizar("zonaTrabajo", v)}
                  placeholder="Ej.: Cruz del Eje y alrededores"
                />

                <Campo
                  label="Foto de perfil"
                  value={perfil.fotoPerfil}
                  onChange={(v) => actualizar("fotoPerfil", v)}
                  placeholder="URL de la imagen"
                />

                <Campo
                  label="Horarios"
                  value={perfil.horarios}
                  onChange={(v) => actualizar("horarios", v)}
                  placeholder="Ej.: Lunes a sábado, 8 a 18 hs"
                />

                <Area
                  label="Presentación profesional"
                  value={perfil.descripcion}
                  onChange={(v) => actualizar("descripcion", v)}
                  placeholder="Contá quién sos, qué experiencia tenés y qué te diferencia."
                />

                <Area
                  label="Servicios"
                  value={perfil.servicios}
                  onChange={(v) => actualizar("servicios", v)}
                  placeholder="Ej.: Instalaciones, reparaciones, mantenimiento..."
                />

                <Area
                  label="Experiencia"
                  value={perfil.experiencia}
                  onChange={(v) => actualizar("experiencia", v)}
                  placeholder="Contá brevemente tu experiencia profesional."
                />

                <Campo
                  label="Estudios / formación"
                  value={perfil.estudios}
                  onChange={(v) => actualizar("estudios", v)}
                  placeholder="Cursos, títulos, certificaciones..."
                />

                <Area
                  label="Habilidades"
                  value={perfil.habilidades}
                  onChange={(v) => actualizar("habilidades", v)}
                  placeholder="Ej.: responsabilidad, trabajo en equipo, precisión..."
                />

              </div>

              <div className="acciones">
                <button
                  className="btn btn-danger"
                  onClick={() => setEditando(false)}
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-blue"
                  onClick={guardarPerfil}
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Guardar perfil"}
                </button>
              </div>
            </section>
          )}

          {pestana === "resumen" && (
            <section className="card">
              <div className="section-title">
                <div>
                  <h2>Disponibilidad</h2>
                  <p>Indicá cuándo pueden encontrarte tus clientes.</p>
                </div>

                <button
                  className="btn btn-blue"
                  onClick={() => setModal("disponibilidad")}
                >
                  + Agregar horario
                </button>
              </div>

              {disponibilidades.length === 0 ? (
                <div className="empty">
                  <strong>No hay horarios específicos cargados.</strong>
                  Tu disponibilidad general es: {texto(perfil.horarios, "No definida")}.
                </div>
              ) : (
                <div className="grid-items">
                  {disponibilidades.map((d, i) => {
                    const id = d.id ?? d.idDisponibilidad;

                    return (
                      <div className="item" key={id || i}>
                        <h3>{texto(d.dia, "Día")}</h3>
                        <p>
                          {texto(d.horaInicio, "—")} a {texto(d.horaFin, "—")}
                        </p>
                        <small>
                          {d.disponible === false ? "No disponible" : "Disponible"}
                        </small>

                        {id && (
                          <div className="item-actions">
                            <button
                              className="mini-delete"
                              onClick={() => eliminar("disponibilidad", id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

        </div>
      </main>

      {modal === "servicio" && (
        <Modal titulo="Agregar servicio profesional" cerrar={() => setModal(null)}>
          <div className="form-grid">
            <Campo
              label="Nombre del servicio"
              value={nuevoServicio.nombre}
              onChange={(v) =>
                setNuevoServicio({ ...nuevoServicio, nombre: v })
              }
              placeholder="Ej.: Instalación eléctrica"
            />

            <Campo
              label="Modalidad"
              value={nuevoServicio.modalidad}
              onChange={(v) =>
                setNuevoServicio({ ...nuevoServicio, modalidad: v })
              }
              placeholder="Presencial / domicilio"
            />

            <Campo
              label="Precio desde"
              value={nuevoServicio.precioDesde}
              onChange={(v) =>
                setNuevoServicio({ ...nuevoServicio, precioDesde: v })
              }
              placeholder="Ej.: 15000"
              type="number"
            />

            <Campo
              label="Precio hasta"
              value={nuevoServicio.precioHasta}
              onChange={(v) =>
                setNuevoServicio({ ...nuevoServicio, precioHasta: v })
              }
              placeholder="Ej.: 50000"
              type="number"
            />

            <Area
              label="Descripción"
              value={nuevoServicio.descripcion}
              onChange={(v) =>
                setNuevoServicio({ ...nuevoServicio, descripcion: v })
              }
              placeholder="Describí el servicio."
            />
          </div>

          <div className="acciones">
            <button className="btn btn-danger" onClick={() => setModal(null)}>
              Cancelar
            </button>

            <button
              className="btn btn-blue"
              onClick={() =>
                agregar("servicio", nuevoServicio)
              }
            >
              Guardar servicio
            </button>
          </div>
        </Modal>
      )}

      {modal === "experiencia" && (
        <Modal titulo="Agregar experiencia laboral" cerrar={() => setModal(null)}>
          <div className="form-grid">
            <Campo
              label="Puesto / cargo"
              value={nuevaExperiencia.puesto}
              onChange={(v) =>
                setNuevaExperiencia({ ...nuevaExperiencia, puesto: v })
              }
              placeholder="Ej.: Electricista"
            />

            <Campo
              label="Empresa"
              value={nuevaExperiencia.empresa}
              onChange={(v) =>
                setNuevaExperiencia({ ...nuevaExperiencia, empresa: v })
              }
              placeholder="Empresa o cliente"
            />

            <Campo
              label="Fecha de inicio"
              value={nuevaExperiencia.fechaInicio}
              onChange={(v) =>
                setNuevaExperiencia({ ...nuevaExperiencia, fechaInicio: v })
              }
              type="date"
            />

            <Campo
              label="Fecha de finalización"
              value={nuevaExperiencia.fechaFin}
              onChange={(v) =>
                setNuevaExperiencia({ ...nuevaExperiencia, fechaFin: v })
              }
              type="date"
            />

            <Area
              label="Descripción"
              value={nuevaExperiencia.descripcion}
              onChange={(v) =>
                setNuevaExperiencia({ ...nuevaExperiencia, descripcion: v })
              }
              placeholder="Describí las tareas realizadas."
            />
          </div>

          <div className="acciones">
            <button className="btn btn-danger" onClick={() => setModal(null)}>
              Cancelar
            </button>

            <button
              className="btn btn-blue"
              onClick={() =>
                agregar("experiencia", nuevaExperiencia)
              }
            >
              Guardar experiencia
            </button>
          </div>
        </Modal>
      )}

      {modal === "formacion" && (
        <Modal titulo="Agregar formación" cerrar={() => setModal(null)}>
          <div className="form-grid">
            <Campo
              label="Título / curso"
              value={nuevaFormacion.titulo}
              onChange={(v) =>
                setNuevaFormacion({ ...nuevaFormacion, titulo: v })
              }
              placeholder="Ej.: Técnico electricista"
            />

            <Campo
              label="Institución"
              value={nuevaFormacion.institucion}
              onChange={(v) =>
                setNuevaFormacion({ ...nuevaFormacion, institucion: v })
              }
              placeholder="Institución educativa"
            />

            <Campo
              label="Fecha de inicio"
              value={nuevaFormacion.fechaInicio}
              onChange={(v) =>
                setNuevaFormacion({ ...nuevaFormacion, fechaInicio: v })
              }
              type="date"
            />

            <Campo
              label="Fecha de finalización"
              value={nuevaFormacion.fechaFin}
              onChange={(v) =>
                setNuevaFormacion({ ...nuevaFormacion, fechaFin: v })
              }
              type="date"
            />

            <Area
              label="Descripción"
              value={nuevaFormacion.descripcion}
              onChange={(v) =>
                setNuevaFormacion({ ...nuevaFormacion, descripcion: v })
              }
              placeholder="Información adicional."
            />
          </div>

          <div className="acciones">
            <button className="btn btn-danger" onClick={() => setModal(null)}>
              Cancelar
            </button>

            <button
              className="btn btn-blue"
              onClick={() =>
                agregar("formacion", nuevaFormacion)
              }
            >
              Guardar formación
            </button>
          </div>
        </Modal>
      )}

      {modal === "portfolio" && (
        <Modal titulo="Agregar trabajo al portafolio" cerrar={() => setModal(null)}>
          <div className="form-grid">
            <Campo
              label="Título"
              value={nuevoPortfolio.titulo}
              onChange={(v) =>
                setNuevoPortfolio({ ...nuevoPortfolio, titulo: v })
              }
              placeholder="Ej.: Instalación eléctrica completa"
            />

            <Campo
              label="Categoría"
              value={nuevoPortfolio.categoria}
              onChange={(v) =>
                setNuevoPortfolio({ ...nuevoPortfolio, categoria: v })
              }
              placeholder="Ej.: Electricidad"
            />

            <Campo
              label="URL de imagen"
              value={nuevoPortfolio.imagenUrl}
              onChange={(v) =>
                setNuevoPortfolio({ ...nuevoPortfolio, imagenUrl: v })
              }
              placeholder="https://..."
            />

            <Campo
              label="Fecha"
              value={nuevoPortfolio.fecha}
              onChange={(v) =>
                setNuevoPortfolio({ ...nuevoPortfolio, fecha: v })
              }
              type="date"
            />

            <Area
              label="Descripción"
              value={nuevoPortfolio.descripcion}
              onChange={(v) =>
                setNuevoPortfolio({ ...nuevoPortfolio, descripcion: v })
              }
              placeholder="Describí el trabajo realizado."
            />
          </div>

          <div className="acciones">
            <button className="btn btn-danger" onClick={() => setModal(null)}>
              Cancelar
            </button>

            <button
              className="btn btn-blue"
              onClick={() =>
                agregar("portfolio", nuevoPortfolio)
              }
            >
              Guardar trabajo
            </button>
          </div>
        </Modal>
      )}

      {modal === "disponibilidad" && (
        <Modal titulo="Agregar disponibilidad" cerrar={() => setModal(null)}>
          <div className="form-grid">
            <label className="campo">
              <span>Día</span>
              <select
                value={nuevaDisponibilidad.dia}
                onChange={(e) =>
                  setNuevaDisponibilidad({
                    ...nuevaDisponibilidad,
                    dia: e.target.value
                  })
                }
              >
                <option>Lunes</option>
                <option>Martes</option>
                <option>Miércoles</option>
                <option>Jueves</option>
                <option>Viernes</option>
                <option>Sábado</option>
                <option>Domingo</option>
              </select>
            </label>

            <Campo
              label="Hora de inicio"
              value={nuevaDisponibilidad.horaInicio}
              onChange={(v) =>
                setNuevaDisponibilidad({
                  ...nuevaDisponibilidad,
                  horaInicio: v
                })
              }
              type="time"
            />

            <Campo
              label="Hora de fin"
              value={nuevaDisponibilidad.horaFin}
              onChange={(v) =>
                setNuevaDisponibilidad({
                  ...nuevaDisponibilidad,
                  horaFin: v
                })
              }
              type="time"
            />
          </div>

          <div className="acciones">
            <button className="btn btn-danger" onClick={() => setModal(null)}>
              Cancelar
            </button>

            <button
              className="btn btn-blue"
              onClick={() =>
                agregar("disponibilidad", nuevaDisponibilidad)
              }
            >
              Guardar horario
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}
