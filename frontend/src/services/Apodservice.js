// apodService.js
// RF1, RF7 — Foto Astronómica del Día
// Por ahora devuelve datos mock. Cuando el backend esté listo,
// reemplazar la función getApod() con un fetch real a GET /apod

const MOCK_APOD = {
  date: '2026-06-18',
  title: 'The Pillars of Creation',
  explanation:
    'En esta icónica imagen capturada por el Telescopio Espacial James Webb, los Pilares de la Creación ' +
    'se revelan con un detalle sin precedentes. Estas columnas de gas y polvo interestelar, ubicadas en ' +
    'la Nebulosa del Águila a 6 500 años luz de la Tierra, son viveros de estrellas en formación. ' +
    'La luz infrarroja penetra el polvo y expone proto-estrellas que de otra forma permanecerían ocultas, ' +
    'ofreciendo una ventana única al proceso de nacimiento estelar.',
  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg/800px-Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg',
  media_type: 'image',
  copyright: 'NASA, ESA, CSA, STScI',
};

/**
 * Obtiene la Foto Astronómica del Día.
 * @param {string} [date] - Fecha en formato YYYY-MM-DD. Si se omite, devuelve la del día actual.
 * @returns {Promise<Object>} Datos de la APOD (title, explanation, url, media_type, date, copyright)
 */
export async function getApod(date = null) {
  // Simula latencia de red
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (date && date !== MOCK_APOD.date) {
    // Mock para fechas históricas: devuelve la misma imagen con la fecha pedida
    return { ...MOCK_APOD, date, title: `APOD histórico — ${date}` };
  }

  return { ...MOCK_APOD };
}