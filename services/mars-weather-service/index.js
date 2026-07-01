// mars-weather-service — RF3
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
// Fuente: Centro de Astrobiología (CSIC-INTA), datos del rover Curiosity.
// MAAS original (marsweather.ingenology.com) está abandonado; esta es
// la fuente primaria que alimentaba MAAS.
const MAAS_URL =
  "http://cab.inta-csic.es/rems/wp-content/plugins/marsweather-widget/api.php";

// GET /marte/clima
app.get("/marte/clima", async (req, res) => {
  try {
    const response = await axios.get(MAAS_URL, { timeout: 6000 });
    const raw = response.data;

    // La API devuelve { reports: [ { terrestrial_date, sol, min_temp,
    // max_temp, pressure, wind_speed, season, ... }, ... ] }
    const report = raw?.reports?.[0];

    if (!report) {
      // Respondió pero sin datos útiles
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

    res.json(clima);
  } catch (err) {
    // MAAS caído o timeout → devolver ejemplo sin tirar error 500
    console.warn("MAAS no disponible, usando datos de ejemplo:", err.message);
    res.json(EJEMPLO);
  }
});

app.listen(PORT, () => {
  console.log(`mars-weather-service en http://localhost:${PORT}/marte/clima`);
});