// services/issService.js
// RF4 / RF5 — Servicio de la ISS (posición y alertas de paso)

const ISS_SERVICE_URL = 'http://localhost:3004'

/**
 * Obtiene la posición actual de la ISS desde el iss-tracker-service.
 * @returns {Promise<{latitude: number, longitude: number, timestamp: number, message: string}>}
 */
export async function getIssLocation() {
  const response = await fetch(`${ISS_SERVICE_URL}/iss/posicion`)
  if (!response.ok) throw new Error(`Error ${response.status}`)
  return response.json()
}

/**
 * Simula el registro de una ciudad para alertas de paso de la ISS.
 * @param {string} city - nombre de la ciudad ingresada en el formulario
 */
export function subscribeIssAlert(city) {
  return {
    success: true,
    city: city || 'Ciudad de México',
    message: 'Mock: alerta registrada (sin conexión real todavía)',
  }
}

/**
 * Simula una lista de próximos pasos de la ISS sobre una ciudad.
 */
export function getIssPasses() {
  return [
    { date: '2026-06-18', time: '20:45', duration_minutes: 6 },
    { date: '2026-06-19', time: '19:58', duration_minutes: 4 },
    { date: '2026-06-21', time: '21:10', duration_minutes: 5 },
  ]
}