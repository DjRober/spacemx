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
- Integración con InSight Mars Weather API — clima en Marte.
- Integración con Open-Notify ISS Location — posición de la ISS.
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
| APIs externas | NASA APOD, NeoWs, InSight, Open-Notify |

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

La aplicación está compuesta por **6 servicios independientes**: 4 servicios externos consumidos mediante APIs públicas y 2 servicios propios desarrollados por SpaceMex.

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

#### Servicio 3 — Clima en Marte (InSight)

Obtiene los datos meteorológicos más recientes registrados por el módulo InSight de NASA en la superficie de Marte, incluyendo temperatura, velocidad del viento y presión atmosférica.

| Campo | Valor |
|---|---|
| Proveedor | NASA InSight Mars Weather Service |
| Base URL | `https://api.nasa.gov` |
| Endpoint | `/insight_weather/` |
| Método HTTP | GET |

Parámetros:

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `api_key` | string | Sí | Clave de autenticación NASA |
| `feedtype` | string | Sí | Formato de respuesta; valor: `json` |
| `ver` | number | Sí | Versión de la API; valor: `1.0` |

**Datos que provee:** temperatura mínima y máxima (°C), velocidad y dirección del viento, presión atmosférica, sol marciano (día en Marte).

#### Servicio 4 — Posición de la ISS en tiempo real (Open Notify)

Obtiene las coordenadas geográficas actuales de la Estación Espacial Internacional (ISS) directamente desde los servidores de Open Notify, actualizándose cada pocos segundos.

| Campo | Valor |
|---|---|
| Proveedor | Open Notify |
| Base URL | `http://api.open-notify.org` |
| Endpoint | `/iss-now.json` |
| Método HTTP | GET |

**Parámetros:** no requiere parámetros ni autenticación.

**Datos que provee:** latitud y longitud actuales de la ISS, timestamp Unix de la medición.

### 5.2 Servicios propios — SpaceMex

#### Servicio 5 — API de Alertas ISS

Servicio desarrollado internamente por SpaceMex que notifica al usuario cuando la ISS pasará sobre su ciudad. Calcula la hora aproximada de paso, la duración visible y la elevación máxima.

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

#### Servicio 6 — API de Reportes Espaciales

Servicio propio que permite a los usuarios autenticados registrar, consultar, editar y eliminar sus observaciones astronómicas personales. Los reportes pueden marcarse como públicos para ser vistos por la comunidad.

| Campo | Valor |
|---|---|
| Proveedor | SpaceMex (desarrollo propio) |
| Base URL | `https://api.spacemex.dev` (propuesta) |
| Endpoints | `/reportes` · `/reportes/{id}` |
| Métodos HTTP | GET · POST · PUT · DELETE |

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
