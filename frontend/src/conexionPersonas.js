import { apiFetch } from "./apiFetch";
const API = "/api";

export async function obtenerPublicaciones({ page = 0, size = 12, categoria, ubicacion, q } = {}) {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (categoria && categoria !== "Todos") params.set("categoria", categoria);
    if (ubicacion && ubicacion !== "Todas") params.set("ubicacion", ubicacion);
    if (q?.trim()) params.set("q", q.trim());
    const respuesta = await apiFetch(`${API}/publicaciones/buscar?${params}`);

    if (!respuesta.ok) {
        throw new Error(`Error obteniendo publicaciones: ${respuesta.status}`);
    }

    const pagina = await respuesta.json();
    return Array.isArray(pagina) ? { content: pagina, last: true, number: 0 } : pagina;
}

export async function crearPublicacion(publicacion) {
    const respuesta = await apiFetch(`${API}/publicaciones`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(publicacion)
    });

    if (!respuesta.ok) {
        const texto = await respuesta.text();
        throw new Error(texto || `Error HTTP ${respuesta.status}`);
    }

    return await respuesta.json();
}

export async function marcarInteres(publicacionId, usuario) {
    const respuesta = await apiFetch(`${API}/intereses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            publicacionId,
            usuario
        })
    });

    const texto = await respuesta.text();

    if (!respuesta.ok) {
        throw new Error(texto || `Error HTTP ${respuesta.status}`);
    }

    return texto ? JSON.parse(texto) : null;
}

export async function obtenerInteresados(publicacionId) {
    const respuesta = await apiFetch(
        `${API}/intereses/publicacion/${publicacionId}`
    );

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    return await respuesta.json();
}

export async function obtenerCantidadInteresados(publicacionId) {
    const respuesta = await apiFetch(
        `${API}/intereses/publicacion/${publicacionId}/cantidad`
    );

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    return await respuesta.json();
}

export async function obtenerComentarios(publicacionId) {
    const respuesta = await apiFetch(
        `${API}/comentarios/publicacion/${publicacionId}`
    );

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    return await respuesta.json();
}

export async function crearComentario(publicacionId, autor, contenido) {
    const respuesta = await apiFetch(`${API}/comentarios`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            publicacionId,
            autor,
            contenido
        })
    });

    const texto = await respuesta.text();

    if (!respuesta.ok) {
        throw new Error(texto || `Error HTTP ${respuesta.status}`);
    }

    return JSON.parse(texto);
}

export async function obtenerConversacion(emisor, receptor) {
    const parametros = new URLSearchParams({
        emisor,
        receptor
    });

    const respuesta = await apiFetch(`${API}/mensajes/conversacion?${parametros}`);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    return await respuesta.json();
}

export async function enviarMensaje(emisor, receptor, contenido) {
    const respuesta = await apiFetch(`${API}/mensajes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emisor,
            receptor,
            contenido
        })
    });

    const texto = await respuesta.text();

    if (!respuesta.ok) {
        throw new Error(texto || `Error HTTP ${respuesta.status}`);
    }

    return JSON.parse(texto);
}

export async function subirImagen(archivo) {
    const form = new FormData();
    form.append("archivo", archivo);
    const respuesta = await apiFetch(`${API}/archivos/subir`, { method: "POST", body: form });
    if (!respuesta.ok) throw new Error(await respuesta.text() || `Error HTTP ${respuesta.status}`);
    const { url } = await respuesta.json();
    return url;
}
