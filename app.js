// ========= Preloader =========
window.addEventListener("load", () => {
  // quita el preloader con una pequeña transición
  const pre = document.getElementById("preloader");
  if (!pre) return;
  pre.style.opacity = "0";
  setTimeout(() => pre.remove(), 350);
  document.body.classList.remove("no-scroll-y");
});

// ========= Texto animado con manita =========
(function initTyped() {
  const lines = [
    "💌 Invita de forma especial, personaliza y sorprende.",
    "Nuestras invitaciones digitales",
    "son elegantes, prácticas y perfectas para cualquier evento.",
    "✨ Fáciles de enviar • 📲 Compartibles con un clic",
    "🎉 ¡Haz que tu evento brille!",
  ];

  const container = document.getElementById("animated-text");
  const hand = document.querySelector(".typing-hand");
  if (!container || !hand) return;

  // Posicionamiento base de la mano
  const setHand = (x, y) => {
    hand.style.left = x + "px";
    hand.style.top = y + "px";
  };

  const typeLine = (text) =>
    new Promise((resolve) => {
      let i = 0;
      const p = document.createElement("p");
      container.appendChild(p);

      const tick = () => {
        if (i < text.length) {
          p.textContent += text.charAt(i);
          // ubicar mano al final del párrafo
          const rect = p.getBoundingClientRect();
          const host = container.getBoundingClientRect();
          setHand(
            Math.min(rect.width + 10, host.width - 24),
            rect.top - host.top - 8
          );
          i++;
          setTimeout(tick, 26); // velocidad de tipeo
        } else {
          setTimeout(resolve, 300);
        }
      };
      tick();
    });

  (async function run() {
    for (const l of lines) {
      await typeLine(l);
    }
    hand.style.display = "none";
  })();
})();

// ========= Recarga segura del iframe al volver desde el historial =========
window.addEventListener("pageshow", (evt) => {
  const nav = performance.getEntriesByType("navigation")[0];
  const cameBack = evt.persisted || (nav && nav.type === "back_forward");
  if (cameBack) {
    const iframe = document.getElementById("celularIframe");
    if (iframe) iframe.src = iframe.src;
  }
});

// ========= Grilla “Elige tu evento” =========
(function buildEvents() {
  const events = [
    { img: "./img/boda.png", name: "Boda", link: "./secciones/boda.html" },
    { img: "./img/XV.png", name: "XV Años", link: "./secciones/quince.html" },
    {
      img: "./img/bautizo.png",
      name: "Bautizo",
      link: "./secciones/bautizo.html",
    },
    {
      img: "./img/3años.png",
      name: "Tres Años",
      link: "./secciones/tresAnios.html",
    },
    {
      img: "./img/fiesta.png",
      name: "Eventos",
      link: "./secciones/eventos.html",
    },
  ];

  const grid = document.getElementById("eventGrid");
  if (!grid) return;

  const frag = document.createDocumentFragment();

  events.forEach((e) => {
    const col = document.createElement("div");
    col.className = "col-10 col-sm-6 col-md-4 col-lg-3";

    col.innerHTML = `
      <a class="card card-event h-100" href="${e.link}">
        <img src="${e.img}" alt="${e.name}">
        <div class="card-body">
          <h3>${e.name}</h3>
        </div>
      </a>
    `;
    frag.appendChild(col);
  });

  grid.appendChild(frag);
})();
