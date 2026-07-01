// services/marsWeatherService.js
// RF3 — Clima en Marte
// Conectado al mars-weather-service (http://localhost:3002/marte/clima).
// Si el servicio está apagado, devuelve datos de ejemplo para no romper la página.

const SERVICIO_URL = "http://localhost:3002/marte/clima";

// Datos de respaldo por si el servicio está apagado
const EJEMPLO = {
  sol: "Sol 3847",
  terrestrial_date: "2026-06-19",
  season: "Verano del norte",
  temperature: { max: -20, min: -73 },
  pressure: 718,
  wind_speed: 12,
};

export const marsWeatherService = {
  async getLatestWeather() {
    try {
      const response = await fetch(SERVICIO_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn("mars-weather-service no disponible, usando ejemplo:", err.message);
      return EJEMPLO;
    }
  },
};