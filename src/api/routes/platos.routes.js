/*=========================
    Rutas de administracion de platos (protegidas)
==========================*/

import { Router } from "express";
import platosController from "../controllers/platos.controller.js";
import requireLogin from "../middlewares/validateSession.js";
import validateId from "../middlewares/validateId.js";
import validatePlato from "../middlewares/validatePlato.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.use(requireLogin);

router.post("/", upload.single("image"), validatePlato, platosController.createPlato);
router.post("/:id", validateId, upload.single("image"), validatePlato, platosController.updatePlato);
router.post("/:id/desactivar", validateId, platosController.deactivatePlato);
router.post("/:id/activar", validateId, platosController.activatePlato);
router.post("/:id/eliminar", validateId, platosController.deletePlato);

export default router;
