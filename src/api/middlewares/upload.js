import multer from "multer";
import { join, __dirname } from "../utils/index.js";
import { existsSync, mkdirSync } from "fs";

const uploadsDir = join(__dirname, "src/public/uploads/platos");

if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`);
    }
});

function fileFilter(req, file, cb) {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) {
        return cb(null, true);
    }
    cb(new Error("Solo se permiten imagenes JPG, PNG o WEBP"));
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default upload;
