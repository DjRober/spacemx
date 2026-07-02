import express from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());

const ISS_URL = "https://api.wheretheiss.at/v1/satellites/25544";

// GET /iss/posicion
app.get("/iss/posicion", async (req, res) => {
  try {
    const response = await axios.get(ISS_URL, { timeout: 15000 });
    const data = response.data;

    res.json({
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      timestamp: data.timestamp * 1000,
      message: "success",
    });
  } catch (error) {
    console.error("[iss-tracker] Error:", error.message);
    res.status(502).json({
      error: "No se pudo obtener la posición de la ISS.",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`iss-tracker-service en http://localhost:${PORT}/iss/posicion`);
});
