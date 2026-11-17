import { DatabaseSync } from "node:sqlite";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, "viandas.sqlite");
const schemaPath = join(__dirname, "schema.sql");

if (!existsSync(dirname(dbPath))) {
    mkdirSync(dirname(dbPath), { recursive: true });
}

const connection = new DatabaseSync(dbPath);
connection.exec("PRAGMA journal_mode = WAL");
connection.exec("PRAGMA foreign_keys = ON");

// Crea las tablas si todavia no existen (idempotente, corre en cada arranque)
connection.exec(readFileSync(schemaPath, "utf-8"));

// Bases creadas antes de que existiera la columna "agotado": se les agrega
const columnas = connection.prepare("PRAGMA table_info(platos)").all();
if (!columnas.some((columna) => columna.name === "agotado")) {
    connection.exec("ALTER TABLE platos ADD COLUMN agotado INTEGER NOT NULL DEFAULT 0");
}

export default connection;
