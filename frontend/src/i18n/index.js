// i18n/index.js — Configuración de vue-i18n
import { createI18n } from "vue-i18n";
import es from "./es.js";
import en from "./en.js";

// Persistir el idioma elegido en localStorage
const savedLocale = localStorage.getItem("spacemex-locale") || "es";

const i18n = createI18n({
  legacy: false,       // Usar Composition API
  locale: savedLocale,
  fallbackLocale: "es",
  messages: { es, en },
});

export default i18n;
