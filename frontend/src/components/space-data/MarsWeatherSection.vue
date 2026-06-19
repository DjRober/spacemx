<template>
  <div class="mars-weather-card" v-if="weather">
    <div class="card-header">
      <h3>Clima en Marte 🪐</h3>
      <span class="sol-badge">{{ weather.sol }}</span>
    </div>
    
    <div class="card-body">
      <p class="date">Fecha terrestre: {{ weather.terrestrial_date }}</p>
      
      <div class="temp-container">
        <div class="temp-item">
          <span class="label">Máx</span>
          <span class="value">{{ weather.temperature.max }}°C</span>
        </div>
        <div class="temp-item">
          <span class="label">Mín</span>
          <span class="value">{{ weather.temperature.min }}°C</span>
        </div>
      </div>

      <div class="extra-info">
        <p><strong>Estación:</strong> {{ weather.season }}</p>
        <p><strong>Presión:</strong> {{ weather.pressure }} Pa</p>
        <p><strong>Velocidad del viento:</strong> {{ weather.wind_speed }} km/h</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { marsWeatherService } from '../../services/marsWeatherService'

const weather = ref(null)

onMounted(async () => {
  weather.value = await marsWeatherService.getLatestWeather()
})
</script>

<style scoped>
.mars-weather-card {
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  max-width: 300px;
  background: #1e1e1e;
  color: #fff;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.sol-badge {
  background: #ff6b6b;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: bold;
}
.temp-container {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  background: #2a2a2a;
  padding: 10px;
  border-radius: 6px;
}
.temp-item { display: flex; flex-direction: column; align-items: center; }
.label { font-size: 0.8em; color: #aaa; }
.value { font-size: 1.2em; font-weight: bold; }
</style>