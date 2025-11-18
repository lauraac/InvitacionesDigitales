// ===== Menú hamburguesa + dropdown "Contacto" + Intro + Música flotante =====
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- NAVBAR ---------- */
  const navMenu = document.getElementById("navMenu");
  const contactToggle = document.getElementById("contactDropdown");

  const closeAllDropdowns = () => {
    document.querySelectorAll(".navbar .dropdown-menu.show").forEach((menu) => {
      const toggle = menu
        .closest(".dropdown")
        ?.querySelector('[data-bs-toggle="dropdown"]');
      if (toggle && window.bootstrap) {
        bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
      }
    });
  };

  if (contactToggle && window.bootstrap) {
    bootstrap.Dropdown.getOrCreateInstance(contactToggle, {
      autoClose: "outside",
    });
  }

  if (navMenu && window.bootstrap) {
    navMenu.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      const isDropdownToggle = link.matches('[data-bs-toggle="dropdown"]');
      const insideDropdownMenu = !!e.target.closest(".dropdown-menu");
      if (isDropdownToggle) return;

      if (insideDropdownMenu) {
        closeAllDropdowns();
        setTimeout(() => {
          if (navMenu.classList.contains("show")) {
            bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
          }
        }, 120);
        return;
      }
      if (navMenu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
      }
    });
    navMenu.addEventListener("hidden.bs.collapse", closeAllDropdowns);
  }

  document.addEventListener("click", (e) => {
    const insideNavbar = e.target.closest(".navbar");
    if (!insideNavbar) {
      closeAllDropdowns();
      if (navMenu && navMenu.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
      }
    }
  });

  /* ---------- INTRO (VIDEO) + MÚSICA ---------- */
  const intro = document.getElementById("introVideo");
  const video = document.getElementById("introPlayer");
  const appWrap = document.getElementById("app");

  const audio = document.getElementById("bgAudio");
  const audioBtn = document.getElementById("audioToggle");
  const audioIcon = document.getElementById("audioIcon");

  const imgPlay = "./img/musica.png"; // cuando está pausado
  const imgPause = "./img/pause.png"; // cuando está sonando
  const INITIAL_VOL = 0.06; // volumen al abrir (muy bajito)
  const TARGET_VOL = 0.18; // volumen objetivo suave
  const FADE_MS = 2000; // duración del fade-in en milisegundos
  function fadeTo(target = TARGET_VOL, ms = FADE_MS) {
    if (!audio) return;
    const start = audio.volume;
    const delta = target - start;
    const t0 = performance.now();

    function step(t) {
      const k = Math.min(1, (t - t0) / ms);
      audio.volume = Math.max(0, Math.min(1, start + delta * k));
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const updateAudioBtn = () => {
    if (!audioBtn || !audioIcon) return;
    if (audio.paused) {
      audioBtn.classList.add("paused");
      audioIcon.src = imgPlay;
      audioIcon.alt = "Reproducir música";
      audioBtn.title = "Reproducir música";
    } else {
      audioBtn.classList.remove("paused");
      audioIcon.src = imgPause;
      audioIcon.alt = "Pausar música";
      audioBtn.title = "Pausar música";
    }
  };

  const tryPlayAudio = async () => {
    if (!audio) return;
    audio.volume = INITIAL_VOL; // 👈 empieza muy bajo
    try {
      await audio.play(); // intenta reproducir
      fadeTo(TARGET_VOL, FADE_MS); // 👈 sube suave
    } catch {
      // Si el navegador bloquea el autoplay con sonido,
      // el usuario tocará el botón y ahí haremos el fade también.
    }
    updateAudioBtn();
  };

  if (audioBtn && audio) {
    audioBtn.addEventListener("click", async () => {
      if (audio.paused) {
        try {
          audio.volume = INITIAL_VOL; // 👈 por si venías de pausa
          await audio.play();
          fadeTo(TARGET_VOL, FADE_MS);
        } catch {}
      } else {
        audio.pause();
      }
      updateAudioBtn();
    });
  }

  // Intro video
  if (intro && video && appWrap) {
    document.body.classList.add("lock-scroll");

    const revealApp = () => {
      intro.style.opacity = "0";
      setTimeout(() => {
        intro.remove();
        appWrap.hidden = false;
        document.body.classList.remove("lock-scroll");
        window.scrollTo(0, 0);

        // Mostrar botón y empezar música
        audioBtn.hidden = false;
        tryPlayAudio();
      }, 450);
    };

    video.addEventListener("ended", revealApp, { once: true });
    setTimeout(revealApp, 4500);
    setTimeout(
      () => intro.addEventListener("click", revealApp, { once: true }),
      1200
    );
  } else {
    audioBtn.hidden = false;
    tryPlayAudio();
  }
});

(function () {
  const notice = document.getElementById("desktopNotice");
  const app = document.getElementById("app");
  const qr = document.getElementById("dnQr");
  const copyBtn = document.getElementById("dnCopy");
  const waBtn = document.getElementById("dnWhats");

  // ✅ Usa tu URL publicada (fija y sin dudas)
  const url = "https://lauraac.github.io/InvitacionesDigitales/";

  // ===== QR con fallback =====
  // 1) Primer servicio
  const primaryQR =
    "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=";
  // 2) Segundo servicio (fallback)
  const fallbackQR =
    "https://chart.googleapis.com/chart?cht=qr&chs=220x220&chl=";

  function setQR(srcBase) {
    if (!qr) return;
    // cache-buster para evitar que el navegador se quede con una imagen vieja
    qr.src = srcBase + encodeURIComponent(url) + "&t=" + Date.now();
  }

  if (qr) {
    setQR(primaryQR);
    // Si el primero falla, usamos el segundo
    qr.onerror = function () {
      setQR(fallbackQR);
    };
    // Accesible: muestra la URL como tooltip
    qr.title = url;
  }

  // WhatsApp con la URL
  if (waBtn) {
    const msg = "Hola, ábrelo en mi celular: " + url;
    waBtn.href = "https://wa.me/?text=" + encodeURIComponent(msg);
  }

  // Copiar enlace
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(url);
        copyBtn.textContent = "¡Copiado!";
        setTimeout(() => (copyBtn.textContent = "Copiar enlace"), 1600);
      } catch (e) {
        alert("Copia manual: " + url);
      }
    });
  }

  // Agrega el enlace debajo del QR para abrir/copy fácil
  // (si quieres, ya tienes estilos en CSS; si no, se ve simple y bien)
  const qrWrap = document.querySelector(".dn-qr-wrap");
  if (qrWrap) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = url.replace("https://", "");
    link.style.wordBreak = "break-all";
    link.style.fontSize = "0.9rem";
    link.style.opacity = "0.9";
    qrWrap.appendChild(link);
  }

  // Detección: móvil vs escritorio
  const isUA_Mobile = /Mobi|Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );
  const isSmallViewport = matchMedia("(max-width: 768px)").matches;
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isMobile = isUA_Mobile || (isSmallViewport && hasTouch);

  if (!isMobile) {
    if (notice) notice.hidden = false;
    if (app) app.hidden = true;
  } else {
    if (notice) notice.hidden = true;
    // #app lo muestra tu intro cuando termina
  }

  window.addEventListener("resize", () => {
    const wide = matchMedia("(min-width: 992px)").matches;
    if (wide) {
      if (notice) notice.hidden = false;
      if (app) app.hidden = true;
    } else if (isUA_Mobile || hasTouch) {
      if (notice) notice.hidden = true;
    }
  });
})();

// ===== Lluvia de globos 🎈 con explosión tipo bomba de chicle =====
(function () {
  // Capa de lluvia (reutiliza si ya existe)
  let rainLayer = document.querySelector(".angel-rain");
  if (!rainLayer) {
    rainLayer = document.createElement("div");
    rainLayer.className = "angel-rain";
    document.body.appendChild(rainLayer);
  }

  const ANGEL_SRC = "./img/globo1.png"; // globito
  const MAX_ANGELS = 6; // cuántos globos máximo al mismo tiempo
  let currentAngels = 0;

  // Reutilizamos la misma lógica de explosión para caída y para toque
  function explodeAngel(angel) {
    if (!angel) return;

    // Obtener el centro del globo en pantalla
    const rect = angel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Crear la "bomba de chicle"
    const boom = document.createElement("div");
    boom.className = "explosion-angel";
    boom.style.left = centerX + "px";
    boom.style.top = centerY + "px";

    document.body.appendChild(boom);

    // Quitar globo
    angel.remove();
    currentAngels = Math.max(0, currentAngels - 1);

    // Quitar explosión cuando termine
    setTimeout(() => boom.remove(), 650);
  }

  function createAngel() {
    if (!rainLayer) return;
    if (currentAngels >= MAX_ANGELS) return;

    const angel = document.createElement("img");
    angel.src = ANGEL_SRC;
    angel.alt = "Globito";
    angel.className = "angelito";

    // Tamaño aleatorio (40px a 80px)
    const size = 40 + Math.random() * 40;
    angel.style.width = size + "px";

    // Posición horizontal aleatoria (0 a 100vw)
    const left = Math.random() * 100;
    angel.style.left = left + "vw";

    // Duración de la caída (10s a 16s)
    const duration = 10 + Math.random() * 6;
    angel.style.animationDuration = duration + "s";

    // Pequeño delay inicial
    const delay = Math.random() * 2;
    angel.style.animationDelay = delay + "s";

    currentAngels++;
    rainLayer.appendChild(angel);

    // 💥 Explota solo al terminar la animación (si nadie lo tocó)
    angel.addEventListener(
      "animationend",
      () => {
        if (document.body.contains(angel)) {
          explodeAngel(angel);
        }
      },
      { once: true }
    );

    // 💥 Explota cuando lo tocan (móvil) o hacen click (PC)
    const handleTap = (ev) => {
      ev.preventDefault();
      // Evitamos doble explosión
      if (!document.body.contains(angel)) return;
      explodeAngel(angel);
    };

    angel.addEventListener("click", handleTap);
    angel.addEventListener("touchstart", handleTap, { passive: false });
  }

  // Crear algunos globos al inicio, escalonados
  for (let i = 0; i < 3; i++) {
    setTimeout(createAngel, i * 700);
  }

  // Seguir creando globos cada cierto tiempo
  setInterval(createAngel, 2300);
})();
