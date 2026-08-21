# Viandas Nati

Menú digital con panel de administración. Node + Express + EJS (MVC), SQLite embebido (`node:sqlite`, sin instalación aparte) y carrito 100% client-side que arma el pedido y lo abre en WhatsApp.

Requiere **Node 22.5 o superior** (usa el módulo nativo `node:sqlite`).

## Setup

```bash
npm install
cp .env.example .env
```

Completar en `.env`:
- `SESSION_KEY`: cualquier string largo y aleatorio.
- `ADMIN_EMAIL`: el email con el que se loguea el admin.
- `ADMIN_PASSWORD_HASH`: generarlo con `node scripts/hash-password.js "tuContraseña"` y pegar el resultado.
- `WHATSAPP_NUMBER`: número real (con código de país, sin `+` ni espacios).

Cargar el menú de ejemplo (solo la primera vez, o cuando quieras resetear):

```bash
npm run seed
```

Levantar el servidor:

```bash
npm run dev
```

Abrir `http://localhost:3000` (menú público) y `http://localhost:3000/admin` (panel, pide login).

## Estructura

```
index.js                       punto de entrada
src/api/config/                variables de entorno
src/api/database/              conexion sqlite + schema + seed
src/api/models/                acceso a datos (platos.model.js)
src/api/controllers/           logica de vistas y de acciones admin
src/api/routes/                rutas Express
src/api/middlewares/           auth de sesion, validaciones, multer
src/views/                     EJS (menu publico + admin)
src/public/                    css, js del carrito, imagenes subidas
```

## Pendiente antes de producción
- Reemplazar la imagen ambiental placeholder (`.stripe-img` en el encabezado/hero) por una foto real editada — hay candidatas en `../img/2.0`.
- Cargar el menú real (los 9 platos de `npm run seed` son de ejemplo).
- Definir el contenido de "Catering" (hoy muestra un mensaje de "próximamente").
- Elegir una `SESSION_KEY` fuerte y el número de WhatsApp real antes de desplegar.
- Fotos de platos: quedan afuera del alcance por ahora, se agregan al final.

## Deploy (decisiones ya tomadas, pendientes de ejecutar)
- **Hosting:** todavía sin definir. Si termina en un VPS con disco persistente (~$10-15/año, ej. RackNerd/Contabo), no hace falta tocar nada del código. Si termina en serverless (ej. Vercel), la base SQLite necesita migrar a algo hosteado (Turso o Postgres) porque el filesystem ahí no persiste.
- **Imágenes de platos:** hoy se guardan en disco local vía Multer (`src/public/uploads/platos`), que solo persiste con hosting de disco propio. Decisión tomada: cuando llegue el momento, migrar a **Cloudinary** (plan gratis, redimensiona automático) — funciona igual en VPS o en serverless, así que desacopla esto de la decisión de hosting. No se migra todavía; se hace al final, junto con la carga de fotos reales.
