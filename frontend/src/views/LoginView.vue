<template>
  <div class="login-page">
    <div class="login-card card">

      <!-- Logo / nombre -->
      <div class="login-brand">
        <span class="login-brand-icon">🚀</span>
        <h1 class="login-brand-name">SpaceMex</h1>
        <p class="login-brand-sub">NASA Space Dashboard</p>
      </div>

      <!-- Formulario -->
      <div class="login-form">
        <div class="login-field">
          <label for="email" class="field-label">Correo electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="input"
            placeholder="tucorreo@ejemplo.com"
            autocomplete="email"
          />
        </div>

        <div class="login-field">
          <label for="password" class="field-label">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="input"
            placeholder="••••••••"
            autocomplete="current-password"
            @keyup.enter="handleLogin"
          />
        </div>

        <button class="btn login-btn" @click="handleLogin">
          Iniciar sesión
        </button>
      </div>

      <!-- Link a registro -->
      <p class="login-register-link">
        ¿No tienes cuenta?
        <router-link to="/register">Regístrate</router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const auth = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')

function handleLogin() {
  auth.login(email.value, password.value)
  router.push('/dashboard')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-app);
  padding: 1.5rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Brand ─────────────────────────────────────────────────────── */
.login-brand {
  text-align: center;
}

.login-brand-icon {
  font-size: 2.25rem;
  display: block;
  margin-bottom: 0.5rem;
}

.login-brand-name {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem;
}

.login-brand-sub {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin: 0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* ── Form ──────────────────────────────────────────────────────── */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.login-btn {
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.75rem;
  font-size: 0.95rem;
}

/* ── Footer link ───────────────────────────────────────────────── */
.login-register-link {
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.login-register-link a {
  color: var(--color-accent);
  font-weight: 600;
}

.login-register-link a:hover {
  text-decoration: underline;
}
</style>