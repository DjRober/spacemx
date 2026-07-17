// i18n/es.js — Diccionario en español
export default {
  // ── NavBar ─────────────────────────────────────────────────────
  nav: {
    links: {
      apod: "Foto del Día",
      iss: "ISS",
      marte: "Marte",
      asteroides: "Asteroides",
      reportes: "Mis Reportes",
    },
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    dashboard: "Ver dashboard",
  },

  // ── Home ───────────────────────────────────────────────────────
  home: {
    eyebrow: "🚀 SpaceMex · Datos espaciales en tiempo real",
    title: "Explora el universo\ndesde tu navegador",
    subtitle:
      "Un solo lugar para seguir la Estación Espacial Internacional, el clima en Marte, los asteroides cercanos y la foto astronómica del día. Datos de la NASA, presentados de forma clara.",
    btnDashboard: "Ver dashboard",
    btnRegister: "Crear cuenta",
    featuresTitle: "¿Qué puedes hacer en SpaceMex?",
    featuresSubtitle: "Cuatro ventanas al cosmos, actualizadas a diario.",
    features: {
      apod: {
        title: "Foto del Día",
        desc: "La imagen astronómica diaria de la NASA, con su descripción científica y un buscador histórico.",
      },
      iss: {
        title: "ISS en vivo",
        desc: "Sigue la Estación Espacial Internacional en tiempo real: posición, velocidad y próximos pasos sobre ti.",
      },
      marte: {
        title: "Clima en Marte",
        desc: "Temperatura, presión y vientos del último sol marciano medidos por las sondas en el planeta rojo.",
      },
      asteroides: {
        title: "Asteroides",
        desc: "Objetos cercanos a la Tierra de los próximos días, con distancia, tamaño y nivel de peligrosidad.",
      },
    },
  },

  // ── Reportes ───────────────────────────────────────────────────
  reportes: {
    title: "Mis Reportes Espaciales",
    subtitle: "Formulario para una nueva observación y lista de reportes con CRUD completo.",
    authNote: "🔒 Esta sección requiere iniciar sesión — endpoints autenticados de la API SpaceMex.",
    form: {
      title: "Nueva observación",
      labelTitulo: "Título",
      placeholderTitulo: "Ej. Aurora boreal en Chihuahua",
      labelDesc: "Descripción",
      placeholderDesc: "Describe lo que observaste...",
      labelFecha: "Fecha",
      labelLat: "Latitud",
      placeholderLat: "Ej. 31.7",
      labelLon: "Longitud",
      placeholderLon: "Ej. -106.4",
      labelVisibilidad: "Visibilidad",
      privada: "🔒 Privada",
      publica: "🌐 Pública",
      btnGuardar: "Guardar reporte",
      btnActualizar: "Actualizar reporte",
      btnGuardando: "Guardando...",
      btnCancelar: "Cancelar",
      helperLogin: "Inicia sesión para guardar observaciones.",
      errorRequeridos: "Todos los campos son requeridos.",
      errorGuardar: "Error al guardar el reporte.",
    },
    lista: {
      cargando: "Cargando reportes...",
      vacio: "Aún no tienes observaciones. ¡Crea tu primera!",
      badgePublica: "🌐 pública",
      badgePrivada: "🔒 privada",
      titleEditar: "Editar",
      titleEliminar: "Eliminar",
      confirmEliminar: "¿Seguro que quieres eliminar esta observación?",
      errorEliminar: "Error al eliminar el reporte.",
    },
  },

  // ── APOD ───────────────────────────────────────────────────────
  apod: {
    title: "Foto Astronómica del Día",
    subtitle:
      "Lo primero que ve el usuario: la imagen protagonista del universo, su descripción científica y un buscador histórico.",
    searchLabel: "Buscador histórico — ver foto de otra fecha",
    btnBuscar: "Buscar",
    btnBuscando: "Buscando",
    error: "No se pudo cargar la foto",
  },

  // ── ISS ────────────────────────────────────────────────────────
  iss: {
    title: "Estación Espacial Internacional",
    subtitle:
      "Mapa interactivo con la posición en vivo de la ISS y panel de alertas de paso por tu ciudad.",
    posicion: {
      title: "Posición actual",
      latitud: "Latitud",
      longitud: "Longitud",
      actualizado: "Actualizado",
      sinConexion: "Sin conexión al servicio",
    },
    alertas: {
      title: "🔔 Alertas de paso",
      label: "Latitud, Longitud",
      placeholder: "Ej: 19.4326, -99.1332",
      btn: "Avisarme cuando pase la ISS",
      btnCalculando: "Calculando...",
      hint: "→ hora de paso, duración y elevación máx.",
      paso: "Paso",
      elevMax: "Elev. máx.",
      errorCoords: "Ingresa coordenadas válidas: latitud, longitud (Ej: 19.43, -99.13)",
      errorSinPasos: "No se encontraron próximos pasos para esa ubicación.",
      errorServicio: "No se pudo conectar al servicio de alertas. Intenta más tarde.",
    },
  },

  // ── Marte ──────────────────────────────────────────────────────
  marte: {
    title: "Clima en Marte",
    subtitle:
      "Datos del módulo InSight / rover Curiosity en el cráter Gale. Tres indicadores de igual jerarquía.",
    temperatura: "Temperatura",
    minMax: "mín {min}° / máx {max}°",
    viento: "Viento",
    presion: "Presión atmosférica",
    cacheTag: "⚡ servido desde caché",
  },

  // ── Asteroides ─────────────────────────────────────────────────
  asteroides: {
    title: "Asteroides cercanos (NeoWs)",
    subtitle:
      "Objetos próximos a la Tierra detectados por el sistema NeoWs de la NASA. Barra de filtros arriba, resultados abajo.",
    filtros: {
      desde: "Desde",
      hasta: "Hasta",
      tamano: "Tamaño estimado",
      todos: "Todos",
      small: "< 100 m",
      mid: "100–500 m",
      large: "> 500 m",
      peligrosidad: "Peligrosidad",
      todas: "Todas",
      peligroso: "Peligroso",
      noPeligroso: "No peligroso",
      limpiar: "Limpiar",
    },
    tabla: {
      nombre: "Nombre",
      diametro: "Diámetro máx.",
      velocidad: "Velocidad",
      fecha: "Fecha de enfoque",
      peligroso: "Peligroso",
      si: "⚠ Sí",
      no: "✓ No",
      vacio: "No se encontraron asteroides con esos filtros.",
    },
  },

  // ── Autenticación ──────────────────────────────────────────────
  auth: {
    brandSub: "NASA Space Dashboard",
    login: {
      email: "Correo electrónico",
      emailPlaceholder: "tucorreo@ejemplo.com",
      password: "Contraseña",
      btn: "Iniciar sesión",
      btnCargando: "Iniciando…",
      noAccount: "¿No tienes cuenta?",
      register: "Regístrate",
      errorCampos: "Ingresa tu correo y contraseña.",
      errorCredenciales: "Correo o contraseña incorrectos.",
      errorConexion: "No se pudo conectar con el servidor.",
      errorGenerico: "No se pudo iniciar sesión.",
    },
    register: {
      title: "Crear cuenta",
      subtitle: "Únete al dashboard espacial",
      nombre: "Nombre completo",
      nombrePlaceholder: "Roberto Pérez",
      email: "Correo electrónico",
      emailPlaceholder: "roberto@spacemex.dev",
      password: "Contraseña",
      confirm: "Confirmar contraseña",
      btn: "Crear cuenta",
      btnCargando: "Creando…",
      hasAccount: "¿Ya tienes cuenta?",
      login: "Inicia sesión",
      errorNoCoinciden: "Las contraseñas no coinciden.",
      errorConexion: "No se pudo conectar con el servidor.",
      errorGenerico: "No se pudo crear la cuenta.",
    },
  },

  // ── Footer ─────────────────────────────────────────────────────
  footer: {
    tagline: "NASA Space Dashboard — Arquitectura SOA.",
    dataBy: "Datos provistos por",
    and: "y",
  },
};
