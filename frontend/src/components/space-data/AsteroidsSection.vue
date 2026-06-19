<template>
  <div class="asteroids-section">
    <h2>Asteroides Cercanos (NeoWs)</h2>

    <div class="filters">
      <input 
        v-model="filters.search" 
        type="text" 
        placeholder="Buscar por nombre..." 
      />
      <label>
        <input v-model="filters.hazardousOnly" type="checkbox" />
        Solo potencialmente peligrosos
      </label>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Diámetro Máx (km)</th>
          <th>Velocidad (km/h)</th>
          <th>Fecha de Enfoque</th>
          <th>Peligroso</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="asteroid in filteredAsteroids" :key="asteroid.id">
          <td>{{ asteroid.name }}</td>
          <td>{{ asteroid.diameter_max_km }} km</td>
          <td>{{ asteroid.velocity_km_h }}</td>
          <td>{{ asteroid.close_approach_date }}</td>
          <td>
            <span :class="asteroid.is_potentially_hazardous ? 'danger' : 'safe'">
              {{ asteroid.is_potentially_hazardous ? '⚠️ Sí' : '✅ No' }}
            </span>
          </td>
        </tr>
        <tr v-if="filteredAsteroids.length === 0">
          <td colspan="5">No se encontraron asteroides con esos filtros.</td>
        </tr>
      </tbody>
    </table>
  </div>
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
/* Dale el estilo que combine con tu dashboard */
.asteroids-section { padding: 20px; }
.filters { display: flex; gap: 15px; margin-bottom: 15px; align-items: center; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #333; padding: 10px; text-align: left; }
.danger { color: #ff4d4d; font-weight: bold; }
.safe { color: #4da6ff; }
</style>