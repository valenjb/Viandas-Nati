// Carga platos de ejemplo. Correr una sola vez con: node src/api/database/seed.js
// Dos platos quedan inactivos a proposito para poder probar el alta/baja desde el admin.
import connection from "./db.js";

const platos = [
    { name: "Empanadas caseras (x2)", description: "De carne cortada a cuchillo, horneadas", price: 2200, category: "Entrada", tag: "Clásico", active: 1 },
    { name: "Tarta de verduras", description: "Masa casera, acelga y cebolla salteada", price: 2800, category: "Entrada", tag: "Vegetariano", active: 1 },
    { name: "Provoleta", description: "Con orégano y aceite de oliva", price: 3100, category: "Entrada", tag: "Favorito", active: 0 },

    { name: "Milanesas con puré", description: "Milanesa de nalga, puré de papa casero", price: 5200, category: "Plato principal", tag: "Clásico", active: 1 },
    { name: "Guiso de lentejas", description: "Con panceta y chorizo colorado", price: 4800, category: "Plato principal", tag: "Casero", active: 1 },
    { name: "Pollo al horno con papas", description: "Con romero y limón", price: 5000, category: "Plato principal", tag: "Liviano", active: 1 },
    { name: "Ñoquis de papa", description: "Con salsa de tomate casera", price: 4600, category: "Plato principal", tag: "Vegetariano", active: 0 },

    { name: "Flan casero", description: "Con dulce de leche y crema", price: 1800, category: "Postre", tag: "Dulce", active: 1 },
    { name: "Ensalada de frutas", description: "De estación", price: 1500, category: "Postre", tag: "Liviano", active: 1 }
];

const insert = connection.prepare(`
    INSERT INTO platos (name, description, price, category, tag, active)
    VALUES (@name, @description, @price, @category, @tag, @active)
`);

connection.exec("BEGIN");
for (const plato of platos) insert.run(plato);
connection.exec("COMMIT");

console.log(`${platos.length} platos cargados.`);
