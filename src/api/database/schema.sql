-- =============================================
-- Viandas Nati - Menu digital
-- Script para crear la base de datos (SQLite)
-- =============================================

-- ---------------------------------------------------------
-- Tabla platos
-- category: las tres secciones del menu semanal
-- active: baja logica (no se borran filas, se ocultan del menu)
-- agotado: sigue visible en el menu pero no se puede pedir
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
    agotado INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------
-- Tabla ajustes
-- Textos del menu que Nati edita desde el panel (clave -> valor):
--   aviso: cartel de la semana ("Pedidos hasta el jueves")
--   info:  datos fijos del pie (zona de entrega, formas de pago...)
--   pedidos_cerrados: "1" cuando Nati ya no toma pedidos esta semana
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS ajustes (
    clave TEXT PRIMARY KEY,
    valor TEXT NOT NULL DEFAULT ''
);
