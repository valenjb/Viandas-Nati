import express from "express";
import session from "express-session";
import environments from "./src/api/config/environments.js";
import { CATEGORIAS } from "./src/api/config/categorias.js";
import { viewRoutes, authRoutes, platosRoutes, ajustesRoutes } from "./src/api/routes/index.routes.js";
import { join, __dirname } from "./src/api/utils/index.js";
import { urlImagen } from "./src/api/utils/imagenes.js";

const app = express();
const { port, session_key, isProduction } = environments;

const TREINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000;

// ---------- Configuracion general ----------
app.disable("x-powered-by");

// En produccion la app va detras de un proxy (nginx) que maneja el HTTPS
if (isProduction) {
    app.set("trust proxy", 1);
}

// ---------- Configuracion de vistas EJS ----------
app.set("view engine", "ejs");
app.set("views", join(__dirname, "src/views"));
app.locals.CATEGORIAS = CATEGORIAS;
app.locals.urlImagen = urlImagen;

// ---------- Middlewares ----------
// Los archivos estaticos van antes del log para no llenar la consola
app.use(express.static(join(__dirname, "src/public")));

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: session_key,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",          // el navegador no manda la cookie en formularios de otros sitios
        secure: isProduction,     // solo por HTTPS en el servidor real
        maxAge: TREINTA_DIAS_MS   // Nati no tiene que loguearse cada vez que cierra el navegador
    }
}));

// ---------- Rutas ----------
app.use("/", viewRoutes);
app.use("/admin", authRoutes);
app.use("/admin/platos", platosRoutes);
app.use("/admin/ajustes", ajustesRoutes);

// ---------- 404 ----------
app.use((req, res) => {
    res.status(404).render("error", {
        title: "Página no encontrada · Viandas Nati",
        mensaje: "No encontramos esa página."
    });
});

// ---------- Manejo de errores inesperados ----------
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render("error", {
        title: "Error · Viandas Nati",
        mensaje: "Algo salió mal de nuestro lado. Probá de nuevo en un momento."
    });
});

app.listen(port, () => {
    console.log(`Servidor de Viandas Nati corriendo en http://localhost:${port}`);
});
