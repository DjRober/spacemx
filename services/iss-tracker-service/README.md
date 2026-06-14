# iss-tracker-service

Servicio que consume **Open Notify ISS Location API** (`/iss-now.json`).

- **RF4** — Posición geográfica de la ISS en tiempo real (mapa)

## API externa

- Base URL: `http://api.open-notify.org`
- Endpoint: `/iss-now.json`
- Sin parámetros ni autenticación

## Pendiente

- Definir endpoint propio (ej. `GET /iss/posicion`)
- Definir frecuencia de polling hacia el frontend
