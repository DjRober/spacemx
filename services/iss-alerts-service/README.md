# iss-alerts-service (propio)

Servicio propio de SpaceMex que calcula y notifica al usuario cuándo la ISS pasará sobre su ciudad.

- **RF5** — Alertas de paso de la ISS (hora, duración, elevación máxima)

## API propuesta

- Base URL: `https://api.spacemex.dev` (propuesta)
- Endpoint: `POST /alertas/paso`
- Body JSON: `latitud` (float, requerido), `longitud` (float, requerido), `n_pasos` (integer, opcional, default 3)
- Respuesta: hora de inicio (UTC), duración (s), elevación máxima, dirección de entrada/salida

## Pendiente

- Algoritmo de predicción de pasos (a partir de posición ISS / TLE)
- Definir mecanismo de notificación (push, email, polling en frontend)
