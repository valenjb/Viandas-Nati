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

// Crea la tabla si todavia no existe (idempotente, corre en cada arranque)
connection.exec(readFileSync(schemaPath, "utf-8"));

export default connection;
