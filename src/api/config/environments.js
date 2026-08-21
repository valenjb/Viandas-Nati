import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT || 3000,
    session_key: process.env.SESSION_KEY,
    admin: {
        email: process.env.ADMIN_EMAIL,
        passwordHash: process.env.ADMIN_PASSWORD_HASH
    },
    whatsappNumber: process.env.WHATSAPP_NUMBER || ""
};
