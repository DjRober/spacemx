// services/neowsService.js
// RF2, RF9 — Asteroides Near-Earth (NeoWs)
// Consume el wrapper neows-service a través del reverse proxy (/api).
// Cuando el servicio esté apagado, devuelve un arreglo vacío sin romper la app.

export const neowsService = {
  async getUpcomingAsteroids() {
    try {
      const response = await fetch('/api/asteroides')

      if (!response.ok) {
        console.error('[neowsService] Error del servidor:', response.status)
        return []
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('[neowsService] No se pudo conectar al servicio:', error.message)
      return []
    }
  },
}