export function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  return fetch(url, { ...options, headers });
}

export async function responseMessage(response, fallback = "La solicitud no se pudo completar.") {
  const raw = await response.text().catch(() => "");
  if (!raw) return fallback;
  try {
    const data = JSON.parse(raw);
    return data.mensaje || data.message || Object.values(data.errores || {}).join(" ") || fallback;
  } catch { return raw; }
}
