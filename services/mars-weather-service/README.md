# mars-weather-service

Servicio que consume la **API MAAS/REMS** (clima del rover Curiosity, CAB CSIC-INTA) y
expone el clima de Marte con un formato simple para el frontend.

- **RF3** — Temperatura, viento y presión atmosférica en Marte
- **RF8** — Cache Handler (datos meteorológicos cambian poco) — *pendiente*

## API externa

- Base URL: `http://cab.inta-csic.es`
- Endpoint: `/rems/wp-content/plugins/marsweather-widget/api.php`
- Sin parámetros ni autenticación (API pública)

> **Nota:** el plan original consumía NASA InSight (`/insight_weather/` en `api.nasa.gov`),
> pero esa misión terminó en 2022 y su API ya no entrega datos nuevos. Ver abajo.

## ⚠️ Situación de InSight

La misión InSight terminó en diciembre de 2022, por lo que la API
`/insight_weather/` ya **no entrega datos nuevos** (devuelve los últimos soles
registrados o viene vacía). Por eso el servicio usa un objeto `EJEMPLO` como
respaldo cuando la NASA no manda datos.

### Alternativas (en orden de menor a mayor esfuerzo)

1. **Quedarse con el ejemplo de respaldo** (lo actual). Confiable para la demo,
   pero no es clima "en vivo". Honesto si en la UI se etiqueta como
   "últimos datos registrados por InSight".
2. **Datos históricos reales semilla.** Descargar un set fijo de datos reales de
   InSight y servirlos. Números reales, nunca se cae. Bajo esfuerzo.
3. **MAAS API (Curiosity / REMS).** API comunitaria que expone el clima del rover
   Curiosity. Es la alternativa "en vivo" más conocida, pero al no ser oficial
   **se cae con frecuencia** — habría que verificar que el endpoint siga activo y
   dejar el `EJEMPLO` como respaldo igual. Doc: https://ingenology.github.io/mars_weather_api/

**Decisión del equipo:** usar la opción 3 (MAAS API). Como MAAS no es oficial y se
cae con frecuencia, la implementación debe **dejar un objeto de ejemplo de respaldo**
para que la sección no se rompa si el servicio externo está caído.

## Pendiente

- Implementar la capa de caché (RF8): hoy `index.js` no cachea, solo cae al objeto
  `EJEMPLO` cuando MAAS no responde.
