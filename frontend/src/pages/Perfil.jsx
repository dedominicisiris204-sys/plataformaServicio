import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API = "/api";

const AVATARES_PREDEFINIDOS = [
  { label: "⚡ Electricista", url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Electricista&backgroundColor=0d9488" },
  { label: "🔧 Plomero", url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Plomero&backgroundColor=2563eb" },
  { label: "🧱 Constructor", url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Albanil&backgroundColor=d97706" },
  { label: "🎨 Pintor", url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Pintor&backgroundColor=7c3aed" },
  { label: "👩‍💼 Profesional", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Profesional1&backgroundColor=b6e3f4" },
  { label: "👨‍🔧 Especialista", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Especialista2&backgroundColor=c0aede" }
];

function comprimirImagenBase64(file, maxDim = 480) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h >= w && h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = ev.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const perfilInicial = {
  fotoPerfil: "https://api.dicebear.com/7.x/avataaars/svg?seed=EspecialistaPro&backgroundColor=b6e3f4",
  oficio: "Especialista en Servicios del Hogar, Instalaciones y Mantenimiento",
  descripcion:
    "Profesional matriculado con más de 8 años de experiencia en instalaciones eléctricas, plomería, pintura y reparaciones generales del hogar y comercios. Atención puntual, presupuestos sin cargo y garantía escrita en cada trabajo realizado.",
  servicios:
    "• Instalaciones eléctricas completas, tableros, térmicas y disyuntores\n• Reparación de pérdidas de agua, grifería, termotanques y bombas\n• Pintura interior/exterior, impermeabilización y arreglos generales",
  experiencia:
    "Más de 350 trabajos residenciales y comerciales finalizados con calificación 5 estrellas.",
  estudios: "Técnico Instalador Matriculado · Capacitación en Seguridad Eléctrica y Sanitaria",
  habilidades: "Diagnóstico rápido, Prolijidad, Presupuesto sin cargo, Atención de urgencias 24 hs, Garantía escrita",
  zonaTrabajo: "Cruz del Eje, Centro y alrededores (Atención a domicilio)",
  horarios: "Lunes a Sábado de 08:00 a 20:00 hs · Urgencias 24 hs",
  calificacionPromedio: 5.0
};

const SERVICIOS_EJEMPLO_DEFAULT = [
  {
    id: "ej-srv-1",
    nombre: "Instalación y Reparación Eléctrica Completa",
    descripcion: "Colocación de disyuntores, llaves térmicas, cableado nuevo, luminarias LED y detección de cortocircuitos.",
    precioDesde: "18000",
    precioHasta: "65000",
    modalidad: "A domicilio · Garantía escrita"
  },
  {
    id: "ej-srv-2",
    nombre: "Plomería, Sanitarios y Termotanques",
    descripcion: "Reparación de cañerías por termofusión, cambio de griferías, instalación de tanques y bombas presurizadoras.",
    precioDesde: "15000",
    precioHasta: "55000",
    modalidad: "Urgencias en el día"
  },
  {
    id: "ej-srv-3",
    nombre: "Pintura de Interiores, Fachadas e Impermeabilización",
    descripcion: "Preparación de superficies, enduido, fijador y aplicación de látex lavable o membrana líquida en techos.",
    precioDesde: "25000",
    precioHasta: "120000",
    modalidad: "Presupuesto sin cargo"
  }
];

const EXPERIENCIAS_EJEMPLO_DEFAULT = [
  {
    id: "ej-exp-1",
    puesto: "Especialista Técnico Independiente",
    empresa: "Servicios Integrales del Hogar & Comercios",
    fechaInicio: "2019-03-01",
    actual: true,
    descripcion: "Resolución de urgencias eléctricas, instalaciones sanitarias, refacciones integrales y mantenimiento preventivo para hogares y locales comerciales."
  },
  {
    id: "ej-exp-2",
    puesto: "Oficial de Mantenimiento e Instalaciones",
    empresa: "Constructora & Obras del Norte",
    fechaInicio: "2016-02-01",
    fechaFin: "2019-02-28",
    actual: false,
    descripcion: "Montaje de tableros eléctricos, tendido de redes de agua fría/caliente y terminaciones de obra fina."
  }
];

const FORMACIONES_EJEMPLO_DEFAULT = [
  {
    id: "ej-form-1",
    titulo: "Instalador Electricista y Sanitarista Matriculado",
    institucion: "Instituto de Formación Técnica Profesional",
    descripcion: "Certificación oficial en normativas de seguridad eléctrica AEA y termofusión sanitaria."
  },
  {
    id: "ej-form-2",
    titulo: "Especialización en Mantenimiento Edilicio y Climatización",
    institucion: "Centro de Capacitación en Oficios",
    descripcion: "Diagnóstico de fallas, eficiencia energética e impermeabilización de cubiertas."
  }
];

const PORTAFOLIO_EJEMPLO_DEFAULT = [
  {
    id: "ej-port-1",
    titulo: "Armado de Tablero Eléctrico con Térmicas y Disyuntor",
    categoria: "⚡ Electricidad",
    fecha: "2026-10-15",
    imagenUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80",
    descripcion: "Renovación completa de tablero principal, recableado normalizado e instalación de iluminación LED en vivienda familiar."
  },
  {
    id: "ej-port-2",
    titulo: "Instalación Sanitaria y Grifería Monocomando en Cocina",
    categoria: "🔧 Plomería",
    fecha: "2026-10-28",
    imagenUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=80",
    descripcion: "Tendido de cañerías en termofusión, colocación de bajo mesada, grifería de alta presión y prueba hidráulica."
  },
  {
    id: "ej-port-3",
    titulo: "Pintura Interior y Renovación de Living Comedor",
    categoria: "🎨 Pintura y Refacción",
    fecha: "2026-11-04",
    imagenUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80",
    descripcion: "Reparación de humedad con enduido plástico, lijado integral y dos manos de látex satinado primera línea."
  },
  {
    id: "ej-port-4",
    titulo: "Mueble a Medida y Carpintería en Madera Maciza",
    categoria: "🚪 Carpintería",
    fecha: "2026-11-10",
    imagenUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80",
    descripcion: "Diseño, corte y armado de amoblamiento a medida con herrajes reforzados y barnizado poliuretánico."
  }
];

const TEXTOS_ESTRELLAS = {
  1: "1 ★ · Malo",
  2: "2 ★★ · Regular",
  3: "3 ★★★ · Bueno",
  4: "4 ★★★★ · Muy bueno",
  5: "5 ★★★★★ · Excelente"
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

function Avatar({ nombre, foto, grande = false, onSubirFoto }) {
  const fileRef = useRef(null);
  const inicial =
    texto(nombre, "P").trim().charAt(0).toUpperCase() || "P";

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div className={`avatar ${grande ? "avatar-grande" : ""}`}>
        {foto ? (
          <img src={foto} alt={nombre} />
        ) : (
          <span>{inicial}</span>
        )}
      </div>

      {grande && onSubirFoto && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onSubirFoto}
            style={{ display: "none" }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            title="Subir o cambiar foto de perfil desde tu dispositivo"
            style={{
              position: "absolute",
              bottom: -6,
              right: -6,
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              color: "#0f172a",
              border: "2px solid white",
              borderRadius: 999,
              padding: "6px 11px",
              fontSize: 11.5,
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4
            }}
          >
            📷 Foto
          </button>
        </>
      )}
    </div>
  );
}

function EstrellasVisuales({ valor = 5, tamano = 18 }) {
  const redondeado = Math.round(Number(valor) || 0);
  return (
    <span style={{ display: "inline-flex", gap: 2, color: "#fbbf24", fontSize: tamano, lineHeight: 1 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= redondeado ? "#fbbf24" : "rgba(255,255,255,0.35)" }}>
          ★
        </span>
      ))}
    </span>
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
        rows="4"
      />
    </label>
  );
}

export default function Perfil() {
  const navigate = useNavigate();
  const location = useLocation();

  const usuario = useMemo(() => obtenerUsuario(), []);
  const usuarioId = usuario?.id;

  const autorVisitado = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const autorParam = (params.get("autor") || "").trim();
    const miNombre = (usuario?.nombre || "").trim();
    if (autorParam && autorParam.toLowerCase() !== miNombre.toLowerCase()) {
      return autorParam;
    }
    return "";
  }, [location.search, usuario]);

  const nombreMostrado = autorVisitado || nombreVisible(usuario);

  // Estado de Tema Claro / Oscuro en Perfil
  const [tema, setTema] = useState(() => localStorage.getItem("tema") || "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    document.body.setAttribute("data-theme", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);
  const toggleTema = () => setTema(prev => (prev === "dark" ? "light" : "dark"));

  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [perfil, setPerfil] = useState(perfilInicial);
  const [perfilId, setPerfilId] = useState(null);

  const [servicios, setServicios] = useState(SERVICIOS_EJEMPLO_DEFAULT);
  const [experiencias, setExperiencias] = useState(EXPERIENCIAS_EJEMPLO_DEFAULT);
  const [formaciones, setFormaciones] = useState(FORMACIONES_EJEMPLO_DEFAULT);
  const [habilidades, setHabilidades] = useState([]);
  const [portafolio, setPortafolio] = useState(PORTAFOLIO_EJEMPLO_DEFAULT);
  const [disponibilidades, setDisponibilidades] = useState([]);

  const [pestana, setPestana] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "resumen";
  });
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [modal, setModal] = useState(null);
  const [publicacionesUsuario, setPublicacionesUsuario] = useState([]);
  const [estadoVivo, setEstadoVivo] = useState(
    () => localStorage.getItem(`estado_vivo_${usuarioId || "default"}`) || "🟢 Disponible para trabajar hoy"
  );
  const [mostrarTarjetaDigital, setMostrarTarjetaDigital] = useState(false);
  const [imagenFullscreen, setImagenFullscreen] = useState(null);
  const fotoInputEditRef = useRef(null);
  const portfolioFileRef = useRef(null);

  // Estado para Valoración con Estrellas del 1 al 5
  const [resenas, setResenas] = useState(() => {
    try {
      const guardadas = JSON.parse(localStorage.getItem(`resenas_perfil_${usuarioId || "default"}`) || "null");
      if (Array.isArray(guardadas) && guardadas.length > 0) return guardadas;
    } catch {
      // ignore
    }
    return [
      {
        id: 1,
        autor: "Carlos Rodríguez",
        estrellas: 5,
        comentario: "Excelente profesional, muy puntual y prolijo en su trabajo.",
        fecha: "Reciente"
      },
      {
        id: 2,
        autor: "María Fernanda",
        estrellas: 5,
        comentario: "Recomendable 100%, solucionó el problema en el día.",
        fecha: "Reciente"
      }
    ];
  });
  const [estrellasSeleccionadas, setEstrellasSeleccionadas] = useState(5);
  const [estrellaHover, setEstrellaHover] = useState(0);
  const [autorResena, setAutorResena] = useState(usuario?.nombre || "Cliente verificado");
  const [comentarioResena, setComentarioResena] = useState("");

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
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam) {
      setPestana(tabParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (!usuarioId) {
      navigate("/login");
      return;
    }
    cargarTodo();
  }, [usuarioId, autorVisitado]);

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

  const cargarColeccion = async (url, setter, fallback = []) => {
    try {
      const data = await request(url);
      if (Array.isArray(data) && data.length > 0) {
        setter(data);
      } else {
        setter(fallback);
      }
    } catch {
      setter(fallback);
    }
  };

  const cargarTodo = async () => {
    setCargando(true);
    setError("");

    try {
      // Cargar publicaciones del usuario o profesional visitado
      request(`${API}/publicaciones`)
        .then((listaPubs) => {
          const arr = Array.isArray(listaPubs)
            ? listaPubs
            : Array.isArray(listaPubs?.content)
            ? listaPubs.content
            : [];
          const buscado = (autorVisitado || usuario?.nombre || "").trim().toLowerCase();
          const propias = arr.filter((p) => (p.autor || "").trim().toLowerCase() === buscado);
          setPublicacionesUsuario(propias.length > 0 ? propias : arr.slice(0, 4));
        })
        .catch(() => {});

      // Si estamos visitando el perfil de otro autor, buscar su usuarioId en /api/usuarios
      let targetUserId = usuarioId;
      if (autorVisitado) {
        try {
          const todosUsuarios = await request(`${API}/usuarios`);
          if (Array.isArray(todosUsuarios)) {
            const encontrado = todosUsuarios.find(
              (u) => (u.nombre || "").trim().toLowerCase() === autorVisitado.toLowerCase()
            );
            if (encontrado?.id) {
              targetUserId = encontrado.id;
            }
          }
        } catch {
          // ignore
        }
      }

      const data = await request(`${API}/perfiles/usuario/${targetUserId}`);

      if (data) {
        setPerfil({
          fotoPerfil: data.fotoPerfil || perfilInicial.fotoPerfil,
          oficio: data.oficio || perfilInicial.oficio,
          descripcion: data.descripcion || perfilInicial.descripcion,
          servicios: data.servicios || perfilInicial.servicios,
          experiencia: data.experiencia || perfilInicial.experiencia,
          estudios: data.estudios || perfilInicial.estudios,
          habilidades: data.habilidades || perfilInicial.habilidades,
          zonaTrabajo: data.zonaTrabajo || perfilInicial.zonaTrabajo,
          horarios: data.horarios || perfilInicial.horarios,
          calificacionPromedio:
            data.calificacionPromedio && Number(data.calificacionPromedio) > 0
              ? Number(data.calificacionPromedio)
              : 5.0
        });

        if (data.idPerfil) {
          setPerfilId(data.idPerfil);

          await Promise.all([
            cargarColeccion(
              `${API}/servicios-profesionales/perfil/${data.idPerfil}`,
              setServicios,
              SERVICIOS_EJEMPLO_DEFAULT
            ),
            cargarColeccion(
              `${API}/experiencias/perfil/${data.idPerfil}`,
              setExperiencias,
              EXPERIENCIAS_EJEMPLO_DEFAULT
            ),
            cargarColeccion(
              `${API}/formaciones/perfil/${data.idPerfil}`,
              setFormaciones,
              FORMACIONES_EJEMPLO_DEFAULT
            ),
            cargarColeccion(
              `${API}/habilidades-profesionales/perfil/${data.idPerfil}`,
              setHabilidades,
              []
            ),
            cargarColeccion(
              `${API}/portafolio/perfil/${data.idPerfil}`,
              setPortafolio,
              PORTAFOLIO_EJEMPLO_DEFAULT
            ),
            cargarColeccion(
              `${API}/disponibilidades/perfil/${data.idPerfil}`,
              setDisponibilidades,
              []
            )
          ]);
        }
      }
    } catch (e) {
      if (!String(e.message).includes("204")) {
        setError("No se pudo conectar con el servidor de perfiles.");
      }
    } finally {
      setCargando(false);
    }
  };

  const guardarPerfil = async (calificacionCustom = null) => {
    setGuardando(true);
    setMensaje("");
    setError("");

    const calificacionFinal =
      calificacionCustom !== null
        ? calificacionCustom
        : Number(perfil.calificacionPromedio || 5.0);

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
            horarios: perfil.horarios || "",
            calificacionPromedio: calificacionFinal
          })
        }
      );

      if (guardado) {
        setPerfil({
          ...perfilInicial,
          ...guardado,
          calificacionPromedio: calificacionFinal
        });
        setPerfilId(guardado.idPerfil || perfilId);
      }

      setMensaje("Perfil actualizado correctamente.");
      setEditando(false);

      setTimeout(() => setMensaje(""), 3500);
    } catch (e) {
      setError(`No se pudo guardar el perfil: ${e.message}`);
    } finally {
      setGuardando(false);
    }
  };

  const manejarSubirFotoPerfil = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      setError("La imagen no debe superar los 6MB.");
      return;
    }
    try {
      setGuardando(true);
      setError("");
      const base64 = await comprimirImagenBase64(file, 440);
      setPerfil((prev) => ({ ...prev, fotoPerfil: base64 }));

      const guardado = await request(`${API}/perfiles/usuario/${usuarioId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...perfil,
          fotoPerfil: base64,
          calificacionPromedio: Number(perfil.calificacionPromedio || 5.0)
        })
      });

      if (guardado?.idPerfil) {
        setPerfilId(guardado.idPerfil);
      }

      // Sincronizar también en localStorage del usuario para el resto de la app
      try {
        const uActual = JSON.parse(localStorage.getItem("usuario") || "{}");
        if (uActual && uActual.id) {
          uActual.fotoPerfil = base64;
          localStorage.setItem("usuario", JSON.stringify(uActual));
        }
      } catch {
        // ignore
      }

      setMensaje("📷 ¡Foto de perfil actualizada y guardada con éxito!");
      setTimeout(() => setMensaje(""), 3500);
    } catch (err) {
      setError("No se pudo subir la foto de perfil: " + (err.message || ""));
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstadoVivo = (nuevoEstado) => {
    setEstadoVivo(nuevoEstado);
    try {
      localStorage.setItem(`estado_vivo_${usuarioId || "default"}`, nuevoEstado);
    } catch {
      // ignore
    }
    setMensaje(`Estado actualizado a: ${nuevoEstado}`);
    setTimeout(() => setMensaje(""), 2500);
  };

  const enviarValoracionEstrellas = async (e) => {
    e.preventDefault();
    const puntos = Math.min(5, Math.max(1, Number(estrellasSeleccionadas) || 5));

    const nueva = {
      id: Date.now(),
      autor: (autorResena || usuario?.nombre || "Cliente").trim(),
      estrellas: puntos,
      comentario:
        comentarioResena.trim() ||
        `Calificación de ${puntos} ${puntos === 1 ? "estrella" : "estrellas"} otorgada al profesional.`,
      fecha: new Date().toLocaleDateString("es-AR")
    };

    const actualizadas = [nueva, ...resenas];
    setResenas(actualizadas);
    setComentarioResena("");

    const nuevoPromedio = Number(
      (
        actualizadas.reduce((acc, item) => acc + Number(item.estrellas || 5), 0) /
        actualizadas.length
      ).toFixed(1)
    );

    setPerfil((prev) => ({
      ...prev,
      calificacionPromedio: nuevoPromedio
    }));

    try {
      localStorage.setItem(
        `resenas_perfil_${usuarioId || "default"}`,
        JSON.stringify(actualizadas)
      );
    } catch {
      // ignore
    }

    await guardarPerfil(nuevoPromedio);
    setMensaje(`¡Valoración de ${puntos} ★ registrada con éxito! Promedio: ${nuevoPromedio} ★`);
  };

  const agregar = async (tipo, datos, cerrar) => {
    if (!perfilId) {
      setError("Primero guardá la información principal del perfil (botón Editar perfil -> Guardar).");
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

  const promedioActual = useMemo(() => {
    if (resenas.length > 0) {
      return (
        resenas.reduce((acc, r) => acc + Number(r.estrellas || 5), 0) /
        resenas.length
      ).toFixed(1);
    }
    return Number(perfil.calificacionPromedio || 5.0).toFixed(1);
  }, [resenas, perfil.calificacionPromedio]);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (cargando) {
    return (
      <div className="perfil-cargando">
        <div className="spinner"></div>
        <h2>Cargando perfil profesional...</h2>
        <p>Preparando tu espacio de trabajo y reputación.</p>
      </div>
    );
  }

  return (
    <div className="perfil-layout">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .perfil-layout {
          display: flex;
          min-height: 100vh;
          background: var(--background-site);
          background-attachment: fixed;
          color: var(--text);
          transition: background 0.25s ease, color 0.25s ease;
        }

        /* BARRA LATERAL EN PERFIL */
        .perfil-sidebar {
          width: 270px;
          min-width: 270px;
          background: var(--sidebar-bg);
          backdrop-filter: blur(16px);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          box-shadow: var(--shadow-sm);
          z-index: 95;
          transition: width 0.2s ease;
        }

        .perfil-sidebar.contraido {
          width: 68px;
          min-width: 68px;
          align-items: center;
        }

        .perfil-page {
          flex: 1;
          min-width: 0;
          padding-bottom: 60px;
        }

        .perfil-topbar {
          height: 70px;
          background: linear-gradient(90deg, #0f766e 0%, #0284c7 55%, #1d4ed8 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4%;
          box-shadow: 0 4px 20px rgba(13, 148, 136, 0.2);
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
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.35);
          font-weight: 900;
        }

        .volver {
          color: white;
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 8px 16px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 700;
          font-size: 13.5px;
          transition: 0.2s;
        }

        .volver:hover {
          background: rgba(255, 255, 255, 0.28);
        }

        .perfil-container {
          width: min(1140px, 94%);
          margin: 28px auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          border-radius: 26px;
          background:
            linear-gradient(125deg, #0f766e 0%, #0369a1 52%, #1d4ed8 100%);
          color: white;
          padding: 34px;
          box-shadow: 0 18px 50px rgba(13, 148, 136, 0.22);
        }

        .hero::after {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          right: -80px;
          top: -120px;
          background: radial-gradient(circle, rgba(253, 224, 71, 0.22), transparent 70%);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(254, 243, 199, 0.2);
          border: 1px solid rgba(253, 224, 71, 0.55);
          color: #fde047;
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 11.5px;
          font-weight: 900;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }

        .hero-main {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 116px minmax(0, 1fr) minmax(0, 1.2fr);
          align-items: center;
          gap: 18px 22px;
        }

        .avatar {
          flex: 0 0 auto;
          width: 58px;
          height: 58px;
          border-radius: 18px;
          overflow: hidden;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #14b8a6, #3b82f6);
          color: white;
          font-size: 22px;
          font-weight: 900;
          border: 3px solid rgba(255,255,255,.65);
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
          border-radius: 28px;
          font-size: 42px;
        }

        .hero h1 {
          margin: 0 0 6px;
          font-size: clamp(26px, 3.6vw, 40px);
          letter-spacing: -.6px;
        }

        .hero-oficio {
          font-size: 18px;
          color: #ccfbf1;
          font-weight: 600;
          margin-bottom: 14px;
        }

        .hero-meta {
          display: flex;
          min-width: 0;
          align-content: center;
          flex-wrap: wrap;
          gap: 10px;
          color: #f0fdfa;
          font-size: 13px;
        }

        .hero-identity { min-width: 0; }

        .meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,.14);
          border: 1px solid rgba(255,255,255,.24);
          border-radius: 999px;
          padding: 7px 13px;
          font-weight: 600;
        }

        .disponible {
          background: rgba(16, 185, 129, 0.25);
          border-color: rgba(110, 231, 183, 0.5);
          color: #a7f3d0;
        }

        .hero-actions {
          grid-column: 2 / -1;
          margin-left: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .btn {
          border: 0;
          border-radius: 12px;
          padding: 11px 18px;
          cursor: pointer;
          font-weight: 800;
          font-size: 13px;
          transition: .2s ease;
        }

        .btn:hover {
          transform: translateY(-1px);
        }

        .btn-gold {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #0f172a;
          box-shadow: 0 6px 18px rgba(245, 158, 11, 0.35);
        }

        .btn-light {
          background: white;
          color: #0f766e;
        }

        .btn-outline {
          background: rgba(255,255,255,0.12);
          color: white;
          border: 1px solid rgba(255,255,255,.38);
        }

        .btn-blue {
          background: linear-gradient(135deg, #0d9488, #2563eb);
          color: white;
          box-shadow: 0 6px 16px rgba(13, 148, 136, 0.25);
        }

        .btn-danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 14px;
          margin-top: 22px;
        }

        .stat {
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.2);
          padding: 15px;
          border-radius: 16px;
          backdrop-filter: blur(8px);
        }

        .stat strong {
          display: block;
          font-size: 22px;
        }

        .stat span {
          font-size: 11px;
          color: #ccfbf1;
          text-transform: uppercase;
          letter-spacing: .6px;
          font-weight: 700;
        }

        .completitud {
          margin-top: 18px;
          background: rgba(255,255,255,.12);
          padding: 14px 16px;
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,.18);
        }

        .completitud-top {
          display: flex;
          justify-content: space-between;
          font-size: 12.5px;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .barra {
          height: 8px;
          background: rgba(255,255,255,.2);
          border-radius: 99px;
          overflow: hidden;
        }

        .barra span {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #34d399, #fde047);
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
          border: 1px solid #ccfbf1;
          border-radius: 22px;
          padding: 26px;
          box-shadow: 0 10px 30px rgba(13, 148, 136, 0.06);
        }

        .tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding: 8px;
          background: white;
          border: 1px solid #ccfbf1;
          border-radius: 18px;
          box-shadow: 0 8px 25px rgba(13, 148, 136, 0.05);
        }

        .tab {
          border: 0;
          background: transparent;
          color: #475569;
          padding: 11px 18px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s;
        }

        .tab:hover {
          background: #f0fdfa;
          color: #0f766e;
        }

        .tab.activo {
          color: #fff;
          background: linear-gradient(135deg, #0d9488, #2563eb);
          box-shadow: 0 5px 15px rgba(13, 148, 136, 0.28);
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
          color: #0f172a;
        }

        .section-title p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13.5px;
        }

        .sobre-grid {
          display: grid;
          grid-template-columns: 1.35fr .65fr;
          gap: 20px;
        }

        .descripcion {
          color: #334155;
          line-height: 1.75;
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
          border-bottom: 1px solid var(--border-subtle);
          font-size: 13.5px;
        }

        .info-row span:first-child {
          color: #64748b;
        }

        .info-row strong {
          text-align: right;
          color: #0f172a;
        }

        .grid-items {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 15px;
        }

        .item {
          border: 1px solid #e2e8f0;
          border-radius: 17px;
          padding: 18px;
          background: #f8fafc;
          position: relative;
        }

        .item h3 {
          margin: 0 0 7px;
          color: #0f172a;
          font-size: 16px;
        }

        .item p {
          margin: 6px 0;
          color: #475569;
          font-size: 13.5px;
          line-height: 1.55;
        }

        .item small {
          color: #64748b;
        }

        .item-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }

        .mini-delete {
          border: 0;
          color: #b42318;
          background: #fee2e2;
          padding: 6px 10px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 11.5px;
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
          background: #99f6e4;
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
          background: #0d9488;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #99f6e4;
        }

        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .skill {
          padding: 9px 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, #f0fdfa, #e0f2fe);
          border: 1px solid #99f6e4;
          color: #0f766e;
          font-weight: 800;
          font-size: 12.5px;
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 15px;
        }

        .portfolio {
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 17px;
          background: white;
        }

        .portfolio-img {
          height: 150px;
          background: linear-gradient(135deg, #ccfbf1, #dbeafe);
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
          color: #64748b;
          font-size: 12.5px;
          line-height: 1.5;
        }

        .empty {
          text-align: center;
          padding: 35px 15px;
          color: #64748b;
          border: 1px dashed #99f6e4;
          background: #f0fdfa;
          border-radius: 17px;
        }

        .empty strong {
          display: block;
          color: #0f766e;
          margin-bottom: 5px;
        }

        .form-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
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
          font-size: 12.5px;
          font-weight: 800;
          color: #1e293b;
        }

        .campo input,
        .campo textarea,
        .campo select {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 11px;
          padding: 11px 13px;
          font: inherit;
          color: #0f172a;
          background: white;
          outline: none;
        }

        .campo textarea {
          resize: vertical;
        }

        .campo input:focus,
        .campo textarea:focus,
        .campo select:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.14);
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
          padding: 13px 16px;
          border-radius: 12px;
          font-size: 13.5px;
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
          background: rgba(15, 23, 42, 0.62);
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
          color: #0f172a;
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
          background: #f0fdfa;
          color: #0f766e;
        }

        .spinner {
          width: 42px;
          height: 42px;
          border: 4px solid #ccfbf1;
          border-top-color: #0d9488;
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .perfil-sidebar {
            display: none;
          }
          .hero-main {
            grid-template-columns: 96px minmax(0, 1fr);
            align-items: flex-start;
            gap: 14px;
          }
          .hero-meta,
          .hero-actions {
            grid-column: 1 / -1;
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

        @media (max-width: 640px) {
          .perfil-layout {
            min-height: 100dvh;
            overflow-x: clip;
          }

          .perfil-page {
            width: 100%;
            padding-bottom: 28px;
          }

          .perfil-topbar {
            height: auto;
            min-height: 0;
            align-items: stretch;
            flex-direction: column;
            gap: 12px;
            padding: 12px 16px;
          }

          .marca {
            min-width: 0;
            gap: 9px;
          }

          .marca-logo {
            width: 36px;
            height: 36px;
            flex: 0 0 36px;
          }

          .marca > span {
            min-width: 0;
            font-size: 13px;
            line-height: 1.3;
          }

          .perfil-topbar-actions {
            width: 100%;
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px !important;
          }

          .perfil-topbar-actions .volver {
            min-width: 0;
            min-height: 40px;
            padding: 8px 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 11.5px;
            line-height: 1.25;
            overflow-wrap: anywhere;
          }

          .perfil-container {
            width: min(calc(100% - 24px), 560px);
            margin: 14px auto 0;
          }

          .hero {
            padding: 18px 16px;
            border-radius: 20px;
          }

          .hero-badge {
            max-width: 100%;
            margin-bottom: 14px;
            padding: 6px 10px;
            font-size: 9.5px;
            letter-spacing: .6px;
          }

          .hero-main {
            display: grid;
            grid-template-columns: 76px minmax(0, 1fr);
            align-items: start;
            gap: 12px;
          }

          .hero-identity {
            min-width: 0;
          }

          .avatar-grande {
            width: 68px;
            height: 68px;
            border-radius: 20px;
            font-size: 28px;
          }

          .hero h1 {
            margin: 0 0 4px;
            font-size: clamp(21px, 6vw, 28px);
            line-height: 1.15;
            overflow-wrap: anywhere;
          }

          .hero-oficio {
            margin-bottom: 9px;
            font-size: 13px;
            line-height: 1.4;
            overflow-wrap: anywhere;
          }

          .hero-identity > div[style] {
            gap: 6px !important;
          }

          .hero-meta {
            grid-column: 1 / -1;
            min-width: 0;
            gap: 7px;
            font-size: 11px;
          }

          .meta-pill {
            max-width: 100%;
            padding: 6px 9px;
            border-radius: 12px;
            overflow-wrap: anywhere;
          }

          .hero-meta select {
            max-width: 100%;
            white-space: normal;
          }

          .hero-actions {
            grid-column: 1 / -1;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .hero-actions .btn {
            min-width: 0;
            min-height: 42px;
            padding: 9px 8px;
            font-size: 11px;
            line-height: 1.25;
          }

          .stats {
            gap: 8px;
            margin-top: 16px;
          }

          .stat {
            min-width: 0;
            padding: 11px 9px;
            border-radius: 13px;
          }

          .stat strong {
            font-size: 19px;
          }

          .stat span {
            display: block;
            font-size: 9px;
            letter-spacing: .35px;
            line-height: 1.3;
          }

          .completitud {
            padding: 12px;
          }

          .completitud-top {
            gap: 8px;
            font-size: 11px;
          }

          .contenido {
            margin-top: 14px;
            gap: 12px;
          }

          .tabs {
            flex-wrap: nowrap;
            gap: 6px;
            padding: 6px;
            overflow-x: auto;
            overscroll-behavior-x: contain;
            scrollbar-width: thin;
            border-radius: 14px;
          }

          .tab {
            flex: 0 0 auto;
            min-height: 40px;
            padding: 9px 12px;
            font-size: 12px;
            white-space: nowrap;
          }

          .card {
            min-width: 0;
            padding: 16px;
            border-radius: 17px;
          }

          .section-title {
            align-items: stretch;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 14px;
          }

          .section-title h2 {
            font-size: 18px;
            line-height: 1.3;
          }

          .section-title p {
            font-size: 12px;
            line-height: 1.45;
          }

          .section-title > .btn,
          .section-title > button {
            width: 100%;
            min-height: 42px;
          }

          .sobre-grid,
          .grid-items,
          .portfolio-grid,
          .form-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 10px;
          }

          .item,
          .portfolio {
            min-width: 0;
          }

          .item {
            padding: 14px;
          }

          .item h3,
          .item p,
          .portfolio-body h3,
          .portfolio-body p,
          .descripcion {
            overflow-wrap: anywhere;
          }

          .info-row {
            flex-direction: column;
            gap: 3px;
            font-size: 12px;
          }

          .info-row strong {
            text-align: left;
            overflow-wrap: anywhere;
          }

          .form-card {
            padding: 14px;
          }

          .acciones {
            flex-direction: column-reverse;
            gap: 8px;
          }

          .acciones > .btn {
            width: 100%;
            min-height: 42px;
          }

          .modal-fondo {
            padding: 10px;
          }

          .modal {
            max-height: 94dvh;
            padding: 17px;
            border-radius: 18px;
          }

          .modal-header h3 {
            max-width: calc(100% - 44px);
            font-size: 17px;
          }

          .empty {
            padding: 24px 12px;
            font-size: 13px;
          }
        }

        @media (max-width: 380px) {
          .perfil-container {
            width: calc(100% - 18px);
          }

          .perfil-topbar {
            padding-right: 10px;
            padding-left: 10px;
          }

          .hero {
            padding: 15px 12px;
          }

          .hero-main {
            grid-template-columns: 64px minmax(0, 1fr);
            gap: 8px;
          }

          .avatar-grande {
            width: 58px;
            height: 58px;
            border-radius: 17px;
          }

          .hero-actions {
            grid-template-columns: 1fr;
          }

          .card {
            padding: 13px;
          }
        }
      `}</style>

      {/* BARRA LATERAL DE FUNCIONALIDADES EN PERFIL */}
      <aside className={`perfil-sidebar ${sidebarAbierto ? "" : "contraido"}`}>
        <div
          style={{
            padding: sidebarAbierto ? "20px 18px" : "16px 8px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarAbierto ? "space-between" : "center",
            width: "100%"
          }}
        >
          {sidebarAbierto && (
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #0d9488, #2563eb)",
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800
                }}
              >
                PS
              </div>
              <div>
                <strong style={{ fontSize: 15, display: "block", color: "#0f172a" }}>Plataforma</strong>
                <span style={{ fontSize: 10.5, color: "#0d9488", fontWeight: 700 }}>MENÚ LATERAL</span>
              </div>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            title={sidebarAbierto ? "Contraer menú lateral" : "Abrir menú lateral"}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px solid #ccfbf1",
              background: "#f0fdfa",
              color: "#0f766e",
              cursor: "pointer",
              fontWeight: 800
            }}
          >
            {sidebarAbierto ? "◀" : "☰"}
          </button>
        </div>

        <div style={{ padding: sidebarAbierto ? "14px 12px" : "12px 6px", display: "flex", flexDirection: "column", gap: 5, flex: 1, width: "100%" }}>
          {sidebarAbierto && (
            <div style={{ fontSize: 10.5, fontWeight: 800, color: "#94a3b8", padding: "4px 10px", textTransform: "uppercase" }}>
              Ir a Funciones
            </div>
          )}

          {[
            { icon: "🏠", label: "Pantalla Principal", action: () => navigate("/") },
            { icon: "📰", label: "Ver Trabajos / Muro", action: () => navigate("/?sec=publicaciones") },
            { icon: "🔍", label: "Buscar Servicios", action: () => navigate("/?sec=buscar") },
            { icon: "🛠️", label: "Rubros y Oficios", action: () => navigate("/?sec=servicios") },
            { icon: "💬", label: "Mensajes & Chat", action: () => navigate("/mensajes") }
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={item.action}
              title={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarAbierto ? "flex-start" : "center",
                gap: 10,
                padding: sidebarAbierto ? "10px 14px" : "10px",
                borderRadius: 10,
                border: "none",
                background: "transparent",
                color: "#334155",
                fontWeight: 600,
                fontSize: 13.5,
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              {sidebarAbierto && <span>{item.label}</span>}
            </button>
          ))}

          {sidebarAbierto && (
            <div style={{ fontSize: 10.5, fontWeight: 800, color: "#94a3b8", padding: "12px 10px 4px", textTransform: "uppercase" }}>
              Secciones de Perfil
            </div>
          )}

          {[
            { id: "resumen", icon: "📋", label: "Resumen General" },
            { id: "servicios", icon: "🛠️", label: "Mis Servicios" },
            { id: "experiencia", icon: "💼", label: "Experiencia" },
            { id: "portafolio", icon: "🖼️", label: "Portafolio" },
            { id: "reputacion", icon: "⭐", label: "Estrellas (1 al 5)" }
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setPestana(sec.id)}
              title={sec.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarAbierto ? "flex-start" : "center",
                gap: 10,
                padding: sidebarAbierto ? "10px 14px" : "10px",
                borderRadius: 10,
                border: "none",
                background: pestana === sec.id ? "linear-gradient(135deg, #f0fdfa, #e0f2fe)" : "transparent",
                color: pestana === sec.id ? "#0f766e" : "#475569",
                fontWeight: pestana === sec.id ? 800 : 600,
                fontSize: 13.5,
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <span style={{ fontSize: 17 }}>{sec.icon}</span>
              {sidebarAbierto && <span>{sec.label}</span>}
            </button>
          ))}
        </div>

        <div style={{ padding: 14, borderTop: "1px solid #f1f5f9", width: "100%" }}>
          <button
            type="button"
            onClick={cerrarSesion}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 10,
              border: "none",
              background: "#fee2e2",
              color: "#b91c1c",
              fontWeight: 700,
              fontSize: 12.5,
              cursor: "pointer"
            }}
          >
            🚪 {sidebarAbierto ? "Cerrar sesión" : ""}
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL DEL PERFIL */}
      <div className="perfil-page">
        <header className="perfil-topbar">
          <div className="marca">
            <div className="marca-logo">PS</div>
            <span>
              {autorVisitado
                ? `Perfil Profesional de ${autorVisitado}`
                : "Mi Perfil Profesional & Valoraciones"}
            </span>
          </div>

          <div className="perfil-topbar-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              onClick={toggleTema}
              className="volver"
              style={{ cursor: "pointer" }}
              title={tema === "dark" ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
            >
              {tema === "dark" ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
            </button>

            {autorVisitado && (
              <Link to="/perfil" className="volver">
                👤 Ver Mi Propio Perfil
              </Link>
            )}

            <Link to="/" className="volver">
              ← Volver al Panel Principal
            </Link>
          </div>
        </header>

        <main className="perfil-container">
          <section className="hero">
            <div className="hero-badge">
              ✦ PERFIL PROFESIONAL VERIFICADO
            </div>

            <div className="hero-main">
              <Avatar
                nombre={nombreMostrado}
                foto={autorVisitado ? "" : perfil.fotoPerfil}
                grande
                onSubirFoto={!autorVisitado ? manejarSubirFotoPerfil : undefined}
              />

              <div className="hero-identity">
                <h1>{nombreMostrado}</h1>

                <div className="hero-oficio">
                  {texto(perfil.oficio, "Profesional independiente")}
                </div>

                {/* Insignias de Confianza y Reputación */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  <span
                    style={{
                      background: "rgba(16, 185, 129, 0.25)",
                      border: "1px solid rgba(110, 231, 183, 0.6)",
                      color: "#d1fae5",
                      borderRadius: 999,
                      padding: "4px 10px",
                      fontSize: 11.5,
                      fontWeight: 800
                    }}
                  >
                    🛡️ Identidad Verificada
                  </span>
                  <span
                    style={{
                      background: "rgba(253, 224, 71, 0.22)",
                      border: "1px solid rgba(253, 224, 71, 0.6)",
                      color: "#fde047",
                      borderRadius: 999,
                      padding: "4px 10px",
                      fontSize: 11.5,
                      fontWeight: 800
                    }}
                  >
                    ⭐ Calificación {promedioActual}/5.0
                  </span>
                  <span
                    style={{
                      background: "rgba(56, 189, 248, 0.22)",
                      border: "1px solid rgba(125, 211, 252, 0.55)",
                      color: "#e0f2fe",
                      borderRadius: 999,
                      padding: "4px 10px",
                      fontSize: 11.5,
                      fontWeight: 800
                    }}
                  >
                    ⚡ Respuesta Rápida
                  </span>
                </div>

              </div>

              <div className="hero-meta">
                  <span className="meta-pill">
                    ✉ {texto(usuario?.email)}
                  </span>

                  <span className="meta-pill">
                    📍 {texto(perfil.zonaTrabajo, "Zona de trabajo no definida")}
                  </span>

                  {!autorVisitado ? (
                    <select
                      value={estadoVivo}
                      onChange={(e) => cambiarEstadoVivo(e.target.value)}
                      title="Cambiá tu estado en vivo para tus clientes"
                      style={{
                        background: "rgba(16, 185, 129, 0.28)",
                        border: "1px solid rgba(110, 231, 183, 0.65)",
                        color: "white",
                        borderRadius: 999,
                        padding: "6px 12px",
                        fontSize: 12.5,
                        fontWeight: 800,
                        cursor: "pointer",
                        outline: "none"
                      }}
                    >
                      <option value="🟢 Disponible para trabajar hoy" style={{ color: "#0f172a" }}>
                        🟢 Disponible para trabajar hoy
                      </option>
                      <option value="⚡ Atendiendo urgencias 24 hs" style={{ color: "#0f172a" }}>
                        ⚡ Atendiendo urgencias 24 hs
                      </option>
                      <option value="📅 Agenda abierta esta semana" style={{ color: "#0f172a" }}>
                        📅 Agenda abierta esta semana
                      </option>
                      <option value="🔴 Ocupado temporalmente" style={{ color: "#0f172a" }}>
                        🔴 Ocupado temporalmente
                      </option>
                    </select>
                  ) : (
                    <span className="meta-pill disponible">{estadoVivo}</span>
                  )}

                  <span
                    className="meta-pill"
                    style={{
                      background: "rgba(254, 243, 199, 0.22)",
                      borderColor: "rgba(253, 224, 71, 0.6)",
                      color: "#fde047",
                      cursor: "pointer"
                    }}
                    onClick={() => setPestana("reputacion")}
                    title="Hacé clic para valorar con estrellas del 1 al 5"
                  >
                    <EstrellasVisuales valor={promedioActual} tamano={15} />
                    <strong>{promedioActual} / 5.0</strong> ({resenas.length})
                  </span>
                </div>

              <div className="hero-actions">
                <button
                  className="btn btn-gold"
                  onClick={() => setPestana("reputacion")}
                >
                  ⭐ Valorar (1 a 5 ★)
                </button>

                {!autorVisitado && (
                  <button
                    className="btn btn-light"
                    onClick={() => {
                      setEditando(true);
                      setTimeout(() => {
                        document.getElementById("seccion-editar-perfil")?.scrollIntoView({ behavior: "smooth" });
                      }, 80);
                    }}
                  >
                    ✎ Editar perfil y foto
                  </button>
                )}

                <button
                  className="btn btn-outline"
                  onClick={() => setMostrarTarjetaDigital(true)}
                  title="Ver y compartir tarjeta profesional digital"
                >
                  🪪 Compartir Tarjeta
                </button>

                <button
                  className="btn btn-outline"
                  onClick={() =>
                    navigate("/mensajes", {
                      state: autorVisitado ? { receptor: autorVisitado } : undefined
                    })
                  }
                >
                  💬 {autorVisitado ? `Chatear con ${autorVisitado}` : "Mensajes"}
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

              <div className="stat" style={{ cursor: "pointer" }} onClick={() => setPestana("reputacion")}>
                <strong style={{ color: "#fde047" }}>★ {promedioActual}</strong>
                <span>Calificación (1-5 ★)</span>
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
                📋 Resumen
              </button>

              <button
                className={`tab ${pestana === "servicios" ? "activo" : ""}`}
                onClick={() => setPestana("servicios")}
              >
                🛠️ Servicios
              </button>

              <button
                className={`tab ${pestana === "experiencia" ? "activo" : ""}`}
                onClick={() => setPestana("experiencia")}
              >
                💼 Experiencia
              </button>

              <button
                className={`tab ${pestana === "portafolio" ? "activo" : ""}`}
                onClick={() => setPestana("portafolio")}
              >
                🖼️ Portafolio
              </button>

              <button
                className={`tab ${pestana === "publicaciones" ? "activo" : ""}`}
                onClick={() => setPestana("publicaciones")}
              >
                📰 Publicaciones ({publicacionesUsuario.length})
              </button>

              <button
                className={`tab ${pestana === "reputacion" ? "activo" : ""}`}
                onClick={() => setPestana("reputacion")}
              >
                ⭐ Valorar con Estrellas (1 a 5)
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
                        <h2>Información y Calificación</h2>
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
                        <span>Valoración</span>
                        <strong style={{ color: "#d97706" }}>
                          ★ {promedioActual} / 5.0 ({resenas.length} votos)
                        </strong>
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

            {/* PESTAÑA DE REPUTACIÓN Y VALORACIÓN CON ESTRELLAS DEL 1 AL 5 */}
            {pestana === "reputacion" && (
              <section className="card">
                <div className="section-title">
                  <div>
                    <h2>⭐ Valoración y Reputación Profesional (1 a 5 Estrellas)</h2>
                    <p>Calificá el desempeño profesional eligiendo de 1 a 5 estrellas.</p>
                  </div>
                </div>

                <div className="sobre-grid" style={{ marginBottom: 24 }}>
                  {/* Resumen numérico y estrellas */}
                  <div
                    className="card"
                    style={{
                      background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                      borderColor: "#fde68a",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <div style={{ fontSize: 54, fontWeight: 900, color: "#d97706", lineHeight: 1 }}>
                      {promedioActual}
                    </div>
                    <div style={{ margin: "10px 0" }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          style={{
                            fontSize: 28,
                            color: n <= Math.round(Number(promedioActual)) ? "#f59e0b" : "#cbd5e1"
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <strong style={{ color: "#92400e", fontSize: 14 }}>
                      Basado en {resenas.length} {resenas.length === 1 ? "valoración" : "valoraciones"}
                    </strong>
                  </div>

                  {/* Formulario interactivo para valorar del 1 al 5 */}
                  <form
                    onSubmit={enviarValoracionEstrellas}
                    className="card"
                    style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}
                  >
                    <h3 style={{ margin: "0 0 8px", color: "#0f172a", fontSize: 17 }}>
                      Calificar con Estrellas (del 1 al 5)
                    </h3>
                    <p style={{ margin: "0 0 14px", fontSize: 13, color: "#64748b" }}>
                      Seleccioná la cantidad de estrellas según tu conformidad:
                    </p>

                    {/* Botones de 1 a 5 estrellas */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 14,
                        padding: "10px 14px",
                        background: "white",
                        borderRadius: 14,
                        border: "1px solid #fde68a"
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((estrella) => {
                        const activa = (estrellaHover || estrellasSeleccionadas) >= estrella;
                        return (
                          <button
                            key={estrella}
                            type="button"
                            onMouseEnter={() => setEstrellaHover(estrella)}
                            onMouseLeave={() => setEstrellaHover(0)}
                            onClick={() => setEstrellasSeleccionadas(estrella)}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              fontSize: 32,
                              lineHeight: 1,
                              color: activa ? "#f59e0b" : "#cbd5e1",
                              transform:
                                (estrellaHover || estrellasSeleccionadas) === estrella
                                  ? "scale(1.18)"
                                  : "scale(1)",
                              transition: "all 0.15s ease"
                            }}
                            title={TEXTOS_ESTRELLAS[estrella]}
                          >
                            ★
                          </button>
                        );
                      })}
                      <span style={{ marginLeft: 8, fontWeight: 800, color: "#b45309", fontSize: 13.5 }}>
                        {TEXTOS_ESTRELLAS[estrellaHover || estrellasSeleccionadas]}
                      </span>
                    </div>

                    <div style={{ display: "grid", gap: 10 }}>
                      <input
                        type="text"
                        value={autorResena}
                        onChange={(e) => setAutorResena(e.target.value)}
                        placeholder="Tu nombre"
                        style={{
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: "1px solid #cbd5e1",
                          fontSize: 13.5
                        }}
                      />
                      <textarea
                        rows="2"
                        value={comentarioResena}
                        onChange={(e) => setComentarioResena(e.target.value)}
                        placeholder="Escribí un comentario sobre la atención o el trabajo realizado..."
                        style={{
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: "1px solid #cbd5e1",
                          fontSize: 13.5,
                          resize: "vertical"
                        }}
                      />
                      <button type="submit" className="btn btn-gold" style={{ width: "100%" }}>
                        ⭐ Enviar Valoración de {estrellasSeleccionadas}{" "}
                        {estrellasSeleccionadas === 1 ? "Estrella" : "Estrellas"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Lista de reseñas con sus estrellas */}
                <h3 style={{ margin: "0 0 14px", fontSize: 17, color: "#0f172a" }}>
                  Opiniones y calificaciones recibidas
                </h3>
                <div className="grid-items">
                  {resenas.map((r) => (
                    <div key={r.id} className="item" style={{ background: "white" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <strong>{r.autor}</strong>
                        <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 15 }}>
                          {"★".repeat(Number(r.estrellas || 5))}
                          <span style={{ color: "#cbd5e1" }}>
                            {"★".repeat(5 - Number(r.estrellas || 5))}
                          </span>{" "}
                          ({r.estrellas}/5)
                        </span>
                      </div>
                      <p style={{ margin: "4px 0 6px" }}>{r.comentario}</p>
                      <small>{r.fecha}</small>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {pestana === "publicaciones" && (
              <section className="card">
                <div className="section-title">
                  <div>
                    <h2>📰 Avisos y Trabajos Publicados por {nombreMostrado}</h2>
                    <p>Publicaciones activas en el muro de la comunidad.</p>
                  </div>

                  <button
                    className="btn btn-blue"
                    onClick={() => navigate("/?sec=publicaciones&publicar=1")}
                  >
                    + Crear nueva publicación
                  </button>
                </div>

                {publicacionesUsuario.length === 0 ? (
                  <div className="empty">
                    <strong>Todavía no hay publicaciones activas en el muro.</strong>
                    Publicá un aviso ofreciendo tu oficio o buscando un especialista.
                  </div>
                ) : (
                  <div className="grid-items">
                    {publicacionesUsuario.map((pub) => (
                      <div key={pub.id} className="item">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span className="skill" style={{ padding: "4px 10px", fontSize: 11 }}>
                            {pub.tipo || "Servicio"}
                          </span>
                          <small>📍 {pub.ubicacion || "Zona local"}</small>
                        </div>
                        <p style={{ margin: "8px 0 12px" }}>{pub.contenido}</p>
                        {pub.imagenBase64 && (
                          <img
                            src={pub.imagenBase64}
                            alt="Publicación"
                            onClick={() => setImagenFullscreen(pub.imagenBase64)}
                            style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10, cursor: "zoom-in", marginBottom: 8 }}
                          />
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <small>❤️ {pub.interesados || 0} interesados</small>
                          <button
                            type="button"
                            className="btn btn-blue"
                            style={{ padding: "6px 12px", fontSize: 12 }}
                            onClick={() => navigate("/?sec=publicaciones")}
                          >
                            Ver en el Muro →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {editando && (
              <section id="seccion-editar-perfil" className="card">
                <div className="section-title">
                  <div>
                    <h2>✎ Editar perfil y foto profesional</h2>
                    <p>Subí tu foto de perfil desde tu dispositivo o elegí un avatar y completá tu información.</p>
                  </div>
                </div>

                {/* BLOQUE DESTACADO PARA SUBIR O CAMBIAR FOTO DE PERFIL */}
                <div
                  style={{
                    background: "var(--surface-soft)",
                    border: "1px solid var(--border)",
                    borderRadius: 18,
                    padding: 20,
                    marginBottom: 20,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 20
                  }}
                >
                  <Avatar nombre={nombreMostrado} foto={perfil.fotoPerfil} grande />

                  <div style={{ flex: 1, minWidth: 260 }}>
                    <h3 style={{ margin: "0 0 6px", fontSize: 16, color: "var(--text)" }}>
                      📷 Foto de Perfil Profesional
                    </h3>
                    <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--text-secondary)" }}>
                      Podés subir una foto desde tu computadora o celular, pegar un enlace o elegir un avatar rápido:
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                      <input
                        ref={fotoInputEditRef}
                        type="file"
                        accept="image/*"
                        onChange={manejarSubirFotoPerfil}
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        className="btn btn-blue"
                        onClick={() => fotoInputEditRef.current?.click()}
                      >
                        📷 Subir foto desde mi dispositivo
                      </button>

                      {perfil.fotoPerfil && (
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => actualizar("fotoPerfil", "")}
                        >
                          🗑️ Quitar foto
                        </button>
                      )}
                    </div>

                    {/* Avatares prediseñados de 1 clic */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>
                        O elegí un avatar rápido:
                      </span>
                      {AVATARES_PREDEFINIDOS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => actualizar("fotoPerfil", av.url)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "5px 10px",
                            borderRadius: 999,
                            border: perfil.fotoPerfil === av.url ? "2px solid var(--primary)" : "1px solid var(--border)",
                            background: "var(--surface-card)",
                            color: "var(--text)",
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          <img src={av.url} alt={av.label} style={{ width: 20, height: 20, borderRadius: "50%" }} />
                          <span>{av.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-grid">
                  <Campo
                    label="Oficio o profesión"
                    value={perfil.oficio}
                    onChange={(v) => actualizar("oficio", v)}
                    placeholder="Ej.: Electricista matriculado"
                  />

                  <Campo
                    label="Zona de trabajo"
                    value={perfil.zonaTrabajo}
                    onChange={(v) => actualizar("zonaTrabajo", v)}
                    placeholder="Ej.: Cruz del Eje y alrededores"
                  />

                  <Campo
                    label="URL de Foto de perfil (opcional si subiste archivo)"
                    value={perfil.fotoPerfil?.startsWith("data:") ? "" : perfil.fotoPerfil}
                    onChange={(v) => actualizar("fotoPerfil", v)}
                    placeholder="https://... (o usá el botón Subir foto arriba)"
                  />

                  <Campo
                    label="Horarios de atención"
                    value={perfil.horarios}
                    onChange={(v) => actualizar("horarios", v)}
                    placeholder="Ej.: Lunes a sábado, 8 a 18 hs · Urgencias 24 hs"
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
                    onClick={() => guardarPerfil()}
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
            <div style={{ marginBottom: 14, padding: 14, borderRadius: 14, background: "var(--surface-soft)", border: "1px solid var(--border)" }}>
              <input
                ref={portfolioFileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const base64 = await comprimirImagenBase64(file, 700);
                    setNuevoPortfolio((prev) => ({ ...prev, imagenUrl: base64 }));
                  } catch {
                    // ignore
                  }
                }}
              />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <strong style={{ display: "block", fontSize: 13.5, color: "var(--text)" }}>
                    📷 Fotografía del trabajo realizado
                  </strong>
                  <small style={{ color: "var(--text-muted)" }}>
                    Subí una foto desde tu PC/celular o pegá un enlace abajo
                  </small>
                </div>
                <button
                  type="button"
                  className="btn btn-blue"
                  onClick={() => portfolioFileRef.current?.click()}
                >
                  📷 Subir foto desde mi dispositivo
                </button>
              </div>
              {nuevoPortfolio.imagenUrl && (
                <div style={{ marginTop: 10 }}>
                  <img
                    src={nuevoPortfolio.imagenUrl}
                    alt="Previsualización portafolio"
                    style={{ maxHeight: 140, borderRadius: 10, border: "1px solid var(--border)" }}
                  />
                </div>
              )}
            </div>

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
                label="URL de imagen (opcional si subiste foto)"
                value={nuevoPortfolio.imagenUrl?.startsWith("data:") ? "" : nuevoPortfolio.imagenUrl}
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

        {mostrarTarjetaDigital && (
          <Modal
            titulo="🪪 Tarjeta Profesional Digital Compartible"
            cerrar={() => setMostrarTarjetaDigital(false)}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #0f766e 0%, #0369a1 55%, #1d4ed8 100%)",
                color: "white",
                borderRadius: 20,
                padding: 24,
                textAlign: "center",
                boxShadow: "0 16px 40px rgba(13, 148, 136, 0.3)",
                marginBottom: 18
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <Avatar nombre={nombreMostrado} foto={perfil.fotoPerfil} grande />
              </div>
              <h2 style={{ margin: "0 0 4px", fontSize: 22 }}>{nombreMostrado}</h2>
              <p style={{ margin: "0 0 10px", color: "#ccfbf1", fontWeight: 700 }}>
                {texto(perfil.oficio, "Especialista Verificado")}
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.22)", padding: "5px 14px", borderRadius: 999, fontSize: 13, fontWeight: 800, color: "#fde047", marginBottom: 12 }}>
                ★ {promedioActual} / 5.0 · {resenas.length} reseñas verificadas
              </div>
              <p style={{ fontSize: 13, color: "#f0fdfa", margin: "0 0 10px" }}>
                📍 {texto(perfil.zonaTrabajo, "Atención a domicilio")} · {estadoVivo}
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn btn-blue"
                onClick={() => {
                  const url = `${window.location.origin}/perfil?autor=${encodeURIComponent(nombreMostrado)}`;
                  navigator.clipboard?.writeText(url);
                  setMensaje("🔗 ¡Enlace de tu perfil copiado al portapapeles!");
                  setMostrarTarjetaDigital(false);
                }}
              >
                🔗 Copiar enlace de mi Perfil
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Hola, te comparto mi Perfil Profesional de ${texto(perfil.oficio, "Servicios")} (${nombreMostrado} - Calificación ★ ${promedioActual}/5.0): ${window.location.origin}/perfil?autor=${encodeURIComponent(nombreMostrado)}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold"
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
              >
                📲 Compartir por WhatsApp
              </a>
            </div>
          </Modal>
        )}

        {imagenFullscreen && (
          <div
            onClick={() => setImagenFullscreen(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(9, 13, 22, 0.88)",
              backdropFilter: "blur(8px)",
              display: "grid",
              placeItems: "center",
              padding: 24,
              cursor: "zoom-out"
            }}
          >
            <img
              src={imagenFullscreen}
              alt="Vista ampliada"
              style={{ maxWidth: "90vw", maxHeight: "86vh", borderRadius: 16 }}
            />
          </div>
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
    </div>
  );
}
