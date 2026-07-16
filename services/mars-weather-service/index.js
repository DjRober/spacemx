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
const TTL_MS = 4 * 60 * 60 * 1000; // 4 horas
const CACHE_KEY = "mars_weather:latest";
const cache = new Map();

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

    const report = raw?.reports?.[0];

    if (!report) {
      // Respondió pero sin datos útiles → devolver ejemplo sin cachear
      return res.json(EJEMPLO);
    }

    // Mapear al formato del contrato
    const clima = {
      sol: `Sol ${report.sol}`,
      terrestrial_date: report.terrestrial_date,
      season: report.season || EJEMPLO.season,
      temperature: {
        max: Number(report.max_temp ?? EJEMPLO.temperature.max),
        min: Number(report.min_temp ?? EJEMPLO.temperature.min),
      },
      pressure: Number(report.pressure ?? EJEMPLO.pressure),
      wind_speed: Number(report.wind_speed ?? EJEMPLO.wind_speed),
    };

    // 2. Guardar en caché con TTL de 4 horas
    cache.set(CACHE_KEY, {
      data: clima,
      expiresAt: Date.now() + TTL_MS,
    });

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

    // Sin caché → devolver ejemplo sin tirar error 500
    console.warn("MAAS no disponible, usando datos de ejemplo:", err.message);
    res.json(EJEMPLO);
  }
});

app.listen(PORT, () => {
  console.log(`mars-weather-service en http://localhost:${PORT}/marte/clima`);
});