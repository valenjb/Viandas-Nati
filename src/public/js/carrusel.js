(function () {
    const INTERVALO_MS = 5000;

    const grupos = Array.from(document.querySelectorAll(".carrusel-ambiente"));
    if (grupos.length === 0) return;

    const totalSlides = grupos[0].querySelectorAll(".carrusel-slide").length;
    if (totalSlides <= 1) return;

    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sinMovimiento) return;

    let indice = 0;

    function mostrarSlide(i) {
        grupos.forEach((grupo) => {
            grupo.querySelectorAll(".carrusel-slide").forEach((slide, idx) => {
                slide.classList.toggle("activa", idx === i);
            });
        });
    }

    setInterval(() => {
        indice = (indice + 1) % totalSlides;
        mostrarSlide(indice);
    }, INTERVALO_MS);
})();
