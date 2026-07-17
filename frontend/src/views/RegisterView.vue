<template>
  <div class="register-page">
    <div class="register-card card">

      <!-- Brand -->
      <div class="brand">
        <span class="brand-icon">🚀</span>
        <span class="brand-name">SpaceMex</span>
      </div>

      <h1 class="register-title">{{ t("auth.register.title") }}</h1>
      <p class="register-sub">{{ t("auth.register.subtitle") }}</p>

      <!-- Formulario -->
      <form class="register-form" @submit.prevent="handleRegister">

        <div class="field">
          <label class="field-label" for="reg-nombre">{{ t("auth.register.nombre") }}</label>
          <input
            id="reg-nombre"
            v-model="nombre"
            type="text"
            class="input"
            :placeholder="t('auth.register.nombrePlaceholder')"
            autocomplete="name"
            required
          />
        </div>

        <div class="field">
          <label class="field-label" for="reg-email">{{ t("auth.register.email") }}</label>
          <input
            id="reg-email"
            v-model="email"
            type="email"
            class="input"
            :placeholder="t('auth.register.emailPlaceholder')"
            autocomplete="email"
            required
          />
        </div>

        <div class="field">
          <label class="field-label" for="reg-password">{{ t("auth.register.password") }}</label>
          <input
            id="reg-password"
            v-model="password"
            type="password"
            class="input"
            placeholder="••••••••"
            autocomplete="new-password"
            required
          />
        </div>

        <div class="field">
          <label class="field-label" for="reg-confirm">{{ t("auth.register.confirm") }}</label>
          <input
            id="reg-confirm"
            v-model="confirm"
            type="password"
            class="input"
            :class="{ 'input--error': passwordNoCoincide }"
            placeholder="••••••••"
            autocomplete="new-password"
            required
          />
        </div>

        <p v-if="errorMsg" class="error-msg text-danger">{{ errorMsg }}</p>

        <button type="submit" class="btn register-btn" :disabled="cargando">
          {{ cargando ? t("auth.register.btnCargando") : t("auth.register.btn") }}
        </button>

      </form>

      <!-- Link a login -->
      <p class="login-hint">
        {{ t("auth.register.hasAccount") }}
        <router-link to="/login" class="login-link">{{ t("auth.register.login") }}</router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../composables/useAuth.js'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const auth = useAuth()
const router = useRouter()

const nombre   = ref('')
const email    = ref('')
const password = ref('')
const confirm  = ref('')
const errorMsg = ref('')
const cargando = ref(false)
const passwordNoCoincide = ref(false)

async function handleRegister() {
  errorMsg.value = ''
  passwordNoCoincide.value = false

  if (password.value !== confirm.value) {
    passwordNoCoincide.value = true
    errorMsg.value = t('auth.register.errorNoCoinciden')
    return
  }

  cargando.value = true
  try {
    await auth.registro(nombre.value, email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    errorMsg.value = e.message?.includes('fetch')
      ? t('auth.register.errorConexion')
      : e.message || t('auth.register.errorGenerico')
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
/* ── Layout de página ────────────────────────────────────────────── */
.register-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background-color: var(--color-bg-app);
  padding: 2rem 1rem;
}

/* ── Tarjeta ─────────────────────────────────────────────────────── */
.register-card {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 2rem 2rem 1.75rem;
}

/* ── Brand ───────────────────────────────────────────────────────── */
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.5rem;
}

.brand-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, var(--color-accent), #1a2a6c);
  display: grid;
  place-items: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.brand-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

/* ── Encabezado ──────────────────────────────────────────────────── */
.register-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0.25rem 0 0;
}

.register-sub {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0 0 0.75rem;
}

/* ── Formulario ──────────────────────────────────────────────────── */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

/* Borde rojo en el input cuando hay error */
.input--error {
  border-color: var(--color-danger);
}

.input--error:focus {
  border-color: var(--color-danger);
}

.error-msg {
  font-size: 0.75rem;
  margin: 0;
}

/* ── Botón principal ─────────────────────────────────────────────── */
.register-btn {
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.7rem;
  font-size: 0.9rem;
}

/* ── Link a login ────────────────────────────────────────────────── */
.login-hint {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  text-align: center;
  margin: 0.75rem 0 0;
}

.login-link {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.login-link:hover {
  text-decoration: underline;
  opacity: 0.85;
}
</style>
