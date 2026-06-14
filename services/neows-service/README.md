# neows-service

Servicio que consume **NASA NeoWs API** (`/neo/rest/v1/feed`) para asteroides cercanos a la Tierra.

- **RF2** — Asteroides Near-Earth en tiempo real
- **RF9** — Filtros por rango de fechas, tamaño estimado y peligrosidad

## API externa

- Base URL: `https://api.nasa.gov`
- Endpoint: `/neo/rest/v1/feed`
- Params: `api_key`, `start_date`, `end_date` (máx. 7 días)

## Pendiente

- Definir endpoint propio (ej. `GET /asteroides?start_date=...&end_date=...&size=...&hazardous=...`)
- Lógica de filtrado de tamaño/peligrosidad sobre la respuesta de NeoWs
