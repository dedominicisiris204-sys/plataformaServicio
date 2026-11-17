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

export async function actualizarPublicacion(id, publicacion) {
    const respuesta = await fetch(`${API}/publicaciones/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(publicacion)
    });

    if (!respuesta.ok) {
        const texto = await respuesta.text().catch(() => "");
        throw new Error(texto || `Error HTTP ${respuesta.status}`);
    }

    return await respuesta.json();
}

export async function eliminarPublicacion(id) {
    const respuesta = await fetch(`${API}/publicaciones/${id}`, {
        method: "DELETE"
    });

    if (!respuesta.ok) {
        const texto = await respuesta.text().catch(() => "");
        throw new Error(texto || `Error HTTP ${respuesta.status}`);
    }

    return true;
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

export async function crearComentario(publicacionId, autor, contenido, comentarioPadreId = null) {
    const payload = {
        publicacionId,
        autor,
        contenido
    };

    if (comentarioPadreId != null) {
        payload.comentarioPadreId = comentarioPadreId;
    }

    const respuesta = await fetch(`${API}/comentarios`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const texto = await respuesta.text();

    if (!respuesta.ok) {
        throw new Error(texto || `Error HTTP ${respuesta.status}`);
    }

    return JSON.parse(texto);
}

export async function eliminarComentario(id) {
    const respuesta = await fetch(`${API}/comentarios/${id}`, {
        method: "DELETE"
    });

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    return true;
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

export async function obtenerTodosLosMensajes() {
    const respuesta = await fetch(`${API}/mensajes`);
    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }
    return await respuesta.json();
}

export async function eliminarMensaje(id) {
    const respuesta = await fetch(`${API}/mensajes/${id}`, {
        method: "DELETE"
    });
    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }
    return true;
}

export async function obtenerUsuarios() {
    const respuesta = await fetch(`${API}/usuarios`);
    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }
    return await respuesta.json();
}
