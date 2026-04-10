// Global UI enhancements, smooth transitions, GSAP animations and API calls

// Na produkciji (Cloudflare) koristi isti domen /api; na localhost – lokalni backend
const API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:4000/api"
    : `${typeof window !== "undefined" ? window.location.origin : ""}/api`;

// Fallback meni kada backend nije dostupan (isti kao u meni.html)
const FALLBACK_MENU = [
  { name: "Espresso", description: "Klasičan kratki espresso sa bogatom cremom.", price: 150, category: "Kafa" },
  { name: "Cappuccino", description: "Espresso sa penom od mleka.", price: 200, category: "Espresso pića" },
  { name: "Cold latte", description: "Hladni latte sa ledom.", price: 260, category: "Espresso pića" },
  { name: "Hot latte", description: "Topao latte sa kremastom penom.", price: 260, category: "Espresso pića" },
  { name: "Ice coffee", description: "Hladna kafa sa ledom.", price: 260, category: "Osvežavajuća pića" },
  { name: "Instant coffee", description: "Instant kafa po izboru – vruća ili hladna.", price: 220, category: "Kafa" },
  { name: "Choco cookie", description: "Dodatak ukusa – čoko keks.", price: 50, category: "Ukusi" },
  { name: "Pečeni lešnik", description: "Dodatak ukusa – pečeni lešnik.", price: 50, category: "Ukusi" },
  { name: "Karamela", description: "Dodatak ukusa – karamela.", price: 50, category: "Ukusi" },
  { name: "Vanila", description: "Dodatak ukusa – vanila.", price: 50, category: "Ukusi" },
  { name: "Kokos", description: "Dodatak ukusa – kokos.", price: 50, category: "Ukusi" },
];

function initTheme() {
  const stored = localStorage.getItem("timecaffe-theme");
  // Default is dark on first visit; user choice still has priority.
  const shouldDark = stored ? stored === "dark" : true;
  const root = document.documentElement;
  if (shouldDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = root.classList.contains("dark") ? "☀" : "☾";
}

function toggleTheme() {
  const root = document.documentElement;
  root.classList.toggle("dark");
  const isDark = root.classList.contains("dark");
  localStorage.setItem("timecaffe-theme", isDark ? "dark" : "light");
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = isDark ? "☀" : "☾";
}

function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", toggleTheme);
}

function initMobileMenu() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  let open = false;
  let scrollLockY = 0;
  const overlay = document.getElementById("page-transition");

  /** iOS/Android: stop the page scrolling behind the open flyout */
  function lockBodyScroll() {
    scrollLockY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollLockY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlockBodyScroll() {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollLockY);
  }

  function setState(nextOpen) {
    open = nextOpen;
    if (open) {
      lockBodyScroll();
      menu.style.pointerEvents = "auto";
      menu.style.transform = "translateY(0)";
      menu.style.opacity = "1";
      if (overlay) overlay.style.opacity = "0.6";
    } else {
      unlockBodyScroll();
      menu.style.pointerEvents = "none";
      menu.style.transform = "translateY(-100%)";
      menu.style.opacity = "0";
      if (overlay) overlay.style.opacity = "0";
    }
  }

  toggle.addEventListener("click", () => setState(!open));

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setState(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) setState(false);
  });
}

function initPageTransitions() {
  const overlay = document.getElementById("page-transition");
  if (!overlay) return;

  // Uvek sakrij overlay pri učitavanju (fix: nazad dugme više ne ostavlja braon ekran)
  overlay.style.opacity = "0";

  function handleClick(e) {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;
    if (a.target === "_blank") return;
    e.preventDefault();
    overlay.style.opacity = "1";
    setTimeout(() => {
      window.location.href = href;
    }, 350);
  }

  document.addEventListener("click", handleClick);
}

/**
 * Fragment scroll: clearance for the fixed header comes from CSS
 * (`main section[id] { scroll-margin-top }` in styles.css), not manual math.
 */
function scrollHashTargetIntoView(behavior = "auto") {
  const hash = window.location.hash;
  if (!hash) return;
  let el;
  try {
    el = document.querySelector(hash);
  } catch (_) {
    return;
  }
  if (!el) return;
  el.scrollIntoView({ block: "start", behavior });
}

function initScrollToHash() {
  function afterLayout() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollHashTargetIntoView("auto");
      });
    });
  }

  if (window.location.hash) {
    afterLayout();
    window.addEventListener("load", () => scrollHashTargetIntoView("auto"), {
      once: true,
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => scrollHashTargetIntoView("auto"))
        .catch(() => {});
    }
  }

  window.addEventListener("hashchange", () =>
    scrollHashTargetIntoView("auto")
  );
}

function initParallax() {
  const layer = document.querySelector("[data-parallax]");
  if (!layer) return;
  // Keep full hero image framing stable.
  layer.style.transform = "translateY(0)";
}

function initGSAP() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.config({
    ignoreMobileResize: true,
  });

  gsap.from("#hero h1", {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });
  gsap.from("#hero p", {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: "power3.out",
  });
  gsap.from("#hero .btn-primary, #hero .btn-ghost", {
    y: 20,
    opacity: 0,
    duration: 0.9,
    delay: 0.4,
    stagger: 0.08,
    ease: "power3.out",
  });

  const revealItems = document.querySelectorAll(".reveal-up");
  revealItems.forEach((item) => {
    const delay = parseFloat(item.dataset.delay || "0");
    gsap.to(item, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
      },
    });
  });

  function refreshST() {
    ScrollTrigger.refresh();
  }
  refreshST();
  window.addEventListener("load", refreshST, { once: true });
  window.addEventListener("resize", refreshST);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refreshST).catch(() => {});
  }
}

function initGalleryLightbox() {
  const items = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-image");
  const close = document.getElementById("lightbox-close");
  if (!items.length || !lightbox || !img || !close) return;

  /* Na sekciji galerije sa klasom gallery-no-lightbox slike se ne otvaraju – samo hover */
  const noLightbox = items[0].closest(".gallery-no-lightbox");
  if (noLightbox) return;

  function open(src) {
    img.src = src;
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
  }
  function closeBox() {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    img.src = "";
  }

  items.forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.dataset.src;
      if (src) open(src);
    });
  });
  close.addEventListener("click", closeBox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeBox();
  });
}

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Greška pri komunikaciji sa serverom.");
  }
  return res.json();
}

function renderMenuCards(container, items, statusEl) {
  if (!container) return;
  container.innerHTML = "";
  const list = items && items.length ? items : FALLBACK_MENU;
  list.forEach((item) => {
    const card = document.createElement("article");
    card.className =
      "rounded-2xl border border-espresso/20 bg-[#ead8c4]/88 p-4 shadow-lg shadow-black/20 backdrop-blur dark:border-white/12 dark:bg-[#1a130f]/88 dark:shadow-black/45";
    card.innerHTML = `
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0 flex-1">
          <p class="text-xs uppercase tracking-[0.18em] text-gold mb-1">${
            item.category || "Specijal"
          }</p>
          <h3 class="text-sm font-semibold text-espresso dark:text-cream">${
            item.name
          }</h3>
          <p class="mt-1 text-xs text-espresso/70 dark:text-cream/70">${
            item.description || ""
          }</p>
        </div>
        <div class="flex shrink-0 items-center justify-center">
          <span class="rounded-full bg-espresso text-center text-xs font-semibold text-cream px-3 py-1 dark:bg-gold dark:text-espresso">${
            item.price
          } din</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  if (statusEl) statusEl.textContent = "Izdvojene stavke iz našeg menija.";
}

async function initMenuPreview() {
  const container = document.getElementById("menu-preview");
  const status = document.getElementById("menu-preview-status");
  if (!container || !status) return;

  renderMenuCards(container, FALLBACK_MENU.slice(0, 6), status);

  const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
  let items = FALLBACK_MENU;

  try {
    const res = await fetch("/api/menu");
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json) && json.length) items = json;
    }
  } catch (_) {}

  if (items === FALLBACK_MENU) {
    try {
      const res = await fetch("/menu.json");
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && json.length) items = json;
      }
    } catch (_) {}
  }

  if (isLocalhost && items === FALLBACK_MENU) {
    try {
      const data = await fetchJSON(`${API_BASE_URL}/menu?limit=6`);
      if (data.items && data.items.length) items = data.items;
    } catch (_) {}
  }

  renderMenuCards(container, items.slice(0, 6), status);
}

function initReservationForm() {
  const form = document.getElementById("reservation-form");
  const status = document.getElementById("reservation-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (!payload.name || !payload.phone || !payload.date || !payload.time) {
      status.textContent = "Molimo popunite sva obavezna polja.";
      return;
    }

    const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
    if (!isLocalhost) {
      status.textContent = "Rezervacije putem forme trenutno nisu dostupne. Molimo rezervišite telefonom: 064 019 0460.";
      return;
    }

    try {
      const btn = form.querySelector("button[type=submit]");
      if (btn) btn.disabled = true;
      await fetchJSON(`${API_BASE_URL}/reservations`, {
        method: "POST",
        body: JSON.stringify({
          name: payload.name,
          phone: payload.phone,
          date: payload.date,
          time: payload.time,
          people: Number(payload.people || 1),
          note: payload.note || "",
        }),
      });
      form.reset();
      status.textContent =
        "Hvala! Vaša rezervacija je primljena. Uskoro ćemo vas kontaktirati za potvrdu.";
    } catch (err) {
      console.error(err);
      status.textContent =
        "Rezervacije putem forme trenutno nisu dostupne. Molimo rezervišite telefonom: 064 019 0460.";
    } finally {
      const btn = form.querySelector("button[type=submit]");
      if (btn) btn.disabled = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initThemeToggle();
  initMobileMenu();
  initPageTransitions();
  initScrollToHash();
  initParallax();
  initGalleryLightbox();
  initMenuPreview();
  initReservationForm();

  if (window.gsap) {
    initGSAP();
  } else {
    window.addEventListener("load", initGSAP);
  }
});

