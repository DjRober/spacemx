<template>
  <footer class="footer">
    <p class="footer__text">
      SpaceMex &copy; {{ year }} · NASA Space Dashboard — Arquitectura SOA. Datos
      provistos por
      <a
        href="https://api.nasa.gov/"
        target="_blank"
        rel="noopener noreferrer"
        class="footer__link"
      >NASA Open APIs</a>
      y
      <a
        href="http://open-notify.org/"
        target="_blank"
        rel="noopener noreferrer"
        class="footer__link"
      >Open-Notify</a>.
    </p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: var(--color-bg-nav);
  border-top: 1px solid var(--color-bg-elevated);
}

.footer__text {
  font-size: 0.8rem;
  color: var(--color-text-disabled);
}

.footer__link {
  color: var(--color-accent);
  text-decoration: none;
}

.footer__link:hover {
  text-decoration: underline;
}
</style>
