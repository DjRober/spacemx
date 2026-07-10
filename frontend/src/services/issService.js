// services/issService.js
// RF4 / RF5 — Servicio de la ISS (posición y alertas de paso)

const ISS_SERVICE_URL   = 'http://localhost:3004'
const ISS_ALERTS_URL    = 'http://localhost:3007'

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
 * Solicita los próximos pasos de la ISS sobre una ubicación al iss-alerts-service.
 * @param {number} latitud  - Latitud de la ciudad del usuario
 * @param {number} longitud - Longitud de la ciudad del usuario
 * @param {number} [n_pasos=3] - Número de próximos pasos a consultar
 * @returns {Promise<Array<{risetime: number, duration: number, max_elevation: number}>>}
 */
export async function getIssPasses(latitud, longitud, n_pasos = 3) {
  const response = await fetch(`${ISS_ALERTS_URL}/alertas/paso`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitud, longitud, n_pasos }),
  })
  if (!response.ok) throw new Error(`Error ${response.status}`)
  return response.json()
}