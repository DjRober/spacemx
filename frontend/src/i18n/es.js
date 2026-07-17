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
};
