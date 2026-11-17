import platosModel from "../models/platos.model.js";
import { guardarImagen, eliminarImagen } from "../utils/imagenes.js";

// Los errores inesperados (ej: falla la base) los atrapa el manejador
// central de index.js, que muestra la pagina de error. Las funciones async
// (las que suben fotos) se lo pasan a mano con next(error).

// Vuelve al panel en la misma vista (visibles u ocultos) desde la que se hizo
// la accion. El "sigue=1" avisa que se sigue trabajando en el panel, asi un
// plato recien ocultado no se va de su lugar (ver dashboardView).
function volverAlPanel(req, res) {
    const vista = req.body.vista === "ocultos" ? "ocultos" : "visibles";
    res.redirect(`/admin?vista=${vista}&sigue=1`);
}

// POST /admin/platos
async function createPlato(req, res, next) {
    try {
        // La foto se sube recien aca, con el plato ya validado
        const image = req.file ? await guardarImagen(req.file) : null;

        platosModel.create({ ...req.body, image });

        req.session.flash = `Se agregó "${req.body.name}" al menú.`;

        // Si se creo desde "Armar la semana", se vuelve ahi para seguir armandola
        res.redirect(req.body.volver === "semana" ? "/admin/semana" : "/admin");
    } catch (error) {
        next(error);
    }
}

// POST /admin/platos/:id
async function updatePlato(req, res, next) {
    try {
        const actual = platosModel.getById(req.id);

        if (!actual) {
            return res.status(404).render("error", {
                title: "Plato no encontrado · Viandas Nati",
                mensaje: "Ese plato ya no existe."
            });
        }

        // undefined = conservar la foto actual, null = quitarla
        let image;
        if (req.file) {
            image = await guardarImagen(req.file);
        } else if (req.body.quitarImagen === "1") {
            image = null;
        }

        platosModel.update(req.id, { ...req.body, image });

        // Si la foto cambio o se quito, la anterior ya no se usa
        if (image !== undefined) {
            eliminarImagen(actual.image);
        }

        req.session.flash = `Se guardaron los cambios de "${req.body.name}".`;
        res.redirect("/admin");
    } catch (error) {
        next(error);
    }
}

// POST /admin/platos/:id/desactivar (baja logica: se oculta del menu)
function deactivatePlato(req, res) {
    platosModel.setActive(req.id, false);

    // Se recuerda para dejarlo en su lugar hasta la proxima vez que se entre
    const recienOcultos = req.session.recienOcultos || [];
    if (!recienOcultos.includes(req.id)) recienOcultos.push(req.id);
    req.session.recienOcultos = recienOcultos;

    req.session.flash = "El plato quedó oculto: ya no aparece en el menú. Si fue sin querer, tocá \"Mostrar\".";
    volverAlPanel(req, res);
}

// POST /admin/platos/:id/activar
function activatePlato(req, res) {
    platosModel.setActive(req.id, true);

    req.session.recienOcultos = (req.session.recienOcultos || []).filter((id) => id !== req.id);

    req.session.flash = "El plato ya está visible en el menú.";
    volverAlPanel(req, res);
}

// POST /admin/platos/:id/agotar (sigue en el menu, pero no se puede pedir)
function agotarPlato(req, res) {
    platosModel.setAgotado(req.id, true);

    req.session.flash = "Marcado como agotado: se ve en el menú, pero no se puede pedir.";
    volverAlPanel(req, res);
}

// POST /admin/platos/:id/reponer
function reponerPlato(req, res) {
    platosModel.setAgotado(req.id, false);

    req.session.flash = "El plato vuelve a estar disponible.";
    volverAlPanel(req, res);
}

// POST /admin/platos/semana - deja visibles solo los platos tildados
function armarSemana(req, res) {
    // Un solo casillero llega como texto y varios como lista: se unifica
    const elegidos = [].concat(req.body.ids || [])
        .map(Number)
        .filter((id) => Number.isInteger(id) && id > 0);

    platosModel.setSemana(elegidos);

    // "+ Nuevo plato" dentro de Armar la semana: primero guarda lo tildado
    // (para no perderlo) y despues lleva al formulario
    if (req.body.despues === "nuevo") {
        return res.redirect("/admin/platos/nuevo?volver=semana");
    }

    req.session.flash = `Menú de la semana guardado: ${elegidos.length} platos visibles.`;
    res.redirect("/admin");
}

// POST /admin/platos/:id/eliminar (borrado definitivo)
function deletePlato(req, res) {
    const actual = platosModel.getById(req.id);

    platosModel.remove(req.id);
    eliminarImagen(actual?.image);

    req.session.flash = "El plato se eliminó.";
    res.redirect("/admin");
}

export default {
    createPlato,
    updatePlato,
    deactivatePlato,
    activatePlato,
    agotarPlato,
    reponerPlato,
    armarSemana,
    deletePlato
};
