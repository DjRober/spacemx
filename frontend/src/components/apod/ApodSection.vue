<template>
  <section id="apod" class="apod-section">
    <!-- Encabezado -->
    <div class="apod-header">
      <h2 class="apod-title">Foto Astronómica del Día</h2>
      <p class="apod-subtitle">
        Una imagen del universo, cada día seleccionada por astrónomos de la
        NASA.
      </p>
    </div>

    <!-- Buscador de fecha histórica (RF7) — sin lógica por ahora -->
    <div class="apod-search">
      <label for="apod-date" class="apod-search-label">Explorar fecha</label>
      <div class="apod-search-row">
        <input
          id="apod-date"
          type="date"
          class="apod-date-input"
          :max="today"
          min="1995-06-16"
          placeholder="YYYY-MM-DD"
        />
        <button class="apod-search-btn" disabled>Buscar</button>
      </div>
    </div>

    <!-- Tarjeta principal -->
    <div class="apod-card">
      <!-- Imagen / placeholder -->
      <div class="apod-image-wrap">
        <img :src="apod.url" :alt="apod.title" class="apod-image" />
        <div class="apod-image-overlay">
          <span class="apod-date-badge">{{ apod.date }}</span>
        </div>
      </div>

      <!-- Contenido textual -->
      <div class="apod-content">
        <h3 class="apod-image-title">{{ apod.title }}</h3>

        <p class="apod-description">{{ apod.explanation }}</p>

        <div v-if="apod.copyright" class="apod-credit">
          <span class="apod-credit-icon">©</span>
          {{ apod.copyright }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";

// Datos mock estáticos — se reemplazarán con llamada a apodService.getApod()
const apod = ref({
  date: "2026-06-18",
  title: "The Pillars of Creation",
  explanation:
    "En esta icónica imagen capturada por el Telescopio Espacial James Webb, los Pilares de la Creación " +
    "se revelan con un detalle sin precedentes. Estas columnas de gas y polvo interestelar, ubicadas en " +
    "la Nebulosa del Águila a 6 500 años luz de la Tierra, son viveros de estrellas en formación.",
  url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg/800px-Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg",
  media_type: "image",
  copyright: "NASA, ESA, CSA, STScI",
});

// Fecha máxima para el date picker = hoy
const today = computed(() => new Date().toISOString().split("T")[0]);
</script>

<style scoped>
.apod-section {
  --apod-radius: 12px;
  --apod-font-mono: "JetBrains Mono", "Fira Code", monospace;

  background: var(--color-bg-app);
  padding: 4rem 1.5rem;
  color: var(--color-text-primary);
  font-family: inherit;
}

/* ─── Encabezado ──────────────────────────────────────────────────────────── */
.apod-header {
  max-width: 720px;
  margin: 0 auto 2.5rem;
  text-align: center;
}

.apod-eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 0.75rem;
}

.apod-title {
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem;
  line-height: 1.2;
}

.apod-subtitle {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin: 0;
}

/* ─── Buscador de fecha ───────────────────────────────────────────────────── */
.apod-search {
  max-width: 480px;
  margin: 0 auto 2.5rem;
}

.apod-search-label {
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}

.apod-search-row {
  display: flex;
  gap: 0.5rem;
}

.apod-date-input {
  flex: 1;
  background: var(--color-bg-card);
  border: 1px solid var(--color-bg-elevated);
  border-radius: var(--apod-radius);
  color: var(--color-text-primary);
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  color-scheme: dark;
}

.apod-date-input:focus {
  border-color: var(--color-accent);
}

.apod-search-btn {
  background: var(--color-accent);
  color: var(--color-text-dark);
  border: none;
  border-radius: var(--apod-radius);
  padding: 0.6rem 1.25rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: not-allowed;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.apod-search-btn:not(:disabled) {
  cursor: pointer;
  opacity: 1;
}

.apod-search-btn:not(:disabled):hover {
  opacity: 0.85;
}

/* ─── Tarjeta principal ───────────────────────────────────────────────────── */
.apod-card {
  max-width: 900px;
  margin: 0 auto;
  background: var(--color-bg-card);
  border: 1px solid var(--color-bg-elevated);
  border-radius: var(--apod-radius);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .apod-card {
    grid-template-columns: 1.1fr 1fr;
  }
}

/* ─── Imagen ──────────────────────────────────────────────────────────────── */
.apod-image-wrap {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--color-bg-app);
}

.apod-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.apod-card:hover .apod-image {
  transform: scale(1.03);
}

.apod-image-overlay {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
}

.apod-date-badge {
  font-family: var(--apod-font-mono);
  font-size: 0.7rem;
  background: rgba(11, 15, 26, 0.85);
  border: 1px solid var(--color-bg-elevated);
  color: var(--color-accent);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  letter-spacing: 0.05em;
  backdrop-filter: blur(4px);
}

/* ─── Contenido ───────────────────────────────────────────────────────────── */
.apod-content {
  padding: 2rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.apod-image-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
}

.apod-description {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 0;
  flex: 1;
}

.apod-credit {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-family: var(--apod-font-mono);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border-top: 1px solid var(--color-bg-elevated);
  padding-top: 0.75rem;
}

.apod-credit-icon {
  color: var(--color-hover);
  font-style: normal;
}
</style>
