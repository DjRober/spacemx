// apod-service — RF1, RF7
// Esqueleto base. La lógica de la ruta la implementa el encargado.

import express from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3001;
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

// Tiempo máximo que esperamos a la NASA antes de rendirnos.
// Sin esto, si la NASA cuelga, nuestra request queda colgada para siempre.
const NASA_TIMEOUT_MS = 10000;

// ─── Caché en memoria ────────────────────────────────────────────
// La APOD cambia UNA vez al día y las fotos de fechas pasadas NUNCA
// cambian → son 100% cacheables. Guardamos por fecha (clave "YYYY-MM-DD"
// o "today" para la del día). Así evitamos:
//   1. Latencia: respondemos al instante en vez de ir a la NASA.
//   2. Rate-limit: DEMO_KEY solo permite 30 req/hora; el caché lo respeta.
// Map<string, { data: object, expiresAt: number }>  (expiresAt = 0 → no expira)
const cache = new Map();

// Fecha de hoy en UTC ("YYYY-MM-DD"), que es como la NASA marca su APOD.
function hoyUTC() {
  return new Date().toISOString().slice(0, 10);
}

app.use(cors()); // permite que el frontend (localhost:5173) consuma este servicio

// https://api.nasa.gov/planetary/apod?api_key
// GET /apod                 -> foto de hoy
// GET /apod?date=2024-01-15 -> foto de una fecha pasada (RF7)
//
// TODO: llamar a https://api.nasa.gov/planetary/apod
//       (params: api_key, date) y devolver un objeto con ESTA forma:
// {
//   "date":        "2026-06-18",
//   "title":       "The Pillars of Creation",
//   "explanation": "Descripción científica de la NASA...",
//   "url":         "https://....jpg",
//   "media_type":  "image",          // "image" o "video"
//   "copyright":   "NASA, ESA"        // puede venir null
// }
app.get("/apod", async (req, res) => {
  // Clave de caché: la fecha pedida, o "today" si no especifican.
  const fecha = req.query.date || null;
  const clave = fecha ?? "today";

  // 1. ¿Lo tenemos cacheado y vigente? → respondemos sin tocar la NASA.
  const cacheado = cache.get(clave);
  if (
    cacheado &&
    (cacheado.expiresAt === 0 || cacheado.expiresAt > Date.now())
  ) {
    res.set("Cache-Control", "public, max-age=3600"); // el navegador también cachea
    return res.json(cacheado.data);
  }

  try {
    const params = { api_key: NASA_API_KEY };
    if (fecha) params.date = fecha; // si pide una fecha específica

    const { data } = await axios.get("https://api.nasa.gov/planetary/apod", {
      params,
      timeout: NASA_TIMEOUT_MS,
    });

    // Mapeamos solo los campos necesitados
    const apod = {
      date: data.date,
      title: data.title,
      explanation: data.explanation,
      url: data.url,
      media_type: data.media_type,
      copyright: data.copyright ?? null,
    };

    // 2. Guardamos en caché. Una fecha pasada nunca cambia (no expira);
    //    la de "today" expira en el próximo cambio de día UTC.
    const esHoy = !fecha || fecha === hoyUTC();
    cache.set(clave, {
      data: apod,
      expiresAt: esHoy ? finDelDiaUTC() : 0,
    });

    res.set("Cache-Control", "public, max-age=3600");
    res.json(apod);
  } catch (error) {
    // Distinguimos timeout de otros fallos para dar mejor diagnóstico.
    const esTimeout = error.code === "ECONNABORTED";
    res.status(esTimeout ? 504 : 502).json({
      error: esTimeout
        ? "La NASA tardó demasiado en responder."
        : "No se pudo obtener la foto de la NASA.",
    });
  }
});

// Milisegundos (epoch) hasta el final del día UTC → cuándo expira la foto de hoy.
function finDelDiaUTC() {
  const ahora = new Date();
  const manana = Date.UTC(
    ahora.getUTCFullYear(),
    ahora.getUTCMonth(),
    ahora.getUTCDate() + 1,
  );
  return manana;
}

app.listen(PORT, () => {
  console.log(`apod-service en http://localhost:${PORT}/apod`);
});
