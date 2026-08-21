/*===========================
    Rutas de autenticacion
============================*/

import { Router } from "express";
import { loginView, login, logout } from "../controllers/auth.controller.js";

const router = Router();

router.get("/login", loginView);
router.post("/login", login);
router.post("/logout", logout);

export default router;
