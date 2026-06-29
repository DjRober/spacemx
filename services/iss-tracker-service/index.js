// iss-tracker-service — RF4
// Esqueleto base. La lógica de la ruta la implementa el encargado.
// No necesita API key.

import express from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());

// GET /iss/posicion
//
// TODO: llamar a http://api.open-notify.org/iss-now.json (no necesita api_key)
//       y devolver un objeto con ESTA forma:
// {
//   "latitude":  19.4326,
//   "longitude": -99.1332,
//   "timestamp": 1718750000000,   // en milisegundos (Open-Notify da segundos)
//   "message":   "success"
// }
app.get("/iss/posicion", async (req, res) => {
  res.json({ ruta: "/iss/posicion", estado: "pendiente de implementar" });
});

app.listen(PORT, () => {
  console.log(`iss-tracker-service en http://localhost:${PORT}/iss/posicion`);
});
