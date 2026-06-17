<template>
  <section id="alertas-iss" class="iss-alert-section">
    <h2 class="section-title">Alertas de paso de la ISS</h2>
    <p class="section-subtitle">
      Ingresa tu ciudad para recibir avisos cuando la ISS pase sobre tu ubicación.
    </p>

    <form class="alert-form">
      <label class="alert-label" for="city-input">Ciudad</label>
      <div class="alert-form-row">
        <input
          id="city-input"
          type="text"
          class="alert-input"
          placeholder="Ej. Ciudad Juárez"
        />
        <button type="submit" class="alert-submit-btn">
          Activar alerta
        </button>
      </div>
    </form>

    <p class="alert-helper-text">
      Aún no hay lógica conectada. Esta sección solo muestra la estructura del formulario.
    </p>
  </section>
</template>

<script setup>
// RF5 — Alertas de paso de la ISS
// Sin conexión a Open-Notify todavía. Formulario únicamente visual, sin lógica de envío.
// Cuando se conecte la API, aquí se manejará el estado de "ciudad" y la llamada al servicio.
</script>

<style scoped>
.iss-alert-section {
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

.alert-form {
  background-color: #1f2937;
  border-radius: 12px;
  padding: 1.5rem;
}

.alert-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #f9fafb;
}

.alert-form-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.alert-input {
  flex: 1;
  min-width: 200px;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  border: 1px solid #374151;
  background-color: #111827;
  color: #f9fafb;
  font-size: 1rem;
}

.alert-input::placeholder {
  color: #6b7280;
}

.alert-submit-btn {
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  border: none;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
}

.alert-submit-btn:hover {
  background-color: #1d4ed8;
}

.alert-helper-text {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #6b7280;
}
</style>
