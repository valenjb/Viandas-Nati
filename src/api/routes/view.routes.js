/*=========================
    Rutas de vistas publicas y del dashboard admin
==========================*/

import { Router } from "express";
import { menuView, dashboardView, semanaView, createPlatoView, editPlatoView, ajustesView } from "../controllers/view.controller.js";
import requireLogin from "../middlewares/validateSession.js";
import validateId from "../middlewares/validateId.js";

const router = Router();

// Menu publico
router.get("/", menuView);

// Dashboard admin
router.get("/admin", requireLogin, dashboardView);
router.get("/admin/semana", requireLogin, semanaView);
router.get("/admin/platos/nuevo", requireLogin, createPlatoView);
router.get("/admin/platos/:id/editar", requireLogin, validateId, editPlatoView);
router.get("/admin/ajustes", requireLogin, ajustesView);

export default router;
