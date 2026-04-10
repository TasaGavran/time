/**
 * Jednokratna skripta: generiše ../menu.json iz strukture (fizički meni Time Caffe).
 * Pokretanje: node scripts/generate-menu.mjs
 */
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

function item(name, price, category, description = "") {
  return { name, price, category, description };
}

const MENU = [
  // Kafa
  item("Turska kafa", 140, "Kafa", ""),
  item("Turska kafa sa mlekom", 150, "Kafa", ""),
  item("Turska kafa sa šlagom", 160, "Kafa", ""),
  item("Espresso", 180, "Kafa", ""),
  item("Espresso sa mlekom", 190, "Kafa", ""),
  item("Espresso sa šlagom", 210, "Kafa", ""),
  item("Espresso dupli", 280, "Kafa", ""),
  item("Cappucino", 210, "Kafa", ""),
  item("Macchiato", 190, "Kafa", ""),
  item("Latte macchiato", 240, "Kafa", ""),
  item("Moka kafa", 240, "Kafa", ""),
  item("Ice kafa", 270, "Kafa", ""),
  item("Nes kafa", 220, "Kafa", ""),
  item("Nes kafa sa šlagom", 250, "Kafa", ""),
  item("Nescafé cappuccino ukusi", 240, "Kafa", ""),
  item("Chocofredo", 220, "Kafa", ""),
  item('Cappuccino "La Time"', 240, "Kafa", ""),
  item("Time Moka late", 270, "Kafa", ""),

  // Topli i hladni napici
  item("Topla čokolada", 280, "Topli i hladni napici", ""),
  item("Topla čokolada sa šlagom", 310, "Topli i hladni napici", ""),
  item("Topla čokolada sa plazmom", 350, "Topli i hladni napici", ""),
  item("Topla čokolada sa plazmom i šlagom", 370, "Topli i hladni napici", ""),
  item("Milk šejk", 290, "Topli i hladni napici", ""),
  item("Neskvik", 210, "Topli i hladni napici", ""),
  item("Čaj milford", 180, "Topli i hladni napici", ""),
  item("Mleko 0,2", 90, "Topli i hladni napici", ""),
  item("Voćni kompot (jabuka, višnja)", 220, "Topli i hladni napici", ""),
  item("Plazma šejk", 310, "Topli i hladni napici", ""),
  item("Plazma – cheesecake", 350, "Topli i hladni napici", ""),

  // Hausbrandt Frappe (promo letak)
  item(
    "Hausbrandt Frappe — kafa",
    290,
    "Hausbrandt Frappe",
    "Kafa frappe u visokoj čaši, šlag, preliv od čokolade, vafl kolačić. Hausbrandt."
  ),
  item(
    "Hausbrandt Frappe — šumsko voće",
    290,
    "Hausbrandt Frappe",
    "Voćni frappe (šumsko voće), visoka čaša, šlag, čokoladni preliv, vafl kolačić. Hausbrandt."
  ),

  // Frappe — ukusi (kartica menija)
  item("Frappe — čokolada", 290, "Frappe", ""),
  item("Frappe — vanila", 290, "Frappe", ""),
  item("Frappe — kokos", 290, "Frappe", ""),
  item("Frappe — lešnik", 290, "Frappe", ""),
  item("Frappe — banana", 290, "Frappe", ""),
  item("Frappe — vanila Plazma", 350, "Frappe", ""),
  item("Frappe — jagoda", 290, "Frappe", ""),

  // Gazirani sokovi
  item("Coca cola", 240, "Gazirani sokovi", "0,25 l"),
  item("Fanta", 240, "Gazirani sokovi", "0,25 l"),
  item("Sprite", 240, "Gazirani sokovi", "0,25 l"),
  item("Schweppes bitter lemon", 240, "Gazirani sokovi", "0,25 l"),
  item("Schweppes tonik", 240, "Gazirani sokovi", "0,25 l"),
  item("Schweppes tangerina", 240, "Gazirani sokovi", "0,25 l"),
  item("Orangina", 280, "Gazirani sokovi", "0,25 l"),
  item("Cocta", 240, "Gazirani sokovi", "0,275 l"),
  item("Mali sok", 160, "Gazirani sokovi", "0,2 l"),
  item("Limona", 270, "Gazirani sokovi", "0,2 l"),

  // Negazirani sokovi
  item("Next sokovi", 240, "Negazirani sokovi", "0,2 l"),
  item("Cedevita", 190, "Negazirani sokovi", "0,2 l"),
  item("Aloja sokovi", 280, "Negazirani sokovi", "0,25 l"),
  item("Bravo sokovi", 240, "Negazirani sokovi", "0,25 l"),

  // Prirodni sokovi
  item("Limunada", 210, "Prirodni sokovi", ""),
  item("Ceđena narandža", 290, "Prirodni sokovi", ""),
  item("Time voćni koktel", 290, "Prirodni sokovi", ""),
  item("Vitaminska bomba", 290, "Prirodni sokovi", ""),

  // Vina
  item("Vranac", 280, "Vina", "0,187 l"),
  item("Chardonay", 280, "Vina", "0,187 l"),
  item("Rose", 280, "Vina", "0,187 l"),
  item("Grand sud chardonnay", 370, "Vina", "0,25 l"),
  item("Grand sud merlot", 370, "Vina", "0,25 l"),
  item("Somersby", 290, "Vina", "0,33 l"),
  item("Šampanjac Cinciano Granset", 1900, "Vina", ""),

  // Piva
  item("Tuborg", 270, "Piva", "0,33 l"),
  item("Carlsberg", 280, "Piva", "0,25 l"),
  item("Erdinger", 390, "Piva", "0,33 l"),
  item("Tamni Budweiser", 280, "Piva", "0,33 l"),
  item("San Miguel", 380, "Piva", "0,33 l"),
  item("Budweiser točeno", 270, "Piva", "0,33 l"),
  item("Budweiser točeno", 340, "Piva", "0,5 l"),
  item("Lav točeno", 230, "Piva", "0,33 l"),
  item("Lav točeno", 290, "Piva", "0,5 l"),
  item("Kronenburg", 290, "Piva", "0,33 l"),
  item("Radler Sprite beer", 280, "Piva", "0,33 l"),
  item("Radler Fanta beer", 280, "Piva", "0,33 l"),

  // Žestoka pića (0,03 l osim ako nije drugačije)
  item("Vinjak", 170, "Žestoka pića", "0,03 l"),
  item("Vodka", 170, "Žestoka pića", "0,03 l"),
  item("Pelinkovac", 150, "Žestoka pića", "0,03 l"),
  item("Gorki list", 190, "Žestoka pića", "0,03 l"),
  item("Stomaklija", 150, "Žestoka pića", "0,03 l"),
  item("Viljamovka", 210, "Žestoka pića", "0,03 l"),
  item("Kajsija", 210, "Žestoka pića", "0,03 l"),
  item("Dunja", 210, "Žestoka pića", "0,03 l"),
  item("Šljiva", 210, "Žestoka pića", "0,03 l"),
  item("Lozovača", 210, "Žestoka pića", "0,03 l"),
  item("Gin", 170, "Žestoka pića", "0,03 l"),
  item("Stock", 210, "Žestoka pića", "0,03 l"),
  item("Stock XO", 320, "Žestoka pića", "0,03 l"),
  item("Puškin vodka", 210, "Žestoka pića", "0,03 l"),
  item("Keglevich vodka", 190, "Žestoka pića", "0,03 l"),
  item("Tekila", 220, "Žestoka pića", "0,03 l"),
  item("Jägermeister", 220, "Žestoka pića", "0,03 l"),
  item("Cepelin", 180, "Žestoka pića", "0,03 l"),
  item("Mastika", 190, "Žestoka pića", "0,03 l"),
  item("Martini", 230, "Žestoka pića", "0,03 l"),
  item("Rum Bacardi", 230, "Žestoka pića", "0,03 l"),
  item("Courvoisier", 360, "Žestoka pića", "0,03 l"),
  item("Rum", 180, "Žestoka pića", "0,03 l"),
  item("Malibu", 260, "Žestoka pića", "0,03 l"),

  // Viski
  item("Jack Daniels", 250, "Viski", "0,03 l"),
  item("Jack Gentleman", 350, "Viski", "0,03 l"),
  item("Jack Honey", 250, "Viski", "0,03 l"),
  item("Jack Single Barrel", 380, "Viski", "0,03 l"),
  item("Jonnie Walker", 220, "Viski", "0,03 l"),
  item("Balantines", 220, "Viski", "0,03 l"),
  item("Chivas", 350, "Viski", "0,03 l"),
  item("Teacher's", 220, "Viski", "0,03 l"),
  item("Jim Beam", 220, "Viski", "0,03 l"),
  item("Kanadian klub viski", 210, "Viski", "0,03 l"),
  item("Kilbeggan irski viski", 210, "Viski", "0,03 l"),
  item("Famous Grouse", 210, "Viski", "0,03 l"),
  item("Jim Beam Black", 280, "Viski", "0,03 l"),
  item("Jameson", 240, "Viski", "0,03 l"),

  // Likeri
  item("Vermut", 210, "Likeri", "0,05 l"),
  item("Campari", 230, "Likeri", "0,03 l"),
  item("Baileys", 220, "Likeri", "0,03 l"),
  item("Stock krema", 220, "Likeri", "0,03 l"),
  item("Sambuca Stock", 220, "Likeri", "0,03 l"),
  item("Amareto", 220, "Likeri", "0,03 l"),
  item("Stock vermut", 230, "Likeri", "0,05 l"),
  item("Aperol", 220, "Likeri", "0,03 l"),
  item("Liker višnja", 210, "Likeri", "0,03 l"),
  item("Maraschino liqueur", 210, "Likeri", "0,03 l"),
  item("Pina colada", 210, "Likeri", "0,03 l"),
  item("Meduška", 210, "Likeri", "0,03 l"),
  item("Liker čokolada", 210, "Likeri", "0,03 l"),

  // Vode
  item("Rosa gazirana", 160, "Vode", "0,25 l"),
  item("Rosa negazirana", 160, "Vode", "0,33 l"),
  item("Romerquelle voda", 210, "Vode", "0,33 l"),

  // Dodaci
  item("Mleko za kafu", 10, "Dodaci", ""),
  item("Bademovo (posno) mleko za kafu", 20, "Dodaci", ""),
  item("Med", 30, "Dodaci", ""),
  item("Šlag", 30, "Dodaci", ""),
  item("Plazma", 60, "Dodaci", ""),
  item("Voćni sirup", 90, "Dodaci", "0,03 l"),

  // Energetska pića
  item("Ultra energy", 240, "Energetska pića", "0,25 l"),
  item("Red Bull", 320, "Energetska pića", "0,25 l"),

  // Specijaliteti – zeleni meni
  item(
    "Crna čokolada",
    330,
    "Specijaliteti",
    "Crna čokolada, sirup, mleko. Ukusi: Choco Cookie, Pečeni lešnik, Karamela, Vanila, Višnja, Kokos, Bundeva, Pistać."
  ),
  item(
    "Bela čokolada",
    330,
    "Specijaliteti",
    "Bela čokolada, sirup, mleko. Isti ukusi kao kod crne čokolade."
  ),
  item(
    "Homemade Lemonade",
    300,
    "Specijaliteti",
    "Sirup, limunov sok, voda. Ukusi: Tropsko voće, Jagoda, Lubenica, Zelena menta, Kivi, Mango, Breskva, Zelena jabuka, Borovnica, Mandarina, Malina, Kruška."
  ),
  item(
    "Ceđena narandža",
    330,
    "Specijaliteti",
    "Sirup, ceđena narandža. Ukusi: Tropsko voće, Jagoda, Lubenica, Zelena menta, Kivi, Mango, Breskva, Zelena jabuka, Borovnica, Mandarina, Kruška."
  ),
  item(
    "Homemade Iced Tea",
    300,
    "Specijaliteti",
    "Baza čaja, voćni pire, voda. Ukusi: Tropsko voće, Jagoda, Lubenica, Zelena menta, Kivi, Mango, Breskva, Zelena jabuka, Borovnica, Mandarina, Malina, Kruška."
  ),
  item(
    "Kuvano vino",
    310,
    "Specijaliteti",
    "Sirup, crveno vino. Ukusi: Malina, Jagoda, Borovnica."
  ),

  // Kokteli inspirisani serijom La Casa de Papel (Bella ciao)
  item(
    "El Profesor",
    470,
    "Kokteli (La Casa de Papel)",
    "Breskva, borovnica, sok od narandže, vodka."
  ),
  item(
    "Tokio",
    370,
    "Kokteli (La Casa de Papel)",
    "Jagoda, tropsko voće, sok od narandže, vodka."
  ),
  item(
    "Lisabon",
    370,
    "Kokteli (La Casa de Papel)",
    "Breskva, zelena jabuka, Sprite, džin."
  ),
  item(
    "Rio",
    370,
    "Kokteli (La Casa de Papel)",
    "Malina, kokos, Sprite, vodka."
  ),
  item(
    "Berlin",
    370,
    "Kokteli (La Casa de Papel)",
    "Zelena menta, sok od jabuke, vodka."
  ),
  item(
    "Nairobi",
    370,
    "Kokteli (La Casa de Papel)",
    "Borovnica, sok od šumskog voća, vodka."
  ),
  item(
    "Denver",
    370,
    "Kokteli (La Casa de Papel)",
    "Jagoda, Sprite, vodka."
  ),
  item(
    "Stocholm",
    370,
    "Kokteli (La Casa de Papel)",
    "Tropsko voće, mango, sok od narandže, džin."
  ),
  item(
    "Helsinki",
    370,
    "Kokteli (La Casa de Papel)",
    "Limunada, zelena menta, džin."
  ),
  item(
    "Moscow",
    370,
    "Kokteli (La Casa de Papel)",
    "Malina, bitter lemon, vodka."
  ),
  item(
    "Palermo",
    370,
    "Kokteli (La Casa de Papel)",
    "Lubenica, tonik, džin."
  ),
];

const out = join(__dirname, "..", "menu.json");
writeFileSync(out, JSON.stringify(MENU, null, 2), "utf8");
console.log("Wrote", MENU.length, "items to", out);
