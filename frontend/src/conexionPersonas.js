const API = "/api";

export async function obtenerPublicaciones() {
    const respuesta = await fetch(`${API}/publicaciones`);

    if (!respuesta.ok) {
        throw new Error(`Error obteniendo publicaciones: ${respuesta.status}`);
    }

    return await respuesta.json();
}

export async function crearPublicacion(publicacion) {
    const respuesta = await fetch(`${API}/publicaciones`, {
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
    const respuesta = await fetch(`${API}/intereses`, {
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
    const respuesta = await fetch(
        `${API}/intereses/publicacion/${publicacionId}`
    );

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    return await respuesta.json();
}

export async function obtenerCantidadInteresados(publicacionId) {
    const respuesta = await fetch(
        `${API}/intereses/publicacion/${publicacionId}/cantidad`
    );

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    return await respuesta.json();
}

export async function obtenerComentarios(publicacionId) {
    const respuesta = await fetch(
        `${API}/comentarios/publicacion/${publicacionId}`
    );

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    return await respuesta.json();
}

export async function crearComentario(publicacionId, autor, contenido) {
    const respuesta = await fetch(`${API}/comentarios`, {
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

    const respuesta = await fetch(
        `${API}/mensajes/conversacion?${parametros}`
    );

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    return await respuesta.json();
}

export async function enviarMensaje(emisor, receptor, contenido) {
    const respuesta = await fetch(`${API}/mensajes`, {
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
