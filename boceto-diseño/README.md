# Handoff: Menú digital Viandas Nati

## Overview
Menú digital para un emprendimiento de viandas caseras ("Viandas Nati"). El cliente navega el menú de la semana, arma un pedido en un carrito y al confirmar se abre WhatsApp con el pedido ya escrito. **Mobile es el producto principal**; desktop es secundario pero debe funcionar bien.

El menú **no lleva foto por plato** (decisión del cliente: las viandas son caseras y no se repiten estéticamente). Sólo hay una imagen ambiental ("mesa servida") en el encabezado. Puede sumarse un carrusel de ambiente más adelante.

## About the Design Files
Los archivos de este bundle son **referencias de diseño hechas en HTML** — prototipos que muestran el aspecto y el comportamiento buscado, no código de producción para copiar tal cual. La tarea es **recrear estos diseños en el entorno del codebase destino** (React, Vue, Astro, Next, etc.) usando sus patrones y librerías establecidas. Si todavía no hay proyecto, elegir el framework más adecuado (para un menú digital público, algo estático/SSG con una capa de estado en cliente alcanza) e implementarlo ahí.

## Fidelity
**High-fidelity (hifi).** Colores, tipografía, espaciados y estados están definidos. Recrear la UI fielmente con las librerías del codebase. Lo único deliberadamente provisorio:
- las imágenes son placeholders rayados (`.stripe-img`),
- los precios y los platos son de muestra,
- el número de WhatsApp es `5491100000000` (reemplazar).

## Screens / Views

### 1. Menú — Mobile (390 × 790 de referencia)
**Propósito:** ver el menú de la semana y armar el pedido.

Estructura, de arriba a abajo:
1. **Imagen ambiental** full-bleed, `aspect-ratio:16/9`, filtro `sepia(0.25) saturate(0.7) contrast(1.05)`.
2. **Encabezado** (`padding:28px 24px 16px`):
   - Filete ornamental: línea 1px burdeos + punto de 6px + línea 1px, con `gap:10px`.
   - Kicker "Comida casera" — 11px, weight 600, `letter-spacing:0.2em`, uppercase, color salvia `#7c8c6a`, centrado.
   - H1 "Viandas **Nati**" — Cormorant Garamond, 400, itálica, 38px, `line-height:1.05`, centrado; "Nati" en burdeos `#6b2737`.
   - Eslogan "Hecho a fuego lento, como en casa" — 14px, itálica, salvia, centrado.
   - Párrafo descriptivo — 13px, `line-height:1.7`, `text-align:justify`.
3. **Pills de categoría** (`padding:4px 24px 20px`, centradas, `gap:10px`): "Viandas semanales" (activa: borde 1px burdeos, texto burdeos) y "Catering" (inactiva: borde `color-mix(in srgb,#2a231c 16%,transparent)`, texto `#6b6153`). 13px, weight 600, `border-radius:20px`, `padding:8px 20px`.
4. **Tres secciones de menú**: Entrada, Plato principal, Postre. Cada una: H2 Cormorant itálica 22px + regla 1px `color-mix(in srgb,#2a231c 20%,transparent)`, luego la lista.
5. **Fila de plato** (`padding:15px 0`, separador inferior 1px `color-mix(in srgb,#2a231c 22%,transparent)`):
   - Nombre (Cormorant 600, 18px) a la izquierda y precio a la derecha (Lora 600, 13px, burdeos, `font-variant-numeric:tabular-nums`), alineados por `align-items:baseline`.
   - Descripción 12.5px, `color:#4a4238`, `line-height:1.55`.
   - Pie de fila: etiqueta (10.5px uppercase, borde 1px salvia, `border-radius:12px`, `padding:3px 10px`) a la izquierda; a la derecha, botón "Agregar" (borde 1px burdeos, transparente, `border-radius:20px`, `padding:7px 16px`, Cormorant 600 13px) que se **reemplaza** por el stepper –/cantidad/+ cuando la cantidad es > 0. Botones del stepper: círculos de 22px, borde 1px salvia.
6. **Barra de pedido sticky al pie** — sólo visible con al menos 1 item. Fondo `#2a231c`, texto `#f3ede2`, borde superior 2px burdeos, `padding:14px 20px`. Izquierda: "**N** items · $total". Derecha: "Ver pedido" (borde 1px `#c99a8e`, texto `#c99a8e`, pill) → link de WhatsApp.

> Nota de accesibilidad pedida por el cliente: parte del público es gente mayor. No bajar de los tamaños de acá; si hay que ajustar, subir. Hit targets ≥ 44px en la implementación real (los steppers de 22px del mock deben crecer a 44px de área táctil con padding).

### 2. Menú — Desktop (1280 × 820 de referencia)
Mismo contenido, distinta disposición. El mock incluye un chrome de ventana (tres círculos) que **no** es parte del diseño: es sólo el marco de presentación.

1. **Navbar** (`padding:26px 56px`, borde inferior 3px burdeos): marca "Viandas *Nati*" (Cormorant 600, 22px) a la izquierda; a la derecha, con `gap:28px`: "Viandas semanales" (activa, subrayada con borde inferior 2px burdeos), "Catering" (`#8a8074`) y el **botón de carrito**: fondo burdeos sólido, texto `#f3ede2`, pill, texto "Carrito · N". El botón muestra **sólo la cantidad, nunca el total**, y está siempre visible.
2. **Hero** — grid `1.1fr 1fr`, `gap:56px`, `padding:44px 56px 40px`, `align-items:center`. Izquierda: kicker, H1 54px Cormorant itálica, eslogan 15px, párrafo 15px `line-height:1.75` justificado con `max-width:480px`. Derecha: imagen ambiental `aspect-ratio:4/3`, mat blanco de 4px + `outline:1px solid #6b2737` (tratamiento tipo "plate").
3. **Secciones de menú** (`padding:8px 56px`): H2 Cormorant itálica 26px + regla 1px; las filas de plato en `grid-template-columns:repeat(2,1fr)`, cada fila con `padding:16px 20px 16px 0` y separador inferior. Tipografía un punto mayor que en mobile (nombre 18px, descripción 13px `line-height:1.6`).
4. **Modal de carrito** — se abre con el botón de la navbar. Overlay `rgba(42,35,28,0.45)` cubriendo el viewport, centrado. Panel: 440px de ancho, `max-height:78%`, scroll interno, fondo `#fdfaf5`, borde 1px burdeos, `border-radius:8px`, `padding:28px`.
   - Título "Tu pedido" (Cormorant 600, 22px) + botón "×" para cerrar.
   - Estado vacío: "Todavía no agregaste platos." (14px, `#6b6153`).
   - Por item: nombre (Cormorant 600 16px) + subtotal de línea (12.5px burdeos, tabular) a la izquierda; a la derecha stepper –/cantidad/+ (círculos 22px, borde salvia) y "Quitar" (texto plano `#8a6b5a`, 13px).
   - Pie: borde superior 2px burdeos; "**Total** · $X" a la izquierda y "Comprar" (fondo burdeos sólido, texto `#fdfaf5`, pill) a la derecha → link de WhatsApp.

## Interactions & Behavior
- **Agregar al carrito:** el botón "Agregar" de la fila se sustituye in-place por el stepper. Bajar a 0 vuelve a mostrar "Agregar".
- **Stepper:** `+` incrementa, `–` decrementa con piso en 0.
- **Quitar** (sólo en el modal): elimina la línea completa.
- **Barra sticky (mobile):** aparece al tener ≥ 1 item; oculta con carrito vacío.
- **Botón de carrito (desktop):** siempre visible, muestra la cantidad. Abre/cierra el modal.
- **Comprar / Ver pedido:** abre `https://wa.me/<NUMERO>?text=<mensaje>` en pestaña nueva. Mensaje generado:
  ```
  Hola! Quiero pedir:
  - 2x Milanesas con puré
  - 1x Flan casero
  Total: $12.600
  ```
  (`encodeURIComponent` sobre el texto completo; los saltos de línea son `\n`.)
- **Categorías:** "Viandas semanales" es la única activa hoy. "Catering" está en el nav pero su contenido todavía no está definido por el cliente — dejarlo como ruta preparada, sin badge de "próximamente".
- **Responsive:** un solo breakpoint alcanza. Mobile = lista de una columna, hero apilado con imagen arriba, barra sticky al pie. Desktop (≈ ≥1024px) = navbar con carrito, hero en dos columnas, platos en dos columnas, carrito en modal.
- No hay animaciones definidas. Si se agregan, mantenerlas sobrias (fade/slide de 150–200ms en el modal).

## State Management
Estado mínimo, todo en cliente:
- `cart: Record<dishId, number>` — cantidades por plato.
- `cartOpen: boolean` — visibilidad del modal (sólo desktop).

Derivados (no guardar): `count` (suma de cantidades), `total` (suma de `precio × cantidad`), `cartItems` (los items con cantidad > 0), el texto y la URL de WhatsApp.

Persistencia sugerida: guardar `cart` en `localStorage` para que el pedido sobreviva un refresh.

**Datos del menú:** el menú **cambia semana a semana** (algunos platos se repiten, otros rotan) y lo define Nati. No hardcodear la lista: cargarla de una fuente editable (JSON, CMS liviano, Google Sheet, Airtable). Forma de cada plato:
```js
{ id: 'milanesas', name: 'Milanesas con puré', desc: '…', tag: 'Clásico', price: 5200, cat: 'Plato principal' }
```
`cat` ∈ `'Entrada' | 'Plato principal' | 'Postre'`. `tag` es libre (Vegetariano, Liviano, Clásico, Favorito, Casero, Dulce).

Formato de precio: `'$' + n.toLocaleString('es-AR')`.

## Design Tokens

Paleta "Burdeos & Salvia":
| Rol | Hex |
| --- | --- |
| Fondo | `#f3ede2` |
| Superficie (modal) | `#fdfaf5` |
| Texto | `#2a231c` |
| Texto secundario | `#4a4238` |
| Texto atenuado | `#6b6153` / `#8a8074` |
| Acento primario (burdeos) | `#6b2737` |
| Acento secundario (salvia) | `#7c8c6a` |
| Acento sobre fondo oscuro | `#c99a8e` |
| Divisor de plato | `color-mix(in srgb, #2a231c 22%, transparent)` |
| Divisor de sección | `color-mix(in srgb, #2a231c 20%, transparent)` |
| Borde pill inactiva | `color-mix(in srgb, #2a231c 16%, transparent)` |
| Overlay del modal | `rgba(42,35,28,0.45)` |

Tipografía:
- Títulos: **Cormorant Garamond** (400 y 600, con itálicas). H1 38px mobile / 54px desktop, itálica 400. H2 22px mobile / 26px desktop, itálica 400. Nombre de plato 18px, 600.
- Texto: **Lora** (400/600). Cuerpo 13–15px, `line-height` 1.55–1.75. Precios y cifras siempre con `font-variant-numeric:tabular-nums`.
- Kickers: 11px, weight 600, `letter-spacing:0.2em`, uppercase.
- Etiquetas de plato: 10.5px, uppercase, `letter-spacing:0.03em`.

Radios: `2px` (imagen con mat) · `8px` (panel del modal) · `12px` (etiqueta) · `20px` (pills y botones) · `50%` (steppers).
Espaciado: mobile `24px` de gutter lateral; desktop `56px`. Filas de plato `15–16px` verticales. Secciones separadas `26–32px`.
Sombras: ninguna en el diseño. La elevación se dibuja con bordes y reglas, no con sombras — el marco/sombra de los mocks es sólo presentación.

Filtros de imagen: `sepia(0.25) saturate(0.7) contrast(1.05)`. La imagen del hero desktop va matada: `border:4px solid #fff; outline:1px solid #6b2737`.

## Assets
- **Ninguna imagen final.** Los dos lugares con imagen usan un placeholder rayado (clase `.stripe-img`, `repeating-linear-gradient` a 45°). Nati tiene fotos ambientales pendientes de edición — reemplazar ahí:
  1. imagen ambiental del encabezado mobile (16/9),
  2. imagen del hero desktop (4/3).
- Tipografías: Cormorant Garamond y Lora, vía Google Fonts.
- Iconografía: el diseño no usa iconos. Si se agregan, usar Lucide.

## Files
- `Menu Viandas Nati.dc.html` — la referencia de diseño: mobile y desktop, con el carrito funcionando (agregar, sumar, restar, quitar, total, link a WhatsApp). Abrir en el navegador para probar el comportamiento.
- `support.js` — runtime que necesita el archivo anterior para renderizar. No es parte del diseño ni del entregable.
- `Viandas Nati - Exploracion.dc.html` — el canvas completo de exploración, con las direcciones descartadas y las paletas evaluadas. Sólo contexto histórico; **la dirección aprobada es la de `Menu Viandas Nati.dc.html`**.

## Pendientes del cliente
- Precios reales y menú real de la semana.
- Número de WhatsApp real.
- Fotos ambientales editadas.
- Definición del contenido de "Catering".
