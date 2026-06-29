// apodService.js
// RF1, RF7 — Foto Astronómica del Día
// Por ahora devuelve datos mock. Cuando el backend esté listo,
// reemplazar la función getApod() con un fetch real a GET /apod

const API_URL = "http://localhost:3001/apod";

/**
 * Obtiene la Foto Astronómica del Día.
 * @param {string} [date] - Fecha en formato YYYY-MM-DD. Si se omite, devuelve la del día actual.
 * @returns {Promise<Object>} Datos de la APOD (title, explanation, url, media_type, date, copyright)
 */
export async function getApod(date = null) {
  const url = date ? `${API_URL}?date=${date}` : API_URL;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("No se pudo obtener la foto del dia");
  }

  return await res.json();
}
