<template>
  <section id="reportes" class="section reportes-section">
    <h2 class="section__title">Mis Reportes Espaciales</h2>
    <p class="section__subtitle">
      Formulario para una nueva observación y lista de reportes con CRUD
      completo.
    </p>

    <div class="auth-note">
      🔒 Esta sección requiere iniciar sesión — endpoints autenticados de la API
      SpaceMex.
    </div>

    <div class="rep-grid">
      <!-- Formulario nueva observación -->
      <form class="card form-card" @submit.prevent>
        <h3 class="form-title">Nueva observación</h3>

        <div class="field">
          <label class="field-label" for="rep-titulo">Título</label>
          <input
            id="rep-titulo"
            type="text"
            class="input"
            placeholder="Ej. Aurora boreal en Chihuahua"
          />
        </div>

        <div class="field">
          <label class="field-label" for="rep-desc">Descripción</label>
          <textarea
            id="rep-desc"
            class="input field-textarea"
            placeholder="Describe lo que observaste..."
          ></textarea>
        </div>

        <div class="field-row">
          <div class="field">
            <label class="field-label" for="rep-fecha">Fecha</label>
            <input id="rep-fecha" type="date" class="input" />
          </div>
          <div class="field">
            <label class="field-label" for="rep-coords">Coordenadas</label>
            <input id="rep-coords" type="text" class="input" placeholder="Lat, Lon" />
          </div>
        </div>

        <div class="field">
          <label class="field-label" for="rep-imagen">Imagen (opcional)</label>
          <input
            id="rep-imagen"
            type="text"
            class="input"
            placeholder="URL de la imagen"
          />
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

        <button class="btn submit-btn" disabled>Guardar reporte</button>
        <p class="submit-helper">Inicia sesión para guardar observaciones.</p>
      </form>

      <!-- Lista de reportes mock -->
      <div class="reports-list">
        <div v-for="reporte in reportes" :key="reporte.id" class="card rep-card">
          <div class="rep-thumb">
            <span class="rep-thumb-icon">🔭</span>
          </div>
          <div class="rep-info">
            <h4 class="rep-title">{{ reporte.titulo }}</h4>
            <p class="rep-meta">
              {{ reporte.fecha }} · {{ reporte.coords }}
              <span :class="reporte.publica ? 'badge public' : 'badge private'">
                {{ reporte.publica ? "🌐 pública" : "🔒 privada" }}
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
  { id: 1, titulo: "Aurora boreal sobre la Sierra Tarahumara", fecha: "2026-06-10", coords: "27.8° N, 107.6° O", publica: true },
  { id: 2, titulo: "Conjunción Júpiter–Venus desde Juárez", fecha: "2026-06-14", coords: "31.7° N, 106.4° O", publica: false },
  { id: 3, titulo: "Lluvia de meteoros Perseidas 2026", fecha: "2026-06-17", coords: "28.6° N, 106.0° O", publica: true },
];
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

/* ── Formulario ───────────────────────────────── */
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

.submit-helper {
  text-align: center;
  font-size: 0.72rem;
  color: var(--color-text-disabled);
  margin: 0;
}

/* ── Lista de reportes ────────────────────────── */
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

/* ── Responsive ───────────────────────────────── */
@media (max-width: 820px) {
  .rep-grid,
  .field-row {
    grid-template-columns: 1fr;
  }
}

/* Móvil estrecho (≤ 560px, optimizado para 360px):
   la tarjeta de reporte pasa a dos filas — thumb + info arriba,
   y las acciones a todo el ancho abajo con tap targets cómodos. */
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
