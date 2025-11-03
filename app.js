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
