// iss-alerts-service — RF5
// Calcula los próximos pasos de la ISS sobre unas coordenadas usando TLE + satellite.js

import express from 'express'
import cors from 'cors'
import axios from 'axios'
import * as satellite from 'satellite.js'
import 'dotenv/config'

const app  = express()
const PORT = process.env.PORT || 3007
const TLE_URL = process.env.TLE_URL ||
  'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE'

app.use(cors())
app.use(express.json())

// ── Cache del TLE (se refresca cada 6 horas) ─────────────────────
let tleCache = null
let tleFetchedAt = 0
const TLE_TTL_MS = 6 * 60 * 60 * 1000

async function getTLE() {
  const now = Date.now()
  if (tleCache && now - tleFetchedAt < TLE_TTL_MS) return tleCache

  const { data } = await axios.get(TLE_URL, { timeout: 8000 })
  const lines = data.trim().split('\n').map((l) => l.trim())
  // El TLE tiene 3 líneas: nombre, línea1, línea2
  if (lines.length < 3) throw new Error('TLE inválido recibido de Celestrak')

  tleCache = { name: lines[0], line1: lines[1], line2: lines[2] }
  tleFetchedAt = now
  console.log('[iss-alerts-service] TLE actualizado:', tleCache.name)
  return tleCache
}

// ── Cálculo de pasos ─────────────────────────────────────────────
/**
 * Propaga la órbita de la ISS minuto a minuto durante los próximos 3 días
 * y detecta los pasos sobre el observador (elevación > 0°).
 *
 * @param {number} lat       - Latitud del observador (grados)
 * @param {number} lon       - Longitud del observador (grados)
 * @param {number} n_pasos   - Número de pasos a devolver
 * @returns {Array<{inicio_utc, duracion_s, elevacion_max_grados}>}
 */
async function calcularPasos(lat, lon, n_pasos) {
  const { line1, line2 } = await getTLE()
  const satrec = satellite.twoline2satrec(line1, line2)

  const observador = {
    longitude: satellite.degreesToRadians(lon),
    latitude:  satellite.degreesToRadians(lat),
    height:    0.1, // km sobre el nivel del mar
  }

  const pasos = []
  const ahora = Date.now()
  const PASO_MS  = 60 * 1000        // muestreo cada 1 minuto
  const VENTANA  = 3 * 24 * 60      // minutos en 3 días

  let enPaso       = false
  let inicioMs     = null
  let elevMaxRad   = 0

  for (let i = 0; i <= VENTANA; i++) {
    const t = new Date(ahora + i * PASO_MS)
    const posVel = satellite.propagate(satrec, t)
    if (!posVel.position) continue

    const gmst = satellite.gstime(t)
    const posGeo = satellite.eciToGeodetic(posVel.position, gmst)
    const lookAngles = satellite.ecfToLookAngles(
      observador,
      satellite.eciToEcf(posVel.position, gmst)
    )

    const elevRad = lookAngles.elevation

    if (elevRad > 0) {
      if (!enPaso) {
        enPaso     = true
        inicioMs   = t.getTime()
        elevMaxRad = elevRad
      } else {
        if (elevRad > elevMaxRad) elevMaxRad = elevRad
      }
    } else {
      if (enPaso) {
        enPaso = false
        const duracion_s = Math.round((t.getTime() - inicioMs) / 1000)
        pasos.push({
          inicio_utc:            new Date(inicioMs).toISOString(),
          duracion_s,
          elevacion_max_grados:  parseFloat(
                                   satellite.radiansToDegrees(elevMaxRad).toFixed(1)
                                 ),
        })
        if (pasos.length >= n_pasos) break
      }
    }
  }

  return pasos
}

// ── Ruta principal ───────────────────────────────────────────────
// POST /alertas/paso
// Body: { latitud: number, longitud: number, n_pasos?: number }
app.post('/alertas/paso', async (req, res) => {
  const { latitud, longitud, n_pasos = 3 } = req.body

  // Validación
  if (latitud === undefined || longitud === undefined) {
    return res.status(400).json({ error: 'latitud y longitud son requeridos' })
  }
  if (typeof latitud !== 'number' || typeof longitud !== 'number') {
    return res.status(400).json({ error: 'latitud y longitud deben ser números' })
  }
  if (latitud < -90 || latitud > 90) {
    return res.status(400).json({ error: 'latitud fuera de rango (-90 a 90)' })
  }
  if (longitud < -180 || longitud > 180) {
    return res.status(400).json({ error: 'longitud fuera de rango (-180 a 180)' })
  }
  const pasosSolicitados = Math.min(Math.max(parseInt(n_pasos) || 3, 1), 10)

  try {
    const pasos = await calcularPasos(latitud, longitud, pasosSolicitados)
    res.json(pasos)
  } catch (error) {
    console.error('[iss-alerts-service] Error al calcular pasos:', error.message)
    res.status(502).json({ error: 'No se pudo calcular el paso de la ISS. Intenta más tarde.' })
  }
})

app.listen(PORT, () => {
  console.log(`iss-alerts-service en http://localhost:${PORT}/alertas/paso`)
})