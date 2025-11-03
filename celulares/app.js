document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const btnPrev = document.querySelector(".prev");
  const btnNext = document.querySelector(".next");
  let index = 0;
  let timer;

  function show(i) {
    slides.forEach((s) => s.classList.remove("activo"));
    slides[i].classList.add("activo");
  }

  function next() {
    index = (index + 1) % slides.length;
    show(index);
  }

  function prev() {
    index = (index - 1 + slides.length) % slides.length;
    show(index);
  }

  // autoplay
  function startAuto() {
    timer = setInterval(next, 3500);
  }
  function stopAuto() {
    clearInterval(timer);
  }

  btnNext.addEventListener("click", () => {
    stopAuto();
    next();
    startAuto();
  });
  btnPrev.addEventListener("click", () => {
    stopAuto();
    prev();
    startAuto();
  });

  // Swipe táctil (móvil)
  let startX = null;
  const carousel = document.querySelector(".carousel");
  carousel.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      stopAuto();
    },
    { passive: true }
  );
  carousel.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 30) dx > 0 ? prev() : next();
    startX = null;
    startAuto();
  });

  show(index);
  startAuto();
});
