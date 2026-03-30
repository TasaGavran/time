/**
 * Cloudflare Worker: servira statičke fajlove + API za meni (KV) i podešavanja (QR redirect).
 * GET /api/menu → meni iz KV (ili podrazumevani)
 * POST /api/menu → sačuvaj meni (zaštićeno lozinkom)
 * GET /api/settings → { qr_target: "home" | "menu" } za redirect stranicu
 * POST /api/settings → sačuvaj qr_target (zaštićeno lozinkom)
 */

const DEFAULT_MENU = [
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

const ADMIN_HASH = "4adddf4287b79c7a279ea400ece0e779bc756ba71d4bad9e1a47cc740d63f013";

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/menu") {
      if (request.method === "GET") {
        let raw = await env.MENU.get("menu");
        if (!raw) {
          await env.MENU.put("menu", JSON.stringify(DEFAULT_MENU));
          raw = JSON.stringify(DEFAULT_MENU);
        }
        return new Response(raw, {
          headers: { "Content-Type": "application/json" },
        });
      }
      if (request.method === "POST") {
        let body;
        try {
          body = await request.json();
        } catch (_) {
          return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
        }
        const hash = await sha256(body.password || "");
        const expected = env.ADMIN_HASH || ADMIN_HASH;
        if (hash !== expected) {
          return jsonResponse({ ok: false }, 401);
        }
        if (!Array.isArray(body.menu)) {
          return jsonResponse({ ok: false, error: "menu must be array" }, 400);
        }
        await env.MENU.put("menu", JSON.stringify(body.menu));
        return jsonResponse({ ok: true });
      }
    }
    if (url.pathname === "/api/settings") {
      if (request.method === "GET") {
        const qrTarget = await env.MENU.get("qr_target");
        const value = qrTarget === "menu" ? "menu" : "home";
        return jsonResponse({ qr_target: value });
      }
      if (request.method === "POST") {
        let body;
        try {
          body = await request.json();
        } catch (_) {
          return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
        }
        const hash = await sha256(body.password || "");
        const expected = env.ADMIN_HASH || ADMIN_HASH;
        if (hash !== expected) {
          return jsonResponse({ ok: false }, 401);
        }
        const target = body.qr_target === "menu" ? "menu" : "home";
        await env.MENU.put("qr_target", target);
        return jsonResponse({ ok: true, qr_target: target });
      }
    }
    if (url.pathname === "/q" || url.pathname === "/q.html") {
      const target = await env.MENU.get("qr_target");
      // Redirect to the exact public URLs.
      const to = target === "menu" ? new URL("/meni", url.origin).href : new URL("/", url.origin).href;
      return Response.redirect(to, 302);
    }
    return env.ASSETS.fetch(request);
  },
};
