# iss-alerts-service (propio)

Servicio propio de SpaceMex que calcula y notifica al usuario cuándo la ISS pasará sobre su ciudad.

- **RF5** — Alertas de paso de la ISS (hora, duración, elevación máxima)

> **Estado (09/07/2026):** **no implementado** todavía — esta carpeta solo contiene esta
> especificación (sin `index.js`). Mientras tanto, el frontend muestra datos de ejemplo
> (mock) en la sección de alertas (`frontend/src/services/issService.js`).

## API propuesta

- Base URL: `https://api.spacemex.dev` (propuesta)
- Endpoint: `POST /alertas/paso`
- Body JSON: `latitud` (float, requerido), `longitud` (float, requerido), `n_pasos` (integer, opcional, default 3)
- Respuesta: hora de inicio (UTC), duración (s), elevación máxima, dirección de entrada/salida

## Pendiente

- Algoritmo de predicción de pasos (a partir de posición ISS / TLE)
- Definir mecanismo de notificación (push, email, polling en frontend)
