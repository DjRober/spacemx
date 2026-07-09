# Documento de Requerimientos del Sistema

**SpaceMex · NASA Space Dashboard · Arquitectura SOA · 2026**

| Versión | Fecha | Gerente | Estado |
|---|---|---|---|
| v1.0 | Viernes de entrega | Roberto Pérez | Terminado |

## 1. Problemática

### 1.1 Contexto del problema

Hoy en día, encontrar información sobre el espacio en internet significa abrir múltiples páginas distintas: una para ver la foto del día de la NASA, otra para saber dónde está la ISS, otra para el clima en Marte. No hay un solo lugar donde se pueda ver todo esto junto de forma sencilla y visual.

### 1.2 Descripción de la problemática

La información espacial existe, pero está dispersa y muchas veces requiere conocimientos técnicos para acceder a ella. La mayoría de las personas no sabe cómo usar una API ni dónde buscar estos datos. Tampoco existe una plataforma donde el usuario pueda, además de consultar información, guardar sus propias observaciones o recibir un aviso cuando la ISS va a pasar sobre su ciudad.

### 1.3 Justificación

SpaceMex busca que cualquier persona, sin importar su nivel técnico, pueda explorar el espacio desde su navegador. Al reunir todo en un solo dashboard, se elimina la necesidad de buscar en múltiples fuentes. Esto no solo hace la experiencia más cómoda, sino que también acerca la ciencia espacial a más personas y despierta el interés por la astronomía.

## 2. Alcance del proyecto

### 2.1 Lo que incluye el sistema

- Integración con NASA APOD API — foto astronómica del día.
- Integración con NASA NeoWs API — asteroides cercanos en tiempo real.
- Integración con la API MAAS/REMS (rover Curiosity) — clima en Marte.
- Integración con la API "Where the ISS at?" (`wheretheiss.at`) — posición de la ISS.
- Servicio propio: API de Autenticación — registro, login y emisión de JWT.
- Servicio propio: API de Alertas ISS — notificaciones por ciudad.
- Servicio propio: API de Reportes Espaciales — observaciones del usuario.
- Buscador histórico de la Foto Astronómica del Día (APOD).
- Sistema de almacenamiento en caché para datos meteorológicos de Marte y la Foto Astronómica del Día.
- Filtros para consulta de asteroides por rango de fechas, tamaño estimado y nivel de peligrosidad.

### 2.2 Lo que NO incluye el sistema (exclusiones)

- No se incluyen datos históricos ni predicciones astronómicas a largo plazo.
- No se desarrollará una aplicación móvil nativa en esta versión.

### 2.3 Tecnologías y límites

| Capa | Tecnología |
|---|---|
| Frontend | Vue.js 3 + Tailwind CSS |
| Backend | Node.js con Express |
| SOA | Servicios independientes vía HTTP/REST |
| APIs externas | NASA APOD, NASA NeoWs, MAAS/REMS (Curiosity), Where the ISS at? (`wheretheiss.at`) |

## 3. Requerimientos funcionales

Describen QUÉ debe hacer el sistema.

| ID | Descripción |
|---|---|
| **RF1** | El sistema debe mostrar la foto astronómica del día obtenida desde la NASA APOD API junto con su descripción científica. |
| **RF2** | El sistema debe consultar y mostrar en tiempo real los asteroides Near-Earth detectados por la NASA NeoWs API. |
| **RF3** | El sistema debe mostrar la temperatura, viento y presión atmosférica actuales en la superficie de Marte. |
| **RF4** | El sistema debe mostrar la posición geográfica exacta de la ISS en tiempo real sobre un mapa interactivo. |
| **RF5** | El sistema debe notificar al usuario con la hora y duración cuando la ISS pasará sobre su ciudad. |
| **RF6** | El sistema debe permitir al usuario registrar, guardar y compartir sus observaciones astronómicas personales. |
| **RF7** | El sistema debe incluir un buscador histórico en la sección de la Foto Astronómica del Día (APOD) para permitir al usuario consultar imágenes de fechas pasadas. |
| **RF8** | El sistema debe implementar un mecanismo de almacenamiento en caché (Cache Handler) para los datos meteorológicos de Marte y la foto del día, reduciendo el consumo de peticiones directas a las APIs externas de la NASA. |
| **RF9** | El sistema debe permitir filtrar la consulta de asteroides (NeoWs API) por rango de fechas, tamaño estimado y nivel de peligrosidad. |

> Nota: RF7, RF8 y RF9 se agregaron el 27/05/2026 como expansión del alcance original (ver sección 6).

## 4. Requerimientos no funcionales

Describen CÓMO debe comportarse el sistema: rendimiento, seguridad, disponibilidad, etc.

| ID | Categoría | Descripción |
|---|---|---|
| **RNF1** | Rendimiento | El tiempo de respuesta de cada servicio no debe superar los 3 segundos bajo condiciones normales de uso. |
| **RNF2** | Disponibilidad | El sistema debe estar disponible el 99.5% del tiempo, descontando caídas de las APIs externas. |
| **RNF3** | Seguridad | Los endpoints de las APIs propias deben implementar autenticación para proteger datos del usuario. |
| **RNF4** | Compatibilidad | La interfaz debe funcionar correctamente en los navegadores Chrome, Firefox, Edge y Safari en sus versiones actuales. |
| **RNF5** | Arquitectura SOA | Cada servicio debe ser independiente y desacoplado; la falla de un servicio no debe afectar al resto. |
| **RNF6** | Escalabilidad | Los servicios propios deben soportar escalabilidad horizontal ante incrementos de demanda. |
| **RNF7** | Usabilidad | La plataforma debe ser fácil de usar desde el primer momento, sin necesidad de leer manuales ni recibir capacitación. Debe verse bien tanto en computadora como en celular. |
| **RNF8** | Mantenibilidad | El sistema debe estar organizado de manera que cualquier parte pueda actualizarse o corregirse sin afectar al resto de la aplicación. |
| **RNF9** | Idioma | La interfaz debe estar disponible en español e inglés para llegar a más usuarios. |

## 5. Inventario de servicios SOA

La aplicación está compuesta por **7 servicios independientes**: 4 servicios wrapper que consumen APIs públicas y 3 servicios propios desarrollados por SpaceMex (autenticación, alertas y reportes).

> **Nota (09/07/2026):** respecto al plan original, dos de las APIs externas fueron descartadas por alternativas más estables (ver §6):
> - **Clima en Marte:** se dejó de usar NASA InSight (`/insight_weather/`, misión finalizada en 2022) y ahora se consume la API **MAAS/REMS** del rover Curiosity.
> - **Posición de la ISS:** se dejó de usar Open-Notify (HTTP, inestable) y ahora se consume **"Where the ISS at?"** (`wheretheiss.at`, HTTPS).
>
> Además, la autenticación (RNF3) se extrajo de `reports-service` a un **`auth-service`** propio e independiente.

### 5.1 Servicios externos

#### Servicio 1 — Foto Astronómica del Día (APOD)

Consume la API pública de NASA para obtener diariamente una imagen o video astronómico seleccionado por científicos de la NASA, acompañado de una descripción técnica.

| Campo | Valor |
|---|---|
| Proveedor | NASA Open APIs |
| Base URL | `https://api.nasa.gov` |
| Endpoint | `/planetary/apod` |
| Método HTTP | GET |

Parámetros:

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `api_key` | string | Sí | Clave de autenticación NASA (gratuita) |
| `date` | string (YYYY-MM-DD) | No | Fecha específica; por defecto es el día actual |
| `thumbs` | boolean | No | Devuelve miniatura si el recurso es video |

**Datos que provee:** URL de la imagen/video, título, descripción científica, fecha, nombre del autor (si aplica).

#### Servicio 2 — Asteroides Near-Earth (NeoWs)

Consulta el sistema NeoWs (Near Earth Object Web Service) de NASA para obtener información sobre asteroides que se aproximan a la Tierra en un rango de fechas determinado.

| Campo | Valor |
|---|---|
| Proveedor | NASA NeoWs |
| Base URL | `https://api.nasa.gov` |
| Endpoint | `/neo/rest/v1/feed` |
| Método HTTP | GET |

Parámetros:

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `api_key` | string | Sí | Clave de autenticación NASA |
| `start_date` | string (YYYY-MM-DD) | Sí | Inicio del rango de búsqueda |
| `end_date` | string (YYYY-MM-DD) | No | Fin del rango (máx. 7 días desde start) |

**Datos que provee:** nombre del asteroide, diámetro estimado (mín/máx), velocidad relativa, distancia a la Tierra, indicador de peligrosidad.

#### Servicio 3 — Clima en Marte (MAAS/REMS — Curiosity)

Obtiene los datos meteorológicos más recientes registrados en la superficie de Marte por la estación REMS del rover **Curiosity**, incluyendo temperatura, velocidad del viento y presión atmosférica.

> **Cambio respecto al plan original:** se había planeado consumir NASA InSight (`/insight_weather/`), pero esa misión finalizó en diciembre de 2022 y su API ya no entrega datos nuevos. Se sustituyó por la API MAAS/REMS del rover Curiosity, que sigue activa. Como esta fuente comunitaria puede caerse, el servicio mantiene un objeto de ejemplo de respaldo para que la sección no se rompa.

| Campo | Valor |
|---|---|
| Proveedor | MAAS / REMS — Centro de Astrobiología (CAB, CSIC-INTA), datos del rover Curiosity |
| Base URL | `http://cab.inta-csic.es` |
| Endpoint | `/rems/wp-content/plugins/marsweather-widget/api.php` |
| Método HTTP | GET |

**Parámetros:** no requiere parámetros ni autenticación (API pública).

**Datos que provee:** temperatura mínima y máxima (°C), velocidad del viento, presión atmosférica, estación marciana y sol marciano (día en Marte).

#### Servicio 4 — Posición de la ISS en tiempo real (Where the ISS at?)

Obtiene las coordenadas geográficas actuales de la Estación Espacial Internacional (ISS) desde la API **"Where the ISS at?"**, actualizándose cada pocos segundos.

> **Cambio respecto al plan original:** se había planeado consumir Open-Notify (`api.open-notify.org/iss-now.json`), pero esa API es HTTP (sin HTTPS) y suele estar caída. Se sustituyó por `wheretheiss.at`, que es HTTPS, más estable y devuelve los mismos datos de latitud/longitud. El contrato hacia el frontend no cambia.

| Campo | Valor |
|---|---|
| Proveedor | Where the ISS at? |
| Base URL | `https://api.wheretheiss.at` |
| Endpoint | `/v1/satellites/25544` (`25544` = ID NORAD de la ISS) |
| Método HTTP | GET |

**Parámetros:** no requiere parámetros ni autenticación. Límite recomendado: ~1 petición por segundo.

**Datos que provee:** latitud y longitud actuales de la ISS y timestamp Unix de la medición (el wrapper lo entrega en milisegundos).

### 5.2 Servicios propios — SpaceMex

#### Servicio 5 — API de Autenticación

Servicio propio que gestiona el registro y el inicio de sesión de los usuarios y emite un **JWT** que los demás servicios propios (por ahora `reports-service`) usan para autorizar peticiones. Es dueño de la tabla `usuario`. Se extrajo de `reports-service` para separar la responsabilidad de identidad (RNF3, RNF5).

| Campo | Valor |
|---|---|
| Proveedor | SpaceMex (desarrollo propio) |
| Base URL | `http://localhost:3005` (desarrollo) |
| Endpoints | `/auth/registro` · `/auth/login` |
| Método HTTP | POST |

Operaciones disponibles:

| Endpoint | Método | Body JSON | Respuesta |
|---|---|---|---|
| `/auth/registro` | POST | `nombre`, `email`, `password`, `idioma?` | `{ token, usuario }` (201) |
| `/auth/login` | POST | `email`, `password` | `{ token }` |

**Datos que maneja:** ID de usuario (UUID), nombre, email (único, normalizado a minúsculas), hash de contraseña (bcrypt — nunca se devuelve), idioma preferido (`es`/`en`), fecha de registro.

#### Servicio 6 — API de Alertas ISS

Servicio desarrollado internamente por SpaceMex que notifica al usuario cuando la ISS pasará sobre su ciudad. Calcula la hora aproximada de paso, la duración visible y la elevación máxima.

> **Estado (09/07/2026):** este servicio aún **no está implementado** (solo existe su especificación). El frontend muestra datos de ejemplo (mock) en la sección de alertas hasta que se desarrolle el algoritmo de predicción de pasos.

| Campo | Valor |
|---|---|
| Proveedor | SpaceMex (desarrollo propio) |
| Base URL | `https://api.spacemex.dev` (propuesta) |
| Endpoint | `/alertas/paso` |
| Método HTTP | POST |

Parámetros (body JSON):

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `latitud` | float | Sí | Latitud de la ciudad del usuario |
| `longitud` | float | Sí | Longitud de la ciudad del usuario |
| `n_pasos` | integer | No | Número de próximos pasos a consultar; por defecto 3 |

**Datos que provee:** hora de inicio del paso (UTC), duración en segundos, elevación máxima, dirección de entrada y salida.

#### Servicio 7 — API de Reportes Espaciales

Servicio propio que permite a los usuarios autenticados registrar, consultar, editar y eliminar sus observaciones astronómicas personales. Los reportes pueden marcarse como públicos para ser vistos por la comunidad. **No emite tokens**: valida el JWT que emite `auth-service` (comparten el mismo `JWT_SECRET`) y toma el `usuario_id` del token.

| Campo | Valor |
|---|---|
| Proveedor | SpaceMex (desarrollo propio) |
| Base URL | `http://localhost:3006` (desarrollo) — `https://api.spacemex.dev` (propuesta) |
| Endpoints | `/reportes` · `/reportes/{id}` |
| Métodos HTTP | GET · POST · PUT · DELETE |
| Autenticación | Header `Authorization: Bearer <token>` (JWT de `auth-service`) |

Operaciones disponibles:

| Endpoint | Método | Descripción |
|---|---|---|
| `/reportes` | GET | Lista todas las observaciones del usuario autenticado |
| `/reportes` | POST | Crea una nueva observación (título, descripción, fecha, coords, visibilidad) |
| `/reportes/{id}` | PUT | Actualiza una observación existente |
| `/reportes/{id}` | DELETE | Elimina una observación |

**Datos que maneja:** ID del reporte, ID del usuario, título, descripción, fecha de observación, coordenadas geográficas, imagen adjunta (opcional), visibilidad pública/privada.

## 6. Notas y acuerdos del equipo

| Fecha | Acuerdo / Nota | Responsable |
|---|---|---|
| 27/05/2026 | Se decide expandir la lista original de requerimientos funcionales agregando el buscador histórico de APOD (RF7), filtros para asteroides NeoWs (RF9) y un manejador de caché (RF8). | Diego Martinez |
| 09/07/2026 | Se descarta NASA InSight (misión finalizada, API sin datos nuevos) y se adopta la API MAAS/REMS del rover Curiosity para el clima de Marte (RF3), con objeto de ejemplo de respaldo. | Diego Martinez |
| 09/07/2026 | Se descarta Open-Notify (HTTP inestable) y se adopta "Where the ISS at?" (`wheretheiss.at`, HTTPS) para la posición de la ISS (RF4). El contrato hacia el frontend no cambia. | Iker |
| 09/07/2026 | Se extrae la autenticación (RNF3) de `reports-service` a un `auth-service` propio, dueño de la tabla `usuario`, que emite el JWT. `reports-service` pasa a ser solo CRUD de reportes y validador del token. | Roberto Pérez |
