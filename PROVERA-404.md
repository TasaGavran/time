# Kako da vidiš koji fajl vraća 404

1. Otvori sajt: https://time.opetmilosdinic.workers.dev
2. Pritisni **F12** (Developer Tools)
3. Otvori tab **Network** (Mreža)
4. Ostavi otvoreno; idi na Kontakt, pa klikni **strelicu nazad**
5. U listi zahteva nađi red koji je **crven** (status 404). Klikni na njega.
6. Ispod će pisati **Request URL** – to je adresa koja vraća 404 (npr. .../main.js ili .../styles.css).
7. Pošalji mi tu tačnu adresu (URL).

---

# Trajno rešenje: Cloudflare Pages umesto Workers

Workers je često podešen da servira samo početnu stranicu. Za statički sajt (HTML/CSS/JS) **Cloudflare Pages** servira sve fajlove i neće biti 404.

## Koraci

1. **Dashboard** → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Izaberi repozitorijum **TasaGavran/time**, grana **main**
3. **Build settings:**
   - Framework preset: **None**
   - Build command: (prazno)
   - Build output directory: **.** (tačka)
4. **Save and Deploy**
5. Kad se završi, dobićeš URL tipa **time.pages.dev**. Možeš ga koristiti ili dodati custom domen (npr. time.opetmilosdinic.workers.dev ako želiš).

Na Pages-u svaki push na main automatski deploy-uje i sve putanje (/main.js, /kontakt.html, itd.) rade.
