<template>
  <section id="iss" class="section iss-section">
    <h2 class="section__title">Estación Espacial Internacional</h2>
    <p class="section__subtitle">
      Mapa interactivo con la posición en vivo de la ISS y panel de alertas de
      paso por tu ciudad.
    </p>

    <div class="iss-grid">
      <!-- Mapa Leaflet -->
      <div ref="mapContainer" class="iss-map"></div>

      <!-- Panel lateral: posición + alertas -->
      <div class="iss-panel">
        <div class="card">
          <h3 class="iss-card-title">Posición actual</h3>

          <div class="stat">
            <span>Latitud</span>
            <span class="stat-val">{{ latitude ?? '--.----' }}</span>
          </div>
          <div class="stat">
            <span>Longitud</span>
            <span class="stat-val">{{ longitude ?? '--.----' }}</span>
          </div>
          <div class="stat stat--last">
            <span>Actualizado</span>
            <span class="stat-val">{{ updatedAt ?? '--:--:--' }}</span>
          </div>

          <p v-if="error" class="iss-error">⚠️ Sin conexión al servicio</p>
        </div>

        <form class="card" @submit.prevent>
          <h3 class="iss-card-title">🔔 Alertas de paso</h3>
          <label for="iss-city" class="field-label">Tu ciudad / ubicación</label>
          <input
            id="iss-city"
            type="text"
            class="input"
            placeholder="lat, lon o nombre de ciudad"
          />
          <button type="submit" class="btn iss-alert-btn">
            Avisarme cuando pase la ISS
          </button>
          <p class="iss-alert-hint">→ hora de paso, duración y elevación máx.</p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getIssLocation } from '../../services/issService.js'

const latitude     = ref(null)
const longitude    = ref(null)
const updatedAt    = ref(null)
const error        = ref(false)
const mapContainer = ref(null)

let map        = null
let marker     = null
let intervalId = null

const issIcon = L.divIcon({
  html: '🛰️',
  className: 'iss-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

async function fetchPosition() {
  try {
    const data = await getIssLocation()

    latitude.value  = data.latitude.toFixed(4)
    longitude.value = data.longitude.toFixed(4)
    updatedAt.value = new Date(data.timestamp).toLocaleTimeString()
    error.value     = false

    if (marker) {
      marker.setLatLng([data.latitude, data.longitude])
      map.panTo([data.latitude, data.longitude])
    }
  } catch (e) {
    error.value = true
  }
}

onMounted(async () => {
  map = L.map(mapContainer.value, {
    center: [0, 0],
    zoom: 2,
    zoomControl: true,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map)

  marker = L.marker([0, 0], { icon: issIcon }).addTo(map)
  marker.bindPopup('🛰️ ISS — cargando posición...')

  await fetchPosition()
  intervalId = setInterval(fetchPosition, 5000)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
  if (map) map.remove()
})
</script>

<style scoped>
.iss-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 24px;
}

.iss-map {
  height: 380px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  z-index: 0;
}

:global(.iss-marker) {
  background: none !important;
  border: none !important;
  font-size: 1.6rem;
  line-height: 1;
}

.iss-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.iss-card-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
}

.stat--last {
  border-bottom: none;
}

.stat-val {
  color: var(--color-accent);
  font-family: 'JetBrains Mono', monospace;
}

.iss-alert-btn {
  width: 100%;
  margin-top: 0.75rem;
}

.iss-alert-hint {
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  margin-top: 0.6rem;
}

.iss-error {
  font-size: 0.75rem;
  color: var(--color-warning);
  margin-top: 0.75rem;
}

@media (max-width: 820px) {
  .iss-grid {
    grid-template-columns: 1fr;
  }

  .iss-map {
    height: 280px;
  }
}
</style>