# SpaceMex — NASA Space Dashboard

Dashboard web que centraliza información espacial en tiempo real (foto astronómica del día, asteroides cercanos, clima en Marte, posición de la ISS y alertas de paso) en una sola plataforma, bajo **Arquitectura Orientada a Servicios (SOA)**.

> Proyecto académico — SpaceMex · 2026

## Problema que resuelve

Hoy, ver esta información implica abrir varias páginas distintas y, en muchos casos, saber usar APIs técnicas. SpaceMex reúne todo en un solo dashboard visual, accesible para cualquier persona sin conocimientos técnicos, y permite además guardar observaciones propias y recibir avisos de paso de la ISS.

## Funcionalidades principales

| Sección | Fuente de datos | Requerimiento |
|---|---|---|
| Foto Astronómica del Día (APOD) + buscador histórico | NASA APOD API | RF1, RF7 |
| Asteroides cercanos (NeoWs) + filtros | NASA NeoWs API | RF2, RF9 |
| Clima en Marte (temperatura, viento, presión) | MAAS/REMS — rover Curiosity | RF3 |
| Posición de la ISS en tiempo real | Where the ISS at? (`wheretheiss.at`) | RF4 |
| Alertas de paso de la ISS por tu ciudad | API propia — Alertas ISS *(mock, no implementado)* | RF5 |
| Autenticación (registro / login / JWT) | API propia — Auth | RNF3 |
| Mis Reportes (observaciones propias, CRUD) | API propia — Reportes | RF6 |
| Cache Handler (APOD) | — | RF8 |

Detalle completo en [`docs/requerimientos.md`](docs/requerimientos.md).

## Stack tecnológico

- **Frontend:** Vue.js 3 + Tailwind CSS — una sola página con scroll y navbar sticky con anclas
- **Backend:** Node.js + Express
- **Arquitectura:** SOA — servicios independientes vía HTTP/REST
- **APIs externas:** NASA APOD, NASA NeoWs, MAAS/REMS (Curiosity), Where the ISS at? (`wheretheiss.at`)

## Estructura del repositorio

```
SpaceMx/
├── README.md
├── .gitignore
├── docs/                       # Documentación del proyecto
│   ├── requerimientos.md       # Requerimientos funcionales y no funcionales (RF/RNF)
│   ├── arquitectura.md         # Arquitectura SOA, diagramas, comunicación entre servicios
│   └── modelo_datos.md         # Modelo de datos de los servicios propios
├── frontend/                   # Dashboard Vue 3 + Tailwind CSS
└── services/                   # Servicios SOA (independientes)
    ├── apod-service/           # Foto del día + buscador histórico + caché (RF1, RF7, RF8)
    ├── mars-weather-service/   # Clima en Marte — MAAS/REMS Curiosity (RF3)
    ├── neows-service/          # Asteroides cercanos + filtros (RF2, RF9)
    ├── iss-tracker-service/    # Posición ISS en tiempo real — wheretheiss.at (RF4)
    ├── auth-service/           # Registro, login y JWT (RNF3) — propio
    ├── reports-service/        # Reportes espaciales / observaciones (RF6) — propio, valida JWT
    └── iss-alerts-service/     # Alertas de paso de la ISS (RF5) — propio, no implementado
```

Cada servicio en `services/` es independiente y desacoplado (RNF5): puede fallar, actualizarse o escalar sin afectar a los demás.

## Documentación

- [`docs/requerimientos.md`](docs/requerimientos.md) — Requerimientos funcionales (RF) y no funcionales (RNF)
- [`docs/arquitectura.md`](docs/arquitectura.md) — Arquitectura SOA y diagramas de servicios
- [`docs/modelo_datos.md`](docs/modelo_datos.md) — Modelo de datos de los servicios propios

## Instalación y uso local

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior
- Una API Key de la [NASA Open APIs](https://api.nasa.gov/) (registro gratuito)

### 1. Clonar el repositorio

```bash
git clone https://github.com/DjRober/spacemx.git
cd spacemx
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y añade tu API key:

```bash
cp frontend/.env.example frontend/.env
```

Edita `frontend/.env`:

```env
VITE_NASA_API_KEY=tu_api_key_aqui
```

### 3. Instalar y ejecutar el frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### 4. Ejecutar los servicios (backend)

Cada servicio se levanta de forma independiente. Desde la raíz del proyecto:

```bash
cd services/<nombre-del-servicio>
npm install
npm run dev
```

Repite el paso para cada servicio que quieras usar:

| Servicio | Puerto por defecto |
|---|---|
| `apod-service` | 3001 |
| `mars-weather-service` | 3002 |
| `neows-service` | 3003 |
| `iss-tracker-service` | 3004 |
| `auth-service` | 3005 |
| `reports-service` | 3006 |
| `iss-alerts-service` | — (no implementado) |

> **Variables de entorno por servicio:** los servicios de NASA (`apod`, `neows`) leen `NASA_API_KEY` de su propio `.env` (cae a `DEMO_KEY` si falta). `auth-service` y `reports-service` requieren `DATABASE_URL` (PostgreSQL) y **el mismo** `JWT_SECRET`. `mars-weather-service` e `iss-tracker-service` no requieren llave.

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
- [ ] `iss-alerts-service` (RF5) — pendiente (el frontend usa datos mock)
- [ ] Caché de `mars-weather-service` (RF8) — pendiente
