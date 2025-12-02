import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const {
  DB_HOST = "localhost",
  DB_USER = "root",
  DB_PASSWORD = "root",
  DB_NAME = "proyecto_ic",
  DB_PORT = "3306",
  PORT = "3000",
  CORS_ORIGIN = "*",
} = process.env;

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN, credentials: false }));

let pool;

async function initDb() {
  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: Number(DB_PORT),
    waitForConnections: true,
    connectionLimit: 10
  });

  // Crea tabla si no existe
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email y password son requeridos" });
    }
    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, password_hash]
    );

    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    // Manejo de duplicado de email
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El email ya está registrado" });
    }
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

app.get("/api/users", async (_req, res) => {
  const [rows] = await pool.query("SELECT id, name, email, created_at FROM users ORDER BY id DESC");
  res.json(rows);
});

initDb()
  .then(() => {
    app.listen(Number(PORT), () => {
      console.log(`API escuchando en puerto ${PORT}`);
    });
  })
  .catch((e) => {
    console.error("Error inicializando DB", e);
    process.exit(1);
  });
