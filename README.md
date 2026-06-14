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
| Clima en Marte (temperatura, viento, presión) | NASA InSight Mars Weather | RF3 |
| Posición de la ISS en tiempo real | Open-Notify ISS Location | RF4 |
| Alertas de paso de la ISS por tu ciudad | API propia — Alertas ISS | RF5 |
| Mis Reportes (observaciones propias, CRUD) | API propia — Reportes | RF6 |
| Cache Handler (APOD y clima Marte) | — | RF8 |

Detalle completo en [`docs/requerimientos.md`](docs/requerimientos.md).

## Stack tecnológico

- **Frontend:** Vue.js 3 + Tailwind CSS — una sola página con scroll y navbar sticky con anclas
- **Backend:** Node.js + Express
- **Arquitectura:** SOA — servicios independientes vía HTTP/REST
- **APIs externas:** NASA APOD, NASA NeoWs, NASA InSight Mars Weather, Open-Notify ISS

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
    ├── neows-service/          # Asteroides cercanos + filtros (RF2, RF9)
    ├── mars-weather-service/   # Clima en Marte + caché (RF3, RF8)
    ├── iss-tracker-service/    # Posición ISS en tiempo real (RF4)
    ├── iss-alerts-service/     # Alertas de paso de la ISS (RF5) — propio
    └── reports-service/        # Reportes espaciales / observaciones (RF6) — propio, con auth
```

Cada servicio en `services/` es independiente y desacoplado (RNF5): puede fallar, actualizarse o escalar sin afectar a los demás.

## Documentación

- [`docs/requerimientos.md`](docs/requerimientos.md) — Requerimientos funcionales (RF) y no funcionales (RNF)
- [`docs/arquitectura.md`](docs/arquitectura.md) — Arquitectura SOA y diagramas de servicios
- [`docs/modelo_datos.md`](docs/modelo_datos.md) — Modelo de datos de los servicios propios

> Estos documentos se desarrollarán en los siguientes pasos del proyecto.

## Equipo — SpaceMex

| Rol | Integrante | Responsabilidad |
|---|---|---|
| Gerente de Proyecto | Roberto Pérez | Documentación de servicios SOA · revisión y entrega final |
| Desarrollador | Daniel Esparza | Requerimientos Funcionales |
| Desarrollador | Diego Martinez | Requerimientos No Funcionales |
| Desarrollador | Iker Requenes | Problemática + Alcance |

## Estado del proyecto

- [x] Documento de requerimientos (v1.0)
- [x] Mockup de estructura base del dashboard
- [ ] Estructura de repositorio inicial
- [ ] Documentación técnica (arquitectura, modelo de datos)
- [ ] Implementación de servicios y frontend
