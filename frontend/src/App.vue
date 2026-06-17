<script setup>
import NavBar from './components/layout/NavBar.vue'
import AppFooter from './components/layout/AppFooter.vue'
import IssMapSection from './components/iss/IssMapSection.vue'
import IssAlertSection from './components/iss/IssAlertSection.vue'
</script>

<template>
  <div class="app-shell">
    <NavBar />

    <main class="app-main">
      <!-- #apod | #asteroides | #marte | #reportes — próximamente -->
      <IssMapSection />
      <IssAlertSection />
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
