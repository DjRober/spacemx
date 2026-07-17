<template>
  <section id="reportes" class="section reportes-section">
    <h2 class="section__title">{{ t("reportes.title") }}</h2>
    <p class="section__subtitle">{{ t("reportes.subtitle") }}</p>

    <!-- Sin sesión: aviso de candado -->
    <div v-if="!auth.isLoggedIn.value" class="auth-note">
      {{ t("reportes.authNote") }}
    </div>

    <div class="rep-grid">
      <!-- Formulario nueva observación -->
      <form class="card form-card" @submit.prevent="guardarReporte">
        <h3 class="form-title">{{ t("reportes.form.title") }}</h3>

        <div class="field">
          <label class="field-label" for="rep-titulo">{{ t("reportes.form.labelTitulo") }}</label>
          <input
            id="rep-titulo"
            v-model="form.titulo"
            type="text"
            class="input"
            :placeholder="t('reportes.form.placeholderTitulo')"
            :disabled="!auth.isLoggedIn.value"
          />
        </div>

        <div class="field">
          <label class="field-label" for="rep-desc">{{ t("reportes.form.labelDesc") }}</label>
          <textarea
            id="rep-desc"
            v-model="form.descripcion"
            class="input field-textarea"
            :placeholder="t('reportes.form.placeholderDesc')"
            :disabled="!auth.isLoggedIn.value"
          ></textarea>
        </div>

        <div class="field-row">
          <div class="field">
            <label class="field-label" for="rep-fecha">{{ t("reportes.form.labelFecha") }}</label>
            <input
              id="rep-fecha"
              v-model="form.fecha_observacion"
              type="date"
              class="input"
              :disabled="!auth.isLoggedIn.value"
            />
          </div>
          <div class="field">
            <label class="field-label" for="rep-lat">{{ t("reportes.form.labelLat") }}</label>
            <input
              id="rep-lat"
              v-model="form.latitud"
              type="number"
              step="any"
              class="input"
              :placeholder="t('reportes.form.placeholderLat')"
              :disabled="!auth.isLoggedIn.value"
            />
          </div>
        </div>

        <div class="field">
          <label class="field-label" for="rep-lon">{{ t("reportes.form.labelLon") }}</label>
          <input
            id="rep-lon"
            v-model="form.longitud"
            type="number"
            step="any"
            class="input"
            :placeholder="t('reportes.form.placeholderLon')"
            :disabled="!auth.isLoggedIn.value"
          />
        </div>

        <div class="field">
          <span class="field-label">{{ t("reportes.form.labelVisibilidad") }}</span>
          <div class="radio-group">
            <label class="radio-label">
              <input
                type="radio"
                name="visibilidad"
                :value="false"
                v-model="form.es_publico"
                class="radio"
                :disabled="!auth.isLoggedIn.value"
              />
              {{ t("reportes.form.privada") }}
            </label>
            <label class="radio-label">
              <input
                type="radio"
                name="visibilidad"
                :value="true"
                v-model="form.es_publico"
                class="radio"
                :disabled="!auth.isLoggedIn.value"
              />
              {{ t("reportes.form.publica") }}
            </label>
          </div>
        </div>

        <p v-if="errorForm" class="error-msg">{{ errorForm }}</p>

        <button class="btn submit-btn" :disabled="!auth.isLoggedIn.value || guardando">
          {{ guardando ? t("reportes.form.btnGuardando") : modoEdicion ? t("reportes.form.btnActualizar") : t("reportes.form.btnGuardar") }}
        </button>

        <button
          v-if="modoEdicion"
          type="button"
          class="btn cancel-btn"
          @click="cancelarEdicion"
        >
          {{ t("reportes.form.btnCancelar") }}
        </button>

        <p v-if="!auth.isLoggedIn.value" class="submit-helper">
          {{ t("reportes.form.helperLogin") }}
        </p>
      </form>

      <!-- Lista de reportes -->
      <div class="reports-list">
        <p v-if="cargando" class="loading-msg">{{ t("reportes.lista.cargando") }}</p>
        <p v-else-if="auth.isLoggedIn.value && reportes.length === 0" class="empty-msg">
          {{ t("reportes.lista.vacio") }}
        </p>

        <div v-for="reporte in reportes" :key="reporte.id" class="card rep-card">
          <div class="rep-thumb">
            <span class="rep-thumb-icon">🔭</span>
          </div>
          <div class="rep-info">
            <h4 class="rep-title">{{ reporte.titulo }}</h4>
            <p class="rep-meta">
              {{ formatearFecha(reporte.fecha_observacion) }} ·
              {{ reporte.latitud }}°, {{ reporte.longitud }}°
              <span :class="reporte.es_publico ? 'badge public' : 'badge private'">
                {{ reporte.es_publico ? t("reportes.lista.badgePublica") : t("reportes.lista.badgePrivada") }}
              </span>
            </p>
          </div>
          <div class="rep-actions">
            <button class="icon-btn" :title="t('reportes.lista.titleEditar')" @click="editarReporte(reporte)">✏️</button>
            <button class="icon-btn" :title="t('reportes.lista.titleEliminar')" @click="eliminarReporte(reporte.id)">🗑️</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// RF6 — Mis Reportes Espaciales
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useAuth } from "../../composables/useAuth.js";
import { reportsService } from "../../services/reportsService.js";

const { t, locale } = useI18n();
const auth = useAuth();

const reportes = ref([]);
const cargando = ref(false);
const guardando = ref(false);
const errorForm = ref("");
const modoEdicion = ref(false);
const idEditando = ref(null);

const form = ref({
  titulo: "",
  descripcion: "",
  fecha_observacion: "",
  latitud: "",
  longitud: "",
  es_publico: false,
});

function formatearFecha(fecha) {
  if (!fecha) return "";
  return new Date(fecha).toLocaleDateString(locale.value === "en" ? "en-US" : "es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function limpiarForm() {
  form.value = {
    titulo: "",
    descripcion: "",
    fecha_observacion: "",
    latitud: "",
    longitud: "",
    es_publico: false,
  };
  errorForm.value = "";
  modoEdicion.value = false;
  idEditando.value = null;
}

async function cargarReportes() {
  if (!auth.isLoggedIn.value || !auth.user.value?.token) return;
  cargando.value = true;
  try {
    reportes.value = await reportsService.listar(auth.user.value.token);
  } catch (err) {
    console.warn("No se pudieron cargar los reportes:", err.message);
  } finally {
    cargando.value = false;
  }
}

onMounted(cargarReportes);

watch(() => auth.isLoggedIn.value, (loggedIn) => {
  if (loggedIn) cargarReportes();
  else reportes.value = [];
});

async function guardarReporte() {
  errorForm.value = "";
  const { titulo, descripcion, fecha_observacion, latitud, longitud, es_publico } = form.value;

  if (!titulo || !descripcion || !fecha_observacion || latitud === "" || longitud === "") {
    errorForm.value = t("reportes.form.errorRequeridos");
    return;
  }

  guardando.value = true;
  try {
    const datos = {
      titulo,
      descripcion,
      fecha_observacion: new Date(fecha_observacion).toISOString(),
      latitud: Number(latitud),
      longitud: Number(longitud),
      es_publico,
    };

    if (modoEdicion.value) {
      await reportsService.actualizar(auth.user.value.token, idEditando.value, datos);
    } else {
      await reportsService.crear(auth.user.value.token, datos);
    }

    limpiarForm();
    await cargarReportes();
  } catch (err) {
    errorForm.value = err.message || t("reportes.form.errorGuardar");
  } finally {
    guardando.value = false;
  }
}

function editarReporte(reporte) {
  modoEdicion.value = true;
  idEditando.value = reporte.id;
  form.value = {
    titulo: reporte.titulo,
    descripcion: reporte.descripcion,
    fecha_observacion: reporte.fecha_observacion?.slice(0, 10) ?? "",
    latitud: reporte.latitud,
    longitud: reporte.longitud,
    es_publico: reporte.es_publico,
  };
}

function cancelarEdicion() {
  limpiarForm();
}

async function eliminarReporte(id) {
  if (!confirm(t("reportes.lista.confirmEliminar"))) return;
  try {
    await reportsService.eliminar(auth.user.value.token, id);
    await cargarReportes();
  } catch (err) {
    alert(err.message || t("reportes.lista.errorEliminar"));
  }
}
</script>

<style scoped>
.auth-note {
  background-color: rgba(255, 200, 87, 0.08);
  border: 1px solid rgba(255, 200, 87, 0.3);
  color: var(--color-warning);
  font-size: 0.8rem;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
}

.rep-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 24px;
}

.form-card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.form-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
}

.field {
  display: flex;
  flex-direction: column;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.field-textarea {
  resize: vertical;
  min-height: 80px;
}

.radio-group {
  display: flex;
  gap: 1.25rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--color-text-primary);
  cursor: pointer;
}

.radio {
  accent-color: var(--color-accent);
  cursor: pointer;
}

.submit-btn {
  width: 100%;
  margin-top: 0.25rem;
}

.cancel-btn {
  width: 100%;
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.cancel-btn:hover {
  background-color: var(--color-bg-elevated);
}

.submit-helper {
  text-align: center;
  font-size: 0.72rem;
  color: var(--color-text-disabled);
  margin: 0;
}

.error-msg {
  font-size: 0.8rem;
  color: var(--color-danger);
  margin: 0;
}

.loading-msg,
.empty-msg {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-align: center;
  padding: 2rem 0;
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.rep-card {
  display: flex;
  align-items: center;
  gap: 14px;
}

.rep-thumb {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  background-color: var(--color-bg-elevated);
  border: 1px dashed var(--color-border);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  font-size: 1.4rem;
}

.rep-info {
  flex: 1;
  min-width: 0;
}

.rep-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rep-meta {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-weight: 500;
}

.badge.public { background-color: rgba(91, 140, 255, 0.14); color: var(--color-accent); }
.badge.private { background-color: rgba(90, 100, 153, 0.25); color: var(--color-text-secondary); }

.rep-actions {
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
}

.icon-btn {
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-secondary);
  padding: 0.3rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.icon-btn:hover {
  background-color: var(--color-bg-nav);
}

@media (max-width: 820px) {
  .rep-grid,
  .field-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .rep-card {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .rep-title {
    white-space: normal;
  }

  .rep-actions {
    flex-basis: 100%;
    gap: 0.6rem;
    margin-top: 0.6rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border);
  }

  .icon-btn {
    flex: 1;
    padding: 0.55rem;
    font-size: 1rem;
  }
}
</style>
