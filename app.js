// ===== Menú hamburguesa + dropdown "Contacto" (comportamiento correcto) =====
document.addEventListener("DOMContentLoaded", () => {
  const navMenu = document.getElementById("navMenu");
  const contactToggle = document.getElementById("contactDropdown");

  // Helper: cerrar todos los dropdowns visibles dentro del navbar
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

  // Inicializa el dropdown "Contacto"
  if (contactToggle && window.bootstrap) {
    bootstrap.Dropdown.getOrCreateInstance(contactToggle, {
      autoClose: "outside",
    });
  }

  // 1) Cerrar al elegir opciones del dropdown y al pulsar otros links del menú
  if (navMenu && window.bootstrap) {
    navMenu.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;

      const isDropdownToggle = link.matches('[data-bs-toggle="dropdown"]');
      const insideDropdownMenu = !!e.target.closest(".dropdown-menu");

      // Si tocaste el botón del dropdown ("Contacto"), no cierres
      if (isDropdownToggle) return;

      // Si tocaste una opción del dropdown (WhatsApp/Llamada):
      if (insideDropdownMenu) {
        // cierra el dropdown de inmediato
        closeAllDropdowns();
        // y cierra el collapse un instante después para no cortar el tap
        setTimeout(() => {
          if (navMenu.classList.contains("show")) {
            bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
          }
        }, 120);
        return;
      }

      // Cualquier otro link dentro del menú: cerrar collapse de inmediato
      if (navMenu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
      }
    });

    // 2) Si el collapse se oculta, asegúrate de cerrar también los dropdowns
    navMenu.addEventListener("hidden.bs.collapse", closeAllDropdowns);
  }

  // 3) Cerrar collapse y dropdowns al hacer clic FUERA del navbar
  document.addEventListener("click", (e) => {
    const insideNavbar = e.target.closest(".navbar");

    if (!insideNavbar) {
      // cierra dropdowns
      closeAllDropdowns();

      // cierra collapse si está abierto
      if (navMenu && navMenu.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
      }
    }
  });
});
