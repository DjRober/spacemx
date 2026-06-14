# apod-service

Servicio que consume **NASA APOD API** (`/planetary/apod`) para la foto astronómica del día.

- **RF1** — Foto del día + descripción científica
- **RF7** — Buscador histórico por fecha (`date`)
- **RF8** — Cache Handler (reduce llamadas a NASA APOD)

## API externa

- Base URL: `https://api.nasa.gov`
- Endpoint: `/planetary/apod`
- Params: `api_key`, `date` (opcional), `thumbs` (opcional)

## Pendiente

- Definir endpoints propios (ej. `GET /apod`, `GET /apod/:date`)
- Implementar capa de caché
