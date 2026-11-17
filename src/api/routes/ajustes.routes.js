/*=========================
    Rutas de los ajustes del menu (protegidas)
==========================*/

import { Router } from "express";
import ajustesController from "../controllers/ajustes.controller.js";
import requireLogin from "../middlewares/validateSession.js";

const router = Router();

router.use(requireLogin);

router.post("/", ajustesController.updateAjustes);
router.post("/pedidos", ajustesController.updatePedidos);
router.get("/copia", ajustesController.descargarCopia);

export default router;
