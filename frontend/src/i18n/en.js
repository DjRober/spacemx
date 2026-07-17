// i18n/en.js — English dictionary
export default {
  // ── NavBar ─────────────────────────────────────────────────────
  nav: {
    links: {
      apod: "Photo of the Day",
      iss: "ISS",
      marte: "Mars",
      asteroides: "Asteroids",
      reportes: "My Reports",
    },
    login: "Sign in",
    logout: "Sign out",
    dashboard: "View dashboard",
  },

  // ── Home ───────────────────────────────────────────────────────
  home: {
    eyebrow: "🚀 SpaceMex · Real-time space data",
    title: "Explore the universe\nfrom your browser",
    subtitle:
      "One place to track the International Space Station, Mars weather, nearby asteroids and the astronomy photo of the day. NASA data, presented clearly.",
    btnDashboard: "View dashboard",
    btnRegister: "Create account",
    featuresTitle: "What can you do in SpaceMex?",
    featuresSubtitle: "Four windows to the cosmos, updated daily.",
    features: {
      apod: {
        title: "Photo of the Day",
        desc: "NASA's daily astronomy image, with its scientific description and a historical search tool.",
      },
      iss: {
        title: "ISS Live",
        desc: "Track the International Space Station in real time: position, speed and next passes over you.",
      },
      marte: {
        title: "Mars Weather",
        desc: "Temperature, pressure and winds from the latest Martian sol, measured by probes on the red planet.",
      },
      asteroides: {
        title: "Asteroids",
        desc: "Near-Earth objects for the coming days, with distance, size and hazard level.",
      },
    },
  },

  // ── Reportes ───────────────────────────────────────────────────
  reportes: {
    title: "My Space Reports",
    subtitle: "Form for a new observation and report list with full CRUD.",
    authNote: "🔒 This section requires signing in — authenticated SpaceMex API endpoints.",
    form: {
      title: "New observation",
      labelTitulo: "Title",
      placeholderTitulo: "E.g. Northern lights in Chihuahua",
      labelDesc: "Description",
      placeholderDesc: "Describe what you observed...",
      labelFecha: "Date",
      labelLat: "Latitude",
      placeholderLat: "E.g. 31.7",
      labelLon: "Longitude",
      placeholderLon: "E.g. -106.4",
      labelVisibilidad: "Visibility",
      privada: "🔒 Private",
      publica: "🌐 Public",
      btnGuardar: "Save report",
      btnActualizar: "Update report",
      btnGuardando: "Saving...",
      btnCancelar: "Cancel",
      helperLogin: "Sign in to save observations.",
      errorRequeridos: "All fields are required.",
      errorGuardar: "Error saving the report.",
    },
    lista: {
      cargando: "Loading reports...",
      vacio: "No observations yet. Create your first one!",
      badgePublica: "🌐 public",
      badgePrivada: "🔒 private",
      titleEditar: "Edit",
      titleEliminar: "Delete",
      confirmEliminar: "Are you sure you want to delete this observation?",
      errorEliminar: "Error deleting the report.",
    },
  },
};
