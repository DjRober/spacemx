// services/neowsService.js
// RF2, RF9 — Asteroides Near-Earth (NeoWs)
// Consume el wrapper neows-service a través del reverse proxy (/api).
// Cuando el servicio esté apagado, devuelve un arreglo vacío sin romper la app.

export const neowsService = {
  // Acepta un rango opcional { desde, hasta } (YYYY-MM-DD) que se envía al
  // backend como start_date / end_date. La NASA limita el rango a 7 días.
  async getUpcomingAsteroids({ desde, hasta } = {}) {
    try {
      const params = new URLSearchParams()
      if (desde) params.set('start_date', desde)
      if (hasta) params.set('end_date', hasta)

      const query = params.toString()
      const url = query ? `/api/asteroides?${query}` : '/api/asteroides'

      const response = await fetch(url)

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
