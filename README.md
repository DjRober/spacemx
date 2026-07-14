# SpaceMex — NASA Space Dashboard

Dashboard web que centraliza información espacial en tiempo real (foto astronómica del día, asteroides cercanos, clima en Marte, posición de la ISS y alertas de paso) en una sola plataforma, bajo **Arquitectura Orientada a Servicios (SOA)**.

> Proyecto académico — SpaceMex · 2026

## Arranque rápido (Docker) ⚡

Todo el sistema —PostgreSQL, los 7 servicios y el frontend— con **un solo comando**:

```bash
git clone https://github.com/DjRober/spacemx.git
cd spacemx
docker compose up --build
```

Abre **http://localhost:5173** y listo. No hace falta crear ningún `.env`: todas las
variables tienen un valor por defecto y los servicios de NASA caen a `DEMO_KEY`.

Para detenerlo: `Ctrl+C`, o `docker compose down` desde otra terminal.

### Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye `docker compose`)
- Nada más: Node, npm y PostgreSQL corren **dentro** de los contenedores.

> ¿Prefieres correrlo sin Docker, servicio por servicio? Ver
> [Instalación manual](#instalación-manual-sin-docker) más abajo.

### URLs de cada servicio

Una vez arriba, todo queda publicado en `localhost`:

| Servicio | URL | Requerimiento |
|---|---|---|
| **Frontend** (dashboard) | http://localhost:5173 | — |
| `apod-service` | http://localhost:3001/apod | RF1, RF7, RF8 |
| `mars-weather-service` | http://localhost:3002/marte/clima | RF3 |
| `neows-service` | http://localhost:3003/asteroides | RF2, RF9 |
| `iss-tracker-service` | http://localhost:3004/iss/posicion | RF4 |
| `auth-service` | http://localhost:3005/auth/registro · `/auth/login` | RNF3 |
| `reports-service` | http://localhost:3006/reportes | RF6 |
| `iss-alerts-service` | http://localhost:3007/alertas/paso | RF5 |
| PostgreSQL | `localhost:5432` (BD `spacemex`, user/pass `postgres`) | — |

Los cuatro wrappers y el frontend se abren directo en el navegador. `auth`, `reports`
e `iss-alerts` son `POST`, así que necesitan `curl` o Postman — ejemplos abajo.

### Configurar tus propias variables (opcional)

El compose lee un `.env` en la **raíz**. Solo lo necesitas para poner tu llave real
de NASA (`DEMO_KEY` limita a 30 peticiones/hora) o un `JWT_SECRET` propio:

```bash
cp .env.example .env
```

Edita `.env` y vuelve a levantar (`docker compose up`). Variables disponibles:

| Variable | Default | Para qué |
|---|---|---|
| `NASA_API_KEY` | `DEMO_KEY` | `apod` y `neows`. Llave gratis en https://api.nasa.gov |
| `JWT_SECRET` | secreto de dev | Firma/valida los JWT. **Compartido** por `auth` y `reports` |
| `JWT_EXPIRES_IN` | `24h` | Vigencia del token |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | `postgres` / `postgres` / `spacemex` | Credenciales de la BD |

### Comandos útiles

| Comando | Qué hace |
|---|---|
| `docker compose up --build` | Levanta todo (reconstruye las imágenes) |
| `docker compose up -d` | Igual, pero en segundo plano |
| `docker compose down` | Detiene y borra los contenedores |
| `docker compose down -v` | Además borra la BD (empiezas de cero) |
| `docker compose logs -f auth-service` | Ver los logs de un servicio |
| `docker compose ps` | Estado de todos los contenedores |
| `docker compose up --build apod-service` | Levantar un solo servicio |

### Probar que funciona

```bash
# 1. Registrar un usuario → devuelve un JWT
curl -X POST http://localhost:3005/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Demo","email":"demo@spacemex.test","password":"secreto123"}'

# 2. Crear un reporte con ese token (pega el token del paso 1)
curl -X POST http://localhost:3006/reportes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"titulo":"Mi observación","descripcion":"Vi la ISS","fecha_observacion":"2026-07-14T00:00:00Z","latitud":31.7,"longitud":-106.4,"es_publico":true}'

# 3. Próximos pasos de la ISS sobre Ciudad Juárez
curl -X POST http://localhost:3007/alertas/paso \
  -H "Content-Type: application/json" \
  -d '{"latitud":31.7,"longitud":-106.4,"n_pasos":3}'
```

### Cómo está armado el orquestador

- **Postgres arranca primero.** Tiene un `healthcheck` (`pg_isready`) y `auth`/`reports`
  usan `depends_on: condition: service_healthy`, así que no arrancan hasta que la BD
  acepta conexiones. Sin esto morirían al no poder crear su esquema.
- **Las tablas se crean solas.** `auth` y `reports` aplican su `schema.sql`
  (`CREATE TABLE IF NOT EXISTS`) al arrancar. No hay que correr migraciones a mano.
- **`auth` y `reports` comparten `JWT_SECRET` y la misma BD**: uno firma el token y
  el otro lo valida.
- **Dentro de la red de compose la BD es `postgres:5432`**, no `localhost` (dentro de
  un contenedor `localhost` es el contenedor mismo).
- **El frontend llama a `localhost:300X` desde el navegador**, que resuelve a tu
  máquina, donde compose publica los puertos. Por eso funciona sin tocar el código.
- **Los datos de Postgres persisten** en el volumen `postgres-data` entre reinicios.

## Problema que resuelve

Hoy, ver esta información implica abrir varias páginas distintas y, en muchos casos, saber usar APIs técnicas. SpaceMex reúne todo en un solo dashboard visual, accesible para cualquier persona sin conocimientos técnicos, y permite además guardar observaciones propias y recibir avisos de paso de la ISS.

## Funcionalidades principales

| Sección | Fuente de datos | Requerimiento |
|---|---|---|
| Foto Astronómica del Día (APOD) + buscador histórico | NASA APOD API | RF1, RF7 |
| Asteroides cercanos (NeoWs) + filtros | NASA NeoWs API | RF2, RF9 |
| Clima en Marte (temperatura, viento, presión) | MAAS/REMS — rover Curiosity | RF3 |
| Posición de la ISS en tiempo real | Where the ISS at? (`wheretheiss.at`) | RF4 |
| Alertas de paso de la ISS por tu ciudad | API propia — Alertas ISS (TLE de Celestrak) | RF5 |
| Autenticación (registro / login / JWT) | API propia — Auth | RNF3 |
| Mis Reportes (observaciones propias, CRUD) | API propia — Reportes | RF6 |
| Cache Handler (APOD) | — | RF8 |

Detalle completo en [`docs/requerimientos.md`](docs/requerimientos.md).

## Stack tecnológico

- **Frontend:** Vue.js 3 + Tailwind CSS — una sola página con scroll y navbar sticky con anclas
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL 16 (`auth-service` y `reports-service`)
- **Arquitectura:** SOA — servicios independientes vía HTTP/REST
- **Orquestación:** Docker Compose
- **APIs externas:** NASA APOD, NASA NeoWs, MAAS/REMS (Curiosity), Where the ISS at? (`wheretheiss.at`), Celestrak (TLE)

## Estructura del repositorio

```
SpaceMx/
├── README.md
├── docker-compose.yml          # Orquestador: Postgres + 7 servicios + frontend
├── .env.example                # Variables del compose (cópialo a .env)
├── .gitignore
├── docs/                       # Documentación del proyecto
│   ├── requerimientos.md       # Requerimientos funcionales y no funcionales (RF/RNF)
│   ├── arquitectura.md         # Arquitectura SOA, diagramas, comunicación entre servicios
│   └── modelo_datos.md         # Modelo de datos de los servicios propios
├── frontend/                   # Dashboard Vue 3 + Tailwind CSS
│   └── Dockerfile
└── services/                   # Servicios SOA (independientes)
    ├── apod-service/           # Foto del día + buscador histórico + caché (RF1, RF7, RF8)
    ├── mars-weather-service/   # Clima en Marte — MAAS/REMS Curiosity (RF3)
    ├── neows-service/          # Asteroides cercanos + filtros (RF2, RF9)
    ├── iss-tracker-service/    # Posición ISS en tiempo real — wheretheiss.at (RF4)
    ├── auth-service/           # Registro, login y JWT (RNF3) — propio
    ├── reports-service/        # Reportes espaciales / observaciones (RF6) — propio, valida JWT
    └── iss-alerts-service/     # Alertas de paso de la ISS (RF5) — propio
```

Cada servicio en `services/` es independiente y desacoplado (RNF5): puede fallar, actualizarse o escalar sin afectar a los demás. Cada uno tiene su propio `Dockerfile` y `.env.example`.

## Documentación

- [`docs/requerimientos.md`](docs/requerimientos.md) — Requerimientos funcionales (RF) y no funcionales (RNF)
- [`docs/arquitectura.md`](docs/arquitectura.md) — Arquitectura SOA y diagramas de servicios
- [`docs/modelo_datos.md`](docs/modelo_datos.md) — Modelo de datos de los servicios propios
- [`services/README.md`](services/README.md) — Guía por servicio (puertos, rutas, encargados)

## Instalación manual (sin Docker)

Solo si no quieres usar Docker. Requiere **Node.js 20+**, **npm 9+** y un **PostgreSQL**
corriendo localmente. Son 9 terminales: una por servicio, más la BD y el frontend.

### 1. Crear la base de datos

```bash
createdb spacemex
```

### 2. Levantar cada servicio

Los `.env` **no se versionan**: cada servicio trae un `.env.example` como plantilla.
Para **cada** carpeta en `services/`:

```bash
cd services/apod-service     # repite con cada servicio
npm install
cp .env.example .env         # crea tu archivo de variables
npm run dev
```

Qué poner en cada `.env`:

| Servicio | Puerto | Variables |
|---|---|---|
| `apod-service` | 3001 | `NASA_API_KEY` (o `DEMO_KEY`) |
| `mars-weather-service` | 3002 | ninguna (MAAS/REMS no usa llave) |
| `neows-service` | 3003 | `NASA_API_KEY` (o `DEMO_KEY`) |
| `iss-tracker-service` | 3004 | ninguna (wheretheiss.at no usa llave) |
| `auth-service` | 3005 | `JWT_SECRET`, `JWT_EXPIRES_IN`, `DATABASE_URL` |
| `reports-service` | 3006 | `JWT_SECRET`, `DATABASE_URL` |
| `iss-alerts-service` | 3007 | `TLE_URL` (ya trae default) |

> **Importante:** `auth-service` y `reports-service` deben tener **exactamente el mismo
> `JWT_SECRET`** y el mismo `DATABASE_URL`, o los tokens de `auth` serán rechazados por
> `reports`. Ejemplo de `DATABASE_URL`:
> `postgres://postgres:postgres@localhost:5432/spacemex`

### 3. Levantar el frontend

```bash
cd frontend
npm install
npm run dev
```

Disponible en http://localhost:5173. No necesita `.env`: las URLs de los servicios
apuntan a `localhost:300X` por defecto. (Opcional: `VITE_APOD_API_URL` para apuntar
el APOD a otra URL.)

### Scripts disponibles (frontend)

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Vista previa del build de producción |

## Estado del proyecto

- [x] Documento de requerimientos (v1.0)
- [x] Mockup de estructura base del dashboard
- [x] Estructura de repositorio inicial
- [x] Documentación técnica (arquitectura, modelo de datos)
- [x] Servicios wrapper (APOD, Marte, NeoWs, ISS) implementados
- [x] Autenticación (`auth-service`) y reportes (`reports-service`) con JWT
- [x] Frontend conectado a los servicios reales
- [x] `iss-alerts-service` (RF5) — pasos de la ISS con TLE de Celestrak
- [x] Orquestación con Docker Compose (un solo comando)
- [ ] Caché de `mars-weather-service` (RF8) — pendiente
