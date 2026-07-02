<template>
  <section id="iss" class="section iss-section">
    <h2 class="section__title">Estación Espacial Internacional</h2>
    <p class="section__subtitle">
      Mapa interactivo con la posición en vivo de la ISS y panel de alertas de
      paso por tu ciudad.
    </p>

    <div class="iss-grid">
      <!-- Mapa (placeholder hasta conectar Open-Notify) -->
      <div class="iss-map">
        <div class="iss-map-content">
          <span class="iss-map-icon">🛰️</span>
          <p class="iss-map-text">Mapa en tiempo real (próximamente)</p>
          <p class="iss-map-coords">Open-Notify · actualización cada pocos segundos</p>
        </div>
      </div>

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

          <!-- Error silencioso si el servicio está apagado -->
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
import { getIssLocation } from '../../services/issService.js'

const latitude  = ref(null)
const longitude = ref(null)
const updatedAt = ref(null)
const error     = ref(false)

let intervalId = null

async function fetchPosition() {
  try {
    const data  = await getIssLocation()
    latitude.value  = data.latitude.toFixed(4)
    longitude.value = data.longitude.toFixed(4)
    updatedAt.value = new Date(data.timestamp).toLocaleTimeString()
    error.value = false
  } catch (e) {
    // Si el servicio está apagado no rompe la página, solo muestra el aviso
    error.value = true
  }
}

onMounted(() => {
  fetchPosition()                          // primera carga inmediata
  intervalId = setInterval(fetchPosition, 5000)  // luego cada 5 segundos
})

onBeforeUnmount(() => {
  clearInterval(intervalId)  // limpia el intervalo al salir de la sección
})
</script>

<style scoped>
.iss-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 24px;
}

/* ── Mapa ──────────────────────────────────────────────────────── */
.iss-map {
  min-height: 320px;
  background: repeating-linear-gradient(
    45deg,
    var(--color-bg-card),
    var(--color-bg-card) 12px,
    var(--color-bg-elevated) 12px,
    var(--color-bg-elevated) 24px
  );
  border: 1px dashed var(--color-border);
  border-radius: 12px;
  display: grid;
  place-items: center;
}

.iss-map-content {
  text-align: center;
  color: var(--color-text-secondary);
}

.iss-map-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.iss-map-text {
  font-weight: 500;
  margin: 0;
}

.iss-map-coords {
  font-size: 0.8rem;
  color: var(--color-accent);
  margin-top: 0.25rem;
}

/* ── Panel lateral ─────────────────────────────────────────────── */
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

/* ── Responsive ───────────────────────────────────────────────── */
@media (max-width: 820px) {
  .iss-grid {
    grid-template-columns: 1fr;
  }
}
</style>