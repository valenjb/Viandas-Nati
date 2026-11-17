/*=========================
    Rutas de administracion de platos (protegidas)
==========================*/

import { Router } from "express";
import platosController from "../controllers/platos.controller.js";
import requireLogin from "../middlewares/validateSession.js";
import validateId from "../middlewares/validateId.js";
import validatePlato from "../middlewares/validatePlato.js";
import subirImagen from "../middlewares/upload.js";

const router = Router();

router.use(requireLogin);

router.post("/", subirImagen, validatePlato, platosController.createPlato);
router.post("/semana", platosController.armarSemana); // antes de "/:id" para que no lo tome como un id
router.post("/:id", validateId, subirImagen, validatePlato, platosController.updatePlato);
router.post("/:id/desactivar", validateId, platosController.deactivatePlato);
router.post("/:id/activar", validateId, platosController.activatePlato);
router.post("/:id/agotar", validateId, platosController.agotarPlato);
router.post("/:id/reponer", validateId, platosController.reponerPlato);
router.post("/:id/eliminar", validateId, platosController.deletePlato);

export default router;
