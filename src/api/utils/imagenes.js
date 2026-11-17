/*=====================================================
    Fotos de los platos

    Con las claves de Cloudinary en el .env, las fotos se guardan ahi
    (no dependen del disco del servidor). Sin claves, se guardan en
    src/public/uploads/platos: sirve para desarrollar sin cuenta.

    En la base se guarda siempre la direccion de la foto:
      - Cloudinary: "https://res.cloudinary.com/..."
      - Disco:      "/uploads/platos/123.jpg"
=====================================================*/

import { v2 as cloudinary } from "cloudinary";
import { existsSync, mkdirSync, unlink } from "fs";
import { writeFile } from "fs/promises";
import { basename } from "path";
import environments from "../config/environments.js";
import { join, __dirname } from "./index.js";

const { cloudName, apiKey, apiSecret } = environments.cloudinary;

export const usaCloudinary = Boolean(cloudName && apiKey && apiSecret);

const CARPETA_CLOUDINARY = "viandas-nati/platos";
const uploadsDir = join(__dirname, "src/public/uploads/platos");

// La extension sale del tipo de archivo, no del nombre que manda el navegador
export const EXTENSIONES = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
};

if (usaCloudinary) {
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
} else {
    console.warn("Cloudinary sin configurar: las fotos se guardan en el disco local.");
    if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
}

function esDeCloudinary(direccion) {
    return direccion.startsWith("https://res.cloudinary.com/");
}

// "https://res.cloudinary.com/x/image/upload/v123/viandas-nati/platos/abc.jpg"
//   -> "viandas-nati/platos/abc"  (el identificador que pide Cloudinary para borrar)
export function publicIdDe(direccion) {
    const partes = direccion.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
    return partes ? partes[1] : null;
}

// Guarda la foto que subio Multer (en memoria) y devuelve su direccion
export async function guardarImagen(archivo) {
    if (usaCloudinary) {
        const uri = `data:${archivo.mimetype};base64,${archivo.buffer.toString("base64")}`;
        const respuesta = await cloudinary.uploader.upload(uri, { folder: CARPETA_CLOUDINARY });

        // secure_url es la misma imagen por https
        return respuesta.secure_url;
    }

    const nombre = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${EXTENSIONES[archivo.mimetype]}`;
    await writeFile(join(uploadsDir, nombre), archivo.buffer);

    return `/uploads/platos/${nombre}`;
}

// Borra una foto que ya no usa ningun plato. Si falla solo se avisa por
// consola: no vale la pena frenar al admin por una foto suelta.
export function eliminarImagen(direccion) {
    if (!direccion) return;

    if (esDeCloudinary(direccion)) {
        if (!usaCloudinary) return;

        cloudinary.uploader.destroy(publicIdDe(direccion)).catch((err) => {
            console.error("No se pudo borrar la imagen de Cloudinary:", err.message);
        });
        return;
    }

    // Se usa solo el nombre del archivo, asi nunca borra fuera de la carpeta
    unlink(join(uploadsDir, basename(direccion)), (err) => {
        if (err && err.code !== "ENOENT") {
            console.error("No se pudo borrar la imagen:", err.message);
        }
    });
}

// Direccion de la foto lista para mostrar en un cuadrado de `lado` px.
// A Cloudinary se le pide ya recortada, en el formato y calidad que mejor
// le sirvan a cada navegador; las del disco se devuelven como estan.
export function urlImagen(direccion, lado) {
    if (!direccion || !esDeCloudinary(direccion)) return direccion;

    return direccion.replace("/upload/", `/upload/f_auto,q_auto,c_fill,w_${lado},h_${lado}/`);
}
