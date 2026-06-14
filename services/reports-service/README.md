# reports-service (propio)

Servicio propio de SpaceMex para observaciones astronómicas de usuarios autenticados (CRUD).

- **RF6** — Registrar, guardar y compartir observaciones astronómicas
- **RNF3** — Requiere autenticación

## API propuesta

- Base URL: `https://api.spacemex.dev` (propuesta)
- Endpoints:
  - `GET /reportes` — lista observaciones del usuario autenticado
  - `POST /reportes` — crea observación (título, descripción, fecha, coords, visibilidad)
  - `PUT /reportes/{id}` — actualiza observación
  - `DELETE /reportes/{id}` — elimina observación

## Datos

ID reporte, ID usuario, título, descripción, fecha de observación, coordenadas, imagen (opcional), visibilidad pública/privada.

## Pendiente

- Modelo de datos (ver `docs/modelo_datos.md`)
- Mecanismo de autenticación (RNF3)
