import connection from "../database/db.js";

// Devuelve los ajustes como objeto: { aviso, info, pedidos_cerrados }
function getAll() {
    const filas = connection.prepare("SELECT clave, valor FROM ajustes").all();
    const ajustes = { aviso: "", info: "", pedidos_cerrados: "" };

    for (const fila of filas) {
        ajustes[fila.clave] = fila.valor;
    }

    return ajustes;
}

function set(clave, valor) {
    const sql = `
        INSERT INTO ajustes (clave, valor) VALUES (?, ?)
        ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor
    `;

    connection.prepare(sql).run(clave, valor);
}

// Guarda una copia completa y consistente de la base en el archivo indicado
function guardarCopiaEn(ruta) {
    connection.exec(`VACUUM INTO '${ruta.replace(/'/g, "''")}'`);
}

export default { getAll, set, guardarCopiaEn };
