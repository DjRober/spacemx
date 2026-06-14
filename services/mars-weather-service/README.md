# mars-weather-service

Servicio que consume **NASA InSight Mars Weather API** (`/insight_weather/`).

- **RF3** — Temperatura, viento y presión atmosférica en Marte
- **RF8** — Cache Handler (datos meteorológicos cambian poco)

## API externa

- Base URL: `https://api.nasa.gov`
- Endpoint: `/insight_weather/`
- Params: `api_key`, `feedtype=json`, `ver=1.0`

## Pendiente

- Definir endpoint propio (ej. `GET /marte/clima`)
- Implementar capa de caché compartida con apod-service (o módulo común)
