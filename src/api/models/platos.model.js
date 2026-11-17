import connection from "../database/db.js";

// Trae platos, opcionalmente filtrados por categoria y por estado activo
function getAll({ category, onlyActive = true } = {}) {
    const condiciones = [];
    const params = [];

    if (onlyActive) {
        condiciones.push("active = 1");
    }

    if (category) {
        condiciones.push("category = ?");
        params.push(category);
    }

    const where = condiciones.length > 0 ? `WHERE ${condiciones.join(" AND ")}` : "";

    const sql = `SELECT * FROM platos ${where} ORDER BY category ASC, id ASC`;
    return connection.prepare(sql).all(...params);
}

function getById(id) {
    return connection.prepare("SELECT * FROM platos WHERE id = ?").get(id);
}

function create(data) {
    const { name, description, price, category, tag, image } = data;

    const sql = `
        INSERT INTO platos (name, description, price, category, tag, image, active)
        VALUES (@name, @description, @price, @category, @tag, @image, 1)
    `;

    const result = connection.prepare(sql).run({
        name,
        description: description || null,
        price,
        category,
        tag: tag || null,
        image: image || null
    });

    return result.lastInsertRowid;
}

function update(id, data) {
    const { name, description, price, category, tag, image } = data;

    // Si no llega una imagen nueva, se conserva la que ya tenia el plato
    const actual = getById(id);
    const nuevaImagen = image !== undefined ? image : actual?.image ?? null;

    const sql = `
        UPDATE platos
        SET name = @name,
            description = @description,
            price = @price,
            category = @category,
            tag = @tag,
            image = @image,
            updated_at = datetime('now')
        WHERE id = @id
    `;

    connection.prepare(sql).run({
        id,
        name,
        description: description || null,
        price,
        category,
        tag: tag || null,
        image: nuevaImagen
    });
}

// Baja logica / reactivacion (no se borra la fila, solo cambia el flag active).
// Al ocultar un plato tambien se le quita el "agotado": cuando vuelva al menu
// otra semana, arranca disponible.
function setActive(id, active) {
    const sql = `
        UPDATE platos
        SET active = @active,
            agotado = CASE WHEN @active = 1 THEN agotado ELSE 0 END,
            updated_at = datetime('now')
        WHERE id = @id
    `;

    connection.prepare(sql).run({ id, active: active ? 1 : 0 });
}

// Agotado: el plato sigue en el menu pero no se puede pedir
function setAgotado(id, agotado) {
    connection.prepare("UPDATE platos SET agotado = ?, updated_at = datetime('now') WHERE id = ?").run(agotado ? 1 : 0, id);
}

// Arma el menu de la semana de una sola vez: quedan visibles exactamente los
// platos de la lista y el resto se oculta.
function setSemana(ids) {
    const mostrar = connection.prepare("UPDATE platos SET active = 1, updated_at = datetime('now') WHERE id = ? AND active = 0");
    const visibles = connection.prepare("SELECT id FROM platos WHERE active = 1").all();

    connection.exec("BEGIN");
    try {
        for (const { id } of visibles) {
            if (!ids.includes(id)) setActive(id, false);
        }
        for (const id of ids) mostrar.run(id);
        connection.exec("COMMIT");
    } catch (error) {
        connection.exec("ROLLBACK");
        throw error;
    }
}

function remove(id) {
    connection.prepare("DELETE FROM platos WHERE id = ?").run(id);
}

export default { getAll, getById, create, update, setActive, setAgotado, setSemana, remove };
