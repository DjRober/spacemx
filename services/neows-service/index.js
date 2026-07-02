// neows-service — RF2, RF9
// Wrapper que consume la API de NASA NeoWs y devuelve un arreglo limpio de asteroides.

import express from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3003;
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

app.use(cors());

// Helpers
function today() {
  return new Date().toISOString().split("T")[0];
}

// GET /asteroides?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
// start_date y end_date son opcionales; por defecto usa la fecha de hoy.
// La NASA acepta un rango máximo de 7 días.
app.get("/asteroides", async (req, res) => {
  const start_date = req.query.start_date || today();
  const end_date   = req.query.end_date   || today();

  try {
    const { data } = await axios.get(
      "https://api.nasa.gov/neo/rest/v1/feed",
      {
        params: { api_key: NASA_API_KEY, start_date, end_date },
        timeout: 8000,
      }
    );

    // La NASA agrupa los asteroides por fecha: { "2026-06-20": [...], "2026-06-21": [...] }
    // Los juntamos en un solo arreglo y mapeamos al contrato del frontend.
    const nearEarthObjects = data.near_earth_objects || {};

    const asteroides = Object.values(nearEarthObjects)
      .flat()
      .map((neo) => {
        const approach  = neo.close_approach_data?.[0] ?? {};
        const diameters = neo.estimated_diameter?.kilometers ?? {};

        return {
          id:                       neo.id,
          name:                     neo.name,
          diameter_max_km:          parseFloat(
                                      (diameters.estimated_diameter_max ?? 0).toFixed(3)
                                    ),
          velocity_km_h:            approach.relative_velocity?.kilometers_per_hour
                                      ? Math.round(
                                          parseFloat(approach.relative_velocity.kilometers_per_hour)
                                        ).toString()
                                      : "0",
          close_approach_date:      approach.close_approach_date ?? start_date,
          is_potentially_hazardous: neo.is_potentially_hazardous_asteroid ?? false,
        };
      });

    res.json(asteroides);
  } catch (error) {
    const status  = error.response?.status ?? 500;
    const message = error.response?.data?.error_message
                    ?? error.message
                    ?? "Error al consultar la API de NASA";

    console.error("[neows-service] Error:", message);
    res.status(status).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`neows-service en http://localhost:${PORT}/asteroides`);
});