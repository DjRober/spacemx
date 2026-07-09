import { ref } from 'vue'
import { authService } from '../services/authService.js'

// Los ref van fuera de useAuth para que el estado sea compartido
// entre todos los componentes que importen este composable.
const isLoggedIn = ref(false)
const user = ref(null)

const STORAGE_KEY = 'spacemex_user'

// ── Utilidades de JWT ────────────────────────────────────────────────
// Decodifica el payload del token (sin verificar la firma: eso lo hace el
// backend). Sirve para sacar email/usuario_id y la expiración.
function decodificarToken(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

function tokenVigente(token) {
  const payload = decodificarToken(token)
  if (!payload?.exp) return false
  return payload.exp * 1000 > Date.now()
}

// ── Persistencia ─────────────────────────────────────────────────────
function establecerSesion(u) {
  user.value = u
  isLoggedIn.value = true
  localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
}

// Restaura la sesión al cargar la app (sobrevive a recargas de página).
function cargarSesion() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  try {
    const guardado = JSON.parse(raw)
    if (guardado?.token && tokenVigente(guardado.token)) {
      user.value = guardado
      isLoggedIn.value = true
    } else {
      localStorage.removeItem(STORAGE_KEY) // token ausente o expirado
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
}
cargarSesion()

export function useAuth() {
  /**
   * Inicia sesión contra el auth-service.
   * Lanza un Error (con el mensaje del backend) si las credenciales fallan.
   */
  async function login(email, password) {
    const { token } = await authService.login({ email, password })
    const payload = decodificarToken(token)
    establecerSesion({
      id: payload?.usuario_id ?? null,
      // /auth/login no devuelve el nombre; usamos el email como display.
      name: payload?.email ?? email,
      email: payload?.email ?? email,
      token,
    })
  }

  /**
   * Registra una cuenta nueva y deja la sesión iniciada.
   * Lanza un Error (ej. "El email ya está registrado") si falla.
   */
  async function registro(nombre, email, password, idioma) {
    const { token, usuario } = await authService.registro({ nombre, email, password, idioma })
    establecerSesion({
      id: usuario.id,
      name: usuario.nombre,
      email: usuario.email,
      token,
    })
  }

  /**
   * Cierra sesión y limpia el estado global + localStorage.
   */
  function logout() {
    isLoggedIn.value = false
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { isLoggedIn, user, login, registro, logout }
}

export const useAuthStore = useAuth
