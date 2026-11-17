/*===============================
    Controladores de vistas
================================*/

import platosModel from "../models/platos.model.js";
import ajustesModel from "../models/ajustes.model.js";
import environments from "../config/environments.js";
import { CATEGORIAS } from "../config/categorias.js";

function agruparPorCategoria(platos) {
    return CATEGORIAS
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
    const ajustes = ajustesModel.getAll();

    // Datos minimos que necesita el carrito (en cualquier pestaña): solo los
    // platos que se pueden pedir, o sea, los que no estan agotados.
    // Se escapa "<" para que ningun texto pueda cerrar el <script> donde va.
    const menuJson = JSON.stringify(
        platos
            .filter((plato) => !plato.agotado)
            .map(({ id, name, price }) => ({ id, name, price }))
    ).replace(/</g, "\\u003c");

    res.render("menu", {
        title: "Viandas Nati · Menú de la semana",
        descripcion: "Viandas caseras: mirá el menú de la semana y armá tu pedido por WhatsApp.",
        tab,
        secciones: agruparPorCategoria(platos),
        menuJson,
        ajustes,
        pedidosCerrados: ajustes.pedidos_cerrados === "1",
        whatsappNumber: environments.whatsappNumber
    });
};

// Vista admin - dashboard con todos los platos (visibles y ocultos)
export const dashboardView = (req, res) => {
    const platos = platosModel.getAll({ onlyActive: false });

    // Mensaje de confirmacion de la ultima accion (se muestra una sola vez)
    const flash = req.session.flash || null;
    delete req.session.flash;

    // El panel tiene dos vistas: platos visibles y platos ocultos
    const vista = req.query.vista === "ocultos" ? "ocultos" : "visibles";

    // Un plato recien ocultado se queda en su lugar (con el boton "Mostrar" a
    // mano, por si fue sin querer) mientras se siga trabajando en el panel.
    // Las acciones vuelven con "?sigue=1"; al entrar de nuevo, pasa a ocultos.
    if (!req.query.sigue) {
        delete req.session.recienOcultos;
    }
    const recienOcultos = req.session.recienOcultos || [];

    const visibles = platos.filter((plato) => plato.active || recienOcultos.includes(plato.id));
    const ocultos = platos.filter((plato) => !plato.active);

    // Se mandan las dos listas: el filtro cambia de una a otra sin recargar
    res.render("admin/dashboard", {
        title: "Panel · Viandas Nati Admin",
        vista,
        gruposVisibles: agruparPorCategoria(visibles),
        gruposOcultos: agruparPorCategoria(ocultos),
        cantidad: { visibles: platos.length - ocultos.length, ocultos: ocultos.length },
        pedidosCerrados: ajustesModel.getAll().pedidos_cerrados === "1",
        flash
    });
};

// Vista admin - armar el menu de la semana con casilleros
export const semanaView = (req, res) => {
    const platos = platosModel.getAll({ onlyActive: false });

    const flash = req.session.flash || null;
    delete req.session.flash;

    res.render("admin/semana", {
        title: "Armar la semana · Viandas Nati Admin",
        grupos: agruparPorCategoria(platos),
        flash
    });
};

// Vista admin - crear plato ("?volver=semana" cuando se llega desde Armar la semana)
export const createPlatoView = (req, res) => {
    res.render("admin/form", {
        title: "Nuevo plato · Viandas Nati Admin",
        plato: null,
        errores: null,
        volver: req.query.volver === "semana" ? "semana" : ""
    });
};

// Vista admin - editar plato
export const editPlatoView = (req, res) => {
    const plato = platosModel.getById(req.id);

    if (!plato) {
        return res.status(404).render("error", {
            title: "Plato no encontrado · Viandas Nati",
            mensaje: "Ese plato ya no existe."
        });
    }

    res.render("admin/form", {
        title: "Editar plato · Viandas Nati Admin",
        plato,
        errores: null
    });
};

// Vista admin - aviso de la semana y datos del pie
export const ajustesView = (req, res) => {
    res.render("admin/ajustes", {
        title: "Aviso y datos · Viandas Nati Admin",
        ajustes: ajustesModel.getAll()
    });
};
