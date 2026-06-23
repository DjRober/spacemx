import { ref } from 'vue'

// Los ref van fuera de useAuth para que el estado sea compartido
// entre todos los componentes que importen este composable
const isLoggedIn = ref(false)
const user = ref(null)

export function useAuth() {
  /**
   * Mock login — cualquier email/contraseña es válido por ahora.
   * Cuando el backend esté listo, reemplazar con llamada a POST /auth/login
   */
  function login(email, password) {
    isLoggedIn.value = true
    user.value = { name: 'Roberto', email }
  }

  /**
   * Cierra sesión y limpia el estado global.
   */
  function logout() {
    isLoggedIn.value = false
    user.value = null
  }

  return { isLoggedIn, user, login, logout }
}