<script setup>
import NavBar from './components/layout/NavBar.vue'
import AppFooter from './components/layout/AppFooter.vue'
</script>

<template>
  <div class="app-shell">
    <NavBar />

    <main class="app-main">
      <!-- Las secciones del dashboard se irán agregando aquí -->
      <!-- #apod | #asteroides | #marte | #iss | #reportes -->
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  padding: 2rem;
}
</style>
