<template>
  <section id="asteroides" class="section asteroids-section">
    <h2 class="section__title">Asteroides cercanos (NeoWs)</h2>
    <p class="section__subtitle">
      Objetos próximos a la Tierra detectados por el sistema NeoWs de la NASA.
      Barra de filtros arriba, resultados abajo.
    </p>

    <!-- Barra de filtros -->
    <div class="filters">
      <div>
        <label class="field-label" for="ast-desde">Desde</label>
        <input id="ast-desde" v-model="filters.desde" type="date" class="input" />
      </div>
      <div>
        <label class="field-label" for="ast-hasta">Hasta</label>
        <input id="ast-hasta" v-model="filters.hasta" type="date" class="input" />
      </div>
      <div>
        <label class="field-label" for="ast-size">Tamaño estimado</label>
        <select id="ast-size" v-model="filters.size" class="select">
          <option value="all">Todos</option>
          <option value="small">&lt; 100 m</option>
          <option value="mid">100–500 m</option>
          <option value="large">&gt; 500 m</option>
        </select>
      </div>
      <div>
        <label class="field-label" for="ast-hazard">Peligrosidad</label>
        <select id="ast-hazard" v-model="filters.hazard" class="select">
          <option value="all">Todas</option>
          <option value="yes">Peligroso</option>
          <option value="no">No peligroso</option>
        </select>
      </div>
      <button class="btn btn--ghost" @click="resetFilters">Limpiar</button>
    </div>

    <!-- Tabla de resultados -->
    <div class="card table-card">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Diámetro máx.</th>
            <th>Velocidad</th>
            <th>Fecha de enfoque</th>
            <th>Peligroso</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="asteroid in filteredAsteroids" :key="asteroid.id">
            <td class="name-cell">{{ asteroid.name }}</td>
            <td>{{ asteroid.diameter_max_km }} km</td>
            <td>{{ Number(asteroid.velocity_km_h).toLocaleString("es-MX") }} km/h</td>
            <td>{{ asteroid.close_approach_date }}</td>
            <td>
              <span :class="asteroid.is_potentially_hazardous ? 'tag bad' : 'tag ok'">
                {{ asteroid.is_potentially_hazardous ? "⚠ Sí" : "✓ No" }}
              </span>
            </td>
          </tr>
          <tr v-if="filteredAsteroids.length === 0">
            <td colspan="5" class="empty-row">
              No se encontraron asteroides con esos filtros.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { neowsService } from "../../services/neowsService";

const asteroids = ref([]);
const filters = reactive({
  desde: "",
  hasta: "",
  size: "all",
  hazard: "all",
});

onMounted(async () => {
  asteroids.value = await neowsService.getUpcomingAsteroids();
});

function resetFilters() {
  filters.desde = "";
  filters.hasta = "";
  filters.size = "all";
  filters.hazard = "all";
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
