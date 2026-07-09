# auth-service (propio)

Servicio propio de SpaceMex que gestiona la identidad de los usuarios: registro, login y
emisión de **JWT**. Es dueño de la tabla `usuario`. Se extrajo de `reports-service` para
separar la responsabilidad de autenticación (RNF3, RNF5).

- **RNF3** — Autenticación de las APIs propias

## API

- Base URL: `http://localhost:3005` (desarrollo)

| Endpoint | Método | Body JSON | Respuesta |
|---|---|---|---|
| `/auth/registro` | POST | `nombre`, `email`, `password`, `idioma?` (`es`/`en`) | `201 { token, usuario }` |
| `/auth/login` | POST | `email`, `password` | `200 { token }` |

- El `email` se normaliza a minúsculas; es único (409 si ya existe).
- La contraseña se guarda con hash **bcrypt**; nunca se devuelve `password_hash`.
- El JWT lleva `{ usuario_id, email }` y expira según `JWT_EXPIRES_IN` (default `24h`).

## Cómo lo usan otros servicios

`reports-service` **no llama** a este servicio por red: valida el token localmente
compartiendo el mismo `JWT_SECRET`. Por eso ambos servicios deben tener el mismo valor
de `JWT_SECRET` en su `.env`.

## Datos

Ver `schema.sql` y `docs/modelo_datos.md` §3.1. Tabla `usuario`: `id` (UUID), `nombre`,
`email` (único), `password_hash`, `idioma_preferido` (`es`/`en`, con `CHECK`),
`fecha_registro`.

## Variables de entorno

- `DATABASE_URL` — cadena de conexión a PostgreSQL
- `JWT_SECRET` — secreto para firmar los tokens (**obligatorio**; el proceso no arranca sin él)
- `JWT_EXPIRES_IN` — opcional (default `24h`)
- `PORT` — opcional (default 3005)
