/*===============================
    Controladores de vistas
================================*/

import platosModel from "../models/platos.model.js";
import environments from "../config/environments.js";

const ORDEN_CATEGORIAS = ["Entrada", "Plato principal", "Postre"];

function agruparPorCategoria(platos) {
    return ORDEN_CATEGORIAS
        .map((category) => ({
            category,
            platos: platos.filter((p) => p.category === category)
        }))
        .filter((grupo) => grupo.platos.length > 0);
}

// Vista publica - menu de la semana
export const menuView = (req, res) => {
    const tab = req.query.tab === "catering" ? "catering" : "viandas";
    const platos = platosModel.getAll({ onlyActive: true });

    res.render("menu", {
        title: "Viandas Nati · Menú",
        tab,
        secciones: agruparPorCategoria(platos),
        platos,
        whatsappNumber: environments.whatsappNumber
    });
};

// Vista admin - dashboard con todos los platos (activos e inactivos)
export const dashboardView = (req, res) => {
    const platos = platosModel.getAll({ onlyActive: false });

    res.render("admin/dashboard", {
        title: "Panel · Viandas Nati Admin",
        platos
    });
};

// Vista admin - crear plato
export const createPlatoView = (req, res) => {
    res.render("admin/form", {
        title: "Nuevo plato · Viandas Nati Admin",
        plato: null,
        errores: null
    });
};

// Vista admin - editar plato
export const editPlatoView = (req, res) => {
    const plato = platosModel.getById(req.id);

    if (!plato) {
        return res.status(404).send("Plato no encontrado");
    }

    res.render("admin/form", {
        title: "Editar plato · Viandas Nati Admin",
        plato,
        errores: null
    });
};
