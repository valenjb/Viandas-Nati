(function () {
    const CART_KEY = "viandasNatiCart";
    const cart = load();

    function load() {
        try {
            const raw = localStorage.getItem(CART_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    function save() {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function getDishRows() {
        return Array.from(document.querySelectorAll(".fila-plato"));
    }

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

        getDishRows().forEach((row) => {
            const id = row.dataset.id;
            const qty = cart[id] || 0;

            if (qty > 0) {
                const price = Number(row.dataset.price);
                const name = row.dataset.name;
                count += qty;
                total += qty * price;
                items.push({ id, name, price, qty });
            }
        });

        return { count, total, items };
    }

    // El stepper de la fila edita la cantidad del carrito directamente.
    // En 0 solo se ve el "+"; al agregar aparecen el "-" y la cantidad.
    function renderRow(row) {
        const id = row.dataset.id;
        const qty = cart[id] || 0;
        const btnRestar = row.querySelector(".btn-restar");
        const cantidadEl = row.querySelector(".cantidad");

        btnRestar.hidden = qty === 0;
        cantidadEl.hidden = qty === 0;
        cantidadEl.textContent = qty;
    }

    function renderAllRows() {
        getDishRows().forEach(renderRow);
    }

    function renderCarritoItems(items) {
        const contenedor = document.getElementById("carritoItems");
        if (!contenedor) return;

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

    function buildWhatsappUrl(items, total) {
        if (items.length === 0) return "#";

        const numero = window.WHATSAPP_NUMBER || "";
        const lineas = items.map((item) => `- ${item.qty}x ${item.name}`).join("\n");
        const mensaje = `Hola! Quiero pedir:\n${lineas}\nTotal: ${formatPrice(total)}`;

        return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    }

    function renderSummary() {
        const { count, total, items } = computeTotals();

        document.querySelectorAll(".carrito-count").forEach((el) => {
            el.textContent = count;
        });

        const modalTotal = document.getElementById("modalTotal");
        if (modalTotal) modalTotal.textContent = formatPrice(total);

        renderCarritoItems(items);

        const url = buildWhatsappUrl(items, total);
        const btnComprar = document.getElementById("btnComprar");
        if (btnComprar) btnComprar.href = url;
    }

    function setQty(id, qty) {
        const next = Math.max(0, qty);

        if (next === 0) {
            delete cart[id];
        } else {
            cart[id] = next;
        }

        save();
        renderAllRows();
        renderSummary();
    }

    function addOne(id) {
        setQty(id, (cart[id] || 0) + 1);
    }

    function removeOne(id) {
        setQty(id, (cart[id] || 0) - 1);
    }

    function removeAll(id) {
        setQty(id, 0);
    }

    document.addEventListener("click", (e) => {
        const fila = e.target.closest(".fila-plato");
        if (fila) {
            const id = fila.dataset.id;
            if (e.target.closest(".btn-sumar")) addOne(id);
            else if (e.target.closest(".btn-restar")) removeOne(id);
            return;
        }

        const itemCarrito = e.target.closest(".carrito-item");
        if (itemCarrito) {
            const id = itemCarrito.dataset.id;
            if (e.target.closest(".btn-sumar")) addOne(id);
            else if (e.target.closest(".btn-restar")) removeOne(id);
            else if (e.target.closest(".btn-quitar")) removeAll(id);
        }
    });

    const overlay = document.getElementById("modalOverlay");
    const btnCerrar = document.getElementById("btnCerrarModal");

    function abrirModal() {
        if (overlay) overlay.classList.add("abierto");
    }

    function cerrarModal() {
        if (overlay) overlay.classList.remove("abierto");
    }

    document.querySelectorAll(".btn-abrir-carrito").forEach((btn) => {
        btn.addEventListener("click", abrirModal);
    });
    if (btnCerrar) btnCerrar.addEventListener("click", cerrarModal);
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) cerrarModal();
        });
    }

    renderAllRows();
    renderSummary();
})();
