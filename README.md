# Viandas Nati

Menú digital con panel de administración. Node + Express + EJS (MVC), SQLite embebido (`node:sqlite`, sin instalación aparte) y carrito 100% client-side que arma el pedido y lo abre en WhatsApp.

Requiere **Node 22.5 o superior** (usa el módulo nativo `node:sqlite`).

## Setup

```bash
npm install
cp .env.example .env
```

Completar en `.env`:
- `SESSION_KEY`: string largo y aleatorio (el `.env.example` trae el comando para generarlo).
- `ADMIN_EMAIL`: el email con el que se loguea el admin.
- `ADMIN_PASSWORD_HASH`: generarlo con `node scripts/hash-password.js "tuContraseña"` y pegar el resultado.
- `WHATSAPP_NUMBER`: número real (con código de país, sin `+` ni espacios).
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: datos de la cuenta de Cloudinary, donde se guardan las fotos de los platos. Si quedan vacías, las fotos van al disco local (alcanza para desarrollar).

Cargar el menú de ejemplo (solo la primera vez, o cuando quieras resetear):

```bash
npm run seed
```

Levantar el servidor:

```bash
npm run dev
```

Abrir `http://localhost:3000` (menú público) y `http://localhost:3000/admin` (panel, pide login).

## Qué puede hacer Nati desde el panel

- **Armar la semana**: tildar los platos que van en el menú y guardar una sola vez.
- Crear y editar platos (con foto opcional, que se achica sola antes de subir). Eliminar está dentro de la edición.
- **Agotar / Reponer** un plato: sigue en el menú, pero no se puede pedir.
- **Ocultar / Mostrar** un plato: lo saca del menú sin borrarlo; queda en "Platos guardados".
- **Cerrar / Abrir pedidos**: el menú se sigue viendo, pero nadie puede pedir.
- **Aviso y datos**: el cartel de la semana y los datos fijos del pie. Si quedan vacíos no se muestran.
- **Descargar copia de seguridad** de platos, precios y textos (no incluye las fotos).

## Estructura

```
index.js                       punto de entrada
src/api/config/                variables de entorno y lista de categorias
src/api/database/              conexion sqlite + schema + seed
src/api/models/                acceso a datos (platos, ajustes)
src/api/controllers/           logica de vistas y de acciones admin
src/api/routes/                rutas Express
src/api/middlewares/           sesion, validaciones, subida de fotos
src/api/utils/                 rutas del proyecto, borrado de fotos
src/views/                     EJS (menu publico + admin + pagina de error)
src/public/                    css, js del carrito y carrusel, fotos subidas
```

## Pendiente antes de producción
- Cambiar la contraseña de prueba del admin y poner una `SESSION_KEY` real.
- Reemplazar los placeholders del carrusel (`src/views/partials/carrusel-ambiente.ejs`) por fotos ambientales reales.
- Cargar el menú real (los platos de `npm run seed` son de ejemplo).
- Sacar la carpeta `img/` (fotos crudas, ~840 MB) del repositorio.

## Deploy (decisiones ya tomadas, pendientes de ejecutar)
- **Hosting:** todavía sin definir. Si termina en un VPS con disco persistente (~$10-15/año, ej. RackNerd/Contabo), no hace falta tocar nada del código. Si termina en serverless (ej. Vercel), la base SQLite necesita migrar a algo hosteado (Turso o Postgres) porque el filesystem ahí no persiste.
- **En el servidor** poner `NODE_ENV=production`: activa la cookie de sesión segura, que solo funciona con HTTPS.
- **Imágenes de platos:** con las claves de Cloudinary en el `.env` se guardan ahí (funciona igual en VPS o en serverless). Sin claves van al disco local (`src/public/uploads/platos`), que solo persiste con hosting de disco propio.
