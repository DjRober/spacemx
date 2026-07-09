# apod-service

Servicio que consume **NASA APOD API** (`/planetary/apod`) para la foto astronómica del día.

- **RF1** — Foto del día + descripción científica
- **RF7** — Buscador histórico por fecha (`date`)
- **RF8** — Cache Handler (reduce llamadas a NASA APOD)

## API externa

- Base URL: `https://api.nasa.gov`
- Endpoint: `/planetary/apod`
- Params: `api_key`, `date` (opcional), `thumbs` (opcional)

## Endpoint propio

- `GET /apod` → foto de hoy
- `GET /apod?date=YYYY-MM-DD` → foto de una fecha pasada (RF7)

Respuesta: `{ date, title, explanation, url, media_type, copyright }`.

## Caché (RF8)

Implementada en `index.js` con un `Map` en memoria: la foto de hoy expira al cambio de
día UTC; las fechas pasadas no expiran (no cambian). Reduce latencia y respeta el
rate-limit de `DEMO_KEY` (30 req/hora).
