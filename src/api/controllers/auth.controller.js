/*===================================
    Controladores de autenticacion
    (un unico admin, credenciales en .env, sin tabla de usuarios)
===================================*/

import bcrypt from "bcryptjs";
import environments from "../config/environments.js";

const { admin } = environments;

// Vista login
export const loginView = (req, res) => {
    res.render("admin/login", {
        title: "Ingresar · Viandas Nati Admin",
        error: null
    });
};

// POST login
export const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).render("admin/login", {
            title: "Ingresar · Viandas Nati Admin",
            error: "Todos los campos son obligatorios"
        });
    }

    const credencialesValidas =
        email === admin.email && bcrypt.compareSync(password, admin.passwordHash || "");

    if (!credencialesValidas) {
        return res.status(401).render("admin/login", {
            title: "Ingresar · Viandas Nati Admin",
            error: "Credenciales incorrectas"
        });
    }

    req.session.admin = { email };

    res.redirect("/admin");
};

// POST logout
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesion:", err);
            return res.status(500).send("Error al cerrar sesion");
        }

        res.redirect("/admin/login");
    });
};
