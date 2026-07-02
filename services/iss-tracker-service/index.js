const express = require('express')
const axios   = require('axios')

const app  = express()
const PORT = process.env.PORT || 3004

// CORS — permite que el frontend (localhost:5173/5174) llame a este servicio
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

const ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544'

// GET /iss/posicion
app.get('/iss/posicion', async (req, res) => {
  try {
    const response = await axios.get(ISS_URL, { timeout: 15000 })
    const data     = response.data

    res.json({
      latitude:  parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      timestamp: data.timestamp * 1000,
      message:   'success',
    })
  } catch (error) {
    console.error('[iss-tracker] Error:', error.message)
    res.status(502).json({
      error:   'No se pudo obtener la posición de la ISS.',
      details: error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`iss-tracker-service corriendo en http://localhost:${PORT}`)
})