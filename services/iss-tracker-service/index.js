const express = require('express')
const axios   = require('axios')

const app  = express()
const PORT = process.env.PORT || 3004

const OPEN_NOTIFY_URL = 'http://api.open-notify.org/iss-now.json'

// GET /iss/posicion
app.get('/iss/posicion', async (req, res) => {
  try {
    const response = await axios.get(OPEN_NOTIFY_URL, { timeout: 5000 })
    const data     = response.data

    // Open-Notify devuelve lat/lon como string → convertir a número
    // timestamp viene en segundos → multiplicar por 1000 para milisegundos
    res.json({
      latitude:  parseFloat(data.iss_position.latitude),
      longitude: parseFloat(data.iss_position.longitude),
      timestamp: data.timestamp * 1000,
      message:   data.message,
    })
  } catch (error) {
    console.error('[iss-tracker] Error al consultar Open-Notify:', error.message)
    res.status(502).json({
      error:   'No se pudo obtener la posición de la ISS.',
      details: error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`iss-tracker-service corriendo en http://localhost:${PORT}`)
})