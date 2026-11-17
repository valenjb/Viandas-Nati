import { tmpdir } from "os";
import { join } from "path";
import { unlink } from "fs";
import ajustesModel from "../models/ajustes.model.js";

const LARGO_MAXIMO = { aviso: 200, info: 600 };

// POST /admin/ajustes - guarda el aviso de la semana y los datos del pie
function updateAjustes(req, res) {
    for (const clave of Object.keys(LARGO_MAXIMO)) {
        const valor = (req.body[clave] || "").trim().slice(0, LARGO_MAXIMO[clave]);
        ajustesModel.set(clave, valor);
    }

    req.session.flash = "Se guardaron los textos del menú.";
    res.redirect("/admin");
}

// POST /admin/ajustes/pedidos - abre o cierra los pedidos de la semana
function updatePedidos(req, res) {
    const cerrar = req.body.estado === "cerrar";

    ajustesModel.set("pedidos_cerrados", cerrar ? "1" : "");

    req.session.flash = cerrar
        ? "Pedidos cerrados: el menú se sigue viendo, pero ya no se puede pedir."
        : "Pedidos abiertos: los clientes ya pueden pedir.";
    res.redirect("/admin");
}

// GET /admin/ajustes/copia - descarga una copia de seguridad de la base
function descargarCopia(req, res, next) {
    const fecha = new Date().toISOString().slice(0, 10);
    const temporal = join(tmpdir(), `viandas-copia-${Date.now()}.sqlite`);

    ajustesModel.guardarCopiaEn(temporal);

    res.download(temporal, `viandas-nati-${fecha}.sqlite`, (err) => {
        unlink(temporal, () => {});
        if (err && !res.headersSent) next(err);
    });
}

export default { updateAjustes, updatePedidos, descargarCopia };
