<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "../../composables/useAuth.js";

const route = useRoute();
const router = useRouter();
const auth = useAuth();

const links = [
  { href: "#apod", label: "Foto del Día" },
  { href: "#iss", label: "ISS" },
  { href: "#marte", label: "Marte" },
  { href: "#asteroides", label: "Asteroides" },
  { href: "#reportes", label: "Mis Reportes" },
];

const menuOpen = ref(false);
const activeId = ref("apod");
const lang = ref("ES");

// ── Lógica según ruta activa ──────────────────────────────────────
// /dashboard      -> links de secciones + botón de sesión
// /  (home)       -> solo logo + "Iniciar sesión" + "Ver dashboard"
// /login /register -> solo logo, sin links ni botones de sesión
const isDashboard = computed(() => route.path === "/dashboard");
const isHome = computed(() => route.path === "/");
const isAuthPage = computed(
  () => route.path === "/login" || route.path === "/register"
);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}

function toggleLang() {
  lang.value = lang.value === "ES" ? "EN" : "ES";
}

function irALogin() {
  closeMenu();
  router.push("/login");
}

function irADashboard() {
  closeMenu();
  router.push("/dashboard");
}

function cerrarSesion() {
  closeMenu();
  auth.logout();
  router.push("/");
}

// Resalta el link de la sección visible mientras se hace scroll.
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeId.value = entry.target.id;
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <nav class="navbar">
    <a href="/" class="navbar__brand" @click.prevent="router.push('/'); closeMenu()">
      <span class="navbar__dot">🚀</span> SpaceMex
    </a>

    <!-- Links de secciones — solo en /dashboard, escritorio -->
    <ul v-if="isDashboard" class="navbar__links">
      <li v-for="link in links" :key="link.href">
        <a
          :href="link.href"
          class="navbar__link"
          :class="{ 'is-active': '#' + activeId === link.href }"
        >{{ link.label }}</a>
      </li>
    </ul>

    <!-- Acciones derecha -->
    <button v-if="!isAuthPage" class="navbar__lang" @click="toggleLang">{{ lang }} / {{ lang === "ES" ? "EN" : "ES" }}</button>

    <!-- Home: botones "Iniciar sesión" + "Ver dashboard" -->
    <template v-if="isHome">
      <button v-if="!auth.isLoggedIn.value" class="navbar__login navbar__login--bar" @click="irALogin">
        Iniciar sesión
      </button>
      <button class="navbar__dashboard-btn" @click="irADashboard">
        Ver dashboard
      </button>
    </template>

    <!-- Dashboard: estado de sesión -->
    <template v-else-if="isDashboard">
      <button v-if="!auth.isLoggedIn.value" class="navbar__login navbar__login--bar" @click="irALogin">
        Iniciar sesión
      </button>
      <div v-else class="navbar__user">
        <span class="navbar__user-name">{{ auth.user.value?.name }}</span>
        <button class="navbar__login navbar__login--bar" @click="cerrarSesion">
          Cerrar sesión
        </button>
      </div>
    </template>
    <!-- Botón hamburguesa — móvil, solo si hay algo que mostrar en el drawer -->
    <button
      v-if="isDashboard"
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

    <!-- Menú desplegable — móvil, solo en /dashboard -->
    <ul
      v-if="isDashboard"
      class="navbar__drawer"
      :class="{ 'is-open': menuOpen }"
      @click="closeMenu"
    >
      <li v-for="link in links" :key="link.href">
        <a
          :href="link.href"
          class="navbar__link"
          :class="{ 'is-active': '#' + activeId === link.href }"
        >{{ link.label }}</a>
      </li>
      <li>
        <button v-if="!auth.isLoggedIn.value" class="navbar__login navbar__login--drawer" @click="irALogin">
          Iniciar sesión
        </button>
        <button v-else class="navbar__login navbar__login--drawer" @click="cerrarSesion">
          Cerrar sesión ({{ auth.user.value?.name }})
        </button>
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
  gap: 8px;
  padding: 0 32px;
  height: 60px;
  background-color: rgba(11, 14, 29, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-decoration: none;
  margin-right: auto;
  cursor: pointer;
}

.navbar__brand:hover {
  text-decoration: none;
}

.navbar__dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, var(--color-accent), #1a2a6c);
  display: grid;
  place-items: center;
  font-size: 0.95rem;
}

/* ── Links escritorio ──────────────────────────────────────────── */
.navbar__links {
  display: flex;
  gap: 4px;
  list-style: none;
}

.navbar__link {
  display: block;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  padding: 8px 14px;
  border-radius: 8px;
  transition: color 0.2s, background-color 0.2s;
}

.navbar__link:hover,
.navbar__link.is-active {
  color: var(--color-text-primary);
  background-color: var(--color-bg-elevated);
  text-decoration: none;
}

/* ── Idioma ────────────────────────────────────────────────────── */
.navbar__lang {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  background: none;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;
}

.navbar__lang:hover {
  color: var(--color-text-primary);
  border-color: var(--color-accent);
}

/* ── Login ─────────────────────────────────────────────────────── */
.navbar__login {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.navbar__login:hover {
  background-color: var(--color-hover);
}

.navbar__login--drawer {
  width: 100%;
}

/* ── Botón "Ver dashboard" (solo en home) ─────────────────────── */
.navbar__dashboard-btn {
  background-color: transparent;
  border: 1px solid var(--color-accent);
  color: var(--color-text-primary);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.navbar__dashboard-btn:hover {
  background-color: var(--color-bg-elevated);
}

/* ── Usuario logueado ─────────────────────────────────────────── */
.navbar__user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.navbar__user-name {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
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
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  padding: 6px;
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
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 2rem;
  gap: 0.5rem;

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
@media (max-width: 820px) {
  .navbar {
    padding: 0 16px;
  }

  .navbar__links,
  .navbar__login--bar {
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