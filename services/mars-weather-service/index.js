// mars-weather-service — RF3
// Esqueleto base. La lógica de la ruta la implementa el encargado.

import express from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3002;
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

app.use(cors());

// GET /marte/clima
//
// TODO: InSight ya no manda datos (misión terminada en 2022). Usar la MAAS API
//       del rover Curiosity (ver README para el enlace). Como MAAS se cae seguido,
//       si falla devolver un objeto de ejemplo. Mapear a ESTA forma:
// {
//   "sol":              "Sol 3847",
//   "terrestrial_date": "2026-06-19",
//   "season":           "Verano del norte",
//   "temperature":      { "max": -20, "min": -73 },   // grados °C
//   "pressure":         718,                           // presión en Pa
//   "wind_speed":       12                             // viento en km/h
// }
app.get("/marte/clima", async (req, res) => {
  res.json({ ruta: "/marte/clima", estado: "pendiente de implementar" });
});

app.listen(PORT, () => {
  console.log(`mars-weather-service en http://localhost:${PORT}/marte/clima`);
});
