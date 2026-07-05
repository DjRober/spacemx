// services/reportsService.js
// RF6 — Mis Reportes Espaciales
// Conectado al reports-service (http://localhost:3006/reportes).
// Manda el header Authorization: Bearer <token> en cada petición.

const SERVICIO_URL = "http://localhost:3006/reportes";

function headers(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const reportsService = {
  // GET /reportes — lista los reportes del usuario autenticado
  async listar(token) {
    const res = await fetch(SERVICIO_URL, { headers: headers(token) });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  },

  // POST /reportes — crea una observación
  async crear(token, datos) {
    const res = await fetch(SERVICIO_URL, {
      method: "POST",
      headers: headers(token),
      body: JSON.stringify(datos),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}`);
    }
    return res.json();
  },

  // PUT /reportes/:id — actualiza un reporte propio
  async actualizar(token, id, datos) {
    const res = await fetch(`${SERVICIO_URL}/${id}`, {
      method: "PUT",
      headers: headers(token),
      body: JSON.stringify(datos),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}`);
    }
    return res.json();
  },

  // DELETE /reportes/:id — elimina un reporte propio
  async eliminar(token, id) {
    const res = await fetch(`${SERVICIO_URL}/${id}`, {
      method: "DELETE",
      headers: headers(token),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}`);
    }
  },
};
