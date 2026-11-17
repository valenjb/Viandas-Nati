import multer from "multer";
import { EXTENSIONES } from "../utils/imagenes.js";

const TAMANIO_MAXIMO_MB = 5;

function fileFilter(req, file, cb) {
    if (EXTENSIONES[file.mimetype]) {
        return cb(null, true);
    }
    cb(new Error("La foto tiene que ser JPG, PNG o WEBP"));
}

// La foto queda en memoria (req.file.buffer). Recien se guarda cuando el
// plato paso todas las validaciones, asi no quedan fotos sueltas.
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: TAMANIO_MAXIMO_MB * 1024 * 1024 }
}).single("image");

// Recibe la foto del plato. Si falla (muy pesada o formato invalido) vuelve a
// mostrar el formulario con el error, en vez de una pagina en blanco.
const subirImagen = (req, res, next) => {
    upload(req, res, (err) => {
        if (!err) return next();

        const mensaje = err.code === "LIMIT_FILE_SIZE"
            ? `La foto pesa más de ${TAMANIO_MAXIMO_MB} MB. Probá con una más liviana.`
            : err.message;

        res.status(400).render("admin/form", {
            title: "Viandas Nati · Admin",
            plato: { id: req.params.id || null, ...req.body },
            errores: [mensaje]
        });
    });
};

export default subirImagen;
