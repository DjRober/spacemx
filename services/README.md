# Servicios SpaceMex (backend SOA)

Cada carpeta es un servicio independiente (Node.js + Express). Los cuatro primeros
envuelven una API externa; `auth-service` y `reports-service` son propios (con BD
PostgreSQL). `iss-alerts-service` aún no está implementado.

## Puertos y rutas

| Servicio | Puerto | Ruta | Encargado |
|---|---|---|---|
| `apod-service` | 3001 | `GET /apod` · `GET /apod?date=YYYY-MM-DD` | Roberto |
| `mars-weather-service` | 3002 | `GET /marte/clima` | Diego |
| `neows-service` | 3003 | `GET /asteroides?start_date=&end_date=` | Daniel |
| `iss-tracker-service` | 3004 | `GET /iss/posicion` | Iker |
| `auth-service` | 3005 | `POST /auth/registro` · `POST /auth/login` | Roberto |
| `reports-service` | 3006 | `GET/POST /reportes` · `PUT/DELETE /reportes/:id` (JWT) | Roberto |
| `iss-alerts-service` | — | `POST /alertas/paso` *(no implementado)* | — |

Wrappers y las APIs externas que consumen: `apod` → NASA APOD; `neows` → NASA NeoWs;
`mars-weather` → **MAAS/REMS (Curiosity)**; `iss-tracker` → **Where the ISS at?**
(`wheretheiss.at`). Open-Notify y NASA InSight quedaron descartadas (ver READMEs de
cada servicio).

## Cómo correr tu servicio

Entra a la carpeta de tu servicio y corre estos comandos **una sola vez**:

```bash
cd services/apod-service     # cambia por tu servicio
npm install                  # descarga las dependencias (crea node_modules/)
cp .env.example .env         # crea tu archivo de variables
```

Luego edita el `.env` y pon tu llave de la NASA. Solo la necesitan **apod** y **neows**
(la llave gratuita se saca en https://api.nasa.gov — `DEMO_KEY` también sirve para probar).
`mars-weather` e `iss-tracker` no usan llave. `auth-service` y `reports-service` requieren
`DATABASE_URL` (PostgreSQL) y **el mismo** `JWT_SECRET` en sus `.env`.

Para arrancar el servidor:

```bash
npm run dev                  # se reinicia solo cada vez que guardas
```

Cuando arranque verás algo como:

```
apod-service en http://localhost:3001/apod
```

## Cómo probar que funciona

Abre la URL que imprime la consola **en el navegador**. Si ves datos en JSON, funciona.

| Servicio | Pégalo en el navegador |
|---|---|
| apod | http://localhost:3001/apod |
| marte | http://localhost:3002/marte/clima |
| asteroides | http://localhost:3003/asteroides |
| iss | http://localhost:3004/iss/posicion |

## Reglas importantes

- **Nunca subas tu `.env` a git** (tiene la llave de la NASA). El `.gitignore` ya lo ignora.
- Sí se sube el `.env.example` (es la plantilla, sin llave real).
- No subas `node_modules/` (también está ignorado).
- El JSON que devuelve cada ruta está documentado en un comentario arriba de la ruta,
  dentro del `index.js`. Respeta esos nombres de campo: el frontend ya los espera así.

## Nota sobre el clima de Marte

Se dejó de usar NASA InSight (la misión terminó en 2022 y su API ya no manda datos
nuevos) y ahora `mars-weather-service` consume la API **MAAS/REMS** del rover Curiosity.
Como esa fuente comunitaria se cae con frecuencia, el servicio devuelve un objeto de
ejemplo de respaldo si no hay datos. Ver el README de ese servicio.
