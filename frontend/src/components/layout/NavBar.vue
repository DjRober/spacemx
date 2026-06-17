<script setup>
import { ref } from 'vue'

const links = [
  { href: '#apod',        label: 'APOD' },
  { href: '#asteroides',  label: 'Asteroides' },
  { href: '#marte',       label: 'Marte' },
  { href: '#iss',         label: 'ISS' },
  { href: '#reportes',    label: 'Reportes' },
]

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <nav class="navbar">
    <a href="#" class="navbar__brand" @click="closeMenu">SpaceMex</a>

    <!-- Links — escritorio -->
    <ul class="navbar__links">
      <li v-for="link in links" :key="link.href">
        <a :href="link.href" class="navbar__link">{{ link.label }}</a>
      </li>
    </ul>

    <!-- Botón hamburguesa — móvil -->
    <button
      class="navbar__hamburger"
      :class="{ 'is-open': menuOpen }"
      :aria-expanded="menuOpen"
      aria-label="Menú de navegación"
      @click="toggleMenu"
    >
      <span class="bar" />
      <span class="bar" />
      <span class="bar" />
    </button>

    <!-- Menú desplegable — móvil -->
    <ul
      class="navbar__drawer"
      :class="{ 'is-open': menuOpen }"
      @click="closeMenu"
    >
      <li v-for="link in links" :key="link.href">
        <a :href="link.href" class="navbar__link">{{ link.label }}</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 60px;
  background-color: var(--color-bg-nav);
  border-bottom: 1px solid var(--color-accent);
}

.navbar__brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent);
  text-decoration: none;
  letter-spacing: 0.05em;
}

/* ── Links escritorio ──────────────────────────────────────────── */
.navbar__links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.navbar__link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.navbar__link:hover {
  color: var(--color-text-primary);
}

/* ── Hamburguesa ───────────────────────────────────────────────── */
.navbar__hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.bar {
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--color-text-primary);
  border-radius: 2px;
  transition: transform 0.3s, opacity 0.3s;
  transform-origin: center;
}

/* Animación X al abrir */
.navbar__hamburger.is-open .bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.navbar__hamburger.is-open .bar:nth-child(2) {
  opacity: 0;
}
.navbar__hamburger.is-open .bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ── Drawer móvil ──────────────────────────────────────────────── */
.navbar__drawer {
  display: none;
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  flex-direction: column;
  list-style: none;
  background-color: var(--color-bg-nav);
  border-bottom: 1px solid var(--color-accent);
  padding: 1rem 2rem;
  gap: 1.25rem;

  /* Animación de entrada */
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.25s, transform 0.25s;
  pointer-events: none;
}

.navbar__drawer.is-open {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* ── Breakpoint móvil ──────────────────────────────────────────── */
@media (max-width: 640px) {
  .navbar__links {
    display: none;
  }

  .navbar__hamburger {
    display: flex;
  }

  .navbar__drawer {
    display: flex;
  }
}
</style>
