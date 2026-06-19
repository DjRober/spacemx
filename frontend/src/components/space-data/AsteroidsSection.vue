<template>
  <section id="asteroides" class="asteroids-section">
    <h2 class="section-title">Asteroides Cercanos</h2>
    <p class="section-subtitle">Objetos próximos a la Tierra detectados por el sistema NeoWs de la NASA.</p>

    <div class="filters">
      <input
        v-model="filters.search"
        type="text"
        class="search-input"
        placeholder="Buscar por nombre..."
      />
      <label class="checkbox-label">
        <input v-model="filters.hazardousOnly" type="checkbox" class="checkbox" />
        Solo potencialmente peligrosos
      </label>
    </div>

    <div class="table-wrapper">
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
            <td>{{ asteroid.velocity_km_h }} km/h</td>
            <td>{{ asteroid.close_approach_date }}</td>
            <td>
              <span :class="asteroid.is_potentially_hazardous ? 'badge danger' : 'badge safe'">
                {{ asteroid.is_potentially_hazardous ? '⚠️ Sí' : '✅ No' }}
              </span>
            </td>
          </tr>
          <tr v-if="filteredAsteroids.length === 0">
            <td colspan="5" class="empty-row">No se encontraron asteroides con esos filtros.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { neowsService } from '../../services/neowsService'

const asteroids = ref([])
const filters = reactive({
  search: '',
  hazardousOnly: false
})

onMounted(async () => {
  asteroids.value = await neowsService.getUpcomingAsteroids()
})

const filteredAsteroids = computed(() => {
  return asteroids.value.filter(ast => {
    const matchesSearch = ast.name.toLowerCase().includes(filters.search.toLowerCase())
    const matchesHazard = !filters.hazardousOnly || ast.is_potentially_hazardous
    return matchesSearch && matchesHazard
  })
})
</script>

<style scoped>
.asteroids-section {
  padding: 2rem 1.5rem;
  max-width: 960px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--color-text-primary);
}

.section-subtitle {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--color-text-disabled);
  background-color: var(--color-bg-elevated);
  color: var(--color-text-primary);
  font-size: 1rem;
}

.search-input::placeholder {
  color: var(--color-text-disabled);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  white-space: nowrap;
}

.checkbox {
  accent-color: var(--color-accent);
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.table-wrapper {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: var(--color-bg-elevated);
}

th {
  padding: 0.85rem 1rem;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

td {
  padding: 0.85rem 1rem;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  border-top: 1px solid var(--color-bg-elevated);
}

tbody tr:hover {
  background-color: var(--color-bg-elevated);
}

.name-cell {
  font-weight: 500;
  color: var(--color-accent);
}

.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge.danger {
  background-color: rgba(239, 68, 68, 0.15);
  color: var(--color-danger);
}

.badge.safe {
  background-color: rgba(16, 185, 129, 0.15);
  color: var(--color-success);
}

.empty-row {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 2rem;
}
</style>
