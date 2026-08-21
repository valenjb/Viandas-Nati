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

// Baja logica / reactivacion (no se borra la fila, solo cambia el flag active)
function setActive(id, active) {
    connection.prepare("UPDATE platos SET active = ?, updated_at = datetime('now') WHERE id = ?").run(active ? 1 : 0, id);
}

function remove(id) {
    connection.prepare("DELETE FROM platos WHERE id = ?").run(id);
}

export default { getAll, getById, create, update, setActive, remove };
