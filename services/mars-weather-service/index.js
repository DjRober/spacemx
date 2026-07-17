// mars-weather-service — RF3, RF8
import express from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());

// ── Objeto de ejemplo ─────────────────────────────────────────────
// Se devuelve cuando MAAS no responde, para que la UI no se rompa.
const EJEMPLO = {
  sol: "Sol 3847",
  terrestrial_date: "2026-06-19",
  season: "Verano del norte",
  temperature: { max: -20, min: -73 },
  pressure: 718,
  wind_speed: 12,
};

// ── Endpoint real de REMS/Curiosity ───────────────────────────────
const MAAS_URL =
  "http://cab.inta-csic.es/rems/wp-content/plugins/marsweather-widget/api.php";

// ── Caché en memoria ──────────────────────────────────────────────
// El clima de Marte cambia por "sol marciano" (cada ~24.6 horas terrestres),
// así que un TTL de 3-6 horas es más que suficiente para el MVP.
// Patrón idéntico al de apod-service: Map<string, { data, expiresAt }>
const TTL_MS = 4 * 60 * 60 * 1000; // 4 horas — dato bueno de MAAS
// El respaldo se cachea poco: si MAAS falla no queremos re-consultarlo (y
// pagar su latencia) en cada petición, pero sí reintentar pronto.
const TTL_RESPALDO_MS = 10 * 60 * 1000; // 10 minutos
const CACHE_KEY = "mars_weather:latest";
const cache = new Map();

function guardarEnCache(data, ttl) {
  cache.set(CACHE_KEY, { data, expiresAt: Date.now() + ttl });
}

// MAAS manda "--" (no null) cuando no tiene dato para un campo.
const sinDato = (v) => v === undefined || v === null || v === "--" || v === "";

function aNumero(v, respaldo) {
  if (sinDato(v)) return respaldo;
  const n = Number(v);
  return Number.isNaN(n) ? respaldo : n;
}

// GET /marte/clima
app.get("/marte/clima", async (req, res) => {
  // 1. ¿Tenemos dato en caché y sigue vigente? → respondemos sin tocar MAAS.
  const cacheado = cache.get(CACHE_KEY);
  if (cacheado && cacheado.expiresAt > Date.now()) {
    res.set("X-Cache", "HIT");
    return res.json(cacheado.data);
  }

  try {
    const response = await axios.get(MAAS_URL, { timeout: 6000 });
    const raw = response.data;

    // La API devuelve { descriptions, soles: [...] } — el más reciente va primero.
    const sole = raw?.soles?.[0];

    if (!sole) {
      // Respondió pero sin datos útiles → servir el ejemplo y cachearlo un rato
      // para no re-consultar MAAS en cada petición.
      console.warn("MAAS respondió sin soles; usando datos de ejemplo");
      guardarEnCache(EJEMPLO, TTL_RESPALDO_MS);
      res.set("X-Cache", "FALLBACK");
      return res.json(EJEMPLO);
    }

    // Mapear al formato del contrato
    const clima = {
      sol: sinDato(sole.sol) ? EJEMPLO.sol : `Sol ${sole.sol}`,
      terrestrial_date: sinDato(sole.terrestrial_date)
        ? EJEMPLO.terrestrial_date
        : sole.terrestrial_date,
      season: sinDato(sole.season) ? EJEMPLO.season : sole.season,
      temperature: {
        max: aNumero(sole.max_temp, EJEMPLO.temperature.max),
        min: aNumero(sole.min_temp, EJEMPLO.temperature.min),
      },
      pressure: aNumero(sole.pressure, EJEMPLO.pressure),
      wind_speed: aNumero(sole.wind_speed, EJEMPLO.wind_speed),
    };

    // 2. Guardar en caché con TTL de 4 horas
    guardarEnCache(clima, TTL_MS);

    res.set("X-Cache", "MISS");
    res.json(clima);
  } catch (err) {
    // MAAS caído o timeout → si hay caché expirada, la usamos igual
    const cacheExpirado = cache.get(CACHE_KEY);
    if (cacheExpirado) {
      console.warn("MAAS no disponible, usando caché expirada:", err.message);
      res.set("X-Cache", "STALE");
      return res.json(cacheExpirado.data);
    }

    // Sin caché → servir el ejemplo y cachearlo un rato (evita pagar el
    // timeout de MAAS en cada petición mientras siga caído).
    console.warn("MAAS no disponible, usando datos de ejemplo:", err.message);
    guardarEnCache(EJEMPLO, TTL_RESPALDO_MS);
    res.set("X-Cache", "FALLBACK");
    res.json(EJEMPLO);
  }
});

app.listen(PORT, () => {
  console.log(`mars-weather-service en http://localhost:${PORT}/marte/clima`);
});