<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

// Las 4 funciones principales de SpaceMex.
const features = [
  {
    icon: "🌌",
    accent: "var(--color-star)",
    title: "Foto del Día",
    desc: "La imagen astronómica diaria de la NASA, con su descripción científica y un buscador histórico.",
  },
  {
    icon: "🛰️",
    accent: "var(--color-success)",
    title: "ISS en vivo",
    desc: "Sigue la Estación Espacial Internacional en tiempo real: posición, velocidad y próximos pasos sobre ti.",
  },
  {
    icon: "🔴",
    accent: "var(--color-warning)",
    title: "Clima en Marte",
    desc: "Temperatura, presión y vientos del último sol marciano medidos por las sondas en el planeta rojo.",
  },
  {
    icon: "☄️",
    accent: "var(--color-danger)",
    title: "Asteroides",
    desc: "Objetos cercanos a la Tierra de los próximos días, con distancia, tamaño y nivel de peligrosidad.",
  },
];

function goToDashboard() {
  router.push("/dashboard");
}

function goToRegister() {
  router.push("/register");
}
</script>

<template>
  <!-- ── Hero ─────────────────────────────────────────────────── -->
  <section class="hero">
    <div class="hero__glow" aria-hidden="true"></div>

    <div class="hero__inner">
      <span class="hero__eyebrow"
        >🚀 SpaceMex · Datos espaciales en tiempo real</span
      >

      <h1 class="hero__title">Explora el universo<br />desde tu navegador</h1>

      <p class="hero__subtitle">
        Un solo lugar para seguir la Estación Espacial Internacional, el clima
        en Marte, los asteroides cercanos y la foto astronómica del día. Datos
        de la NASA, presentados de forma clara.
      </p>

      <div class="hero__actions">
        <button class="btn hero__btn" @click="goToDashboard">
          Ver dashboard
        </button>
        <button class="btn btn--ghost hero__btn" @click="goToRegister">
          Crear cuenta
        </button>
      </div>
    </div>
  </section>

  <!-- ── Características ───────────────────────────────────────── -->
  <section class="section features">
    <h2 class="section__title">¿Qué puedes hacer en SpaceMex?</h2>
    <p class="section__subtitle">
      Cuatro ventanas al cosmos, actualizadas a diario.
    </p>

    <div class="features__grid">
      <article v-for="f in features" :key="f.title" class="card feature">
        <span class="feature__icon" :style="{ '--feature-accent': f.accent }">{{
          f.icon
        }}</span>
        <h3 class="feature__title">{{ f.title }}</h3>
        <p class="feature__desc">{{ f.desc }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
/* ── Hero ──────────────────────────────────────────────────────── */
.hero {
  position: relative;
  overflow: hidden;
  border-bottom: 1px dashed var(--color-border);
}

/* Resplandor nebuloso detrás del título */
.hero__glow {
  position: absolute;
  top: -160px;
  left: 50%;
  transform: translateX(-50%);
  width: 720px;
  height: 720px;
  background: radial-gradient(
    circle at center,
    rgba(91, 140, 255, 0.22),
    rgba(74, 20, 140, 0.12) 40%,
    transparent 70%
  );
  pointer-events: none;
}

.hero__inner {
  position: relative;
  max-width: 820px;
  margin: 0 auto;
  padding: 112px 48px 96px;
  text-align: center;
}

.hero__eyebrow {
  display: inline-block;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: var(--color-accent);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  margin-bottom: 1.75rem;
}

.hero__title {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.08;
  margin-bottom: 1.25rem;
}

.hero__subtitle {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto 2.25rem;
  text-wrap: pretty;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
}

.hero__btn {
  padding: 0.8rem 1.6rem;
  font-size: 0.95rem;
  border-radius: 10px;
}

/* ── Características ────────────────────────────────────────────── */
.features__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.feature {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition:
    transform 0.2s,
    border-color 0.2s;
}

.feature:hover {
  transform: translateY(-4px);
  border-color: var(--color-accent);
}

.feature__icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  font-size: 1.4rem;
  border-radius: 12px;
  background: color-mix(in srgb, var(--feature-accent) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--feature-accent) 35%, transparent);
  margin-bottom: 0.4rem;
}

.feature__title {
  font-size: 1.05rem;
  font-weight: 700;
}

.feature__desc {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

/* ── Responsive ────────────────────────────────────────────────── */
@media (max-width: 980px) {
  .features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 820px) {
  .hero__inner {
    padding: 80px 18px 64px;
  }
}

@media (max-width: 520px) {
  .features__grid {
    grid-template-columns: 1fr;
  }
}
</style>
