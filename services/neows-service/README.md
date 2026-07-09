# neows-service

Servicio que consume **NASA NeoWs API** (`/neo/rest/v1/feed`) para asteroides cercanos a la Tierra.

- **RF2** — Asteroides Near-Earth en tiempo real
- **RF9** — Filtros por rango de fechas, tamaño estimado y peligrosidad

## API externa

- Base URL: `https://api.nasa.gov`
- Endpoint: `/neo/rest/v1/feed`
- Params: `api_key`, `start_date`, `end_date` (máx. 7 días)

## Endpoint propio

`GET /asteroides?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` (ambos opcionales, por
defecto hoy; NeoWs acepta un rango máximo de 7 días). Devuelve un arreglo de asteroides
ya mapeado: `id`, `name`, `diameter_max_km`, `velocity_km_h`, `close_approach_date`,
`is_potentially_hazardous`.

> El filtrado por **tamaño** y **peligrosidad** (RF9) se resuelve en el frontend sobre
> este arreglo (ya incluye diámetro y el indicador de peligrosidad), no como query params.
