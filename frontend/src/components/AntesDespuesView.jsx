import React, { useState } from "react";

export default function AntesDespuesView() {
  const [rubroFiltro, setRubroFiltro] = useState("Todos");
  const [sliderPos, setSliderPos] = useState(50); // Porcentaje 0 a 100
  const [proyectoActivoId, setProyectoActivoId] = useState(1);
  const [modalSubir, setModalSubir] = useState(false);

  const proyectos = [
    {
      id: 1,
      titulo: "Remodelación Integral de Baño y Cañerías",
      rubro: "Plomería",
      profesional: "Juan Pérez · Matrícula N° 8492",
      ubicacion: "Cruz del Eje",
      duracion: "4 días",
      descripcion: "Reemplazo de caños de plomo antiguos por sistema termofusión de alta presión, instalación de vanitory flotante y grifería monocomando.",
      antesImg: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      despuesImg: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80",
      calificacion: 5,
      cliente: "Familia Morales"
    },
    {
      id: 2,
      titulo: "Restauración y Pintura Látex en Fachada",
      rubro: "Pintura",
      profesional: "Esteban Rossi · Especialista en Altura",
      ubicacion: "Centro",
      duracion: "3 días",
      descripcion: "Picado de revoque suelto, sellado de fisuras estructurales, fijador al agua y 3 manos de látex impermeabilizante color marfil.",
      antesImg: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
      despuesImg: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      calificacion: 5,
      cliente: "Mariano Ortiz"
    },
    {
      id: 3,
      titulo: "Normalización de Tablero Eléctrico y Térmicas",
      rubro: "Electricidad",
      profesional: "Roberto Gómez · Instalador Electricista Cat. II",
      ubicacion: "Barrio San Martín",
      duracion: "1 día",
      descripcion: "Eliminación de tapones a rosca antiguos con peligro de cortocircuito. Montaje de caja ignífuga, disyuntor bipolar Sica y 5 térmicas sectorizadas.",
      antesImg: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80",
      despuesImg: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
      calificacion: 5,
      cliente: "Distribuidora Norte"
    },
    {
      id: 4,
      titulo: "Bajo Mesada en Melamina y Guías Telescópicas",
      rubro: "Carpintería",
      profesional: "Diego Fernández · Muebles a Medida",
      ubicacion: "Cruz del Eje",
      duracion: "5 días",
      descripcion: "Retiro de mueble desarmado por humedad. Fabricación de estructura antihumedad en melamina 18mm con cantos de aluminio.",
      antesImg: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
      despuesImg: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80",
      calificacion: 5,
      cliente: "Romina Cáceres"
    }
  ];

  const proyectosFiltrados = rubroFiltro === "Todos"
    ? proyectos
    : proyectos.filter(p => p.rubro.toLowerCase() === rubroFiltro.toLowerCase());

  const proyectoSeleccionado = proyectos.find(p => p.id === proyectoActivoId) || proyectos[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Cabecera */}
      <div
        style={{
          background: "var(--surface-card)",
          borderRadius: 16,
          padding: "24px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--text)" }}>
            🖼️ Portafolio Visual: Galería "Antes y Después"
          </h2>
          <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13.5 }}>
            Evidencia fotográfica real de obras y arreglos terminados con clientes verificados.
          </p>
        </div>

        <button
          onClick={() => setModalSubir(true)}
          className="btn-crear-publicacion"
          style={{ padding: "10px 18px", fontSize: 13 }}
        >
          + Subir Trabajo Realizado
        </button>
      </div>

      {/* Visor Interactivo Slider Antes y Después */}
      <div
        style={{
          background: "var(--surface-card)",
          borderRadius: 20,
          border: "1px solid var(--border)",
          padding: "24px",
          boxShadow: "var(--shadow-md)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <span
              style={{
                background: "var(--primary-light)",
                color: "var(--primary)",
                padding: "3px 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 700
              }}
            >
              {proyectoSeleccionado.rubro}
            </span>
            <h3 style={{ margin: "8px 0 4px", fontSize: 18, color: "var(--text)" }}>
              {proyectoSeleccionado.titulo}
            </h3>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Por {proyectoSeleccionado.profesional} · 📍 {proyectoSeleccionado.ubicacion} · Duración: {proyectoSeleccionado.duracion}
            </span>
          </div>

          {/* Selector de modo rápido */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setSliderPos(0)}
              style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: sliderPos === 0 ? "var(--primary)" : "var(--surface-soft)", color: sliderPos === 0 ? "white" : "var(--text)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              Solo Antes
            </button>
            <button
              onClick={() => setSliderPos(50)}
              style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: sliderPos === 50 ? "var(--primary)" : "var(--surface-soft)", color: sliderPos === 50 ? "white" : "var(--text)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              Comparar 50/50
            </button>
            <button
              onClick={() => setSliderPos(100)}
              style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: sliderPos === 100 ? "var(--primary)" : "var(--surface-soft)", color: sliderPos === 100 ? "white" : "var(--text)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              Solo Después
            </button>
          </div>
        </div>

        {/* Contenedor del Slider visual */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "440px",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            background: "#000"
          }}
        >
          {/* Imagen DESPUÉS (Base completa) */}
          <img
            src={proyectoSeleccionado.despuesImg}
            alt="Trabajo Terminado"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 16,
              right: 16,
              background: "rgba(22, 163, 74, 0.9)",
              color: "white",
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 0.5,
              backdropFilter: "blur(4px)"
            }}
          >
            ✓ DESPUÉS (TERMINADO)
          </div>

          {/* Imagen ANTES (Clip por el slider) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${sliderPos}%`,
              height: "100%",
              overflow: "hidden",
              borderRight: "3px solid #ffffff",
              boxShadow: "4px 0 16px rgba(0,0,0,0.4)"
            }}
          >
            <img
              src={proyectoSeleccionado.antesImg}
              alt="Estado Inicial"
              style={{
                width: "1000px",
                maxWidth: "none",
                height: "100%",
                objectFit: "cover"
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                background: "rgba(220, 38, 38, 0.9)",
                color: "white",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 0.5,
                backdropFilter: "blur(4px)"
              }}
            >
              ⚠ ANTES (ESTADO INICIAL)
            </div>
          </div>

          {/* Barra divisoria interactiva */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${sliderPos}%`,
              width: "4px",
              background: "#ffffff",
              cursor: "ew-resize",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--primary)",
                color: "white",
                display: "grid",
                placeItems: "center",
                fontSize: 14,
                boxShadow: "0 0 12px rgba(0,0,0,0.5)",
                border: "2px solid white"
              }}
            >
              ⇄
            </div>
          </div>
        </div>

        {/* Control deslizador */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>Antes</span>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={e => setSliderPos(Number(e.target.value))}
            style={{ flex: 1, accentColor: "var(--primary)", cursor: "pointer" }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>Después</span>
        </div>

        <p style={{ marginTop: 14, color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>
          {proyectoSeleccionado.descripcion}
        </p>
      </div>

      {/* Lista de Trabajos para Seleccionar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", margin: 0 }}>
            Explorar más transformaciones de especialistas
          </h3>
          <div className="feed-filter-bar" style={{ margin: 0 }}>
            {["Todos", "Plomería", "Pintura", "Electricidad", "Carpintería"].map(r => (
              <button
                key={r}
                className={`feed-filter-chip ${rubroFiltro === r ? "active" : ""}`}
                onClick={() => setRubroFiltro(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {proyectosFiltrados.map(p => (
            <div
              key={p.id}
              onClick={() => {
                setProyectoActivoId(p.id);
                setSliderPos(50);
                window.scrollTo({ top: 120, behavior: "smooth" });
              }}
              style={{
                background: "var(--surface-card)",
                border: proyectoActivoId === p.id ? "2px solid var(--primary)" : "1px solid var(--border)",
                borderRadius: 14,
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <div style={{ display: "flex", height: 140 }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <img src={p.antesImg} alt="Antes" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", bottom: 6, left: 6, background: "rgba(0,0,0,0.7)", color: "white", fontSize: 10, padding: "2px 6px", borderRadius: 4 }}>Antes</span>
                </div>
                <div style={{ flex: 1, position: "relative" }}>
                  <img src={p.despuesImg} alt="Después" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(22, 163, 74, 0.85)", color: "white", fontSize: 10, padding: "2px 6px", borderRadius: 4 }}>Después</span>
                </div>
              </div>

              <div style={{ padding: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)" }}>{p.rubro}</span>
                <strong style={{ display: "block", fontSize: 14, color: "var(--text)", margin: "4px 0" }}>{p.titulo}</strong>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.profesional}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Subir Trabajo */}
      {modalSubir && (
        <div className="modal-overlay" onClick={() => setModalSubir(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📸 Subir Obra Realizada (Antes y Después)</h2>
              <button className="btn-close-modal" onClick={() => setModalSubir(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                Sube dos fotos para evidenciar la calidad de tu trabajo: el estado antes de empezar y el resultado final entregado al cliente.
              </p>
              <div className="modal-field">
                <label>Título de la Obra</label>
                <input type="text" placeholder="Ej: Pintura de techos y aislación térmica" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="modal-field">
                  <label>Foto del "Antes"</label>
                  <input type="file" accept="image/*" />
                </div>
                <div className="modal-field">
                  <label>Foto del "Después"</label>
                  <input type="file" accept="image/*" />
                </div>
              </div>
              <div className="modal-field">
                <label>Descripción técnica de lo que se arregló</label>
                <textarea rows={3} placeholder="Menciona qué materiales usaste y qué problemas solucionaste..." />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-modal-cancel" onClick={() => setModalSubir(false)}>Cancelar</button>
              <button type="button" className="btn-modal-submit" onClick={() => { alert("¡Obra subida con éxito a tu portafolio!"); setModalSubir(false); }}>Publicar en Portafolio</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
