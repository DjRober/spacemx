// neows-service — RF2
// Esqueleto base. La lógica de la ruta la implementa el encargado.

import express from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3003;
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

app.use(cors());

// GET /asteroides?start_date=2026-06-20&end_date=2026-06-23
// (máximo 7 días de rango)
//
// TODO: llamar a https://api.nasa.gov/neo/rest/v1/feed
//       (params: api_key, start_date, end_date). La NASA agrupa los asteroides
//       por fecha; juntarlos en un solo ARREGLO con ESTA forma:
// [
//   {
//     "id":                       "2465633",
//     "name":                     "465633 (2009 JR5)",
//     "diameter_max_km":          1.27,
//     "velocity_km_h":            "63441",
//     "close_approach_date":      "2026-06-20",
//     "is_potentially_hazardous": true
//   },
//   ... (un objeto por cada asteroide)
// ]
app.get("/asteroides", async (req, res) => {
  res.json({ ruta: "/asteroides", estado: "pendiente de implementar" });
});

app.listen(PORT, () => {
  console.log(`neows-service en http://localhost:${PORT}/asteroides`);
});
