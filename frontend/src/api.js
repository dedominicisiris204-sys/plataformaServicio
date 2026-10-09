const API = "/api";

export async function registrarUsuario(usuario) {
    const respuesta = await fetch(`${API}/usuarios`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "text/plain, application/json"
        },
        body: JSON.stringify({
            nombre: usuario.nombre,
            email: usuario.email,
            password: usuario.password
        })
    });

    const texto = await respuesta.text();

    if (!respuesta.ok) {
        throw new Error(texto || `Error HTTP ${respuesta.status}`);
    }

    return {
        ok: true,
        mensaje: texto
    };
}

export async function iniciarSesion(email, password) {
    const respuesta = await fetch(`${API}/usuarios/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const texto = await respuesta.text();

    if (!respuesta.ok) {
        throw new Error(texto || "Correo o contraseña incorrectos");
    }

    let datos;

    try {
        datos = JSON.parse(texto);
    } catch {
        datos = {
            mensaje: texto
        };
    }

    localStorage.setItem("usuarioSesion", JSON.stringify(datos));

    return datos;
}

export function obtenerUsuarioSesion() {
    try {
        return JSON.parse(localStorage.getItem("usuarioSesion"));
    } catch {
        return null;
    }
}

export function cerrarSesion() {
    localStorage.removeItem("usuarioSesion");
}

export async function obtenerUsuarios() {
    const respuesta = await fetch(`${API}/usuarios`);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    return await respuesta.json();
}
