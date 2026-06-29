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
  try {
    const params = { api_key: NASA_API_KEY };

    // Si pide una fecha especifica
    if (req.query.date) {
      params.date = req.query.date;
    }

    const { data } = await axios.get("https://api.nasa.gov/planetary/apod", {
      params,
    });

    // Mapeamos solo los campos necesitados
    res.json({
      date: data.date,
      title: data.title,
      explanation: data.explanation,
      url: data.url,
      media_type: data.media_type,
      copyright: data.copyright ?? null,
    });
  } catch (error) {
    res.status(502).json({ error: "No se pudo obtener la foto de la NASA." });
  }
});

app.listen(PORT, () => {
  console.log(`apod-service en http://localhost:${PORT}/apod`);
});
