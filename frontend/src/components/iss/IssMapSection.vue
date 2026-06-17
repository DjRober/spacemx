<template>
  <section id="iss" class="iss-map-section">
    <h2 class="section-title">Posición de la ISS en tiempo real</h2>
    <p class="section-subtitle">
      Ubicación actual de la Estación Espacial Internacional sobre el mapa mundial.
    </p>

    <div class="map-placeholder">
      <div class="map-placeholder-content">
        <span class="map-icon">🛰️</span>
        <p class="map-placeholder-text">Mapa en tiempo real (próximamente)</p>
        <p class="map-placeholder-coords">Lat: --.----  |  Lng: ---.----</p>
      </div>
    </div>

    <div class="iss-info-row">
      <div class="iss-info-card">
        <span class="iss-info-label">Latitud</span>
        <span class="iss-info-value">--</span>
      </div>
      <div class="iss-info-card">
        <span class="iss-info-label">Longitud</span>
        <span class="iss-info-value">--</span>
      </div>
      <div class="iss-info-card">
        <span class="iss-info-label">Última actualización</span>
        <span class="iss-info-value">--</span>
      </div>
    </div>
  </section>
</template>

<script setup>
// RF4 — Posición de la ISS en tiempo real
// Aún sin conexión a Open-Notify. Esta sección es solo estructura visual (placeholder).
// La lógica de obtención de coordenadas se conectará más adelante usando issService.js
</script>

<style scoped>
.iss-map-section {
  padding: 2rem 1.5rem;
  max-width: 960px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.section-subtitle {
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.map-placeholder {
  width: 100%;
  height: 320px;
  background-color: #1f2937;
  border: 2px dashed #374151;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.map-placeholder-content {
  text-align: center;
  color: #6b7280;
}

.map-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.map-placeholder-text {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.map-placeholder-coords {
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.iss-info-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.iss-info-card {
  flex: 1;
  min-width: 150px;
  background-color: #1f2937;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.iss-info-label {
  font-size: 0.8rem;
  color: #9ca3af;
}

.iss-info-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #f9fafb;
}
</style>
