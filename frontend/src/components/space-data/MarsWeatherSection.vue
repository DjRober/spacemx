<template>
  <section id="marte" class="section mars-section">
    <h2 class="section__title">{{ t("marte.title") }}</h2>
    <p class="section__subtitle">{{ t("marte.subtitle") }}</p>

    <div v-if="weather" class="mars-grid">
      <div class="card mars-card">
        <div class="mars-icon">🌡️</div>
        <div class="mars-lbl">{{ t("marte.temperatura") }}</div>
        <div class="mars-val">{{ weather.temperature.max }} °C</div>
        <div class="mars-lbl">
          {{ t("marte.minMax", { min: weather.temperature.min, max: weather.temperature.max }) }}
        </div>
        <span class="cache-tag">{{ t("marte.cacheTag") }}</span>
      </div>

      <div class="card mars-card">
        <div class="mars-icon">💨</div>
        <div class="mars-lbl">{{ t("marte.viento") }}</div>
        <div class="mars-val">{{ weather.wind_speed }} <small>km/h</small></div>
        <div class="mars-lbl">{{ weather.season }}</div>
        <span class="cache-tag">{{ t("marte.cacheTag") }}</span>
      </div>

      <div class="card mars-card">
        <div class="mars-icon">🧭</div>
        <div class="mars-lbl">{{ t("marte.presion") }}</div>
        <div class="mars-val">{{ weather.pressure }} <small>Pa</small></div>
        <div class="mars-lbl">{{ weather.sol }}</div>
        <span class="cache-tag">{{ t("marte.cacheTag") }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { marsWeatherService } from "../../services/marsWeatherService";

const { t } = useI18n();
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
