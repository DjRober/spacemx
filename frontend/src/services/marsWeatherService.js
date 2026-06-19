// services/marsWeatherService.js
// RF3 — Clima en Marte
// Sin conexión a la API de NASA todavía. Devuelve datos mock para maquetar la UI.
// API real: https://api.nasa.gov/insight_weather/

export const marsWeatherService = {
  async getLatestWeather() {
    return {
      sol: 'Sol 3847',
      terrestrial_date: '2026-06-19',
      season: 'Verano del norte',
      temperature: {
        max: -20,
        min: -73,
      },
      pressure: 718,
      wind_speed: 12,
    }
  },
}
