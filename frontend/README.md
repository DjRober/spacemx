# SpaceMex — Frontend

Dashboard SPA construido con **Vue 3 + Tailwind CSS**. Una sola página con scroll y navbar sticky con anclas a cada sección (ver mockup en `spacemex_mockup.html`).

## Secciones (1 página, scroll)

1. **Foto del Día (APOD)** — héroe, buscador histórico — RF1, RF7
2. **ISS** — mapa en tiempo real + alertas de paso — RF4, RF5
3. **Clima en Marte** — temperatura, viento, presión (con caché) — RF3, RF8
4. **Asteroides (NeoWs)** — filtros + tabla de resultados — RF2, RF9
5. **Mis Reportes** — formulario CRUD, requiere login — RF6, RNF3

## Pendiente

- Inicializar proyecto Vue 3 (Vite) + Tailwind CSS
- Idioma ES/EN (RNF9)
- Consumir endpoints de `services/` vía REST
