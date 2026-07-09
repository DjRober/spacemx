-- reports-service — RF6
-- Crea la tabla reporte si no existe (idempotente: seguro correrlo varias veces)

CREATE TABLE IF NOT EXISTS reporte (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id        UUID        NOT NULL,
  titulo            VARCHAR     NOT NULL,
  descripcion       TEXT        NOT NULL,
  fecha_observacion TIMESTAMPTZ NOT NULL,
  latitud           DECIMAL(8,6)  NOT NULL CHECK (latitud  BETWEEN -90  AND 90),
  longitud          DECIMAL(9,6)  NOT NULL CHECK (longitud BETWEEN -180 AND 180),
  es_publico        BOOLEAN     NOT NULL DEFAULT false,
  fecha_creacion    TIMESTAMPTZ NOT NULL DEFAULT now(),
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para listar reportes de un usuario rápido
CREATE INDEX IF NOT EXISTS idx_reporte_usuario_id ON reporte (usuario_id);

-- Índice para el listado comunitario (es_publico = true)
CREATE INDEX IF NOT EXISTS idx_reporte_publico ON reporte (es_publico, fecha_creacion DESC);
