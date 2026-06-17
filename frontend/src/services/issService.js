// services/issService.js
// RF4 / RF5 — Servicio de la ISS (posición y alertas de paso)
// Sin conexión a Open-Notify todavía. Devuelve datos mock (hardcodeados)
// para poder construir y probar la UI sin depender de la API real.

/**
 * Simula la obtención de la posición actual de la ISS.
 * Cuando se conecte la API real (Open-Notify), esta función
 * hará fetch a http://api.open-notify.org/iss-now.json
 */
export function getIssLocation() {
  return {
    latitude: 19.4326,
    longitude: -99.1332,
    timestamp: Date.now(),
    message: "success",
  };
}

/**
 * Simula el registro de una ciudad para alertas de paso de la ISS.
 * Por ahora no hay lógica real ni conexión a backend propio (iss-alerts-service).
 * @param {string} city - nombre de la ciudad ingresada en el formulario
 */
export function subscribeIssAlert(city) {
  return {
    success: true,
    city: city || "Ciudad de México",
    message: "Mock: alerta registrada (sin conexión real todavía)",
  };
}

/**
 * Simula una lista de próximos pasos de la ISS sobre una ciudad.
 * Datos hardcodeados solo para maquetar la UI.
 */
export function getIssPasses() {
  return [
    { date: "2026-06-18", time: "20:45", duration_minutes: 6 },
    { date: "2026-06-19", time: "19:58", duration_minutes: 4 },
    { date: "2026-06-21", time: "21:10", duration_minutes: 5 },
  ];
}
