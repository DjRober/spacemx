<template>
  <section id="reportes" class="reportes-section">
    <h2 class="section-title">Mis Reportes Espaciales</h2>
    <p class="section-subtitle">Registra y comparte tus observaciones astronómicas con la comunidad.</p>

    <div class="auth-note">
      🔒 Esta sección requiere iniciar sesión — endpoints autenticados de la API SpaceMex.
    </div>

    <div class="rep-grid">
      <!-- Formulario nueva observación -->
      <div class="form-card">
        <h3 class="form-title">Nueva observación</h3>

        <div class="field">
          <label class="field-label" for="rep-titulo">Título</label>
          <input id="rep-titulo" type="text" class="field-input" placeholder="Ej. Aurora boreal en Chihuahua" />
        </div>

        <div class="field">
          <label class="field-label" for="rep-desc">Descripción</label>
          <textarea id="rep-desc" class="field-input field-textarea" placeholder="Describe lo que observaste..."></textarea>
        </div>

        <div class="field-row">
          <div class="field">
            <label class="field-label" for="rep-fecha">Fecha</label>
            <input id="rep-fecha" type="date" class="field-input" />
          </div>
          <div class="field">
            <label class="field-label" for="rep-coords">Coordenadas</label>
            <input id="rep-coords" type="text" class="field-input" placeholder="Lat, Lon" />
          </div>
        </div>

        <div class="field">
          <label class="field-label" for="rep-imagen">Imagen (opcional)</label>
          <input id="rep-imagen" type="text" class="field-input" placeholder="URL de la imagen" />
        </div>

        <div class="field">
          <span class="field-label">Visibilidad</span>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" name="visibilidad" value="publica" checked class="radio" />
              🌐 Pública
            </label>
            <label class="radio-label">
              <input type="radio" name="visibilidad" value="privada" class="radio" />
              🔒 Privada
            </label>
          </div>
        </div>

        <button class="submit-btn" disabled>Guardar reporte</button>
        <p class="submit-helper">Inicia sesión para guardar observaciones.</p>
      </div>

      <!-- Lista de reportes mock -->
      <div class="reports-list">
        <div v-for="reporte in reportes" :key="reporte.id" class="rep-card">
          <div class="rep-thumb">
            <span class="rep-thumb-icon">🔭</span>
          </div>
          <div class="rep-info">
            <h4 class="rep-title">{{ reporte.titulo }}</h4>
            <p class="rep-meta">
              {{ reporte.fecha }} · {{ reporte.coords }}
              <span :class="reporte.publica ? 'badge public' : 'badge private'">
                {{ reporte.publica ? '🌐 Pública' : '🔒 Privada' }}
              </span>
            </p>
          </div>
          <div class="rep-actions">
            <button class="icon-btn" title="Editar">✏️</button>
            <button class="icon-btn" title="Eliminar">🗑️</button>
            <button class="icon-btn" title="Compartir">🔗</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// RF6 — Mis Reportes Espaciales
// Sin conexión a la API SpaceMex todavía. Lista de reportes mock para maquetar la UI.
// La lógica de auth, CRUD y visibilidad se conectará en la siguiente etapa.

const reportes = [
  { id: 1, titulo: 'Aurora boreal sobre la Sierra Tarahumara', fecha: '2026-06-10', coords: '27.8° N, 107.6° O', publica: true },
  { id: 2, titulo: 'Conjunción Júpiter–Venus desde Juárez',   fecha: '2026-06-14', coords: '31.7° N, 106.4° O', publica: false },
  { id: 3, titulo: 'Lluvia de meteoros Perseidas 2026',        fecha: '2026-06-17', coords: '28.6° N, 106.0° O', publica: true },
]
</script>

<style scoped>
.reportes-section {
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
  margin-bottom: 1.25rem;
}

.auth-note {
  background-color: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: var(--color-warning);
  font-size: 0.85rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
}

.rep-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 1.5rem;
}

/* Igual que el mockup: un solo breakpoint que colapsa el grid a una columna.
   La rep-card se mantiene como fila horizontal (thumb → info → acciones). */
@media (max-width: 820px) {
  .reportes-section {
    padding: 2.5rem 1.125rem;
  }

  .rep-grid {
    grid-template-columns: 1fr;
  }

  .field-row {
    grid-template-columns: 1fr;
  }
}

/* ── Formulario ───────────────────────────────── */
.form-card {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.field-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.field-input {
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-text-disabled);
  color: var(--color-text-primary);
  border-radius: 8px;
  padding: 0.6rem 0.85rem;
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.field-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.field-input::placeholder {
  color: var(--color-text-disabled);
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
  font-size: 0.9rem;
  color: var(--color-text-primary);
  cursor: pointer;
}

.radio {
  accent-color: var(--color-accent);
  cursor: pointer;
}

.submit-btn {
  width: 100%;
  padding: 0.7rem;
  background-color: var(--color-primary);
  color: var(--color-text-primary);
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: not-allowed;
  opacity: 0.5;
  margin-top: 0.25rem;
}

.submit-helper {
  text-align: center;
  font-size: 0.78rem;
  color: var(--color-text-disabled);
  margin: 0;
}

/* ── Lista de reportes ────────────────────────── */
.reports-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rep-card {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rep-thumb {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  background-color: var(--color-bg-elevated);
  border: 1px dashed var(--color-text-disabled);
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
  color: var(--color-text-primary);
  margin: 0 0 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rep-meta {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badge {
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-weight: 500;
}

.badge.public  { background-color: rgba(0, 184, 217, 0.12); color: var(--color-accent); }
.badge.private { background-color: rgba(71, 85, 105, 0.25); color: var(--color-text-secondary); }

.rep-actions {
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
}

.icon-btn {
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-bg-elevated);
  border-radius: 6px;
  color: var(--color-text-secondary);
  padding: 0.3rem 0.5rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.icon-btn:hover {
  background-color: var(--color-bg-nav);
}
</style>
