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

        <!-- Formulario de alertas -->
        <form class="card" @submit.prevent="handleAlertSubmit">
          <h3 class="iss-card-title">🔔 Alertas de paso</h3>
          <label for="iss-city" class="field-label">Latitud, Longitud</label>
          <input
            id="iss-city"
            v-model="coordInput"
            type="text"
            class="input"
            placeholder="Ej: 19.4326, -99.1332"
            :disabled="loadingPasses"
          />
          <button type="submit" class="btn iss-alert-btn" :disabled="loadingPasses">
            <span v-if="loadingPasses">Calculando...</span>
            <span v-else>Avisarme cuando pase la ISS</span>
          </button>
          <p class="iss-alert-hint">→ hora de paso, duración y elevación máx.</p>

          <!-- Error de alertas -->
          <p v-if="alertError" class="iss-error">⚠️ {{ alertError }}</p>

          <!-- Lista de próximos pasos -->
          <ul v-if="passes.length" class="iss-passes">
            <li v-for="(pass, i) in passes" :key="i" class="iss-pass-item">
              <div class="pass-row">
                <span class="pass-label">Paso {{ i + 1 }}</span>
                <span class="pass-time">{{ formatTime(pass.inicio_utc) }}</span>
              </div>
              <div class="pass-meta">
                <span>⏱ {{ pass.duracion_s }}s</span>
                <span>📐 Elev. máx. {{ pass.elevacion_max_grados }}°</span>
              </div>
            </li>
          </ul>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getIssLocation, getIssPasses } from '../../services/issService.js'

// ── Posición ISS ────────────────────────────────────────────────
const latitude     = ref(null)
const longitude    = ref(null)
const updatedAt    = ref(null)
const error        = ref(false)
const mapContainer = ref(null)

// ── Alertas de paso ─────────────────────────────────────────────
const coordInput   = ref('')
const passes       = ref([])
const loadingPasses = ref(false)
const alertError   = ref('')

let map        = null
let marker     = null
let intervalId = null

const issIcon = L.divIcon({
  html: '🛰️',
  className: 'iss-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

// ── Helpers ─────────────────────────────────────────────────────
function formatTime(risetime) {
  // risetime puede venir como timestamp Unix (número) o string ISO
  const date = typeof risetime === 'number'
    ? new Date(risetime * 1000)
    : new Date(risetime)
  return isNaN(date) ? risetime : date.toLocaleString('es-MX')
}

function parseCoords(input) {
  const parts = input.split(',').map((s) => parseFloat(s.trim()))
  if (parts.length !== 2 || parts.some(isNaN)) return null
  const [lat, lon] = parts
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null
  return { lat, lon }
}

// ── Posición en tiempo real ──────────────────────────────────────
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

// ── Alertas de paso ──────────────────────────────────────────────
async function handleAlertSubmit() {
  alertError.value = ''
  passes.value     = []

  const coords = parseCoords(coordInput.value)
  if (!coords) {
    alertError.value = 'Ingresa coordenadas válidas: latitud, longitud (Ej: 19.43, -99.13)'
    return
  }

  loadingPasses.value = true
  try {
    const result = await getIssPasses(coords.lat, coords.lon)
    passes.value = Array.isArray(result) ? result : []
    if (!passes.value.length) {
      alertError.value = 'No se encontraron próximos pasos para esa ubicación.'
    }
  } catch (e) {
    alertError.value = 'No se pudo conectar al servicio de alertas. Intenta más tarde.'
  } finally {
    loadingPasses.value = false
  }
}

// ── Ciclo de vida ────────────────────────────────────────────────
onMounted(async () => {
  map = L.map(mapContainer.value, { center: [0, 0], zoom: 2, zoomControl: true })

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

/* ── Lista de pasos ─────────────────────────────────────────────── */
.iss-passes {
  list-style: none;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.iss-pass-item {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
}

.pass-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.pass-label {
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pass-time {
  font-size: 0.8rem;
  color: var(--color-accent);
  font-family: 'JetBrains Mono', monospace;
}

.pass-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
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