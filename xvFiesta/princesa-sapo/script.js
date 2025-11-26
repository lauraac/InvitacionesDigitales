// ===============================
// CONFIGURACIÓN BÁSICA
// ===============================

// Cambia esta fecha por la del evento real
// Formato: "YYYY-MM-DDTHH:MM:SS"
const EVENT_DATE_STRING = "2026-01-31T19:00:00";

// ===============================
// MANEJO DEL OVERLAY DE INTRO
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const introOverlay = document.getElementById("introOverlay");
  const enterBtn = document.getElementById("enterInvitationBtn");
  const bgMusic = document.getElementById("bgMusic");
  const introVideo = document.getElementById("introVideo"); // asegúrate de tener id="introVideo" en el <video>
  const musicFab = document.getElementById("toggleMusicBtn");
  const musicIcon = document.getElementById("musicIcon");
  let isMusicPlaying = false;

  // ========= FUNCIONES MÚSICA FONDO =========

  function updateMusicButton() {
    if (!musicFab || !musicIcon) return;

    if (isMusicPlaying) {
      musicFab.classList.add("is-playing");
      musicIcon.src = "./img/pausa.png"; // tu icono de pausa
      musicIcon.alt = "Pausar música";
    } else {
      musicFab.classList.remove("is-playing");
      musicIcon.src = "./img/musica.png"; // tu icono de nota
      musicIcon.alt = "Reproducir música";
    }
  }

  async function startMusic() {
    if (!bgMusic) return;
    try {
      await bgMusic.play();
      isMusicPlaying = true;
      updateMusicButton();
    } catch (error) {
      console.log("El navegador no permitió reproducir la música:", error);
    }
  }

  function pauseMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
    isMusicPlaying = false;
    updateMusicButton();
  }

  // ===============================
  // MANEJO DEL OVERLAY
  // ===============================
  if (enterBtn && introOverlay) {
    enterBtn.addEventListener("click", () => {
      introOverlay.classList.add("intro-overlay--hidden");

      // apagar video intro
      if (introVideo) {
        introVideo.muted = true;
        introVideo.pause();
      }

      // mostrar botón flotante de música
      if (musicFab) {
        musicFab.classList.add("is-visible"); // 👈 ahora ya se ve
      }

      // iniciar música mp3
      startMusic();
    });
  }

  // 👉 al tocar el video, quitamos mute y reproducimos con sonido (se queda igual)
  if (introVideo) {
    introVideo.addEventListener("click", () => {
      try {
        introVideo.muted = false; // enciende el audio
        introVideo.play(); // reproduce por si estaba pausado
      } catch (e) {
        console.log("No se pudo activar el audio del video:", e);
      }
    });
  }

  // ===============================
  // BOTÓN FLOTANTE DE MÚSICA
  // ===============================
  if (musicFab && bgMusic) {
    musicFab.addEventListener("click", () => {
      if (!isMusicPlaying) {
        startMusic();
      } else {
        pauseMusic();
      }
    });
  }

  // ===============================
  // CONTADOR REGRESIVO
  // ===============================

  initCountdown();

  // ===============================
  // FORMULARIO DE RSVP
  // ===============================

  const rsvpForm = document.getElementById("rsvpForm");
  const rsvpSuccessMsg = document.getElementById("rsvpSuccessMsg");

  if (rsvpForm && rsvpSuccessMsg) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(rsvpForm);
      const name = formData.get("guestName") || "Invitado";
      const attendance = formData.get("attendance");

      let message = "";

      if (attendance === "si") {
        message = `¡Gracias, ${name}! ✨ Tu lugar en el reino ha sido reservado.`;
      } else if (attendance === "no") {
        message = `Gracias por avisarnos, ${name}. 💌 Camila recibirá tu mensaje con cariño.`;
      } else {
        message = `Tu respuesta ha sido registrada. ¡Gracias por contestar!`;
      }

      rsvpSuccessMsg.textContent = message;
      rsvpSuccessMsg.style.display = "block";
    });
  }
});

// ===============================
// FUNCIÓN DE CONTADOR
// ===============================

function initCountdown() {
  const eventDate = new Date(EVENT_DATE_STRING);

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateCountdown() {
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ===============================
// ESTRELLAS ALEATORIAS MAGICAS
// ===============================

function createMagicStar() {
  const star = document.createElement("div");
  star.classList.add("magic-star");

  const container = document.querySelector(".magic-stars");

  star.style.left = Math.random() * 100 + "vw";
  star.style.top = Math.random() * 100 + "vh";

  container.appendChild(star);

  setTimeout(() => {
    star.remove();
  }, 1800);
}

setInterval(createMagicStar, 600);
function sendToWhatsApp() {
  const name = document.getElementById("guestName").value.trim();
  const guests = document.getElementById("guestCount").value.trim();
  const attendance = document.querySelector(
    'input[name="attendance"]:checked'
  )?.value;
  const message = document.getElementById("message").value.trim();

  if (!name || !guests || !attendance) {
    alert("Por favor llena todos los campos obligatorios 🙏");
    return;
  }

  let finalMessage =
    `Hola, quiero confirmar mi asistencia a los XV años de Camila Yoselyn.%0A%0A` +
    `👤 *Nombre:* ${name}%0A` +
    `👥 *Acompañantes:* ${guests}%0A` +
    `📌 *Asistirá:* ${
      attendance === "si" ? "Sí asistiré ✨" : "No podré asistir 💌"
    }%0A`;

  if (message) {
    finalMessage += `%0A💬 *Mensaje:* ${message}`;
  }

  const phone = "5215534633490";
  const url = `https://wa.me/${phone}?text=${finalMessage}`;

  window.open(url, "_blank");
}
