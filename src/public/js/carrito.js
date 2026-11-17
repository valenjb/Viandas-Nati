(function () {
    const CART_KEY = "viandasNatiCart";        // { idPlato: cantidad }
    const DATOS_KEY = "viandasNatiDatos";      // { nombre, nota }
    const ENVIADO_KEY = "viandasNatiEnviado";  // momento en que se envio el ultimo pedido
    const HORAS_PARA_VACIAR = 6;

    // Platos visibles hoy, en el orden del menu: [{ id, name, price }]
    const MENU = JSON.parse(document.getElementById("menuData").textContent);
    const cart = cargarCarrito();
    const datos = leer(DATOS_KEY) || {};

    const overlay = document.getElementById("modalOverlay");
    const btnCerrar = document.getElementById("btnCerrarModal");
    const btnComprar = document.getElementById("btnComprar");
    const btnVaciar = document.getElementById("btnVaciar");
    const datosPedido = document.getElementById("datosPedido");
    const inputNombre = document.getElementById("pedidoNombre");
    const inputNota = document.getElementById("pedidoNota");

    // ---------- Guardado en el navegador ----------
    function leer(clave) {
        try {
            return JSON.parse(localStorage.getItem(clave));
        } catch (e) {
            return null;
        }
    }

    function guardar(clave, valor) {
        try {
            localStorage.setItem(clave, JSON.stringify(valor));
        } catch (e) {
            // Sin lugar o en modo privado: el carrito funciona igual, pero no se recuerda
        }
    }

    function borrar(clave) {
        try {
            localStorage.removeItem(clave);
        } catch (e) {
            // Idem guardar()
        }
    }

    function cargarCarrito() {
        // Si el pedido ya se envio hace varias horas, se arranca de cero
        const enviado = leer(ENVIADO_KEY);
        if (enviado && Date.now() - enviado > HORAS_PARA_VACIAR * 60 * 60 * 1000) {
            borrar(ENVIADO_KEY);
            guardar(CART_KEY, {});
            return {};
        }

        // Solo se conservan los platos que siguen en el menu de hoy
        const guardado = leer(CART_KEY) || {};
        const vigente = {};

        MENU.forEach((plato) => {
            const cantidad = Number(guardado[plato.id]);
            if (Number.isInteger(cantidad) && cantidad > 0) {
                vigente[plato.id] = cantidad;
            }
        });

        guardar(CART_KEY, vigente);
        return vigente;
    }

    // ---------- Calculos ----------
    function formatPrice(n) {
        return "$" + Number(n).toLocaleString("es-AR");
    }

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    function computeTotals() {
        let count = 0;
        let total = 0;
        const items = [];

        MENU.forEach((plato) => {
            const qty = cart[plato.id] || 0;

            if (qty > 0) {
                count += qty;
                total += qty * plato.price;
                items.push({ id: plato.id, name: plato.name, price: plato.price, qty });
            }
        });

        return { count, total, items };
    }

    function buildWhatsappUrl(items, total) {
        const lineas = items.map((item) => `- ${item.qty}x ${item.name}`);
        const partes = ["Hola! Quiero pedir:", ...lineas, `Total: ${formatPrice(total)}`];

        if (datos.nombre) partes.push(`Nombre: ${datos.nombre}`);
        if (datos.nota) partes.push(`Aclaraciones: ${datos.nota}`);

        const numero = window.WHATSAPP_NUMBER || "";
        return `https://wa.me/${numero}?text=${encodeURIComponent(partes.join("\n"))}`;
    }

    // ---------- Dibujado ----------
    // En 0 la fila muestra "+ Agregar"; con el plato en el pedido muestra - cantidad +
    function renderRows() {
        document.querySelectorAll(".fila-plato:not(.agotado)").forEach((row) => {
            const qty = cart[row.dataset.id] || 0;
            const cantidadEl = row.querySelector(".cantidad");

            row.classList.toggle("en-carrito", qty > 0);
            row.querySelector(".btn-restar").hidden = qty === 0;
            cantidadEl.hidden = qty === 0;
            cantidadEl.textContent = qty;
        });
    }

    function renderCarritoItems(items) {
        const contenedor = document.getElementById("carritoItems");

        if (items.length === 0) {
            contenedor.innerHTML = '<p class="carrito-vacio">Todavía no agregaste platos.</p>';
            return;
        }

        contenedor.innerHTML = items
            .map(
                (item) => `
                <div class="carrito-item" data-id="${item.id}">
                    <div class="info">
                        <p class="nombre">${escapeHtml(item.name)}</p>
                        <p class="subtotal tabular">${item.qty} × ${formatPrice(item.price)}</p>
                    </div>
                    <div class="acciones">
                        <div class="stepper">
                            <button type="button" class="btn-restar" aria-label="Quitar uno">–</button>
                            <span class="cantidad">${item.qty}</span>
                            <button type="button" class="btn-sumar" aria-label="Agregar uno">+</button>
                        </div>
                        <button type="button" class="btn-quitar">Quitar</button>
                    </div>
                </div>
            `
            )
            .join("");
    }

    function renderLinkPedido(items, total) {
        const vacio = items.length === 0;

        btnComprar.classList.toggle("deshabilitado", vacio);
        btnComprar.setAttribute("aria-disabled", vacio ? "true" : "false");

        if (vacio) {
            btnComprar.removeAttribute("href");
        } else {
            btnComprar.href = buildWhatsappUrl(items, total);
        }
    }

    function render() {
        const { count, total, items } = computeTotals();
        const vacio = count === 0;

        document.querySelectorAll(".carrito-count").forEach((el) => {
            el.textContent = count;
        });

        // En mobile el boton de arriba tambien muestra cuanto va sumando el pedido
        document.querySelectorAll(".carrito-total").forEach((el) => {
            el.hidden = vacio;
            el.textContent = ` · ${formatPrice(total)}`;
        });

        document.getElementById("modalTotal").textContent = formatPrice(total);
        datosPedido.hidden = vacio;
        btnVaciar.hidden = vacio;

        renderRows();
        renderCarritoItems(items);
        renderLinkPedido(items, total);
    }

    // ---------- Cambios en el pedido ----------
    function setQty(id, qty) {
        if (qty > 0) {
            cart[id] = qty;
        } else {
            delete cart[id];
        }

        // Si se modifica despues de enviar, vuelve a contar como pedido en curso
        borrar(ENVIADO_KEY);
        guardar(CART_KEY, cart);
        render();
    }

    document.addEventListener("click", (e) => {
        const fila = e.target.closest(".fila-plato, .carrito-item");
        if (!fila) return;

        const id = fila.dataset.id;
        const actual = cart[id] || 0;

        if (e.target.closest(".btn-sumar")) setQty(id, actual + 1);
        else if (e.target.closest(".btn-restar")) setQty(id, actual - 1);
        else if (e.target.closest(".btn-quitar")) setQty(id, 0);
    });

    btnVaciar.addEventListener("click", () => {
        if (!confirm("¿Vaciar el pedido?")) return;

        Object.keys(cart).forEach((id) => delete cart[id]);
        guardar(CART_KEY, cart);
        render();
    });

    btnComprar.addEventListener("click", (e) => {
        if (btnComprar.classList.contains("deshabilitado")) {
            e.preventDefault();
            return;
        }

        guardar(ENVIADO_KEY, Date.now());
    });

    // ---------- Nombre y aclaraciones ----------
    inputNombre.value = datos.nombre || "";
    inputNota.value = datos.nota || "";

    function actualizarDatos() {
        datos.nombre = inputNombre.value.trim();
        datos.nota = inputNota.value.trim();
        guardar(DATOS_KEY, datos);

        const { total, items } = computeTotals();
        renderLinkPedido(items, total);
    }

    inputNombre.addEventListener("input", actualizarDatos);
    inputNota.addEventListener("input", actualizarDatos);

    // ---------- Modal ----------
    let botonQueAbrio = null;

    function abrirModal(e) {
        botonQueAbrio = e.currentTarget;
        overlay.classList.add("abierto");
        document.body.classList.add("modal-abierto");
        document.getElementById("modalCarrito").focus();
    }

    function cerrarModal() {
        overlay.classList.remove("abierto");
        document.body.classList.remove("modal-abierto");
        if (botonQueAbrio) botonQueAbrio.focus();
    }

    document.querySelectorAll(".btn-abrir-carrito").forEach((btn) => {
        btn.addEventListener("click", abrirModal);
    });

    btnCerrar.addEventListener("click", cerrarModal);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) cerrarModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("abierto")) cerrarModal();
    });

    render();
})();
