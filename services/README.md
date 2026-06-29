# Servicios SpaceMex (backend SOA)

Cada carpeta es un servicio independiente (Node.js + Express) que envuelve una API
externa y la expone con un formato simple para el frontend.

## Puertos y rutas

| Servicio | Puerto | Ruta | Encargado |
|---|---|---|---|
| `apod-service` | 3001 | `GET /apod` · `GET /apod?date=YYYY-MM-DD` | Roberto |
| `mars-weather-service` | 3002 | `GET /marte/clima` | Diego |
| `neows-service` | 3003 | `GET /asteroides?start_date=&end_date=` | Daniel |
| `iss-tracker-service` | 3004 | `GET /iss/posicion` | Iker |

## Cómo correr tu servicio

Entra a la carpeta de tu servicio y corre estos comandos **una sola vez**:

```bash
cd services/apod-service     # cambia por tu servicio
npm install                  # descarga las dependencias (crea node_modules/)
cp .env.example .env         # crea tu archivo de variables
```

Luego edita el `.env` y pon tu llave de la NASA (los de NASA: apod, mars, neows).
La llave gratuita se saca en https://api.nasa.gov — `DEMO_KEY` también sirve para probar.

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

La API de InSight ya no manda datos nuevos (la misión terminó en 2022). Por eso
`mars-weather-service` devuelve un objeto de ejemplo cuando la NASA viene vacía.
Ver el README de ese servicio para las alternativas.
