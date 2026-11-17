import dotenv from "dotenv";

dotenv.config();

if (!process.env.SESSION_KEY) {
    throw new Error("Falta SESSION_KEY en el archivo .env (copiar .env.example como .env y completarlo)");
}

export default {
    port: process.env.PORT || 3000,
    isProduction: process.env.NODE_ENV === "production",
    session_key: process.env.SESSION_KEY,
    admin: {
        email: process.env.ADMIN_EMAIL,
        passwordHash: process.env.ADMIN_PASSWORD_HASH
    },
    whatsappNumber: process.env.WHATSAPP_NUMBER || "",
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    }
};
