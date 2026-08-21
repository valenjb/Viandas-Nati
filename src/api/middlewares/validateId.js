// Middleware para filtrar ids no validos en /admin/platos/:id/...
const validateId = (req, res, next) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || parseInt(id, 10) === 0) {
        return res.status(400).send("El id debe ser un numero entero positivo");
    }

    req.id = parseInt(id, 10);

    next();
};

export default validateId;
