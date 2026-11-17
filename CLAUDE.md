# Viandas Nati — contexto del proyecto

## Qué es y para quién
Menú digital para Nati (la madre de la novia de Valentino), que vende viandas caseras **por semana** a clientes que ya conoce: gente mayor y personas de un teatro. No se va a publicitar. El objetivo es reemplazar el Canva que arma cada semana: ella cambia el menú desde un panel y los clientes piden por WhatsApp. Presupuesto muy bajo.

Consecuencias de ese contexto:
- **Seguridad liviana, a propósito.** No hay datos sensibles. Nada de límites de intentos, 2FA ni pasos extra para Nati. Sí: contraseña decente, dependencias al día, cookie `sameSite`.
- **Legibilidad primero** (público mayor): textos grandes, buen contraste, botones de 44px o más.
- **Simple antes que escalable.**

## Stack y estructura
Node 22.5+ (ESM) · Express 4 · EJS · SQLite con `node:sqlite` (sin módulos nativos: `better-sqlite3` no compila en esta PC) · Multer (en memoria) · Cloudinary · express-session. Un solo admin con credenciales en `.env`, sin tabla de usuarios.

MVC en `src/api/{config,controllers,database,middlewares,models,routes,utils}`, vistas en `src/views`, estáticos en `src/public`. Nombres `x.controller.js`, `x.model.js`, `x.routes.js`; código y comentarios en español. CSS en `base.css`, `header.css`, `components.css`, `pages.css`. Mismas convenciones que el TP de la facultad de Valentino.

## Reglas de trabajo
- **No modificar nada fuera de `D:\000-PROGRA-VALEN\Viandas-Nati`** (el TP de la facultad es solo de lectura).
- **No commitear ni pushear** salvo que Valentino lo pida. Él prueba los cambios sin commitear y los descarta si no le gustan.
- Valentino suele tener `npm run dev` corriendo en el puerto 3000. Para probar, usar ese servidor o levantar otro con `PORT=3111 node index.js` y detenerlo por puerto al terminar. No dejar procesos colgados.
- Las credenciales de prueba del admin están en el `.env` local (Valentino las conoce).
- Verificar lo visual con `getComputedStyle` o capturas, no solo con la propiedad `hidden`.

## Decisiones de diseño ya tomadas
- Paleta "Burdeos & Salvia", sin sombras, sin animaciones salvo el fundido del carrusel. Referencia en `boceto-diseño/README.md`.
- **Tipografía:** Cormorant Garamond solo en lo grande (marca, títulos, nombres de plato, con peso 600/700). Todo lo funcional (botones, total, textos) en Lora peso 500+. Motivo: Cormorant en tamaños chicos no se leía.
- **Carrito:** un solo stepper por plato, en vivo. En 0 muestra "+ Agregar"; con cantidad muestra "– n +". Sin barra inferior en mobile; el botón de arriba muestra cantidad y total (en desktop solo cantidad). El modal pide nombre y aclaraciones opcionales y arma el mensaje de WhatsApp. Se vacía solo 6 h después de enviar.
- WhatsApp flotante solo en desktop (chico, pegado al borde para no tapar botones); en mobile hay link en el pie.
- La barra de arriba queda fija también en desktop, con cantidad y total en el botón del carrito.
- El filtro "Platos visibles / Platos ocultos" del panel es un control segmentado con pastilla deslizante (260 ms) y cambia de lista sin recargar; a Valentino el cambio seco le parecía tosco.
- Carrusel ambiental automático, sin flechas ni puntos. Hoy con placeholders.
- No hay foto obligatoria por plato (decisión de Nati); la foto es opcional.
- Panel: tarjetas por categoría, "Visible" en verde / "Oculto" en rojo, botones "Ocultar"/"Mostrar" de ancho fijo, mensajes de confirmación, pantalla "Aviso y datos".

## Cómo trabaja Nati (confirmado por Valentino)
- Vende por semana, no por día.
- No tiene precio de menú completo (se le puede proponer más adelante).
- Los envíos los hace ella; se coordinan por WhatsApp después del pedido.

## Cómo funciona el panel (uso semanal de Nati)
- **Armar la semana** (`/admin/semana`): casilleros con todos los platos; al guardar quedan visibles solo los tildados (`setSemana`).
- **Panel**: arriba de todo el recuadro de pedidos abiertos/cerrados; después el título con los 4 botones; después el filtro "Platos visibles / Platos ocultos" (dos vistas, ambas por categoría; `/admin?vista=ocultos`). Buscador en ocultos si son más de 6.
- **Ocultar no mueve el plato de lugar**: queda en la vista de visibles con cartel "Oculto" y botón "Mostrar" (por si fue sin querer) y pasa a ocultos recién la próxima vez que se entra al panel. Se maneja con `req.session.recienOcultos` y el parámetro `sigue=1` que agregan los redirects de las acciones. "Mostrar" sí lo devuelve a visibles al instante.
- Desde Armar la semana, "+ Nuevo plato" guarda lo tildado, abre el formulario (`?volver=semana`) y al crear vuelve a Armar la semana con el plato ya tildado.
- **Agotar / Reponer**: el plato agotado se ve en el menú pero no se puede pedir ni entra al carrito. Ocultar un plato le quita el agotado, así vuelve disponible otra semana.
- **Cerrar / Abrir pedidos** (ajuste `pedidos_cerrados`): el menú se ve con un cartel, sin botones de agregar ni carrito. El carrito guardado del cliente no se toca.
- **Fotos**: se achican en el navegador antes de subir (lado máximo 1400px, JPEG). El límite del servidor sigue en 5 MB. Todo el manejo está en `src/api/utils/imagenes.js`: con `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET` en el `.env` van a Cloudinary (carpeta `viandas-nati/platos`, mismo esquema que el TP 2 de Programación 4: SDK v2, subida como data URI, se guarda `secure_url`); sin claves van al disco local. La foto se sube recién con el plato validado, se borra al reemplazarla, quitarla o eliminar el plato, y las vistas la piden con `urlImagen(direccion, lado)` (recorte cuadrado, `f_auto,q_auto`).
- **Copia de seguridad**: link en el panel que descarga la base (`VACUUM INTO`). No incluye fotos. Para restaurar se reemplaza `src/api/database/viandas.sqlite` con el servidor detenido.
- **Eliminar** un plato está solo dentro de su pantalla de edición, para no borrarlo por error desde la lista.
- Descartado: aumento de precios por porcentaje (deja valores raros).

## Pendiente antes de entregar
- Cambiar la clave de prueba y la `SESSION_KEY`.
- Fotos reales en el carrusel; ajustar la marca "Viandas Nati" de la barra superior (Valentino la quiere retocar).
- Sacar `img/` del repo (~840 MB de fotos crudas); limpiar el historial es decisión de Valentino.
- Borrar el JPG huérfano viejo de `src/public/uploads/platos/`.

## Deploy (decidido, sin ejecutar)
- VPS barato con disco persistente (~10-15 USD/año, RackNerd o Contabo) + dominio. Node, `pm2`, `nginx`, Let's Encrypt. `NODE_ENV=production` activa la cookie segura (requiere HTTPS).
- Fotos de platos: ya van a **Cloudinary** si están las tres claves en el `.env` (falta que Valentino las cargue y probarlo contra la cuenta real). Si terminara en serverless (Vercel), además hay que migrar SQLite a Turso o Postgres.
- Conviene mover la base y los uploads a una carpeta de datos configurable.

## Ideas a futuro (no hacer ahora)
- **Registro de pedidos:** guardar cada pedido al enviarlo y mostrar en el panel el total por plato de la semana. Valentino no lo quiere por ahora.
- Precio de menú completo (entrada + principal + postre).
- Orden manual de platos dentro de cada categoría.
