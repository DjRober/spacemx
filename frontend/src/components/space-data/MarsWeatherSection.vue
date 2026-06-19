<template>
  <section id="marte" class="mars-section" v-if="weather">
    <div class="mars-header">
      <div>
        <h2 class="section-title">Clima en Marte</h2>
        <p class="section-subtitle">
          Datos del rover Curiosity en el cráter Gale — InSight.
        </p>
      </div>
      <span class="sol-badge">{{ weather.sol }}</span>
    </div>

    <div class="mars-main">
      <div class="temp-card">
        <div class="temp-row">
          <div class="temp-item">
            <span class="temp-label">Máxima</span>
            <span class="temp-value danger"
              >{{ weather.temperature.max }}°C</span
            >
          </div>
          <div class="temp-divider"></div>
          <div class="temp-item">
            <span class="temp-label">Mínima</span>
            <span class="temp-value accent"
              >{{ weather.temperature.min }}°C</span
            >
          </div>
        </div>
        <p class="temp-date">Fecha terrestre: {{ weather.terrestrial_date }}</p>
      </div>

      <div class="info-row">
        <div class="info-card">
          <span class="info-label">Estación</span>
          <span class="info-value">{{ weather.season }}</span>
        </div>
        <div class="info-card">
          <span class="info-label">Presión</span>
          <span class="info-value"
            >{{ weather.pressure }} <small>Pa</small></span
          >
        </div>
        <div class="info-card">
          <span class="info-label">Viento</span>
          <span class="info-value"
            >{{ weather.wind_speed }} <small>km/h</small></span
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { marsWeatherService } from "../../services/marsWeatherService";

const weather = ref(null);

onMounted(async () => {
  weather.value = await marsWeatherService.getLatestWeather();
});
</script>

<style scoped>
.mars-section {
  padding: 2rem 1.5rem;
  max-width: 960px;
  margin: 0 auto;
}

.mars-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--color-text-primary);
}

.section-subtitle {
  color: var(--color-text-secondary);
  margin: 0;
}

.sol-badge {
  background-color: var(--color-warning);
  color: var(--color-text-dark);
  padding: 0.35rem 0.85rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
  align-self: center;
}

.mars-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.temp-card {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 0;
}

.temp-icon {
  font-size: 1.25rem;
  grid-column: 1 / -1;
  margin-bottom: 1rem;
}

.temp-row {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  align-items: center;
  margin-bottom: 1.25rem;
}

.temp-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
}

.temp-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

.temp-value {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1;
}

.temp-value.danger {
  color: var(--color-danger);
}
.temp-value.accent {
  color: var(--color-accent);
}

.temp-divider {
  width: 1px;
  height: 56px;
  background-color: var(--color-bg-elevated);
  justify-self: center;
}

.temp-date {
  grid-column: 1 / -1;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-bg-elevated);
  margin: 0;
}

.info-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.info-card {
  flex: 1;
  min-width: 140px;
  background-color: var(--color-bg-card);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.info-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.info-value small {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--color-text-secondary);
}
</style>
