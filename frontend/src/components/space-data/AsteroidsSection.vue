<template>
  <section id="asteroides" class="section asteroids-section">
    <h2 class="section__title">{{ t("asteroides.title") }}</h2>
    <p class="section__subtitle">{{ t("asteroides.subtitle") }}</p>

    <!-- Barra de filtros -->
    <div class="filters">
      <div>
        <label class="field-label" for="ast-desde">{{ t("asteroides.filtros.desde") }}</label>
        <input id="ast-desde" v-model="filters.desde" type="date" class="input" @change="fetchAsteroids" />
      </div>
      <div>
        <label class="field-label" for="ast-hasta">{{ t("asteroides.filtros.hasta") }}</label>
        <input id="ast-hasta" v-model="filters.hasta" type="date" class="input" @change="fetchAsteroids" />
      </div>
      <div>
        <label class="field-label" for="ast-size">{{ t("asteroides.filtros.tamano") }}</label>
        <select id="ast-size" v-model="filters.size" class="select">
          <option value="all">{{ t("asteroides.filtros.todos") }}</option>
          <option value="small">{{ t("asteroides.filtros.small") }}</option>
          <option value="mid">{{ t("asteroides.filtros.mid") }}</option>
          <option value="large">{{ t("asteroides.filtros.large") }}</option>
        </select>
      </div>
      <div>
        <label class="field-label" for="ast-hazard">{{ t("asteroides.filtros.peligrosidad") }}</label>
        <select id="ast-hazard" v-model="filters.hazard" class="select">
          <option value="all">{{ t("asteroides.filtros.todas") }}</option>
          <option value="yes">{{ t("asteroides.filtros.peligroso") }}</option>
          <option value="no">{{ t("asteroides.filtros.noPeligroso") }}</option>
        </select>
      </div>
      <button class="btn btn--ghost" @click="resetFilters">
        {{ t("asteroides.filtros.limpiar") }}
      </button>
    </div>

    <!-- Aviso del límite de la NASA (rango máximo de 7 días) -->
    <p v-if="rangeError" class="range-note">{{ t("asteroides.filtros.rangoMax") }}</p>

    <!-- Tabla de resultados -->
    <div class="card table-card">
      <table>
        <thead>
          <tr>
            <th>{{ t("asteroides.tabla.nombre") }}</th>
            <th>{{ t("asteroides.tabla.diametro") }}</th>
            <th>{{ t("asteroides.tabla.velocidad") }}</th>
            <th>{{ t("asteroides.tabla.fecha") }}</th>
            <th>{{ t("asteroides.tabla.peligroso") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="empty-row">{{ t("asteroides.tabla.cargando") }}</td>
          </tr>
          <template v-else>
            <tr v-for="asteroid in filteredAsteroids" :key="asteroid.id">
              <td class="name-cell">{{ asteroid.name }}</td>
              <td>{{ asteroid.diameter_max_km }} km</td>
              <td>{{ formatearVelocidad(asteroid.velocity_km_h) }} km/h</td>
              <td>{{ asteroid.close_approach_date }}</td>
              <td>
                <span :class="asteroid.is_potentially_hazardous ? 'tag bad' : 'tag ok'">
                  {{ asteroid.is_potentially_hazardous ? t("asteroides.tabla.si") : t("asteroides.tabla.no") }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredAsteroids.length === 0">
              <td colspan="5" class="empty-row">
                {{ t("asteroides.tabla.vacio") }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { neowsService } from "../../services/neowsService";

const { t, locale } = useI18n();

// El separador de miles cambia según el idioma (1,234 en inglés / 1.234 en español)
function formatearVelocidad(v) {
  return Number(v).toLocaleString(locale.value === "en" ? "en-US" : "es-MX");
}

const asteroids = ref([]);
const loading = ref(false);
const rangeError = ref(false);

// Rango máximo permitido por la API de NASA NeoWs.
const MAX_RANGE_DAYS = 7;

// Devuelve una fecha (Date) como "YYYY-MM-DD" en horario local.
function toISODate(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split("T")[0];
}

function addDays(isoDate, days) {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

// Diferencia en días entre dos fechas ISO (hasta - desde), inclusivo.
function diffDays(desde, hasta) {
  const a = new Date(desde + "T00:00:00");
  const b = new Date(hasta + "T00:00:00");
  return Math.round((b - a) / 86400000);
}

// Ventana por defecto: hoy .. hoy + 6 días (7 días, el máximo de la NASA).
const hoy = toISODate(new Date());
const filters = reactive({
  desde: hoy,
  hasta: addDays(hoy, MAX_RANGE_DAYS - 1),
  size: "all",
  hazard: "all",
});

// Pide los asteroides al backend con el rango actual. Valida el tope de 7 días
// y el orden de las fechas antes de disparar la petición.
async function fetchAsteroids() {
  if (!filters.desde || !filters.hasta) return;

  // Corrige el orden si el usuario invierte las fechas.
  if (filters.hasta < filters.desde) {
    filters.hasta = filters.desde;
  }

  if (diffDays(filters.desde, filters.hasta) > MAX_RANGE_DAYS - 1) {
    rangeError.value = true;
    return;
  }

  rangeError.value = false;
  loading.value = true;
  try {
    asteroids.value = await neowsService.getUpcomingAsteroids({
      desde: filters.desde,
      hasta: filters.hasta,
    });
  } finally {
    loading.value = false;
  }
}

onMounted(fetchAsteroids);

function resetFilters() {
  filters.desde = hoy;
  filters.hasta = addDays(hoy, MAX_RANGE_DAYS - 1);
  filters.size = "all";
  filters.hazard = "all";
  fetchAsteroids();
}

// Umbrales de tamaño en km (100 m = 0.1 km, 500 m = 0.5 km)
function matchesSize(diameterKm) {
  if (filters.size === "small") return diameterKm < 0.1;
  if (filters.size === "mid") return diameterKm >= 0.1 && diameterKm <= 0.5;
  if (filters.size === "large") return diameterKm > 0.5;
  return true;
}

const filteredAsteroids = computed(() =>
  asteroids.value.filter((ast) => {
    const matchesDesde = !filters.desde || ast.close_approach_date >= filters.desde;
    const matchesHasta = !filters.hasta || ast.close_approach_date <= filters.hasta;
    const matchesHazard =
      filters.hazard === "all" ||
      (filters.hazard === "yes" && ast.is_potentially_hazardous) ||
      (filters.hazard === "no" && !ast.is_potentially_hazardous);
    return matchesDesde && matchesHasta && matchesSize(ast.diameter_max_km) && matchesHazard;
  })
);
</script>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 14px;
  align-items: end;
  margin-bottom: 22px;
}

.filters .btn {
  height: fit-content;
}

.range-note {
  margin: -10px 0 18px;
  color: var(--color-danger);
  font-size: 0.8rem;
}

/* ── Tabla ─────────────────────────────────────────────────────── */
.table-card {
  padding: 0;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

th {
  color: var(--color-text-secondary);
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid var(--color-border);
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--color-bg-elevated);
  color: var(--color-text-primary);
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background-color: var(--color-bg-elevated);
}

.name-cell {
  font-weight: 500;
  color: var(--color-accent);
}

.tag {
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

.tag.ok {
  background: rgba(61, 220, 151, 0.15);
  color: var(--color-success);
}

.tag.bad {
  background: rgba(255, 93, 115, 0.15);
  color: var(--color-danger);
}

.empty-row {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 2rem;
}

/* ── Responsive ───────────────────────────────────────────────── */
@media (max-width: 820px) {
  .filters {
    grid-template-columns: 1fr 1fr;
  }

  .table-card {
    overflow-x: auto;
  }
}
</style>
