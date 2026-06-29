// apod-service — RF1, RF7
// Esqueleto base. La lógica de la ruta la implementa el encargado.

import express from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3001;
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

app.use(cors()); // permite que el frontend (localhost:5173) consuma este servicio

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
  res.json({ ruta: "/apod", estado: "pendiente de implementar" });
});

app.listen(PORT, () => {
  console.log(`apod-service en http://localhost:${PORT}/apod`);
});
