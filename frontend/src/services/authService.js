// services/authService.js
// RNF3 — Autenticación
// Conectado al auth-service (http://localhost:3005).

const AUTH_URL = "http://localhost:3005";

async function post(path, body) {
  const res = await fetch(`${AUTH_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // El backend manda { error: "..." }; lo propagamos para mostrarlo en la UI.
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data;
}

export const authService = {
  // POST /auth/registro → { token, usuario }
  registro({ nombre, email, password, idioma }) {
    return post("/auth/registro", { nombre, email, password, idioma });
  },

  // POST /auth/login → { token }
  login({ email, password }) {
    return post("/auth/login", { email, password });
  },
};
