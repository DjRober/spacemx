// reports-service — RF6
// CRUD de observaciones astronómicas del usuario autenticado.
// Valida el JWT emitido por auth-service usando el mismo JWT_SECRET.

import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import pg from "pg";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3006;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("Falta JWT_SECRET en el .env");
  process.exit(1);
}

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.on("error", (err) => console.error("Error inesperado en el pool de PG:", err));

app.use(cors());
app.use(express.json());

// ── Inicializar esquema ───────────────────────────────────────────
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function inicializarEsquema() {
  const sql = readFileSync(join(__dirname, "schema.sql"), "utf8");
  await pool.query(sql);
}

// ── Middleware de autenticación ───────────────────────────────────
// Lee el header Authorization: Bearer <token>, lo verifica y
// extrae usuario_id. Si falta o es inválido → 401.
function autenticar(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario_id = payload.usuario_id;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

// ── Validar coordenadas ───────────────────────────────────────────
function validarCoordenadas(latitud, longitud) {
  const lat = Number(latitud);
  const lon = Number(longitud);
  if (isNaN(lat) || lat < -90 || lat > 90)
    return "latitud debe ser un número entre -90 y 90";
  if (isNaN(lon) || lon < -180 || lon > 180)
    return "longitud debe ser un número entre -180 y 180";
  return null;
}

// ── GET /reportes ─────────────────────────────────────────────────
// Devuelve solo los reportes del usuario autenticado.
app.get("/reportes", autenticar, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, titulo, descripcion, fecha_observacion,
              latitud, longitud, es_publico,
              fecha_creacion, fecha_actualizacion
       FROM reporte
       WHERE usuario_id = $1
       ORDER BY fecha_creacion DESC`,
      [req.usuario_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// ── POST /reportes ────────────────────────────────────────────────
// Crea una observación asociada al usuario del token.
app.post("/reportes", autenticar, async (req, res) => {
  const { titulo, descripcion, fecha_observacion, latitud, longitud, es_publico } =
    req.body ?? {};

  if (!titulo || !descripcion || !fecha_observacion || latitud == null || longitud == null) {
    return res.status(400).json({
      error: "titulo, descripcion, fecha_observacion, latitud y longitud son requeridos",
    });
  }

  const errorCoords = validarCoordenadas(latitud, longitud);
  if (errorCoords) return res.status(400).json({ error: errorCoords });

  try {
    const { rows } = await pool.query(
      `INSERT INTO reporte
         (usuario_id, titulo, descripcion, fecha_observacion, latitud, longitud, es_publico)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.usuario_id,
        titulo,
        descripcion,
        fecha_observacion,
        Number(latitud),
        Number(longitud),
        es_publico ?? false,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// ── PUT /reportes/:id ─────────────────────────────────────────────
// Solo si reporte.usuario_id == usuario del token. Si no → 403.
app.put("/reportes/:id", autenticar, async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha_observacion, latitud, longitud, es_publico } =
    req.body ?? {};

  try {
    // Verificar que el reporte existe y pertenece al usuario
    const { rows: existing } = await pool.query(
      `SELECT usuario_id FROM reporte WHERE id = $1`,
      [id]
    );
    if (!existing.length) return res.status(404).json({ error: "Reporte no encontrado" });
    if (existing[0].usuario_id !== req.usuario_id)
      return res.status(403).json({ error: "No tienes permiso para editar este reporte" });

    // Validar coordenadas si se mandan
    if (latitud != null || longitud != null) {
      const errorCoords = validarCoordenadas(
        latitud ?? existing[0].latitud,
        longitud ?? existing[0].longitud
      );
      if (errorCoords) return res.status(400).json({ error: errorCoords });
    }

    const { rows } = await pool.query(
      `UPDATE reporte SET
         titulo              = COALESCE($1, titulo),
         descripcion         = COALESCE($2, descripcion),
         fecha_observacion   = COALESCE($3, fecha_observacion),
         latitud             = COALESCE($4, latitud),
         longitud            = COALESCE($5, longitud),
         es_publico          = COALESCE($6, es_publico),
         fecha_actualizacion = now()
       WHERE id = $7
       RETURNING *`,
      [
        titulo ?? null,
        descripcion ?? null,
        fecha_observacion ?? null,
        latitud != null ? Number(latitud) : null,
        longitud != null ? Number(longitud) : null,
        es_publico ?? null,
        id,
      ]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// ── DELETE /reportes/:id ──────────────────────────────────────────
// Solo si reporte.usuario_id == usuario del token. Si no → 403.
app.delete("/reportes/:id", autenticar, async (req, res) => {
  const { id } = req.params;

  try {
    const { rows: existing } = await pool.query(
      `SELECT usuario_id FROM reporte WHERE id = $1`,
      [id]
    );
    if (!existing.length) return res.status(404).json({ error: "Reporte no encontrado" });
    if (existing[0].usuario_id !== req.usuario_id)
      return res.status(403).json({ error: "No tienes permiso para eliminar este reporte" });

    await pool.query(`DELETE FROM reporte WHERE id = $1`, [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// ── Arrancar ──────────────────────────────────────────────────────
inicializarEsquema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`reports-service en http://localhost:${PORT}/reportes`);
    });
  })
  .catch((err) => {
    console.error("No se pudo inicializar la BD:", err);
    process.exit(1);
  });
