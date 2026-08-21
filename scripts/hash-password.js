// Genera el hash para ADMIN_PASSWORD_HASH en .env
// Uso: node scripts/hash-password.js "miContraseña"
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
    console.log('Uso: node scripts/hash-password.js "miContraseña"');
    process.exit(1);
}

console.log(bcrypt.hashSync(password, 10));
