<template>
  <section id="marte" class="section mars-section">
    <h2 class="section__title">Clima en Marte</h2>
    <p class="section__subtitle">
      Datos del módulo InSight / rover Curiosity en el cráter Gale. Tres
      indicadores de igual jerarquía.
    </p>

    <div v-if="weather" class="mars-grid">
      <div class="card mars-card">
        <div class="mars-icon">🌡️</div>
        <div class="mars-lbl">Temperatura</div>
        <div class="mars-val">{{ weather.temperature.max }} °C</div>
        <div class="mars-lbl">
          mín {{ weather.temperature.min }}° / máx {{ weather.temperature.max }}°
        </div>
        <span class="cache-tag">⚡ servido desde caché</span>
      </div>

      <div class="card mars-card">
        <div class="mars-icon">💨</div>
        <div class="mars-lbl">Viento</div>
        <div class="mars-val">{{ weather.wind_speed }} <small>km/h</small></div>
        <div class="mars-lbl">{{ weather.season }}</div>
        <span class="cache-tag">⚡ servido desde caché</span>
      </div>

      <div class="card mars-card">
        <div class="mars-icon">🧭</div>
        <div class="mars-lbl">Presión atmosférica</div>
        <div class="mars-val">{{ weather.pressure }} <small>Pa</small></div>
        <div class="mars-lbl">{{ weather.sol }}</div>
        <span class="cache-tag">⚡ servido desde caché</span>
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
.mars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.mars-card {
  text-align: center;
  padding: 28px 16px;
}

.mars-icon {
  font-size: 1.85rem;
  margin-bottom: 10px;
}

.mars-val {
  font-size: 1.65rem;
  font-weight: 700;
  margin: 6px 0;
  color: var(--color-text-primary);
}

.mars-val small {
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--color-text-secondary);
}

.mars-lbl {
  color: var(--color-text-secondary);
  font-size: 0.8rem;
}

.cache-tag {
  display: block;
  font-size: 0.7rem;
  color: var(--color-success);
  margin-top: 10px;
}

@media (max-width: 820px) {
  .mars-grid {
    grid-template-columns: 1fr;
  }
}
</style>
