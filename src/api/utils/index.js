// Convierte una URL de archivo (file://) a una ruta del sistema de archivos
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);

// Directorio raiz del proyecto, para armar rutas absolutas desde cualquier archivo
const __dirname = join(dirname(__filename), "../../../");

export { __dirname, join };
