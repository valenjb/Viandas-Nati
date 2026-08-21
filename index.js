import express from "express";
import session from "express-session";
import environments from "./src/api/config/environments.js";
import { viewRoutes, authRoutes, platosRoutes } from "./src/api/routes/index.routes.js";
import { join, __dirname } from "./src/api/utils/index.js";

const app = express();
const { port, session_key } = environments;

// ---------- Configuracion de vistas EJS ----------
app.set("view engine", "ejs");
app.set("views", join(__dirname, "src/views"));

// ---------- Middlewares ----------
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "src/public")));

app.use(session({
    secret: session_key,
    resave: false,
    saveUninitialized: false
}));

// ---------- Rutas ----------
app.use("/", viewRoutes);
app.use("/admin", authRoutes);
app.use("/admin/platos", platosRoutes);

// ---------- 404 ----------
app.use((req, res) => {
    res.status(404).send("Pagina no encontrada");
});

// ---------- Manejo de errores (ej: archivo invalido en multer) ----------
app.use((err, req, res, next) => {
    console.error(err);
    res.status(400).send(err.message || "Ocurrio un error inesperado");
});

app.listen(port, () => {
    console.log(`Servidor de Viandas Nati corriendo en http://localhost:${port}`);
});
