<template>
  <section id="apod" class="section apod-section">
    <h2 class="section__title">Foto Astronómica del Día</h2>
    <p class="section__subtitle">
      Lo primero que ve el usuario: la imagen protagonista del universo, su
      descripción científica y un buscador histórico.
    </p>

    <!-- Error de carga inicial (todavía no hay ninguna foto que mostrar). -->
    <p v-if="error && !apod" class="apod-error">{{ error }}</p>

    <!-- Carga inicial: skeleton con la forma real del grid.
         Da sensación de velocidad y evita el salto de layout cuando
         llegan los datos (el hueco ya está reservado). -->
    <div v-else-if="!apod" class="apod-grid" aria-busy="true">
      <div class="apod-image-wrap skeleton"></div>
      <div class="card apod-info">
        <div class="skeleton skeleton-line skeleton-title"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
      </div>
    </div>

    <div v-else class="apod-grid">
      <!-- Imagen protagonista -->
      <div class="apod-image-wrap">
        <!-- Video (la APOD a veces es un video de YouTube/Vimeo) -->
        <iframe
          v-if="apod.media_type === 'video'"
          :src="apod.url"
          :title="apod.title"
          class="apod-image"
          frameborder="0"
          allowfullscreen
        ></iframe>

        <!-- Imagen: arranca invisible y hace fade-in al terminar de
             descargar (@load). Mientras tanto se ve el skeleton de abajo,
             así no aparece un hueco en blanco con los bytes a medio cargar. -->
        <template v-else>
          <img
            :src="apod.url"
            :alt="apod.title"
            class="apod-image"
            :class="{ 'is-loaded': imageLoaded }"
            loading="lazy"
            decoding="async"
            @load="imageLoaded = true"
            @error="imageLoaded = true"
          />
          <div v-if="!imageLoaded" class="apod-image-skeleton skeleton"></div>
        </template>

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

        <!-- Si falla una búsqueda pero YA había una foto, mostramos el error
             aquí sin borrar la foto actual (error no destructivo). -->
        <p v-if="error && apod" class="apod-error-inline">{{ error }}</p>
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
const imageLoaded = ref(false); // true cuando la <img> terminó de descargar

// Fecha máxima para el date picker = hoy
const today = computed(() => new Date().toISOString().split("T")[0]);

async function cargarApod(date = null) {
  cargando.value = true;
  error.value = "";
  imageLoaded.value = false; // la nueva imagen aún no carga → muestra skeleton
  try {
    apod.value = await getApod(date);
  } catch (e) {
    // Un AbortError no es un fallo real: significa que el usuario lanzó otra
    // búsqueda y cancelamos ésta. Lo ignoramos para no mostrar error en pantalla.
    if (e.name === "AbortError") return;
    error.value = "No se pudo cargar la foto";
    // Si ya había una foto mostrándose, la conservamos: restauramos su estado
    // "cargada" para que vuelva a verse (la habíamos ocultado al iniciar).
    if (apod.value) imageLoaded.value = true;
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

/* La imagen arranca invisible y aparece con un fade suave al cargar. */
img.apod-image {
  opacity: 0;
  transition: transform 0.4s ease, opacity 0.4s ease;
}
img.apod-image.is-loaded {
  opacity: 1;
}

.apod-image-wrap:hover .apod-image {
  transform: scale(1.03);
}

/* Skeleton que cubre la imagen mientras se descargan sus bytes. */
.apod-image-skeleton {
  position: absolute;
  inset: 0;
}

/* ─── Skeleton / shimmer ──────────────────────────────────────── */
/* Bloque gris con un brillo que se desliza: comunica "cargando"
   mucho mejor que un texto y reserva el espacio (sin layout shift). */
.skeleton {
  position: relative;
  overflow: hidden;
  background: var(--color-bg-card);
}
.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.06),
    transparent
  );
  animation: apod-shimmer 1.4s infinite;
}

.skeleton-line {
  height: 0.85rem;
  border-radius: 6px;
}
.skeleton-title {
  height: 1.35rem;
  width: 70%;
  margin-bottom: 0.5rem;
}
.skeleton-line.short {
  width: 45%;
}

@keyframes apod-shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Respeta a quien prefiere menos movimiento (accesibilidad). */
@media (prefers-reduced-motion: reduce) {
  .skeleton::after {
    animation: none;
  }
  img.apod-image {
    transition: none;
  }
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

/* Error no destructivo: aparece bajo el buscador sin tapar la foto. */
.apod-error-inline {
  margin: 0;
  font-size: 0.8rem;
  color: #ff6b6b;
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
