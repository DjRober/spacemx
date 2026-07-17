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

  // ── APOD ───────────────────────────────────────────────────────
  apod: {
    title: "Astronomy Picture of the Day",
    subtitle:
      "The first thing you see: the universe's featured image, its scientific description and a historical search tool.",
    searchLabel: "Historical search — view a photo from another date",
    btnBuscar: "Search",
    btnBuscando: "Searching",
    error: "Could not load the photo",
  },

  // ── ISS ────────────────────────────────────────────────────────
  iss: {
    title: "International Space Station",
    subtitle:
      "Interactive map with the ISS live position and a pass alerts panel for your city.",
    posicion: {
      title: "Current position",
      latitud: "Latitude",
      longitud: "Longitude",
      actualizado: "Updated",
      sinConexion: "No connection to the service",
    },
    alertas: {
      title: "🔔 Pass alerts",
      label: "Latitude, Longitude",
      placeholder: "E.g. 19.4326, -99.1332",
      btn: "Notify me when the ISS passes",
      btnCalculando: "Calculating...",
      hint: "→ pass time, duration and max elevation.",
      paso: "Pass",
      elevMax: "Max elev.",
      errorCoords: "Enter valid coordinates: latitude, longitude (E.g. 19.43, -99.13)",
      errorSinPasos: "No upcoming passes found for that location.",
      errorServicio: "Could not connect to the alerts service. Try again later.",
    },
  },

  // ── Marte ──────────────────────────────────────────────────────
  marte: {
    title: "Mars Weather",
    subtitle:
      "Data from the InSight lander / Curiosity rover in Gale crater. Three indicators of equal importance.",
    temperatura: "Temperature",
    minMax: "min {min}° / max {max}°",
    viento: "Wind",
    presion: "Atmospheric pressure",
    cacheTag: "⚡ served from cache",
  },

  // ── Asteroides ─────────────────────────────────────────────────
  asteroides: {
    title: "Near-Earth asteroids (NeoWs)",
    subtitle:
      "Objects near Earth detected by NASA's NeoWs system. Filter bar above, results below.",
    filtros: {
      desde: "From",
      hasta: "To",
      tamano: "Estimated size",
      todos: "All",
      small: "< 100 m",
      mid: "100–500 m",
      large: "> 500 m",
      peligrosidad: "Hazard level",
      todas: "All",
      peligroso: "Hazardous",
      noPeligroso: "Not hazardous",
      limpiar: "Clear",
    },
    tabla: {
      nombre: "Name",
      diametro: "Max diameter",
      velocidad: "Speed",
      fecha: "Close approach date",
      peligroso: "Hazardous",
      si: "⚠ Yes",
      no: "✓ No",
      vacio: "No asteroids found with those filters.",
    },
  },

  // ── Autenticación ──────────────────────────────────────────────
  auth: {
    brandSub: "NASA Space Dashboard",
    login: {
      email: "Email address",
      emailPlaceholder: "youremail@example.com",
      password: "Password",
      btn: "Sign in",
      btnCargando: "Signing in…",
      noAccount: "Don't have an account?",
      register: "Sign up",
      errorCampos: "Enter your email and password.",
      errorCredenciales: "Incorrect email or password.",
      errorConexion: "Could not connect to the server.",
      errorGenerico: "Could not sign in.",
    },
    register: {
      title: "Create account",
      subtitle: "Join the space dashboard",
      nombre: "Full name",
      nombrePlaceholder: "Roberto Pérez",
      email: "Email address",
      emailPlaceholder: "roberto@spacemex.dev",
      password: "Password",
      confirm: "Confirm password",
      btn: "Create account",
      btnCargando: "Creating…",
      hasAccount: "Already have an account?",
      login: "Sign in",
      errorNoCoinciden: "Passwords do not match.",
      errorConexion: "Could not connect to the server.",
      errorGenerico: "Could not create the account.",
    },
  },

  // ── Footer ─────────────────────────────────────────────────────
  footer: {
    tagline: "NASA Space Dashboard — SOA Architecture.",
    dataBy: "Data provided by",
    and: "and",
  },
};
