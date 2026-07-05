// db.js — pool de conexión a Postgres y carga del esquema.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

// Aplica schema.sql al arrancar (CREATE TABLE IF NOT EXISTS es idempotente).
export async function inicializarEsquema() {
  const sql = readFileSync(join(__dirname, "schema.sql"), "utf8");
  await pool.query(sql);
}