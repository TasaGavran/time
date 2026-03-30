/**
 * Stranica punog menija – učitava stavke i filtere. Učitaj PRVI (pre main.js).
 */
(function () {
  const API_BASE_URL = "http://localhost:4000/api";
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

  function setFilterActive(category) {
    document
      .querySelectorAll(".filter-chip")
      .forEach(function (chip) {
        chip.classList.toggle("active", chip.dataset.category === category);
      });
  }

  function renderMenu(items, category) {
    var list = document.getElementById("menu-list");
    if (!list) return;
    list.innerHTML = "";
    var filtered = category === "all"
      ? items
      : items.filter(function (i) { return i.category === category; });
    if (!filtered.length) {
      list.innerHTML = "<p class=\"text-sm text-espresso/70 dark:text-cream/70\">Trenutno nema stavki u ovoj kategoriji.</p>";
      return;
    }
    filtered.forEach(function (item) {
      var el = document.createElement("article");
      el.className = "rounded-2xl border border-espresso/20 bg-[#ead8c4]/88 p-4 shadow-lg shadow-black/20 backdrop-blur dark:border-white/12 dark:bg-[#1a130f]/88 dark:shadow-black/45";
      el.innerHTML =
        "<div class=\"flex items-center justify-between gap-3\">" +
        "<div class=\"min-w-0 flex-1\">" +
        "<p class=\"text-[11px] uppercase tracking-[0.2em] text-gold mb-1\">" + (item.category || "") + "</p>" +
        "<h2 class=\"text-sm font-semibold text-espresso dark:text-cream\">" + item.name + "</h2>" +
        "<p class=\"mt-1 text-xs text-espresso/70 dark:text-cream/70\">" + (item.description || "") + "</p>" +
        "</div>" +
        "<div class=\"flex shrink-0 items-center justify-center\">" +
        "<span class=\"rounded-full bg-espresso text-center text-xs font-semibold text-cream px-3 py-1 dark:bg-gold dark:text-espresso\">" + item.price + " din</span>" +
        "</div>" +
        "</div>";
      list.appendChild(el);
    });
  }

  function loadMenu(currentMenuItems, countEl) {
    function applyItems(items) {
      if (!items || !items.length) return;
      currentMenuItems.length = 0;
      items.forEach(function (i) { currentMenuItems.push(i); });
      var activeCategory = document.querySelector(".filter-chip.active");
      renderMenu(currentMenuItems, (activeCategory && activeCategory.dataset.category) || "all");
      if (countEl) countEl.textContent = "Ukupno stavki: " + items.length;
    }
    function tryApply(res) {
      return res.ok ? res.json() : Promise.reject(new Error());
    }
    fetch("/api/menu")
      .then(tryApply)
      .then(function (data) { applyItems(Array.isArray(data) ? data : (data.items || [])); })
      .catch(function () {
        return fetch("/menu.json").then(tryApply).then(function (data) { applyItems(Array.isArray(data) ? data : (data.items || [])); });
      })
      .catch(function () {
        if (window.location.hostname === "localhost") {
          fetch(API_BASE_URL + "/menu", { headers: { "Content-Type": "application/json" } })
            .then(tryApply)
            .then(function (data) { applyItems(Array.isArray(data.items) ? data.items : []); })
            .catch(function () {});
        }
      });
  }

  function init() {
    var list = document.getElementById("menu-list");
    var count = document.getElementById("menu-count");
    if (!list || !count) return;

    var currentMenuItems = FALLBACK_MENU.slice();
    setFilterActive("all");
    renderMenu(currentMenuItems, "all");
    count.textContent = "Ukupno stavki: " + currentMenuItems.length;

    document.querySelectorAll(".filter-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var category = chip.dataset.category;
        setFilterActive(category);
        renderMenu(currentMenuItems, category);
      });
    });

    loadMenu(currentMenuItems, count);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
