# reports-service (propio)

Servicio propio de SpaceMex para observaciones astronómicas de usuarios autenticados (CRUD).

- **RF6** — Registrar, guardar y compartir observaciones astronómicas
- **RNF3** — Requiere autenticación

## API

- Base URL: `http://localhost:3006` (desarrollo)
- Autenticación: header `Authorization: Bearer <token>` en todas las rutas. El token lo
  emite **`auth-service`**; este servicio solo lo **valida** con el mismo `JWT_SECRET` y
  toma el `usuario_id` del payload (no llama a auth por red).
- Endpoints:
  - `GET /reportes` — lista los reportes del usuario autenticado
  - `POST /reportes` — crea una observación (título, descripción, fecha, coords, visibilidad)
  - `PUT /reportes/:id` — actualiza un reporte propio (403 si no es del usuario)
  - `DELETE /reportes/:id` — elimina un reporte propio (403 si no es del usuario)

## Datos

Ver `schema.sql` y `docs/modelo_datos.md` §3.2. Tabla `reporte`: `id` (UUID), `usuario_id`
(referencia lógica a `auth-service`, sin FK), título, descripción, fecha de observación,
latitud/longitud (con `CHECK`), `es_publico`, timestamps de creación/actualización.

## Variables de entorno

- `DATABASE_URL` — cadena de conexión a PostgreSQL
- `JWT_SECRET` — **el mismo** que usa `auth-service` para firmar los tokens
- `PORT` — opcional (default 3006)

## Pendiente

- Tabla `reporte_imagen` (imágenes adjuntas) — documentada, aún no creada en `schema.sql`
- Endpoint público del listado comunitario (`es_publico = true`)
