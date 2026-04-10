/**
 * Stranica punog menija – učitava stavke i dinamičke filtere. Učitaj PRVI (pre main.js).
 */
(function () {
  const API_BASE_URL = "http://localhost:4000/api";
  const FALLBACK_MENU = [
    { name: "Turska kafa", description: "", price: 140, category: "Kafa" },
    { name: "Turska kafa sa mlekom", description: "", price: 150, category: "Kafa" },
    { name: "Turska kafa sa šlagom", description: "", price: 160, category: "Kafa" },
    { name: "Espresso", description: "", price: 180, category: "Kafa" },
    { name: "Espresso sa mlekom", description: "", price: 190, category: "Kafa" },
    { name: "Espresso sa šlagom", description: "", price: 210, category: "Kafa" },
    { name: "Espresso dupli", description: "", price: 280, category: "Kafa" },
    { name: "Cappucino", description: "", price: 210, category: "Kafa" },
  ];

  function escapeHtml(s) {
    if (s == null) return "";
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function setFilterActive(category) {
    document.querySelectorAll(".filter-chip").forEach(function (chip) {
      chip.classList.toggle("active", chip.dataset.category === category);
    });
  }

  function buildFilterChips(items) {
    var container = document.getElementById("menu-filter-chips");
    if (!container) return;
    container.innerHTML = "";
    var cats = {};
    items.forEach(function (i) {
      if (i.category) cats[i.category] = true;
    });
    var sorted = Object.keys(cats).sort(function (a, b) {
      return a.localeCompare(b, "sr");
    });
    var allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "filter-chip active";
    allBtn.dataset.category = "all";
    allBtn.textContent = "Sve";
    container.appendChild(allBtn);
    sorted.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "filter-chip";
      b.dataset.category = c;
      b.textContent = c;
      container.appendChild(b);
    });
  }

  function renderMenu(items, category) {
    var list = document.getElementById("menu-list");
    if (!list) return;
    list.innerHTML = "";
    var filtered =
      category === "all"
        ? items
        : items.filter(function (i) {
            return i.category === category;
          });
    if (!filtered.length) {
      list.innerHTML =
        "<p class=\"text-sm text-espresso/70 dark:text-cream/70\">Trenutno nema stavki u ovoj kategoriji.</p>";
      return;
    }
    filtered.forEach(function (item) {
      var el = document.createElement("article");
      el.className =
        "rounded-2xl border border-espresso/20 bg-[#ead8c4]/88 p-4 shadow-lg shadow-black/20 backdrop-blur dark:border-white/12 dark:bg-[#1a130f]/88 dark:shadow-black/45";
      el.innerHTML =
        "<div class=\"flex items-center justify-between gap-3\">" +
        "<div class=\"min-w-0 flex-1\">" +
        '<p class="text-[11px] uppercase tracking-[0.2em] text-gold mb-1">' +
        escapeHtml(item.category || "") +
        "</p>" +
        '<h2 class="text-sm font-semibold text-espresso dark:text-cream">' +
        escapeHtml(item.name) +
        "</h2>" +
        (item.description
          ? '<p class="mt-1 text-xs text-espresso/70 dark:text-cream/70">' +
            escapeHtml(item.description) +
            "</p>"
          : "") +
        "</div>" +
        '<div class="flex shrink-0 items-center justify-center">' +
        '<span class="rounded-full bg-espresso text-center text-xs font-semibold text-cream px-3 py-1 dark:bg-gold dark:text-espresso">' +
        item.price +
        " din</span>" +
        "</div>" +
        "</div>";
      list.appendChild(el);
    });
  }

  function loadMenu(currentMenuItems, countEl) {
    function applyItems(items) {
      if (!items || !items.length) return;
      currentMenuItems.length = 0;
      items.forEach(function (i) {
        currentMenuItems.push(i);
      });
      buildFilterChips(currentMenuItems);
      var activeCategory = document.querySelector(".filter-chip.active");
      renderMenu(
        currentMenuItems,
        (activeCategory && activeCategory.dataset.category) || "all"
      );
      if (countEl) countEl.textContent = "Ukupno stavki: " + items.length;
    }
    function tryApply(res) {
      return res.ok ? res.json() : Promise.reject(new Error());
    }
    fetch("/api/menu")
      .then(tryApply)
      .then(function (data) {
        applyItems(Array.isArray(data) ? data : data.items || []);
      })
      .catch(function () {
        return fetch("/menu.json")
          .then(tryApply)
          .then(function (data) {
            applyItems(Array.isArray(data) ? data : data.items || []);
          });
      })
      .catch(function () {
        if (window.location.hostname === "localhost") {
          fetch(API_BASE_URL + "/menu", {
            headers: { "Content-Type": "application/json" },
          })
            .then(tryApply)
            .then(function (data) {
              applyItems(Array.isArray(data.items) ? data.items : []);
            })
            .catch(function () {});
        }
      });
  }

  function init() {
    var list = document.getElementById("menu-list");
    var count = document.getElementById("menu-count");
    var chipWrap = document.getElementById("menu-filter-chips");
    if (!list || !count || !chipWrap) return;

    var currentMenuItems = FALLBACK_MENU.slice();
    buildFilterChips(currentMenuItems);
    renderMenu(currentMenuItems, "all");
    count.textContent = "Ukupno stavki: " + currentMenuItems.length;

    chipWrap.addEventListener("click", function (e) {
      var chip = e.target.closest(".filter-chip");
      if (!chip) return;
      var category = chip.dataset.category;
      setFilterActive(category);
      renderMenu(currentMenuItems, category);
    });

    loadMenu(currentMenuItems, count);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
