-- =============================================
-- Viandas Nati - Menu digital
-- Script para crear la base de datos (SQLite)
-- =============================================

-- ---------------------------------------------------------
-- Tabla platos
-- category: las tres secciones del menu semanal
-- active: baja logica (no se borran filas, se desactivan)
-- image: ruta relativa dentro de /uploads/platos, puede ser NULL
--        (el menu no depende de tener foto por plato)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS platos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Entrada', 'Plato principal', 'Postre')),
    tag TEXT,
    image TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
