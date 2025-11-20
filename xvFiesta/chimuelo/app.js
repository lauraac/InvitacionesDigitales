document.addEventListener("DOMContentLoaded", () => {
  const desktopWarning = document.getElementById("desktop-warning");

  // Mostrar aviso solo si es pantalla amplia
  if (window.innerWidth >= 768) {
    desktopWarning.style.display = "flex";
  }

  // Smooth scroll para botones con data-scroll
  const scrollButtons = document.querySelectorAll("[data-scroll]");
  scrollButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const targetSelector = btn.getAttribute("data-scroll");
      const target = document.querySelector(targetSelector);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Navegación inferior (bolitas)
  const navDots = document.querySelectorAll(".nav-dot");
  const sections = [
    document.querySelector("#inicio"),
    document.querySelector("#detalle"),
    document.querySelector("#como-llegar"),
    document.querySelector("#rsvp"),
  ].filter(Boolean);

  navDots.forEach((dot, index) => {
    dot.addEventListener("click", (e) => {
      if (!sections[index]) return;
      e.preventDefault();
      sections[index].scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Resaltar la bolita según la sección visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;

        // Animar aparición suave en secciones y footer nuevo
        if (
          entry.target.classList.contains("section") ||
          entry.target.classList.contains("footer-firma")
        ) {
          entry.target.classList.add("visible");
        }

        const index = sections.findIndex((sec) => sec.id === id);
        if (index !== -1) {
          navDots.forEach((d) => d.classList.remove("active"));
          if (navDots[index]) {
            navDots[index].classList.add("active");
          }
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  // Observamos solo las secciones que sí existen
  sections.forEach((sec) => observer.observe(sec));

  // También observamos el footer nuevo para la animación de aparición
  const footerFirma = document.querySelector(".footer-firma");
  if (footerFirma) observer.observe(footerFirma);

  // Música
  // Música
  const musicToggle = document.getElementById("music-toggle");
  const bgMusic = document.getElementById("bg-music");

  if (musicToggle && bgMusic) {
    let isPlaying = false;
    const musicIcon = musicToggle.querySelector("img");

    const NOTE_SRC = "./img/musica.png"; // ícono de nota
    const PAUSE_SRC = "./img/pausa.png"; // ícono de pausa

    const setNoteIcon = () => {
      if (!musicIcon) return;
      musicIcon.src = NOTE_SRC;
      musicIcon.alt = "Reproducir música";
    };

    const setPauseIcon = () => {
      if (!musicIcon) return;
      musicIcon.src = PAUSE_SRC;
      musicIcon.alt = "Pausar música";
    };

    const playMusic = () => {
      bgMusic
        .play()
        .then(() => {
          isPlaying = true;
          musicToggle.classList.add("playing");
          setPauseIcon();
        })
        .catch(() => {
          // Si el navegador no deja autoplay con sonido, no pasa nada
          // el usuario podrá darle clic al botón
        });
    };

    const pauseMusic = () => {
      bgMusic.pause();
      isPlaying = false;
      musicToggle.classList.remove("playing");
      setNoteIcon();
    };

    // Al hacer clic, alterna música y icono
    musicToggle.addEventListener("click", () => {
      if (!isPlaying) playMusic();
      else pauseMusic();
    });

    // Intentar reproducir automáticamente al cargar la página
    // (si el navegador lo bloquea, se quedará en silencio hasta el primer toque)
    playMusic();
  }
});
// ==== Lluvia de fuego con imagen real ====
const containerFire = document.getElementById("fire-particles");

function createFireImage() {
  const spark = document.createElement("img");
  spark.src = "./img/fuego.png"; // tu imagen aquí
  spark.classList.add("fire-img");

  const startX = Math.random() * window.innerWidth;
  const duration = 6.5 + Math.random() * 3;
  const drift = (Math.random() - 0.5) * 60; // dispersión lateral

  spark.style.left = `${startX}px`;
  spark.style.animationDuration = `${duration}s`;
  spark.style.setProperty("--drift", `${drift}px`);

  containerFire.appendChild(spark);

  setTimeout(() => spark.remove(), duration * 1000);
}

setInterval(createFireImage, 300); // más o menos cantidad de fuego

// ==== Cuenta regresiva hasta el viernes 21 de noviembre de 2025 ====
const daysEl = document.getElementById("cd-days");
const hoursEl = document.getElementById("cd-hours");
const minsEl = document.getElementById("cd-mins");
const secsEl = document.getElementById("cd-secs");
const messageEl = document.getElementById("countdown-message");
const countdownCard = document.querySelector(".countdown-card");

if (daysEl && hoursEl && minsEl && secsEl && messageEl && countdownCard) {
  // Fecha de la fiesta → viernes 21 de noviembre 2025
  const targetDate = new Date("2029-02-14T23:59:59");
  // Fecha de caducidad total → sábado 22 noviembre 2025 a las 00:00
  const expireDate = new Date("2029-02-15T00:00:00");

  function updateCountdown() {
    const now = new Date();

    // Si ya pasó al sábado → mostrar mensaje final
    if (now >= expireDate) {
      countdownCard.innerHTML = `
          <p class="card-text" style="text-align:center;">
            La fiesta ha terminado.<br>
            ¡Gracias por habernos acompañado! 🐉💜
          </p>
        `;
      return;
    }

    // Si estamos antes del viernes 21 a las 23:59 → countdown normal
    const diff = targetDate - now;

    if (diff <= 0) {
      // Estamos dentro del día 21 → fiesta en progreso
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";

      messageEl.textContent = "¡Hoy es la fiesta! 🎉🐉✨";
      return;
    }

    // Cálculo normal del countdown
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const mins = Math.floor((totalSeconds % (60 * 60)) / 60);
    const secs = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(mins).padStart(2, "0");
    secsEl.textContent = String(secs).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}
