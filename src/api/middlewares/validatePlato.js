const CATEGORIAS_VALIDAS = ["Entrada", "Plato principal", "Postre"];

// Valida los datos del plato antes de llegar al controller
const validatePlato = (req, res, next) => {
    const { name, price, category } = req.body;
    const errores = [];

    if (!name || typeof name !== "string" || name.trim().length === 0) {
        errores.push("El nombre es obligatorio");
    }

    if (!CATEGORIAS_VALIDAS.includes(category)) {
        errores.push(`La categoria debe ser una de: ${CATEGORIAS_VALIDAS.join(", ")}`);
    }

    if (price === undefined || price === null || price === "" || isNaN(Number(price)) || Number(price) <= 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    if (errores.length > 0) {
        return res.status(400).render("admin/form", {
            title: "Viandas Nati · Admin",
            plato: { id: req.params.id || null, ...req.body },
            errores
        });
    }

    next();
};

export default validatePlato;
