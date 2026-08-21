import platosModel from "../models/platos.model.js";

// POST /admin/platos
async function createPlato(req, res) {
    try {
        const image = req.file ? `/uploads/platos/${req.file.filename}` : null;

        platosModel.create({ ...req.body, image });

        res.redirect("/admin");
    } catch (error) {
        console.log("Error creando plato:", error.message);
        res.status(500).send("Error interno al crear el plato");
    }
}

// POST /admin/platos/:id
async function updatePlato(req, res) {
    try {
        const image = req.file ? `/uploads/platos/${req.file.filename}` : undefined;

        platosModel.update(req.id, { ...req.body, image });

        res.redirect("/admin");
    } catch (error) {
        console.log("Error actualizando plato:", error.message);
        res.status(500).send("Error interno al actualizar el plato");
    }
}

// POST /admin/platos/:id/desactivar (baja logica)
async function deactivatePlato(req, res) {
    try {
        platosModel.setActive(req.id, false);
        res.redirect("/admin");
    } catch (error) {
        console.log("Error desactivando plato:", error.message);
        res.status(500).send("Error interno al desactivar el plato");
    }
}

// POST /admin/platos/:id/activar
async function activatePlato(req, res) {
    try {
        platosModel.setActive(req.id, true);
        res.redirect("/admin");
    } catch (error) {
        console.log("Error activando plato:", error.message);
        res.status(500).send("Error interno al activar el plato");
    }
}

// POST /admin/platos/:id/eliminar (borrado definitivo)
async function deletePlato(req, res) {
    try {
        platosModel.remove(req.id);
        res.redirect("/admin");
    } catch (error) {
        console.log("Error eliminando plato:", error.message);
        res.status(500).send("Error interno al eliminar el plato");
    }
}

export default { createPlato, updatePlato, deactivatePlato, activatePlato, deletePlato };
