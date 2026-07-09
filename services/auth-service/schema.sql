-- Tabla usuario — modelo_datos.md §3.1 (dueño: auth-service, RNF3)
-- id como UUID: identidad compartida con reports-service (reporte.usuario_id UUID).
CREATE TABLE IF NOT EXISTS usuario (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre           VARCHAR(255) NOT NULL,
  email            VARCHAR(255) NOT NULL UNIQUE,
  password_hash    VARCHAR(255) NOT NULL,
  idioma_preferido VARCHAR(2)  NOT NULL DEFAULT 'es'
                     CHECK (idioma_preferido IN ('es', 'en')),
  fecha_registro   TIMESTAMPTZ NOT NULL DEFAULT now()
);