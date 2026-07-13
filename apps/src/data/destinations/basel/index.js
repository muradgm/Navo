import { baselRouteMeta } from "./routeMeta.js";

export const BASEL_BASE_LOCATION = {
  label: "Aparthotel Adagio Basel City",
  address: "Hammerstrasse 46, Basel",
  mapQuery: "Aparthotel Adagio Basel City Hammerstrasse 46 Basel",
};

const maps = (q) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const route = (
  q,
  origin = `${BASEL_BASE_LOCATION.label}, ${BASEL_BASE_LOCATION.address}`,
) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(q)}&travelmode=transit`;

const activityImg = (name) => `/images/activity-ai-v2/${name}`;

export const BASEL_WEATHER_LOCATIONS = {
  basel: {
    label: "Basel",
    latitude: 47.5596,
    longitude: 7.5886,
  },
  zurich: {
    label: "Zürich",
    latitude: 47.3769,
    longitude: 8.5417,
  },
};

export const BASEL_TRIP_DATES = [
  "2026-07-13",
  "2026-07-14",
  "2026-07-15",
  "2026-07-16",
  "2026-07-17",
];

const typeDe = {
  Sightseeing: "Sehenswürdigkeiten",
  Animals: "Tiere",
  Museum: "Museum",
  History: "Geschichte",
  Water: "Wasser",
  Park: "Park",
  "Lake/Water": "See/Wasser",
  Food: "Essen",
  "Day trip": "Tagesausflug",
  Shopping: "Einkauf",
};

const types = [
  "Sightseeing",
  "Animals",
  "Museum",
  "History",
  "Water",
  "Park",
  "Lake/Water",
  "Food",
  "Day trip",
  "Shopping",
];

export const baselDestinationPack = {
  id: "basel",
  name: "Basel",
  country: "Switzerland",
  timezone: "Europe/Zurich",
  baseLocation: BASEL_BASE_LOCATION,
  tripDates: BASEL_TRIP_DATES,
  defaultSelectedDay: "Tue 14",
  defaultWeatherLocation: "basel",
  primaryWeatherLocation: "basel",
  weatherLocations: BASEL_WEATHER_LOCATIONS,
  hero: {
    en: {
      subtitle:
        "Basel is loaded as the first destination pack: ICE arrival/departure, apartment base, breakfast included, dynamic weather, activities, parks/water, Zürich and Saint-Louis options, food, groceries, safety, budget, kids missions, and your daily plan.",
      dateLabel: "13-17 July",
      dateValue: "4 nights",
      journeyLabel: "Arrival / departure",
      journeyValue: "15:36 / 14:25",
    },
    de: {
      subtitle:
        "Basel ist als erstes Zielort-Paket geladen: ICE-Ankunft/-Abreise, Apartment-Basis, Frühstück inklusive, dynamisches Wetter, Aktivitäten, Parks/Wasser, Zürich- und Saint-Louis-Optionen, Essen, Einkauf, Sicherheit, Budget, Kinder-Missionen und Tagesplan.",
      dateLabel: "13.-17. Juli",
      dateValue: "4 Nächte",
      journeyLabel: "Ankunft / Abreise",
      journeyValue: "15:36 / 14:25",
    },
  },
  foodStrategy: {
    en: {
      note: "Breakfast is included in the reservation. Plan lunch outside, cook simple dinners at the apartment, and keep grocery shopping focused on snacks, water, fruit, and dinner basics. Family preference: vegetarian + halal, Middle Eastern food welcome.",
      cards: [
        [
          "Breakfast included",
          "Use the hotel/aparthotel breakfast as the daily base meal. This reduces grocery shopping and makes mornings easier with kids.",
        ],
        [
          "Lunch outside only",
          "Plan CHF 45-75 / EUR 47-78 for casual family lunch. Falafel, vegetarian bowls, pizza/pasta and Turkish/Middle Eastern places are safest.",
        ],
        [
          "Simple dinner at apartment",
          "Keep dinners simple: rice/pasta, soup, salad, eggs, cheese, hummus, bread. Do not overbuy because breakfast is already covered.",
        ],
      ],
    },
    de: {
      note: "Frühstück ist in der Buchung inklusive. Mittagessen draußen einplanen, einfache Abendessen im Apartment kochen und Einkäufe auf Snacks, Wasser, Obst und Abendessen-Basics fokussieren. Familienpräferenz: vegetarisch + halal, gern Nahostküche.",
      cards: [
        [
          "Frühstück inklusive",
          "Nutzt das Hotel-/Aparthotel-Frühstück als tägliche Basismahlzeit. Das reduziert Einkäufe und macht Morgen mit Kindern leichter.",
        ],
        [
          "Nur Mittagessen draußen",
          "Plant CHF 45-75 / EUR 47-78 für einfaches Familien-Mittagessen. Falafel, vegetarische Bowls, Pizza/Pasta und türkische/Nahost-Lokale sind am sichersten.",
        ],
        [
          "Einfaches Abendessen im Apartment",
          "Abendessen einfach halten: Reis/Nudeln, Suppe, Salat, Eier, Käse, Hummus, Brot. Nicht zu viel einkaufen, weil Frühstück schon abgedeckt ist.",
        ],
      ],
    },
  },
  dailyCosts: {
    lunchChf: 65,
    snackBufferChf: 12,
  },
  tripBudget: {
    minChf: 610,
    maxChf: 980,
    categories: [
      {
        id: "attractions",
        chf: "280-350",
        en: "Attractions",
        de: "Aktivitäten",
      },
      {
        id: "transport",
        chf: "50-130",
        en: "Transport/taxis",
        de: "Transport/Taxis",
      },
      {
        id: "food",
        chf: "180-320",
        en: "Food with breakfast included",
        de: "Essen mit Frühstück inklusive",
      },
      { id: "extras", chf: "100-180", en: "Extras", de: "Extras" },
      { id: "total", chf: "610-980", en: "Total", de: "Gesamt", strong: true },
    ],
  },
  trainJourney: {
    outbound: {
      titleEn: "Berlin → Basel",
      titleDe: "Berlin → Basel",
      date: "13.07",
      train: "ICE 371",
      departure: "08:31",
      departureTrack: "Gleis 8",
      arrival: "15:36",
      noteEn:
        "Long travel day. Pack lunch/snacks for the train, chargers, water, light entertainment for kids, and keep Basel arrival evening low-pressure.",
      noteDe:
        "Langer Reisetag. Mittag/Snacks für den Zug, Ladegeräte, Wasser und Beschäftigung für die Kinder einpacken. Abend in Basel ohne Druck planen.",
    },
    return: {
      titleEn: "Basel → Berlin",
      titleDe: "Basel → Berlin",
      date: "17.07",
      train: "ICE 278",
      departure: "14:25",
      departureTrack: "Gleis 4",
      arrival: "21:33",
      noteEn:
        "Departure day is not a full sightseeing day. Use hotel breakfast, pack simple train food, and keep the morning activity close.",
      noteDe:
        "Abreisetag ist kein voller Sightseeing-Tag. Hotelfrühstück nutzen, einfache Zugverpflegung einpacken und den Vormittag nah halten.",
    },
  },
  activities: [
    {
      id: "zoo",
      type: "Animals",
      tier: "$$",
      area: "Basel Zoo / Bachletten",
      cost: 50,
      time: "3–5h",
      transit: "18–25 min by tram",
      distance: "~3 km",
      weather: ["normal", "hot"],
      energy: ["medium", "high"],
      ages: ["5", "11"],
      en: "Basel Zoo",
      de: "Zoo Basel",
      descEn:
        "The most reliable big family activity. Enough space, animals, shade breaks, and easy pacing for both kids.",
      descDe:
        "Die sicherste große Familienaktivität. Viel Platz, Tiere, Schattenpausen und für beide Kinder gut planbar.",
      tipEn:
        "Go in the morning, bring water and snacks, and do not combine it with another big paid attraction.",
      tipDe:
        "Morgens gehen, Wasser und Snacks mitnehmen, und nicht mit einer zweiten großen bezahlten Aktivität kombinieren.",
      missionEn: [
        "Find 3 animals from different continents.",
        "Draw your favorite animal later at the apartment.",
        "Count how many water areas you see.",
      ],
      missionDe: [
        "Finde 3 Tiere von verschiedenen Kontinenten.",
        "Male später dein Lieblingstier im Apartment.",
        "Zähle, wie viele Wasserbereiche du siehst.",
      ],
      images: [activityImg("zoo-01.webp"), activityImg("zoo-02.webp")],
      official: "https://www.zoobasel.ch/en/",
      map: maps("Zoo Basel"),
      photos: maps("Zoo Basel photos reviews"),
    },
    {
      id: "rhine",
      type: "Sightseeing",
      tier: "$",
      area: "Rhine / Münster / Old Town",
      cost: 8,
      time: "1.5–3h",
      transit: "10–20 min walk/tram",
      distance: "~1 km",
      weather: ["normal", "hot"],
      energy: ["low", "medium"],
      ages: ["5", "11"],
      en: "Rhine ferry + Münster view",
      de: "Rheinfähre + Münsterblick",
      descEn:
        "The Basel classic: river walk, small ferry crossing, Münsterplatz, and the viewpoint over the Rhine.",
      descDe:
        "Der Basler Klassiker: Rheinspaziergang, Fähre, Münsterplatz und Blick über den Rhein.",
      tipEn:
        "Best first evening activity. Cheap, simple, and gives the kids a strong sense of the city.",
      tipDe:
        "Beste Aktivität am ersten Abend. Günstig, einfach und gibt den Kindern ein Gefühl für die Stadt.",
      missionEn: [
        "Wave to the ferry.",
        "Spot three bridges.",
        "Take one family photo with the Rhine.",
      ],
      missionDe: [
        "Winke der Fähre.",
        "Finde drei Brücken.",
        "Macht ein Familienfoto mit dem Rhein.",
      ],
      images: [activityImg("rhine-01.webp"), activityImg("rhine-02.webp")],
      official: "https://www.basel.com/en/activities-excursions/ferries",
      map: maps("Basel Münster Rhine ferry"),
      photos: maps("Basel Rhine ferry Münster photos reviews"),
    },
    {
      id: "paper",
      type: "Museum",
      tier: "$$",
      area: "St. Alban",
      cost: 56,
      time: "2–3h",
      transit: "18–25 min walk/tram",
      distance: "~1.7 km",
      weather: ["rainy", "normal"],
      energy: ["medium"],
      ages: ["5", "11"],
      en: "Basel Paper Mill",
      de: "Basler Papiermühle",
      descEn:
        "Hands-on museum for paper, writing, printing and old machines. Strong choice when weather is mixed.",
      descDe:
        "Mitmachmuseum für Papier, Schreiben, Drucken und alte Maschinen. Stark bei gemischtem Wetter.",
      tipEn:
        "Let the kids touch, try, and make. This is better than passive museum walking.",
      tipDe:
        "Kinder ausprobieren lassen. Das ist besser als passiv durchs Museum zu laufen.",
      missionEn: [
        "Find an old printing machine.",
        "Make or spot handmade paper.",
        "Write your name like an old book title.",
      ],
      missionDe: [
        "Finde eine alte Druckmaschine.",
        "Finde oder mache handgeschöpftes Papier.",
        "Schreibe deinen Namen wie in einem alten Buch.",
      ],
      images: [activityImg("paper-01.webp"), activityImg("paper-02.webp")],
      official: "https://www.baslerpapiermuehle.ch/en/",
      map: maps("Basler Papiermühle Basel"),
      photos: maps("Basler Papiermühle photos reviews"),
    },
    {
      id: "augusta",
      type: "History",
      tier: "$",
      area: "Augst",
      cost: 22,
      time: "2.5–4h",
      transit: "35–50 min by public transport",
      distance: "~12 km",
      weather: ["normal", "hot"],
      energy: ["medium", "high"],
      ages: ["5", "11"],
      en: "Augusta Raurica Roman site",
      de: "Augusta Raurica Römerstadt",
      descEn:
        "Roman ruins with space to move. Better for kids than a quiet historical museum.",
      descDe:
        "Römische Ruinen mit Platz zum Laufen. Für Kinder besser als ein stilles Geschichtsmuseum.",
      tipEn:
        "Do this before Aquabasilea only if energy is high. Otherwise make it a standalone history day.",
      tipDe:
        "Nur mit Aquabasilea kombinieren, wenn die Energie hoch ist. Sonst als eigenen Geschichtstag nutzen.",
      missionEn: [
        "Find Roman columns.",
        "Imagine one thing Roman kids used.",
        "Take a “Roman explorer” photo.",
      ],
      missionDe: [
        "Finde römische Säulen.",
        "Stell dir vor, was römische Kinder benutzt haben.",
        "Mache ein „Römer-Entdecker“-Foto.",
      ],
      images: [activityImg("augusta-01.webp"), activityImg("augusta-02.webp")],
      official: "https://www.augustaraurica.ch/en/",
      map: maps("Augusta Raurica"),
      photos: maps("Augusta Raurica photos reviews"),
    },
    {
      id: "stlouis",
      type: "Day trip",
      tier: "$",
      area: "Saint-Louis, France",
      cost: 35,
      time: "2–4h",
      transit: "~30–40 min total by tram",
      distance: "cross-border tram",
      weather: ["normal"],
      energy: ["low", "medium"],
      ages: ["5", "11"],
      en: "Saint-Louis by Tram 3",
      de: "Saint-Louis mit Tram 3",
      descEn:
        "The easy French border treat: take the tram to France for a short walk, bakery/snack, and “we crossed countries” moment.",
      descDe:
        "Der einfache Frankreich-Moment: mit der Tram nach Frankreich für kurzen Spaziergang, Bäckerei/Snack und Grenzgefühl.",
      tipEn:
        "Keep expectations modest. It is a border-hop experience, not a full sightseeing city.",
      tipDe:
        "Erwartungen niedrig halten. Es ist ein Grenzausflug, keine große Sightseeing-Stadt.",
      missionEn: [
        "Say “bonjour” once.",
        "Find a French bakery.",
        "Spot the tram crossing feeling.",
      ],
      missionDe: [
        "Sag einmal „bonjour“.",
        "Finde eine französische Bäckerei.",
        "Achte auf das Gefühl beim Grenzübertritt.",
      ],
      images: [activityImg("stlouis-01.webp"), activityImg("stlouis-02.webp")],
      official:
        "https://www.basel.com/en/activities-excursions/day-trips-from-basel",
      map: maps("Saint-Louis Gare France"),
      photos: maps("Saint-Louis France photos reviews"),
    },
    {
      id: "aquabasilea",
      type: "Water",
      tier: "$$$",
      area: "Pratteln",
      cost: 155,
      time: "2–4h",
      transit: "30–45 min by public transport",
      distance: "~10 km",
      weather: ["rainy", "hot", "normal"],
      energy: ["high"],
      ages: ["5", "11"],
      en: "Aquabasilea waterpark",
      de: "Aquabasilea Wasserwelt",
      descEn:
        "The high-fun, high-cost reward activity. Excellent for kids, but it can dominate the day and the budget.",
      descDe:
        "Die große Spaß-Aktivität mit hohen Kosten. Super für Kinder, aber sie dominiert Tag und Budget.",
      tipEn:
        "Use it as the one big paid fun item. Cook dinner at the apartment the same day.",
      tipDe:
        "Als eine große bezahlte Spaß-Aktivität nutzen. Am selben Tag zuhause Abendessen kochen.",
      missionEn: [
        "Pack swimwear before leaving.",
        "Choose one favorite slide/pool.",
        "Drink water between swims.",
      ],
      missionDe: [
        "Badesachen vorher einpacken.",
        "Wähle eine Lieblingsrutsche/ein Lieblingsbecken.",
        "Zwischen dem Baden Wasser trinken.",
      ],
      images: [
        activityImg("aquabasilea-01.webp"),
        activityImg("aquabasilea-02.webp"),
      ],
      official: "https://www.aquabasilea.ch/",
      map: maps("Aquabasilea Pratteln"),
      photos: maps("Aquabasilea photos reviews"),
    },
    {
      id: "lange",
      type: "Park",
      tier: "$",
      area: "Kleinbasel / North Basel",
      cost: 0,
      time: "2–3h",
      transit: "15–25 min by public transport",
      distance: "~2.5–3 km",
      weather: ["normal", "hot"],
      energy: ["low", "medium"],
      ages: ["5", "11"],
      en: "Lange Erlen animal park",
      de: "Tierpark Lange Erlen",
      descEn:
        "A relaxed low-cost green day with animals, walking, and decompression after heavier activities.",
      descDe:
        "Entspannter günstiger grüner Tag mit Tieren, Spaziergang und Runterkommen nach vollen Tagen.",
      tipEn: "Ideal near the end of the trip when everyone is tired.",
      tipDe: "Ideal gegen Ende der Reise, wenn alle müde sind.",
      missionEn: [
        "Find a deer or goat.",
        "Pick a quiet picnic spot.",
        "Listen for three bird sounds.",
      ],
      missionDe: [
        "Finde ein Reh oder eine Ziege.",
        "Sucht einen ruhigen Picknickplatz.",
        "Höre drei Vogelgeräusche.",
      ],
      images: [activityImg("lange-01.webp"), activityImg("lange-02.webp")],
      official:
        "https://www.basel.com/en/attractions/lange-erlen-animal-park-8b732ee24e",
      map: maps("Tierpark Lange Erlen Basel"),
      photos: maps("Lange Erlen Basel photos reviews"),
    },
    {
      id: "tinguely",
      type: "Museum",
      tier: "$$",
      area: "Wettstein / Rhine",
      cost: 40,
      time: "1.5–2.5h",
      transit: "15–22 min tram/bus or walk",
      distance: "~1.8 km",
      weather: ["rainy", "normal"],
      energy: ["low", "medium"],
      ages: ["11"],
      en: "Museum Tinguely",
      de: "Museum Tinguely",
      descEn:
        "Kinetic art, machines, movement, and odd objects. More playful than many art museums.",
      descDe:
        "Kinetische Kunst, Maschinen, Bewegung und schräge Objekte. Spielerischer als viele Kunstmuseen.",
      tipEn: "Best for the older child if he likes machines or design.",
      tipDe:
        "Am besten für das ältere Kind, wenn es Maschinen oder Design mag.",
      missionEn: [
        "Find the strangest moving machine.",
        "Describe one object in three words.",
      ],
      missionDe: [
        "Finde die seltsamste bewegliche Maschine.",
        "Beschreibe ein Objekt in drei Wörtern.",
      ],
      images: [
        activityImg("tinguely-01.webp"),
        activityImg("tinguely-02.webp"),
      ],
      official: "https://www.tinguely.ch/en.html",
      map: maps("Museum Tinguely Basel"),
      photos: maps("Museum Tinguely photos reviews"),
    },
    {
      id: "natural",
      type: "Museum",
      tier: "$$",
      area: "Münsterplatz",
      cost: 45,
      time: "1.5–2.5h",
      transit: "12–18 min by tram/walk",
      distance: "~1.2 km",
      weather: ["rainy"],
      energy: ["low", "medium"],
      ages: ["5", "11"],
      en: "Natural History Museum",
      de: "Naturhistorisches Museum",
      descEn:
        "Useful rainy-day option because nature, fossils, animals and science are easier for kids than abstract art.",
      descDe:
        "Gute Regenoption, weil Natur, Fossilien, Tiere und Wissenschaft für Kinder leichter sind als abstrakte Kunst.",
      tipEn:
        "Use only when the weather turns bad or the kids need indoor structure.",
      tipDe:
        "Nutzen, wenn das Wetter schlecht wird oder die Kinder Indoor-Struktur brauchen.",
      missionEn: ["Find a fossil.", "Choose the weirdest animal."],
      missionDe: ["Finde ein Fossil.", "Wähle das seltsamste Tier."],
      images: [activityImg("natural-01.webp"), activityImg("natural-02.webp")],
      official: "https://www.nmbs.ch/en.html",
      map: maps("Naturhistorisches Museum Basel"),
      photos: maps("Naturhistorisches Museum Basel photos reviews"),
    },
    {
      id: "markthalle",
      type: "Food",
      tier: "$$",
      area: "Near Basel SBB",
      cost: 65,
      time: "1–2h",
      transit: "15–25 min by tram",
      distance: "~2.2 km",
      weather: ["rainy", "normal"],
      energy: ["low"],
      ages: ["5", "11"],
      en: "Markthalle Basel",
      de: "Markthalle Basel",
      descEn:
        "Indoor food-hall style stop. Good when everyone wants different food and you want vegetarian/Middle Eastern-style options.",
      descDe:
        "Indoor-Food-Hall. Gut, wenn alle etwas anderes wollen und ihr vegetarisch/Nahost-Optionen sucht.",
      tipEn:
        "Use for lunch, not dinner. Then cook in the apartment in the evening.",
      tipDe:
        "Für Mittagessen nutzen, nicht Abendessen. Abends im Apartment kochen.",
      missionEn: [
        "Each person picks one smell they like.",
        "Find one vegetarian option.",
      ],
      missionDe: [
        "Jeder sucht einen Geruch aus, den er mag.",
        "Finde eine vegetarische Option.",
      ],
      images: [
        activityImg("markthalle-01.webp"),
        activityImg("markthalle-02.webp"),
      ],
      official: "https://www.altemarkthalle.ch/",
      map: maps("Markthalle Basel"),
      photos: maps("Markthalle Basel photos reviews"),
    },
    {
      id: "dreilaendereck",
      type: "Sightseeing",
      tier: "$",
      area: "Three-Country Corner",
      cost: 10,
      time: "1.5–2.5h",
      transit: "20–35 min by public transport",
      distance: "~4–5 km",
      weather: ["normal"],
      energy: ["low"],
      ages: ["5", "11"],
      en: "Dreiländereck",
      de: "Dreiländereck",
      descEn:
        "A small but memorable stop: the idea of Switzerland, France and Germany meeting around the Rhine.",
      descDe:
        "Kleiner, aber merkbarer Stopp: Schweiz, Frankreich und Deutschland treffen sich am Rhein.",
      tipEn: "Better as a short add-on, not a full day.",
      tipDe: "Besser als kurzer Zusatz, nicht als ganzer Tag.",
      missionEn: ["Name the three countries.", "Point toward each country."],
      missionDe: ["Nenne die drei Länder.", "Zeige in Richtung jedes Landes."],
      images: [
        activityImg("dreilaendereck-01.webp"),
        activityImg("dreilaendereck-02.webp"),
      ],
      official:
        "https://www.basel.com/en/attractions/three-countries-corner-dreilaendereck",
      map: maps("Dreiländereck Basel"),
      photos: maps("Dreiländereck Basel photos reviews"),
    },
    {
      id: "vitra",
      type: "Day trip",
      tier: "$$",
      area: "Weil am Rhein, Germany",
      cost: 55,
      time: "3–5h",
      transit: "35–55 min by public transport",
      distance: "Germany-side trip",
      weather: ["normal", "rainy"],
      energy: ["medium"],
      ages: ["11"],
      en: "Vitra Design Museum / Campus",
      de: "Vitra Design Museum / Campus",
      descEn:
        "Good for design and architecture inspiration. Better for adults and the older child than the 5-year-old.",
      descDe:
        "Gut für Design- und Architektur-Inspiration. Eher für Erwachsene und das ältere Kind als für das 5-jährige Kind.",
      tipEn: "Do not choose this if the younger child is already tired.",
      tipDe: "Nicht wählen, wenn das jüngere Kind schon müde ist.",
      missionEn: [
        "Find the most unusual building shape.",
        "Choose one favorite chair/object.",
      ],
      missionDe: [
        "Finde die ungewöhnlichste Gebäudeform.",
        "Wähle einen Lieblingsstuhl/ein Lieblingsobjekt.",
      ],
      images: [activityImg("vitra-01.webp"), activityImg("vitra-02.webp")],
      official: "https://www.design-museum.de/en/information/your-visit.html",
      map: maps("Vitra Design Museum Weil am Rhein"),
      photos: maps("Vitra Design Museum photos reviews"),
    },
    {
      id: "kannenfeld",
      type: "Park",
      tier: "$",
      area: "Kannenfeld / Basel West",
      cost: 0,
      time: "1.5–3h",
      transit: "20–30 min by tram",
      distance: "~3.5 km",
      weather: ["normal", "hot"],
      energy: ["low", "medium"],
      ages: ["5", "11"],
      en: "Kannenfeldpark",
      de: "Kannenfeldpark",
      descEn:
        "Large local park with open space and playground energy. Good for a low-cost recovery block.",
      descDe:
        "Großer lokaler Park mit viel Platz und Spielplatz-Energie. Gut für einen günstigen Erholungsblock.",
      tipEn:
        "Use it when the kids need free movement instead of another ticketed attraction.",
      tipDe:
        "Nutzen, wenn die Kinder freie Bewegung brauchen statt noch einer bezahlten Attraktion.",
      missionEn: ["Find the biggest tree.", "Invent a 10-minute park game."],
      missionDe: [
        "Finde den größten Baum.",
        "Erfinde ein 10-Minuten-Parkspiel.",
      ],
      images: [
        activityImg("kannenfeld-01.webp"),
        activityImg("kannenfeld-02.webp"),
      ],
      official: "https://www.google.com/maps/search/Kannenfeldpark+Basel",
      map: maps("Kannenfeldpark Basel"),
      photos: maps("Kannenfeldpark Basel photos reviews"),
    },
    {
      id: "schuetzenmatt",
      type: "Park",
      tier: "$",
      area: "Schützenmatt / Basel",
      cost: 0,
      time: "1–2.5h",
      transit: "18–28 min by tram",
      distance: "~3 km",
      weather: ["normal", "hot"],
      energy: ["low", "medium"],
      ages: ["5", "11"],
      en: "Schützenmattpark",
      de: "Schützenmattpark",
      descEn:
        "Calm city park option with playground/pause potential. Better as a buffer than as a headline attraction.",
      descDe:
        "Ruhige Parkoption mit Spielplatz-/Pausenpotenzial. Besser als Puffer, nicht als Hauptattraktion.",
      tipEn: "Good between lunch and a short evening Rhine walk.",
      tipDe: "Gut zwischen Mittagessen und kurzem Abendspaziergang am Rhein.",
      missionEn: ["Choose a picnic bench.", "Do a 5-minute running race."],
      missionDe: [
        "Sucht euch eine Picknickbank.",
        "Macht ein 5-Minuten-Rennen.",
      ],
      images: [
        activityImg("schuetzenmatt-01.webp"),
        activityImg("schuetzenmatt-02.webp"),
      ],
      official:
        "https://www.google.com/maps/search/Sch%C3%BCtzenmattpark+Basel",
      map: maps("Schützenmattpark Basel"),
      photos: maps("Schützenmattpark Basel photos reviews"),
    },
    {
      id: "merian",
      type: "Park",
      tier: "$",
      area: "Münchenstein / Park im Grünen",
      cost: 10,
      time: "2–4h",
      transit: "25–40 min by public transport",
      distance: "~6 km",
      weather: ["normal", "hot"],
      energy: ["medium"],
      ages: ["5", "11"],
      en: "Merian Gardens / Park im Grünen",
      de: "Merian Gärten / Park im Grünen",
      descEn:
        "A better nature day than forcing a far lake trip: gardens, green space, walking, and family-friendly breathing room.",
      descDe:
        "Besserer Naturtag als ein erzwungener ferner Seeausflug: Gärten, Grünflächen, Spaziergang und familienfreundliche Pause.",
      tipEn: "Pair with simple packed food from the apartment.",
      tipDe: "Mit einfachem Essen aus dem Apartment kombinieren.",
      missionEn: ["Find three flower colors.", "Pick the quietest corner."],
      missionDe: ["Finde drei Blumenfarben.", "Sucht die ruhigste Ecke."],
      images: [activityImg("merian-01.webp"), activityImg("merian-02.webp")],
      official: "https://www.google.com/maps/search/Merian+G%C3%A4rten+Basel",
      map: maps("Merian Gärten Basel"),
      photos: maps("Merian Gärten Basel photos reviews"),
    },
    {
      id: "birskopfli",
      type: "Lake/Water",
      tier: "$",
      area: "Birsköpfli / Rhine-Birs",
      cost: 0,
      time: "1.5–3h",
      transit: "20–35 min by public transport",
      distance: "~4 km",
      weather: ["hot", "normal"],
      energy: ["low", "medium"],
      ages: ["5", "11"],
      en: "Birsköpfli water-side walk",
      de: "Birsköpfli Wasserspaziergang",
      descEn:
        "A local river-side option for hot weather. Not a lake, but useful when you want water, space, and low spending.",
      descDe:
        "Lokale Option am Wasser bei Hitze. Kein See, aber gut für Wassergefühl, Platz und wenig Kosten.",
      tipEn: "Treat as a walk/picnic stop. Be careful near water with kids.",
      tipDe:
        "Als Spaziergang/Picknick sehen. Am Wasser mit Kindern vorsichtig sein.",
      missionEn: [
        "Spot where rivers meet.",
        "Find a safe place to sit away from the edge.",
      ],
      missionDe: [
        "Finde, wo Wasser zusammenkommt.",
        "Sucht einen sicheren Platz weg vom Rand.",
      ],
      images: [
        activityImg("birskopfli-01.webp"),
        activityImg("birskopfli-02.webp"),
      ],
      official: "https://www.google.com/maps/search/Birsk%C3%B6pfli+Basel",
      map: maps("Birsköpfli Basel"),
      photos: maps("Birsköpfli Basel photos reviews"),
    },
    {
      id: "naturbad-riehen",
      type: "Lake/Water",
      tier: "$$",
      area: "Riehen",
      cost: 45,
      time: "2–4h",
      transit: "25–40 min by public transport",
      distance: "~6 km",
      weather: ["hot", "normal"],
      energy: ["medium", "high"],
      ages: ["5", "11"],
      en: "Naturbad Riehen",
      de: "Naturbad Riehen",
      descEn:
        "Outdoor natural swimming option for hot days. A calmer alternative to Aquabasilea if the weather is good.",
      descDe:
        "Natürliches Freibad für heiße Tage. Ruhigere Alternative zu Aquabasilea bei gutem Wetter.",
      tipEn:
        "Check opening/weather before leaving. Pack swimwear, towels, water, and snacks.",
      tipDe:
        "Öffnungszeiten/Wetter vorher prüfen. Badesachen, Handtücher, Wasser und Snacks einpacken.",
      missionEn: [
        "Pack the swim kit yourself.",
        "Choose one quiet water break.",
      ],
      missionDe: [
        "Packe deine Badesachen selbst.",
        "Wähle eine ruhige Wasserpause.",
      ],
      images: [
        activityImg("naturbad-riehen-01.webp"),
        activityImg("naturbad-riehen-02.webp"),
      ],
      official: "https://www.google.com/maps/search/Naturbad+Riehen",
      map: maps("Naturbad Riehen"),
      photos: maps("Naturbad Riehen photos reviews"),
    },
    {
      id: "beyeler",
      type: "Museum",
      tier: "$$",
      area: "Riehen",
      cost: 55,
      time: "2–3h",
      transit: "25–35 min by tram/bus",
      distance: "~6 km",
      weather: ["rainy", "cold", "normal", "hot"],
      energy: ["low", "medium"],
      ages: ["11"],
      en: "Fondation Beyeler",
      de: "Fondation Beyeler",
      descEn:
        "High-quality art museum in Riehen. Strong indoor recommendation for heat, rain, cold, or a calmer adult/older-child block.",
      descDe:
        "Hochwertiges Kunstmuseum in Riehen. Starke Indoor-Empfehlung bei Hitze, Regen, Kälte oder für einen ruhigen Erwachsenen-/älteres-Kind-Block.",
      tipEn:
        "Pair with a short Riehen walk or Sarasinpark only if the weather is comfortable.",
      tipDe:
        "Nur bei angenehmem Wetter mit kurzem Riehen-Spaziergang oder Sarasinpark kombinieren.",
      missionEn: [
        "Choose one artwork you would put in your room.",
        "Find one color used more than three times.",
      ],
      missionDe: [
        "Wähle ein Kunstwerk für dein Zimmer.",
        "Finde eine Farbe, die mehr als dreimal vorkommt.",
      ],
      images: [activityImg("beyeler-01.webp"), activityImg("beyeler-02.webp")],
      official: "https://www.fondationbeyeler.ch/en/",
      map: maps("Fondation Beyeler"),
      photos: maps("Fondation Beyeler photos reviews"),
    },
    {
      id: "kunstmuseum",
      type: "Museum",
      tier: "$$",
      area: "St. Alban / Old Town",
      cost: 45,
      time: "1.5–3h",
      transit: "12–18 min tram/walk",
      distance: "~1.5 km",
      weather: ["rainy", "cold", "hot", "normal"],
      energy: ["low", "medium"],
      ages: ["11"],
      en: "Kunstmuseum Basel",
      de: "Kunstmuseum Basel",
      descEn:
        "Central indoor culture anchor. Good when outdoor plans become too hot, cold, or wet.",
      descDe:
        "Zentrale Indoor-Kulturanker. Gut, wenn Outdoor-Pläne zu heiß, kalt oder nass werden.",
      tipEn:
        "Keep it short with kids: pick one floor or one theme, then leave before museum fatigue.",
      tipDe:
        "Mit Kindern kurz halten: eine Etage oder ein Thema wählen, dann vor Museums-Müdigkeit gehen.",
      missionEn: [
        "Find the oldest-looking painting.",
        "Pick one picture that feels like summer or winter.",
      ],
      missionDe: [
        "Finde das älteste Bild.",
        "Wähle ein Bild, das sich nach Sommer oder Winter anfühlt.",
      ],
      images: [
        activityImg("kunstmuseum-01.webp"),
        activityImg("kunstmuseum-02.webp"),
      ],
      official: "https://kunstmuseumbasel.ch/en",
      map: maps("Kunstmuseum Basel"),
      photos: maps("Kunstmuseum Basel photos reviews"),
    },
    {
      id: "toy-worlds",
      type: "Museum",
      tier: "$$",
      area: "Barfüsserplatz / Old Town",
      cost: 38,
      time: "1–2h",
      transit: "10–15 min tram/walk",
      distance: "~1 km",
      weather: ["rainy", "cold", "hot", "normal"],
      energy: ["low", "medium"],
      ages: ["5", "11"],
      en: "Toy Worlds Museum Basel",
      de: "Spielzeug Welten Museum Basel",
      descEn:
        "Compact indoor stop with toys, miniatures, and kid-readable displays. Useful as a low-stress weather backup.",
      descDe:
        "Kompakter Indoor-Stopp mit Spielzeug, Miniaturen und für Kinder verständlichen Ausstellungen. Gut als stressarme Wetter-Reserve.",
      tipEn:
        "Best as a one-hour reset near the old town, not a full-day anchor.",
      tipDe:
        "Am besten als einstündige Pause nahe Altstadt, nicht als Ganztagesanker.",
      missionEn: ["Find the smallest object.", "Choose the funniest toy face."],
      missionDe: [
        "Finde das kleinste Objekt.",
        "Wähle das lustigste Spielzeuggesicht.",
      ],
      images: [
        activityImg("toy-worlds-01.webp"),
        activityImg("toy-worlds-02.webp"),
      ],
      official: "https://www.spielzeug-welten-museum-basel.ch/en/",
      map: maps("Spielzeug Welten Museum Basel"),
      photos: maps("Toy Worlds Museum Basel photos reviews"),
    },
    {
      id: "pharmacy-museum",
      type: "Museum",
      tier: "$",
      area: "Old Town / Totengässlein",
      cost: 24,
      time: "1–1.5h",
      transit: "10–15 min tram/walk",
      distance: "~1 km",
      weather: ["rainy", "cold", "hot", "normal"],
      energy: ["low"],
      ages: ["11"],
      en: "Pharmacy Museum Basel",
      de: "Pharmaziemuseum Basel",
      descEn:
        "Small, unusual indoor museum. Good when you need a short, cheap, central backup rather than another large attraction.",
      descDe:
        "Kleines, ungewöhnliches Indoor-Museum. Gut, wenn ihr eine kurze, günstige, zentrale Reserve braucht.",
      tipEn: "Use it as a filler near Old Town/Rhine, not as a headline stop.",
      tipDe:
        "Als Lückenfüller nahe Altstadt/Rhein nutzen, nicht als Hauptstopp.",
      missionEn: [
        "Find one strange old medicine jar.",
        "Guess what one tool was used for.",
      ],
      missionDe: [
        "Finde ein seltsames altes Medizinglas.",
        "Rate, wofür ein Werkzeug benutzt wurde.",
      ],
      images: [
        activityImg("pharmacy-museum-01.webp"),
        activityImg("pharmacy-museum-02.webp"),
      ],
      official: "https://pharmaziemuseum.ch/en/",
      map: maps("Pharmaziemuseum Basel"),
      photos: maps("Pharmacy Museum Basel photos reviews"),
    },
    {
      id: "botanical-garden",
      type: "Park",
      tier: "$",
      area: "University / Spalentor",
      cost: 0,
      time: "1–1.5h",
      transit: "12–18 min tram/walk",
      distance: "~1.4 km",
      weather: ["normal", "hot", "cold", "rainy"],
      energy: ["low"],
      ages: ["5", "11"],
      en: "Botanical Garden Basel",
      de: "Botanischer Garten Basel",
      descEn:
        "Small botanical garden with greenhouse value. Good for a short green stop when weather is mixed.",
      descDe:
        "Kleiner botanischer Garten mit Gewächshaus-Vorteil. Gut für einen kurzen grünen Stopp bei gemischtem Wetter.",
      tipEn:
        "Use the greenhouse as a weather bridge, then add Spalentor or Old Town nearby.",
      tipDe:
        "Gewächshaus als Wetterbrücke nutzen, danach Spalentor oder Altstadt in der Nähe.",
      missionEn: [
        "Find a plant with huge leaves.",
        "Choose one plant that looks alien.",
      ],
      missionDe: [
        "Finde eine Pflanze mit riesigen Blättern.",
        "Wähle eine Pflanze, die außerirdisch wirkt.",
      ],
      images: [
        activityImg("botanical-garden-01.webp"),
        activityImg("botanical-garden-02.webp"),
      ],
      official: "https://botgarten.unibas.ch/en/",
      map: maps("Botanischer Garten Basel Universität"),
      photos: maps("Botanical Garden Basel photos reviews"),
    },
    {
      id: "solitude-park",
      type: "Park",
      tier: "$",
      area: "Wettstein / Rhine",
      cost: 0,
      time: "45–90m",
      transit: "15–22 min tram/walk",
      distance: "~1.8 km",
      weather: ["normal", "hot"],
      energy: ["low"],
      ages: ["5", "11"],
      en: "Solitude Park",
      de: "Solitude Park",
      descEn:
        "Quiet Rhine-side park near Museum Tinguely. Strong for a shaded pause before or after an indoor stop.",
      descDe:
        "Ruhiger Rheinpark nahe Museum Tinguely. Stark für eine Schattenpause vor oder nach einem Indoor-Stopp.",
      tipEn:
        "Use as a buffer, not the whole plan. Works well with Museum Tinguely.",
      tipDe:
        "Als Puffer nutzen, nicht als ganzer Plan. Passt gut zum Museum Tinguely.",
      missionEn: [
        "Find a quiet bench.",
        "Watch one boat or bird on the Rhine.",
      ],
      missionDe: [
        "Finde eine ruhige Bank.",
        "Beobachte ein Boot oder einen Vogel am Rhein.",
      ],
      images: [
        activityImg("solitude-park-01.webp"),
        activityImg("solitude-park-02.webp"),
      ],
      official: "https://www.google.com/maps/search/Solitude+Park+Basel",
      map: maps("Solitude Park Basel"),
      photos: maps("Solitude Park Basel photos reviews"),
    },
    {
      id: "st-johanns-park",
      type: "Park",
      tier: "$",
      area: "St. Johann / Rhine",
      cost: 0,
      time: "1–2h",
      transit: "18–28 min tram/walk",
      distance: "~2.8 km",
      weather: ["normal", "hot"],
      energy: ["low", "medium"],
      ages: ["5", "11"],
      en: "St. Johanns-Park",
      de: "St. Johanns-Park",
      descEn:
        "Local Rhine-side park with playground energy and open grass. Useful for a low-cost reset.",
      descDe:
        "Lokaler Rheinpark mit Spielplatz-Energie und Wiese. Gut für eine günstige Pause.",
      tipEn: "Good late afternoon if the day has been too museum-heavy.",
      tipDe: "Gut am späten Nachmittag, wenn der Tag zu museumslastig war.",
      missionEn: [
        "Invent a park game with three rules.",
        "Find a shady spot for water break.",
      ],
      missionDe: [
        "Erfinde ein Parkspiel mit drei Regeln.",
        "Finde einen Schattenplatz für eine Wasserpause.",
      ],
      images: [
        activityImg("st-johanns-park-01.webp"),
        activityImg("st-johanns-park-02.webp"),
      ],
      official: "https://www.google.com/maps/search/St.+Johanns-Park+Basel",
      map: maps("St. Johanns-Park Basel"),
      photos: maps("St. Johanns-Park Basel photos reviews"),
    },
    {
      id: "erlenmattpark",
      type: "Park",
      tier: "$",
      area: "Erlenmatt / Kleinbasel",
      cost: 0,
      time: "1–2h",
      transit: "12–20 min tram/walk",
      distance: "~1.5 km",
      weather: ["normal", "hot"],
      energy: ["low", "medium"],
      ages: ["5", "11"],
      en: "Erlenmattpark",
      de: "Erlenmattpark",
      descEn:
        "Close urban park option from the apartment side. Good for quick free movement without crossing the city.",
      descDe:
        "Nahe urbane Parkoption von Apartment-Seite. Gut für schnelle freie Bewegung ohne Stadtquerung.",
      tipEn:
        "Use this when you need a nearby reset instead of a full attraction.",
      tipDe:
        "Nutzen, wenn ihr eine nahe Pause braucht statt einer ganzen Attraktion.",
      missionEn: [
        "Find the best running loop.",
        "Choose one place for a snack break.",
      ],
      missionDe: [
        "Finde die beste Rennrunde.",
        "Wähle einen Platz für Snackpause.",
      ],
      images: [
        activityImg("erlenmattpark-01.webp"),
        activityImg("erlenmattpark-02.webp"),
      ],
      official: "https://www.google.com/maps/search/Erlenmattpark+Basel",
      map: maps("Erlenmattpark Basel"),
      photos: maps("Erlenmattpark Basel photos reviews"),
    },
    {
      id: "margarethenpark",
      type: "Park",
      tier: "$",
      area: "Margarethen / Binningen edge",
      cost: 0,
      time: "1–2h",
      transit: "20–30 min tram/walk",
      distance: "~3 km",
      weather: ["normal", "hot"],
      energy: ["low", "medium"],
      ages: ["5", "11"],
      en: "Margarethenpark",
      de: "Margarethenpark",
      descEn:
        "Large green option with playground/reset value. Better for relaxed family pacing than another ticketed stop.",
      descDe:
        "Größere Grünoption mit Spielplatz-/Pausenwert. Besser für entspanntes Familientempo als noch ein Ticket-Stopp.",
      tipEn: "Good on a budget day or when the younger child needs movement.",
      tipDe:
        "Gut an einem Budget-Tag oder wenn das jüngere Kind Bewegung braucht.",
      missionEn: [
        "Find the steepest safe hill.",
        "Do a ten-minute explore loop.",
      ],
      missionDe: [
        "Finde den steilsten sicheren Hügel.",
        "Macht eine 10-Minuten-Entdeckerrunde.",
      ],
      images: [
        activityImg("margarethenpark-01.webp"),
        activityImg("margarethenpark-02.webp"),
      ],
      official: "https://www.google.com/maps/search/Margarethenpark+Basel",
      map: maps("Margarethenpark Basel"),
      photos: maps("Margarethenpark Basel photos reviews"),
    },
    {
      id: "sarasinpark",
      type: "Park",
      tier: "$",
      area: "Riehen",
      cost: 0,
      time: "45–90m",
      transit: "25–35 min tram/bus",
      distance: "~6 km",
      weather: ["normal", "hot"],
      energy: ["low"],
      ages: ["5", "11"],
      en: "Sarasinpark Riehen",
      de: "Sarasinpark Riehen",
      descEn:
        "Calm Riehen park that pairs naturally with Fondation Beyeler or Naturbad Riehen.",
      descDe:
        "Ruhiger Riehener Park, natürlich kombinierbar mit Fondation Beyeler oder Naturbad Riehen.",
      tipEn:
        "Use as a nearby soft landing, not as a standalone cross-town trip.",
      tipDe:
        "Als sanfte Ergänzung vor Ort nutzen, nicht als alleiniger Stadtquerungsgrund.",
      missionEn: [
        "Find the calmest path.",
        "Choose one tree you would remember.",
      ],
      missionDe: [
        "Finde den ruhigsten Weg.",
        "Wähle einen Baum, den du dir merkst.",
      ],
      images: [
        activityImg("sarasinpark-01.webp"),
        activityImg("sarasinpark-02.webp"),
      ],
      official: "https://www.google.com/maps/search/Sarasinpark+Riehen",
      map: maps("Sarasinpark Riehen"),
      photos: maps("Sarasinpark Riehen photos reviews"),
    },
    {
      id: "spalentor-oldtown",
      type: "Sightseeing",
      tier: "$",
      area: "Spalentor / Old Town",
      cost: 0,
      time: "45–90m",
      transit: "12–18 min tram/walk",
      distance: "~1.5 km",
      weather: ["normal", "cold"],
      energy: ["low", "medium"],
      ages: ["5", "11"],
      en: "Spalentor + Old Town lanes",
      de: "Spalentor + Altstadtgassen",
      descEn:
        "Compact sightseeing loop with an iconic city gate and old lanes. Better than a long outdoor walk in marginal weather.",
      descDe:
        "Kompakte Sightseeing-Runde mit Stadttor und Altstadtgassen. Besser als langer Outdoor-Walk bei mäßigem Wetter.",
      tipEn:
        "Use it as a 60-minute city texture block, then move indoors or to food.",
      tipDe:
        "Als 60-Minuten-Stadtblock nutzen, danach nach drinnen oder zum Essen.",
      missionEn: ["Find the city gate.", "Pick the narrowest lane."],
      missionDe: ["Finde das Stadttor.", "Wähle die engste Gasse."],
      images: [
        activityImg("spalentor-oldtown-01.webp"),
        activityImg("spalentor-oldtown-02.webp"),
      ],
      official: "https://www.basel.com/en/attractions/spalentor",
      map: maps("Spalentor Basel"),
      photos: maps("Spalentor Basel photos reviews"),
    },
    {
      id: "zurich",
      type: "Day trip",
      tier: "$$$",
      area: "Zürich half-day option",
      cost: 190,
      time: "6–8h including train",
      transit: "~55–75 min train each way from Basel SBB",
      distance: "~88 km by train",
      weather: ["normal", "hot", "rainy"],
      energy: ["high"],
      ages: ["5", "11"],
      en: "Zürich half-day option",
      de: "Zürich Halbtagesoption",
      descEn:
        "Optional bigger treat: fast train to Zürich, compact old town/lake walk, then return. Great, but not cheap and not low-energy.",
      descDe:
        "Optionale größere Tour: schneller Zug nach Zürich, kompakte Altstadt-/See-Runde, dann zurück. Schön, aber nicht günstig und nicht energiesparend.",
      tipEn:
        "Only pick this if you accept the train cost and the kids have high energy. Keep the route compact.",
      tipDe:
        "Nur wählen, wenn Zugkosten okay sind und die Kinder viel Energie haben. Route kompakt halten.",
      missionEn: [
        "Find Lake Zürich.",
        "Spot one old-town alley.",
        "Compare Zürich with Basel in one sentence.",
      ],
      missionDe: [
        "Finde den Zürichsee.",
        "Finde eine Altstadtgasse.",
        "Vergleiche Zürich mit Basel in einem Satz.",
      ],
      images: [activityImg("zurich-01.webp"), activityImg("zurich-02.webp")],
      official: "https://www.zuerich.com/en",
      map: maps("Zürich HB"),
      photos: maps("Zürich old town lake photos reviews"),
    },
  ],
  types,
  typeLabels: { de: typeDe },
  specialPlans: {
    stlouis: {
      en: {
        title: "Saint-Louis mini-plan when selected",
        intro:
          "Treat this as a small cross-border experience, not a full sightseeing city. Best after a light Basel morning or as a relaxed final-day option.",
        steps: [
          "Take Tram 3 toward Saint-Louis / Gare de Saint-Louis. From Basel SBB to St-Louis Soleil is around 21 minutes; from the apartment area plan roughly 30–40 minutes door to door.",
          "Walk around the town centre and stop at a French bakery or café for a small treat.",
          "Search nearby for Parc de la Croisée des Lys / playground / bakery depending on kids’ energy.",
          "Use Google Maps before returning; service and zones can change. Keep passports/IDs with you because you cross into France.",
        ],
        links: [
          ["Saint-Louis centre map", maps("Saint-Louis centre France")],
          ["French bakery near Saint-Louis", maps("bakery Saint-Louis France")],
          [
            "Playground / park near Saint-Louis",
            maps("playground park Saint-Louis France"),
          ],
          ["Route from apartment", route("Saint-Louis Gare France")],
        ],
      },
      de: {
        title: "Saint-Louis Mini-Plan bei Auswahl",
        intro:
          "Als kleinen Grenzausflug sehen, nicht als große Sightseeing-Stadt. Gut nach einem leichten Basler Vormittag oder als entspannte Abschlussoption.",
        steps: [
          "Tram 3 Richtung Saint-Louis / Gare de Saint-Louis nehmen. Basel SBB bis St-Louis Soleil ca. 21 Minuten; ab Apartment grob 30–40 Minuten Tür zu Tür planen.",
          "Kurz durch das Zentrum laufen und bei einer französischen Bäckerei oder einem Café etwas Kleines holen.",
          "Je nach Kinderenergie nach Parc de la Croisée des Lys / Spielplatz / Bäckerei suchen.",
          "Vor der Rückfahrt Google Maps prüfen; Linien/Zonen können sich ändern. Ausweise mitnehmen, weil ihr nach Frankreich fahrt.",
        ],
        links: [
          ["Saint-Louis Zentrum Karte", maps("Saint-Louis centre France")],
          ["Bäckerei in Saint-Louis", maps("bakery Saint-Louis France")],
          [
            "Spielplatz / Park in Saint-Louis",
            maps("playground park Saint-Louis France"),
          ],
          ["Route ab Apartment", route("Saint-Louis Gare France")],
        ],
      },
    },
    zurich: {
      en: {
        title: "Zürich half-day suggestions",
        intro:
          "This is a premium optional day. Basel–Zürich is fast by train, but it adds cost and movement. Do it only if the family has good energy.",
        steps: [
          "Take a direct train Basel SBB → Zürich HB. Plan about 55–75 minutes each way depending on the train.",
          "Keep Zürich compact: Bahnhofstrasse → Lindenhof viewpoint → Old Town → Lake Zürich / Bürkliplatz.",
          "Use lunch as the main paid meal. For halal/vegetarian, search near Zürich HB or Langstrasse before walking too far.",
          "Return before the kids crash. Half-day means 5–6 hours total in Zürich, not a packed full city tour.",
        ],
        links: [
          ["Zürich HB", maps("Zürich HB")],
          ["Lindenhof Zürich", maps("Lindenhof Zürich")],
          ["Lake Zürich Bürkliplatz", maps("Bürkliplatz Zürich")],
          [
            "Vegetarian / halal lunch Zürich HB",
            maps("vegetarian halal lunch near Zürich HB"),
          ],
          ["SBB Basel to Zürich timetable", "https://www.sbb.ch/en"],
        ],
      },
      de: {
        title: "Zürich Halbtagesvorschläge",
        intro:
          "Eine hochwertige optionale Tour. Basel–Zürich ist schnell mit dem Zug, kostet aber Geld und Energie. Nur machen, wenn die Familie fit ist.",
        steps: [
          "Direkten Zug Basel SBB → Zürich HB nehmen. Je nach Verbindung ca. 55–75 Minuten pro Strecke planen.",
          "Zürich kompakt halten: Bahnhofstrasse → Lindenhof → Altstadt → Zürichsee / Bürkliplatz.",
          "Mittagessen als Hauptausgabe nutzen. Für halal/vegetarisch nahe Zürich HB oder Langstrasse suchen.",
          "Rechtzeitig zurückfahren. Halbtag bedeutet 5–6 Stunden in Zürich, keine volle Stadttour.",
        ],
        links: [
          ["Zürich HB", maps("Zürich HB")],
          ["Lindenhof Zürich", maps("Lindenhof Zürich")],
          ["Zürichsee Bürkliplatz", maps("Bürkliplatz Zürich")],
          [
            "Vegetarisch / halal Mittag Zürich HB",
            maps("vegetarian halal lunch near Zürich HB"),
          ],
          ["SBB Basel–Zürich Fahrplan", "https://www.sbb.ch/en"],
        ],
      },
    },
  },
  groceryCards: [
    [
      "Coop / Migros near hotel",
      "Coop / Migros nahe Hotel",
      "Snacks, water, fruit, picnic items and simple dinner basics. Breakfast is already included.",
      "Snacks, Wasser, Obst, Picknick und einfache Abendessen-Basics. Frühstück ist schon inklusive.",
      "CHF 25–50",
      "https://www.google.com/maps/search/Coop+Migros+near+Aparthotel+Adagio+Basel+City",
    ],
    [
      "Denner near hotel",
      "Denner nahe Hotel",
      "Often useful for cheaper drinks, fruit, snacks and simple dinner basics.",
      "Oft gut für günstigere Getränke, Obst, Snacks und einfache Abendessen-Basics.",
      "CHF 20–45",
      "https://www.google.com/maps/search/Denner+near+Aparthotel+Adagio+Basel+City",
    ],
    [
      "Halal / Middle Eastern grocery search",
      "Halal / Nahost-Lebensmittel suchen",
      "Use this for hummus, bread, olives, rice, spices and simple halal/vegetarian dinner basics.",
      "Für Hummus, Brot, Oliven, Reis, Gewürze und einfache halal/vegetarische Abendessen-Basics.",
      "CHF 25–65",
      "https://www.google.com/maps/search/halal+grocery+middle+eastern+food+near+Aparthotel+Adagio+Basel+City",
    ],
    [
      "Vegetarian / halal lunch near activity",
      "Vegetarisches / halal Mittagessen nahe Aktivität",
      "Map search for flexible lunch while outside. This is now the main paid meal of the day.",
      "Maps-Suche für flexibles Mittagessen unterwegs. Das ist jetzt die wichtigste bezahlte Mahlzeit des Tages.",
      "CHF 45–75",
      "https://www.google.com/maps/search/vegetarian+lunch+near+Basel",
    ],
    [
      "Rheincenter Weil am Rhein",
      "Rheincenter Weil am Rhein",
      "Germany-side shopping + food court style option. Good if already going that direction; no need to overbuy because breakfast is included.",
      "Einkauf auf deutscher Seite + Food-Court-Option. Gut, wenn ihr sowieso dorthin fahrt; nicht zu viel kaufen, da Frühstück inklusive ist.",
      "€25–70",
      "https://www.google.com/maps/search/Rheincenter+Weil+am+Rhein",
    ],
    [
      "Kaufland Lörrach",
      "Kaufland Lörrach",
      "Not a quick Basel grocery stop. Use only as a Germany-side shopping trip for dinner/snack basics.",
      "Kein schneller Basler Einkauf. Nur als Deutschland-Einkaufsausflug für Abendessen-/Snack-Basics.",
      "€30–85",
      "https://www.google.com/maps/search/Kaufland+L%C3%B6rrach",
    ],
  ],
  defaultChecklist: [
    [
      "DB/ICE train tickets + seat reservations",
      "DB/ICE-Zugtickets + Sitzplatzreservierungen",
    ],
    ["BaselCard / hotel transport card", "BaselCard / Hotel-Transportkarte"],
    [
      "Breakfast included confirmation / hotel breakfast times",
      "Frühstück inklusive bestätigen / Frühstückszeiten im Hotel",
    ],
    ["Water bottles", "Wasserflaschen"],
    [
      "Kids snacks for train and day trips",
      "Kindersnacks für Zug und Tagesausflüge",
    ],
    ["Sunscreen + hats", "Sonnencreme + Kappen"],
    ["Light jackets", "Leichte Jacken"],
    ["Power bank + charging cable", "Powerbank + Ladekabel"],
    ["Wet wipes / tissues", "Feuchttücher / Taschentücher"],
    [
      "Small towel / swimwear if needed",
      "Kleines Handtuch / Badesachen falls nötig",
    ],
    ["Hotel address screenshot", "Screenshot der Hoteladresse"],
    ["Emergency cash", "Notfall-Bargeld"],
  ],
  dayTemplates: [
    {
      day: "Mon 13",
      de: "Mo 13",
      titleEn: "ICE to Basel + Rhine evening",
      titleDe: "ICE nach Basel + Rheinabend",
      items: ["rhine"],
      noteEn:
        "ICE 371 departs Berlin 08:31 from platform 8 and arrives Basel 15:36. Keep the evening light: check in, collect BaselCard, short Rhine walk.",
      noteDe:
        "ICE 371 fährt 08:31 ab Berlin von Gleis 8 und kommt 15:36 in Basel an. Abend leicht halten: einchecken, BaselCard holen, kurzer Rheinspaziergang.",
    },
    {
      day: "Tue 14",
      de: "Di 14",
      titleEn: "Zoo + Old Town + short park reset",
      titleDe: "Zoo + Altstadt + kurze Parkpause",
      items: ["zoo", "spalentor-oldtown", "rhine", "kannenfeld"],
    },
    {
      day: "Wed 15",
      de: "Mi 15",
      titleEn: "Indoor learning + weather backups",
      titleDe: "Indoor-Lernen + Wetter-Reserve",
      items: ["paper", "toy-worlds", "natural", "tinguely", "kunstmuseum"],
    },
    {
      day: "Thu 16",
      de: "Do 16",
      titleEn: "Weather-dependent big choice",
      titleDe: "Wetterabhängige große Wahl",
      items: ["augusta", "aquabasilea", "beyeler", "naturbad-riehen", "zurich"],
    },
    {
      day: "Fri 17",
      de: "Fr 17",
      titleEn: "Departure 14:25 + easy morning",
      titleDe: "Abreise 14:25 + leichter Morgen",
      items: ["markthalle", "botanical-garden", "erlenmattpark", "rhine"],
      noteEn:
        "ICE 278 departs Basel 14:25 from platform 4 and arrives Berlin 21:33. Keep the morning close to the hotel/station; avoid Saint-Louis or Zürich on departure day.",
      noteDe:
        "ICE 278 fährt 14:25 ab Basel von Gleis 4 und kommt 21:33 in Berlin an. Vormittag nah am Hotel/Bahnhof halten; kein Saint-Louis oder Zürich am Abreisetag.",
    },
  ],
  overview: {
    src: "/images/overview/11-bonus-basel-activity-overview-collage.png",
    alt: "Basel activity overview collage",
    en: "Overview image for planning inspiration.",
    de: "Übersichtsbild zur Planungsinspiration.",
  },
  routeMeta: baselRouteMeta,
};
