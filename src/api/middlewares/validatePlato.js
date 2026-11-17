import { CATEGORIAS } from "../config/categorias.js";
import platosModel from "../models/platos.model.js";

// Valida y normaliza los datos del plato antes de llegar al controller
const validatePlato = (req, res, next) => {
    const name = (req.body.name || "").trim();
    const description = (req.body.description || "").trim();
    const tag = (req.body.tag || "").trim();
    const { category } = req.body;
    const price = Math.round(Number(req.body.price));
    const errores = [];

    if (name.length === 0) {
        errores.push("El nombre es obligatorio");
    }

    if (!CATEGORIAS.includes(category)) {
        errores.push(`La categoría debe ser una de: ${CATEGORIAS.join(", ")}`);
    }

    if (!Number.isFinite(price) || price <= 0) {
        errores.push("El precio debe ser un número mayor a 0");
    }

    if (errores.length > 0) {
        const actual = req.id ? platosModel.getById(req.id) : null;

        return res.status(400).render("admin/form", {
            title: "Viandas Nati · Admin",
            plato: { ...req.body, id: req.id || null, image: actual?.image || null },
            errores
        });
    }

    req.body = { ...req.body, name, description, tag, category, price };

    next();
};

export default validatePlato;
