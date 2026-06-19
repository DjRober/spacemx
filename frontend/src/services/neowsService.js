// services/neowsService.js
// RF2 — Asteroides cercanos (NeoWs)
// Sin conexión a la API de NASA todavía. Devuelve datos mock para maquetar la UI.
// API real: https://api.nasa.gov/neo/rest/v1/feed

export const neowsService = {
  async getUpcomingAsteroids() {
    return [
      {
        id: '2465633',
        name: '465633 (2009 JR5)',
        diameter_max_km: 1.27,
        velocity_km_h: '63441',
        close_approach_date: '2026-06-20',
        is_potentially_hazardous: true,
      },
      {
        id: '3542519',
        name: '(2010 PK9)',
        diameter_max_km: 0.44,
        velocity_km_h: '31250',
        close_approach_date: '2026-06-21',
        is_potentially_hazardous: false,
      },
      {
        id: '3726710',
        name: '(2015 RC)',
        diameter_max_km: 0.08,
        velocity_km_h: '21800',
        close_approach_date: '2026-06-22',
        is_potentially_hazardous: false,
      },
      {
        id: '2481394',
        name: '481394 (2006 SF6)',
        diameter_max_km: 0.93,
        velocity_km_h: '45900',
        close_approach_date: '2026-06-23',
        is_potentially_hazardous: true,
      },
      {
        id: '3838457',
        name: '(2019 AY3)',
        diameter_max_km: 0.19,
        velocity_km_h: '17340',
        close_approach_date: '2026-06-25',
        is_potentially_hazardous: false,
      },
    ]
  },
}
