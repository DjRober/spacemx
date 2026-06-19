<script setup>
import NavBar from "./components/layout/NavBar.vue";
import AppFooter from "./components/layout/AppFooter.vue";
import ApodSection from "./components/apod/ApodSection.vue";
import IssSection from "./components/iss/IssSection.vue";
import MarsWeatherSection from "./components/space-data/MarsWeatherSection.vue";
import AsteroidsSection from "./components/space-data/AsteroidsSection.vue";
import ReportesSection from "./components/reportes/ReportesSection.vue";
</script>

<template>
  <div class="app-shell">
    <NavBar />

    <main class="app-main">
      <ApodSection />
      <IssSection />
      <MarsWeatherSection />
      <AsteroidsSection />
      <ReportesSection />
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
}
</style>
