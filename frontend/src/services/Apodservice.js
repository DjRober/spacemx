// apodService.js
// RF1, RF7 — Foto Astronómica del Día
// Cliente del microservicio apod-service (que a su vez envuelve la NASA API).

// URL del servicio. Configurable por entorno (Vite) para no hardcodear
// localhost en producción; cae a localhost:3001 en desarrollo.
const API_URL = import.meta.env.VITE_APOD_API_URL || "http://localhost:3001/apod";

// ─── Caché de cliente ────────────────────────────────────────────
// El backend ya cachea, pero esto evita incluso la ida y vuelta por red:
// si el usuario vuelve a una fecha que ya consultó (p. ej. alterna fechas
// en el buscador histórico), la respuesta es instantánea y sin fetch.
// Las fotos de fechas pasadas nunca cambian, así que cachearlas es seguro.
const cache = new Map(); // Map<string, Object>  (clave: fecha o "today")

// Controla la petición en vuelo para poder cancelarla si llega otra nueva.
// Sin esto hay una carrera real: si el usuario pulsa "Buscar" varias veces
// rápido, una respuesta vieja puede llegar después y pisar a la más reciente.
let peticionEnVuelo = null;

/**
 * Obtiene la Foto Astronómica del Día.
 * @param {string} [date] - Fecha en formato YYYY-MM-DD. Si se omite, devuelve la del día actual.
 * @returns {Promise<Object>} Datos de la APOD (title, explanation, url, media_type, date, copyright)
 */
export async function getApod(date = null) {
  const clave = date ?? "today";

  // 1. Si ya lo tenemos cacheado, lo devolvemos sin tocar la red.
  if (cache.has(clave)) {
    return cache.get(clave);
  }

  // 2. Cancela cualquier petición anterior que siga en vuelo: su resultado
  //    ya no nos interesa porque el usuario pidió otra fecha.
  if (peticionEnVuelo) {
    peticionEnVuelo.abort();
  }
  const controller = new AbortController();
  peticionEnVuelo = controller;

  const url = date ? `${API_URL}?date=${date}` : API_URL;

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error("No se pudo obtener la foto del dia");
    }

    const data = await res.json();
    cache.set(clave, data); // guardamos para la próxima vez
    return data;
  } finally {
    // Solo limpiamos si seguimos siendo la petición vigente (no nos
    // canceló una más nueva mientras esperábamos).
    if (peticionEnVuelo === controller) {
      peticionEnVuelo = null;
    }
  }
}
