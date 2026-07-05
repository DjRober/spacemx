// auth-service — RNF3
// Servicio propio de autenticación: registro, login y emisión de JWT.

import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { pool, inicializarEsquema } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3005;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

if (!JWT_SECRET) {
  console.error("Falta JWT_SECRET en el .env");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

const firmarToken = (usuario) =>
  jwt.sign(
    { usuario_id: usuario.id, email: usuario.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

// POST /auth/registro  { nombre, email, password, idioma? }
app.post("/auth/registro", async (req, res) => {
  const { nombre, email, password, idioma } = req.body ?? {};

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "nombre, email y password son requeridos" });
  }

  const emailNormalizado = email.trim().toLowerCase();
  const password_hash = await bcrypt.hash(password, 10);
  const idiomaPreferido = idioma === "en" ? "en" : "es";

  try {
    // RETURNING sin password_hash: nunca sale el hash de la BD hacia la respuesta.
    const { rows } = await pool.query(
      `INSERT INTO usuario (nombre, email, password_hash, idioma_preferido)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, idioma_preferido, fecha_registro`,
      [nombre, emailNormalizado, password_hash, idiomaPreferido]
    );
    const usuario = rows[0];
    res.status(201).json({ token: firmarToken(usuario), usuario });
  } catch (err) {
    // 23505 = violación de UNIQUE (email ya registrado).
    if (err.code === "23505") {
      return res.status(409).json({ error: "El email ya está registrado" });
    }
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// POST /auth/login  { email, password }
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: "email y password son requeridos" });
  }

  const emailNormalizado = email.trim().toLowerCase();

  const { rows } = await pool.query(
    `SELECT id, email, password_hash FROM usuario WHERE email = $1`,
    [emailNormalizado]
  );
  const usuario = rows[0];

  // Mismo 401 si el usuario no existe o si la contraseña no coincide.
  const passwordValida = usuario
    ? await bcrypt.compare(password, usuario.password_hash)
    : false;

  if (!passwordValida) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  res.json({ token: firmarToken({ id: usuario.id, email: usuario.email }) });
});

// Arranca solo después de asegurar que la tabla existe.
inicializarEsquema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`auth-service en http://localhost:${PORT}/auth`);
    });
  })
  .catch((err) => {
    console.error("No se pudo inicializar la BD:", err);
    process.exit(1);
  });