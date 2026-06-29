<template>
  <section id="apod" class="section apod-section">
    <h2 class="section__title">Foto Astronómica del Día</h2>
    <p class="section__subtitle">
      Lo primero que ve el usuario: la imagen protagonista del universo, su
      descripción científica y un buscador histórico.
    </p>

    <p v-if="error" class="apod-error">{{ error }}</p>
    <p v-else-if="!apod" class="apod-loading">Cargando foto del dia</p>

    <div v-else class="apod-grid">
      <!-- Imagen protagonista -->
      <div class="apod-image-wrap">
        <img :src="apod.url" :alt="apod.title" class="apod-image" />
        <span class="apod-date-badge">{{ apod.date }}</span>
      </div>

      <!-- Información + buscador -->
      <div class="card apod-info">
        <h3 class="apod-image-title">{{ apod.title }}</h3>
        <p class="apod-description">{{ apod.explanation }}</p>

        <p class="apod-meta">
          📅 {{ apod.date }}
          <template v-if="apod.copyright"> · ✍️ {{ apod.copyright }}</template>
        </p>

        <div class="apod-search">
          <div class="apod-search-field">
            <label for="apod-date" class="field-label">
              Buscador histórico — ver foto de otra fecha
            </label>
            <input
              id="apod-date"
              type="date"
              class="input"
              v-model="selectedDate"
              :max="today"
              min="1995-06-16"
            />
          </div>
          <button class="btn" @click="buscar" :disabled="cargando">
            {{ cargando ? "Buscando" : "Buscar" }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getApod } from "../../services/Apodservice";

const apod = ref(null); // datos de la foto (null mientras carga)
const selectedDate = ref(""); // fecha que escribe el usuario en el input
const cargando = ref(false); // true mientras espera al servicio
const error = ref(""); // mensaje si el servicio falla

// Fecha máxima para el date picker = hoy
const today = computed(() => new Date().toISOString().split("T")[0]);

async function cargarApod(date = null) {
  cargando.value = true;
  error.value = "";
  try {
    apod.value = await getApod(date);
  } catch (e) {
    error.value = "No se pudo cargar la foto";
  } finally {
    cargando.value = false;
  }
}

// Se ejecuta al hacer click en "Buscar"
function buscar() {
  cargarApod(selectedDate.value || null);
}

// Carga la foto de hoy al abrir la seccion
onMounted(() => cargarApod());
</script>

<style scoped>
.apod-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
}

/* ─── Imagen ──────────────────────────────────────────────────── */
.apod-image-wrap {
  position: relative;
  min-height: 380px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
}

.apod-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.apod-image-wrap:hover .apod-image {
  transform: scale(1.03);
}

.apod-date-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.7rem;
  background: rgba(11, 14, 29, 0.85);
  border: 1px solid var(--color-border);
  color: var(--color-accent);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  letter-spacing: 0.05em;
  backdrop-filter: blur(4px);
}

/* ─── Info ────────────────────────────────────────────────────── */
.apod-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.apod-image-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
}

.apod-description {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 0;
  flex: 1;             /* ocupa el espacio libre de la tarjeta */
  min-height: 0;       /* clave: permite que el scroll funcione dentro de un flex */
  overflow-y: auto;    /* scroll SOLO si el texto realmente excede ese espacio */
}

.apod-meta {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.apod-search {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  margin-top: auto;
  padding-top: 0.5rem;
}

.apod-search-field {
  flex: 1;
}

.apod-search .btn {
  white-space: nowrap;
}

/* ─── Responsive ──────────────────────────────────────────────── */
@media (max-width: 820px) {
  .apod-grid {
    grid-template-columns: 1fr;
  }

  .apod-description {
    flex: none;            /* ya no compite por altura */
    overflow-y: visible;   /* sin scroll: en móvil hay espacio de sobra */
  }
}
</style>
