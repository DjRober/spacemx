# iss-tracker-service

Servicio que consume la **Where the ISS at? API** y expone la posición actual de la
Estación Espacial Internacional con un formato simple para el frontend.

- **RF4** — Posición geográfica de la ISS en tiempo real (mapa)

## API externa

- Base URL: `https://api.wheretheiss.at`
- Endpoint: `/v1/satellites/25544` (`25544` es el ID NORAD de la ISS)
- Sin parámetros ni autenticación
- Límite recomendado: ~1 petición por segundo

> **Nota:** el esqueleto original apuntaba a Open-Notify (`api.open-notify.org`),
> pero esa API es HTTP (sin HTTPS) y suele estar caída. Se cambió a
> `wheretheiss.at`, que es HTTPS, más estable y devuelve los mismos datos de
> latitud/longitud. El contrato hacia el frontend no cambia.

## Endpoint propio

`GET /iss/posicion` → posición actual de la ISS.

Respuesta (JSON):

```json
{
  "latitude":  -12.3456,
  "longitude": 145.6789,
  "timestamp": 1751500800000,
  "message":   "success"
}
```

- `latitude` / `longitude` — número (grados decimales)
- `timestamp` — milisegundos (la API externa lo da en segundos; el servicio lo
  multiplica por 1000 para que el frontend lo use directo con `new Date()`)

Si la API externa falla, el servicio responde `502` con un mensaje de error
controlado (no se cae el servidor).

## Frecuencia de polling

El frontend refresca la posición cada **5 segundos** desde `IssSection.vue`
(`setInterval`), y limpia el intervalo al salir de la sección.
