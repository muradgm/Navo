import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { useStoredState } from "./hooks/useStoredState.js";
import { useTripWeather } from "./hooks/useTripWeather.js";
import {
  BusFront,
  CalendarDays,
  CarFront,
  CarTaxiFront,
  CheckCircle2,
  ChevronDown,
  Clock,
  CloudRain,
  CloudSun,
  Euro,
  ExternalLink,
  Heart,
  Home,
  Languages,
  MapPin,
  Navigation,
  PiggyBank,
  Plane,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBasket,
  SlidersHorizontal,
  Star,
  ThermometerSun,
  TrainFront,
  Trash2,
  Utensils,
} from "lucide-react";
import "./styles.css";
import "./navo.css";

const CHF_TO_EUR = 1.04;
const APP_NAME = "Navo";
const BASE_LOCATION = {
  label: "Aparthotel Adagio Basel City",
  address: "Hammerstrasse 46, Basel",
  mapQuery: "Aparthotel Adagio Basel City Hammerstrasse 46 Basel",
};
const eur = (chf) => Math.round(chf * CHF_TO_EUR);
const maps = (q) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const route = (
  q,
  origin = `${BASE_LOCATION.label}, ${BASE_LOCATION.address}`,
) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(q)}&travelmode=transit`;
const activityImg = (name) => `/images/activity-ai-v2/${name}`;

const copy = {
  en: {
    language: "DE",
    title: APP_NAME,
    subtitle:
      "A route-aware city-day planner that turns scattered places, time, weather, food, budget, and traveler context into a clear plan you can actually follow.",
    destinationPack: "Destination pack",
    base: "Base",
    today: "Today plan",
    activities: "Activities",
    food: "Food & groceries",
    checklist: "Checklist",
    safety: "Safety",
    itinerary: "Itinerary",
    budget: "Budget",
    filters: "Filters",
    search: "Search places, food, parks, side trips...",
    weather: "Weather",
    energy: "Traveler energy",
    budgetToday: "Today budget",
    rainy: "Rainy",
    hot: "Hot",
    cold: "Cold",
    normal: "Normal",
    low: "Low",
    medium: "Medium",
    high: "High",
    buildToday: "Build today",
    clearToday: "Clear day",
    add: "Add to day",
    added: "Added",
    addedTo: "Added to",
    alreadyAdded: "Already in",
    chooseDay: "Add activities to",
    viewDay: "View day plan",
    save: "Save",
    saved: "Saved",
    details: "Details",
    route: "Route",
    map: "Map",
    official: "Official/source",
    photos: "Photos/reviews",
    mission: "Kids mission",
    tip: "Parent tip",
    cost: "Cost",
    time: "Time",
    fromBase: "From base",
    type: "Type",
    all: "All",
    dayBag: "Day bag checklist",
    groceries: "Grocery planner",
    foodPlan: "Food strategy",
    emergency: "Emergency basics",
    smartPick: "Smart pick",
    selected: "selected",
    remaining: "remaining",
    expectedTripBudget: "Expected trip budget excluding hotel/train tickets",
    cookNote:
      "Food planning comes from the active destination pack and traveler preferences. Verify opening hours and transit on the day.",
    imageNote:
      "Images are local AI-generated cinematic planning visuals, not official photos.",
    guestWants: "Guest wants",
    navoRecommends: "Navo recommends",
    applyRecommendation: "Use recommendation",
  },
  de: {
    language: "EN",
    title: APP_NAME,
    subtitle:
      "Ein routenbewusster Tagesplaner, der verstreute Orte, Zeit, Wetter, Essen, Budget und Reisekontext in einen klaren, machbaren Plan verwandelt.",
    destinationPack: "Zielort-Paket",
    base: "Basis",
    today: "Tagesplan",
    activities: "Aktivitäten",
    food: "Essen & Einkauf",
    checklist: "Checkliste",
    safety: "Sicherheit",
    itinerary: "Reiseplan",
    budget: "Budget",
    filters: "Filter",
    search: "Suche Orte, Essen, Parks, Ausflüge...",
    weather: "Wetter",
    energy: "Reiseenergie",
    budgetToday: "Tagesbudget",
    rainy: "Regen",
    hot: "Heiß",
    cold: "Kalt",
    normal: "Normal",
    low: "Niedrig",
    medium: "Mittel",
    high: "Hoch",
    buildToday: "Tag bauen",
    clearToday: "Tag leeren",
    add: "Zum Tag hinzufügen",
    added: "Hinzugefügt",
    addedTo: "Hinzugefügt zu",
    alreadyAdded: "Schon in",
    chooseDay: "Aktivitäten hinzufügen zu",
    viewDay: "Tagesplan ansehen",
    save: "Speichern",
    saved: "Gespeichert",
    details: "Details",
    route: "Route",
    map: "Karte",
    official: "Offizielle/Quelle",
    photos: "Fotos/Bewertungen",
    mission: "Kinder-Mission",
    tip: "Eltern-Tipp",
    cost: "Kosten",
    time: "Dauer",
    fromBase: "Ab Basis",
    type: "Art",
    all: "Alle",
    dayBag: "Tagesrucksack-Checkliste",
    groceries: "Einkaufsplaner",
    foodPlan: "Essensstrategie",
    emergency: "Notfall-Basics",
    smartPick: "Gute Wahl",
    selected: "ausgewählt",
    remaining: "übrig",
    expectedTripBudget: "Erwartetes Reisebudget ohne Hotel/Zugtickets",
    cookNote:
      "Essensplanung kommt aus dem aktiven Zielort-Paket und den Reisepräferenzen. Öffnungszeiten und Verkehr am Tag prüfen.",
    imageNote:
      "Bilder sind lokale KI-generierte filmische Planungsbilder, keine offiziellen Fotos.",
    guestWants: "Gast möchte",
    navoRecommends: "Navo empfiehlt",
    applyRecommendation: "Empfehlung nutzen",
  },
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
const tierLabel = { $: "€", $$: "€€", $$$: "€€€" };

const activities = [
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
    tipDe: "Am besten für das ältere Kind, wenn es Maschinen oder Design mag.",
    missionEn: [
      "Find the strangest moving machine.",
      "Describe one object in three words.",
    ],
    missionDe: [
      "Finde die seltsamste bewegliche Maschine.",
      "Beschreibe ein Objekt in drei Wörtern.",
    ],
    images: [activityImg("tinguely-01.webp"), activityImg("tinguely-02.webp")],
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
    missionDe: ["Finde den größten Baum.", "Erfinde ein 10-Minuten-Parkspiel."],
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
    missionDe: ["Sucht euch eine Picknickbank.", "Macht ein 5-Minuten-Rennen."],
    images: [
      activityImg("schuetzenmatt-01.webp"),
      activityImg("schuetzenmatt-02.webp"),
    ],
    official: "https://www.google.com/maps/search/Sch%C3%BCtzenmattpark+Basel",
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
    missionEn: ["Pack the swim kit yourself.", "Choose one quiet water break."],
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
      "Hochwertiges Kunstmuseum in Riehen. Starke Indoor-Empfehlung bei Hitze, Regen, Kälte oder für einen ruhigeren Erwachsenen-/älteres-Kind-Block.",
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
    tipEn: "Best as a one-hour reset near the old town, not a full-day anchor.",
    tipDe:
      "Am besten als einstündige Pause nahe Altstadt, nicht als Ganztagesanker.",
    missionEn: ["Find the smallest object.", "Choose the funniest toy face."],
    missionDe: [
      "Finde das kleinste Objekt.",
      "Wähle das lustigste Spielzeuggesicht.",
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
    tipDe: "Als Lückenfüller nahe Altstadt/Rhein nutzen, nicht als Hauptstopp.",
    missionEn: [
      "Find one strange old medicine jar.",
      "Guess what one tool was used for.",
    ],
    missionDe: [
      "Finde ein seltsames altes Medizinglas.",
      "Rate, wofür ein Werkzeug benutzt wurde.",
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
    missionEn: ["Find a quiet bench.", "Watch one boat or bird on the Rhine."],
    missionDe: [
      "Finde eine ruhige Bank.",
      "Beobachte ein Boot oder einen Vogel am Rhein.",
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
    tipEn: "Use as a nearby soft landing, not as a standalone cross-town trip.",
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
];

const specialPlans = {
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
};

const groceryCards = [
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
];

const defaultChecklist = [
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
];

const dayTemplates = [
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
];

const trainJourney = {
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
};

const tripDates = [
  "2026-07-13",
  "2026-07-14",
  "2026-07-15",
  "2026-07-16",
  "2026-07-17",
];
const baselCoords = { latitude: 47.5596, longitude: 7.5886, name: "Basel" };
const zurichCoords = { latitude: 47.3769, longitude: 8.5417, name: "Zürich" };

const baselDestinationPack = {
  id: "basel",
  name: "Basel",
  country: "Switzerland",
  timezone: "Europe/Zurich",
  baseLocation: BASE_LOCATION,
  tripDates,
  defaultSelectedDay: "Tue 14",
  defaultWeatherLocation: "basel",
  primaryWeatherLocation: "basel",
  weatherLocations: {
    basel: baselCoords,
    zurich: zurichCoords,
  },
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
  trainJourney,
  activities,
  types,
  typeLabels: { de: typeDe },
  specialPlans,
  groceryCards,
  defaultChecklist,
  dayTemplates,
  overview: {
    src: "/images/overview/11-bonus-basel-activity-overview-collage.png",
    alt: "Basel activity overview collage",
    en: "Overview image for planning inspiration.",
    de: "Übersichtsbild zur Planungsinspiration.",
  },
};

function fieldName(label) {
  return (
    String(label)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "field"
  );
}

const routeMeta = {
  zoo: {
    zone: 5,
    minutes: 210,
    family: 96,
    indoor: false,
    outdoor: true,
    route: 5,
    calm: 6,
  },
  rhine: {
    zone: 2,
    minutes: 105,
    family: 88,
    indoor: false,
    outdoor: true,
    route: 2,
    calm: 2,
  },
  paper: {
    zone: 3,
    minutes: 140,
    family: 86,
    indoor: true,
    outdoor: false,
    route: 3,
    calm: 3,
  },
  augusta: {
    zone: 8,
    minutes: 180,
    family: 80,
    indoor: false,
    outdoor: true,
    route: 8,
    calm: 8,
  },
  stlouis: {
    zone: 9,
    minutes: 150,
    family: 72,
    indoor: false,
    outdoor: true,
    route: 9,
    calm: 9,
  },
  aquabasilea: {
    zone: 8,
    minutes: 180,
    family: 95,
    indoor: true,
    outdoor: true,
    route: 8,
    calm: 10,
  },
  lange: {
    zone: 4,
    minutes: 130,
    family: 91,
    indoor: false,
    outdoor: true,
    route: 4,
    calm: 1,
  },
  natural: {
    zone: 2,
    minutes: 120,
    family: 78,
    indoor: true,
    outdoor: false,
    route: 2,
    calm: 4,
  },
  markthalle: {
    zone: 1,
    minutes: 75,
    family: 82,
    indoor: true,
    outdoor: false,
    route: 1,
    calm: 2,
  },
  kannenfeld: {
    zone: 6,
    minutes: 100,
    family: 90,
    indoor: false,
    outdoor: true,
    route: 6,
    calm: 1,
  },
  schuetzenmatt: {
    zone: 6,
    minutes: 90,
    family: 84,
    indoor: false,
    outdoor: true,
    route: 6,
    calm: 1,
  },
  merian: {
    zone: 7,
    minutes: 170,
    family: 87,
    indoor: false,
    outdoor: true,
    route: 7,
    calm: 5,
  },
  birskopfli: {
    zone: 7,
    minutes: 100,
    family: 78,
    indoor: false,
    outdoor: true,
    route: 7,
    calm: 5,
  },
  "naturbad-riehen": {
    zone: 4,
    minutes: 180,
    family: 88,
    indoor: false,
    outdoor: true,
    route: 4,
    calm: 5,
  },
  beyeler: {
    zone: 4,
    minutes: 150,
    family: 74,
    indoor: true,
    outdoor: false,
    route: 4,
    calm: 5,
  },
  kunstmuseum: {
    zone: 2,
    minutes: 135,
    family: 72,
    indoor: true,
    outdoor: false,
    route: 2,
    calm: 3,
  },
  "toy-worlds": {
    zone: 2,
    minutes: 80,
    family: 86,
    indoor: true,
    outdoor: false,
    route: 2,
    calm: 2,
  },
  "pharmacy-museum": {
    zone: 2,
    minutes: 70,
    family: 68,
    indoor: true,
    outdoor: false,
    route: 2,
    calm: 2,
  },
  "botanical-garden": {
    zone: 3,
    minutes: 75,
    family: 82,
    indoor: true,
    outdoor: true,
    route: 3,
    calm: 2,
  },
  "solitude-park": {
    zone: 3,
    minutes: 70,
    family: 78,
    indoor: false,
    outdoor: true,
    route: 3,
    calm: 2,
  },
  "st-johanns-park": {
    zone: 5,
    minutes: 85,
    family: 84,
    indoor: false,
    outdoor: true,
    route: 5,
    calm: 2,
  },
  erlenmattpark: {
    zone: 1,
    minutes: 70,
    family: 84,
    indoor: false,
    outdoor: true,
    route: 1,
    calm: 1,
  },
  margarethenpark: {
    zone: 6,
    minutes: 85,
    family: 82,
    indoor: false,
    outdoor: true,
    route: 6,
    calm: 3,
  },
  sarasinpark: {
    zone: 4,
    minutes: 65,
    family: 78,
    indoor: false,
    outdoor: true,
    route: 4,
    calm: 2,
  },
  "spalentor-oldtown": {
    zone: 2,
    minutes: 70,
    family: 78,
    indoor: false,
    outdoor: true,
    route: 2,
    calm: 2,
  },
  zurich: {
    zone: 12,
    minutes: 390,
    family: 66,
    indoor: true,
    outdoor: true,
    route: 12,
    calm: 12,
  },
};

const guestIntentOptions = {
  outdoor: { en: "Outdoor places", de: "Outdoor-Orte" },
  parks: { en: "Parks and playgrounds", de: "Parks und Spielplätze" },
  indoor: { en: "Indoor / weather-safe", de: "Indoor / wettersicher" },
  museums: { en: "Museums and learning", de: "Museen und Lernen" },
  water: { en: "Water and swimming", de: "Wasser und Baden" },
  budget: { en: "Low-cost day", de: "Günstiger Tag" },
  balanced: { en: "Balanced family day", de: "Ausgewogener Familientag" },
};

function preferenceMatch(activity, intent) {
  const meta = metaFor(activity);
  if (intent === "outdoor") return meta.outdoor;
  if (intent === "parks")
    return activity.type === "Park" || activity.type === "Lake/Water";
  if (intent === "indoor") return meta.indoor;
  if (intent === "museums")
    return activity.type === "Museum" || activity.type === "History";
  if (intent === "water")
    return activity.type === "Water" || activity.type === "Lake/Water";
  if (intent === "budget") return activity.cost <= 15;
  return true;
}

function buildPreferenceRecommendation(
  activities,
  { intent, weather, energy, budget, lang },
) {
  const weatherRisk =
    weather === "hot" || weather === "rainy" || weather === "cold";
  const intentConflicts =
    weatherRisk && ["outdoor", "parks", "water"].includes(intent);
  const scored = activities
    .map((activity) => {
      const meta = metaFor(activity);
      let score = meta.family / 2;
      const preferred = preferenceMatch(activity, intent);
      if (preferred) score += 24;
      if (activity.energy.includes(energy) || energy === "medium") score += 12;
      if (eur(activity.cost) <= budget / 2) score += 8;
      if (weather === "rainy") score += meta.indoor ? 28 : -18;
      if (weather === "cold") score += meta.indoor ? 24 : -12;
      if (weather === "hot")
        score += meta.indoor ? 18 : activity.type === "Lake/Water" ? 14 : -8;
      if (weather === "normal" && activity.weather.includes("normal"))
        score += 10;
      if (activity.cost >= 120) score -= 10;
      return { activity, score, preferred };
    })
    .sort((a, b) => b.score - a.score);

  const recommended = scored.slice(0, 5).map((item) => item.activity);
  const guestMatches = scored
    .filter((item) => item.preferred)
    .slice(0, 4)
    .map((item) => item.activity);
  const text = {
    en: {
      conflict:
        weather === "hot"
          ? "Guest preference leans outdoors, but the weather is hot. Navo shifts toward indoor, shaded, water, or short outdoor blocks."
          : weather === "rainy"
            ? "Guest preference leans outdoors, but rain risk is active. Navo prioritizes indoor anchors and keeps parks as optional buffers."
            : weather === "cold"
              ? "Guest preference leans outdoors, but cold weather favors shorter walks and indoor anchors."
              : "Navo balances the guest preference with family pacing.",
      aligned:
        "Guest preference and weather are aligned. Navo recommends the best-fit sequence.",
    },
    de: {
      conflict:
        weather === "hot"
          ? "Der Gast möchte eher draußen sein, aber es ist heiß. Navo verschiebt zu Indoor, Schatten, Wasser oder kurzen Outdoor-Blöcken."
          : weather === "rainy"
            ? "Der Gast möchte eher draußen sein, aber Regen ist aktiv. Navo priorisiert Indoor-Anker und hält Parks optional."
            : weather === "cold"
              ? "Der Gast möchte eher draußen sein, aber Kälte spricht für kürzere Wege und Indoor-Anker."
              : "Navo balanciert Gastwunsch und Familientempo.",
      aligned:
        "Gastwunsch und Wetter passen zusammen. Navo empfiehlt die beste passende Reihenfolge.",
    },
  }[lang];
  return {
    recommended,
    guestMatches,
    conflict: intentConflicts,
    message: intentConflicts ? text.conflict : text.aligned,
  };
}

const planVariantLabels = {
  en: {
    best: "Best Flow",
    family: "Family Calm",
    fast: "Fast Track",
    rain: "Rain Backup",
    discovery: "Discovery",
    reflowTitle: "Reflow the day",
    dropTitle: "Drop ideas",
    routeTitle: "Smart route order",
    scoreTitle: "Day Score",
  },
  de: {
    best: "Beste Route",
    family: "Familienruhig",
    fast: "Schnellroute",
    rain: "Regenplan",
    discovery: "Entdecken",
    reflowTitle: "Tag neu ordnen",
    dropTitle: "Ideen einwerfen",
    routeTitle: "Smarte Reihenfolge",
    scoreTitle: "Tages-Score",
  },
};

function metaFor(a) {
  return (
    routeMeta[a.id] || {
      zone: 99,
      minutes: 120,
      family: 70,
      indoor: false,
      outdoor: true,
      route: 99,
      calm: 99,
    }
  );
}

function routeUrlForStops(stops) {
  const origin = `${BASE_LOCATION.label}, ${BASE_LOCATION.address}`;
  if (!stops.length) return route(origin);
  const destination =
    stops[stops.length - 1].mapQuery ||
    stops[stops.length - 1].en ||
    stops[stops.length - 1].de;
  const waypoints = stops
    .slice(0, -1)
    .map((s) => s.mapQuery || s.en || s.de)
    .join("|");
  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
    travelmode: "transit",
  });
  if (waypoints) params.set("waypoints", waypoints);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function estimateSegmentMinutes(from, to) {
  const fromMeta =
    from?.id === "base" ? { zone: 2, minutes: 0 } : metaFor(from);
  const toMeta = metaFor(to);
  const zoneDelta = Math.abs((toMeta.zone || 2) - (fromMeta.zone || 2));
  const activitySpread = Math.abs(
    (toMeta.route || toMeta.zone || 2) - (fromMeta.route || fromMeta.zone || 2),
  );
  return Math.max(
    8,
    Math.min(55, Math.round(10 + zoneDelta * 4 + activitySpread * 2)),
  );
}

function buildRouteAwarePlan(
  items,
  {
    variant = "best",
    weather = "normal",
    energy = "medium",
    budget = 120,
    lang = "en",
  } = {},
) {
  const ordered = [...items].sort((a, b) => {
    const ma = metaFor(a);
    const mb = metaFor(b);
    if (variant === "family")
      return ma.calm - mb.calm || mb.family - ma.family || ma.zone - mb.zone;
    if (variant === "fast") return ma.minutes - mb.minutes || ma.zone - mb.zone;
    if (variant === "rain")
      return Number(mb.indoor) - Number(ma.indoor) || ma.route - mb.route;
    if (variant === "discovery") return a.cost - b.cost || ma.route - mb.route;
    return ma.route - mb.route || ma.zone - mb.zone;
  });

  const cost = items.reduce((sum, a) => sum + a.cost, 0);
  const minutes =
    ordered.reduce((sum, a) => sum + metaFor(a).minutes, 0) +
    Math.max(0, ordered.length - 1) * 18;
  const variety = new Set(ordered.map((a) => a.type)).size;
  const weatherFit = ordered.filter(
    (a) => a.weather.includes(weather) || a.weather.includes("normal"),
  ).length;
  const energyFit = ordered.filter(
    (a) => a.energy.includes(energy) || energy === "medium",
  ).length;
  const routeJumps = ordered
    .slice(1)
    .reduce(
      (sum, a, idx) =>
        sum + Math.abs(metaFor(a).zone - metaFor(ordered[idx]).zone),
      0,
    );
  const budgetPressure = budget ? Math.max(0, eur(cost) - budget) : 0;
  const score = Math.max(
    35,
    Math.min(
      98,
      58 +
        Math.min(12, ordered.length * 3) +
        Math.min(10, variety * 2) +
        weatherFit * 5 +
        energyFit * 4 -
        Math.min(18, routeJumps * 1.4) -
        Math.min(15, budgetPressure / 8),
    ),
  );

  const reasons = [];
  if (!ordered.length) {
    reasons.push(
      lang === "en"
        ? "Add 3–7 places to generate a route-aware day."
        : "Füge 3–7 Orte hinzu, um einen routenbewussten Tagesplan zu erzeugen.",
    );
  } else {
    reasons.push(
      lang === "en"
        ? "Stops are ordered to reduce backtracking from your Basel base."
        : "Stopps werden so geordnet, dass unnötiges Hin und Her ab der Basler Basis reduziert wird.",
    );
    reasons.push(
      lang === "en"
        ? `The plan balances ${variety} activity type${variety === 1 ? "" : "s"} with estimated pacing.`
        : `Der Plan kombiniert ${variety} Aktivitätstyp${variety === 1 ? "" : "en"} mit realistischerem Tempo.`,
    );
    if (variant === "family")
      reasons.push(
        lang === "en"
          ? "Family Calm prioritizes kid-friendly resets, parks, and lower-stress sequencing."
          : "Familienruhig priorisiert kindgerechte Pausen, Parks und stressärmere Reihenfolge.",
      );
    if (variant === "rain" || weather === "rainy")
      reasons.push(
        lang === "en"
          ? "Rain-aware planning moves indoor options earlier and keeps outdoor walking flexible."
          : "Regenplanung zieht Indoor-Optionen vor und hält Outdoor-Wege flexibel.",
      );
    if (variant === "fast")
      reasons.push(
        lang === "en"
          ? "Fast Track favors shorter activity blocks and compact movement."
          : "Schnellroute bevorzugt kürzere Blöcke und kompakte Bewegung.",
      );
    if (ordered.length > 6)
      reasons.push(
        lang === "en"
          ? "This is a full day. Consider removing one stop if kids get tired."
          : "Das ist ein voller Tag. Streiche einen Stopp, wenn die Kinder müde werden.",
      );
  }

  const warnings = [];
  if (eur(cost) > budget)
    warnings.push(
      lang === "en"
        ? "Selected activities may push the day over budget."
        : "Die ausgewählten Aktivitäten können das Tagesbudget überschreiten.",
    );
  if (minutes > 480)
    warnings.push(
      lang === "en"
        ? "This route may be too long for a relaxed family day."
        : "Diese Route kann für einen entspannten Familientag zu lang sein.",
    );
  if (routeJumps > 12)
    warnings.push(
      lang === "en"
        ? "There is still some city-crossing. Use Reflow or remove a far stop."
        : "Es gibt noch etwas Stadtquerung. Nutze Reflow oder entferne einen entfernten Stopp.",
    );
  if (ordered.length > 7)
    warnings.push(
      lang === "en"
        ? "Navo can map this, but the day is overloaded. Split it into a headline route and backups."
        : "Navo kann das darstellen, aber der Tag ist überladen. Teile ihn in Hauptroute und Backups.",
    );

  const routeSteps = ordered.map((activity, index) => ({
    activity,
    index: index + 1,
    transferMinutes: estimateSegmentMinutes(
      index === 0 ? { id: "base" } : ordered[index - 1],
      activity,
    ),
  }));

  return {
    ordered,
    routeSteps,
    cost,
    minutes,
    score: Math.round(score),
    reasons,
    warnings,
    routeJumps,
    mapUrl: routeUrlForStops(ordered),
  };
}

function App() {
  const destination = baselDestinationPack;
  const destinationCopy = destination.hero;
  const destinationFood = destination.foodStrategy;
  const storageKey = (name) => `navo-${destination.id}-${name}`;
  const [lang, setLang] = useStoredState(storageKey("lang"), "en");
  const [favorites, setFavorites] = useStoredState(
    storageKey("favorites-v1"),
    [],
  );
  const [expanded, setExpanded] = useState(null);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [weather, setWeather] = useStoredState(
    storageKey("weather-v1"),
    "normal",
  );
  const [energy, setEnergy] = useStoredState(storageKey("energy-v1"), "medium");
  const [todayBudget, setTodayBudget] = useStoredState(
    storageKey("today-budget-v1"),
    120,
  );
  const [selectedDay, setSelectedDay] = useStoredState(
    storageKey("selected-day-v1"),
    destination.defaultSelectedDay,
  );
  const [plan, setPlan] = useStoredState(storageKey("custom-plan-v1"), {});
  const [checked, setChecked] = useStoredState(storageKey("checklist-v1"), []);
  const [activeTab, setActiveTab] = useState("today");
  const [toast, setToast] = useState(null);
  const [weatherLocation, setWeatherLocation] = useStoredState(
    storageKey("weather-location-v1"),
    destination.defaultWeatherLocation,
  );
  const [planVariant, setPlanVariant] = useStoredState(
    storageKey("route-variant-v1"),
    "best",
  );
  const [droppedIdeas, setDroppedIdeas] = useStoredState(
    storageKey("dropped-ideas-v1"),
    "",
  );
  const [guestIntent, setGuestIntent] = useStoredState(
    storageKey("guest-intent-v1"),
    "outdoor",
  );
  const [reflowNote, setReflowNote] = useState(null);
  const activeWeatherLocation =
    destination.weatherLocations[weatherLocation] ||
    destination.weatherLocations[destination.primaryWeatherLocation];
  const liveWeather = useTripWeather(
    activeWeatherLocation,
    destination.timezone,
  );
  const tripWeatherDays = liveWeather.days.filter((d) =>
    destination.tripDates.includes(d.date),
  );
  const c = copy[lang];
  const packCopy = destinationCopy[lang];
  const foodCopy = destinationFood[lang];

  const suggested = useMemo(
    () =>
      destination.activities
        .filter(
          (a) =>
            (a.weather.includes(weather) || a.weather.includes("normal")) &&
            (a.energy.includes(energy) || energy === "medium"),
        )
        .slice(0, 4),
    [destination.activities, weather, energy],
  );

  const filtered = destination.activities.filter((a) => {
    const text = `${a.en} ${a.de} ${a.area} ${a.type}`.toLowerCase();
    return (
      (type === "All" || a.type === type) && text.includes(q.toLowerCase())
    );
  });

  const customIds = plan[selectedDay] || [];
  const customActivities = customIds
    .map((id) => destination.activities.find((a) => a.id === id))
    .filter(Boolean);
  const customCost = customActivities.reduce((s, a) => s + a.cost, 0);
  const foodLunch = destination.dailyCosts.lunchChf;
  const snackBuffer = destination.dailyCosts.snackBufferChf;
  const todayTotal = customCost + foodLunch + snackBuffer;
  const remaining = todayBudget - eur(todayTotal);
  const tripBudget = destination.tripBudget;
  const routeAwarePlan = useMemo(
    () =>
      buildRouteAwarePlan(customActivities, {
        variant: planVariant,
        weather,
        energy,
        budget: todayBudget,
        lang,
      }),
    [customActivities, planVariant, weather, energy, todayBudget, lang],
  );
  const preferenceRecommendation = useMemo(
    () =>
      buildPreferenceRecommendation(destination.activities, {
        intent: guestIntent,
        weather,
        energy,
        budget: todayBudget,
        lang,
      }),
    [destination.activities, guestIntent, weather, energy, todayBudget, lang],
  );

  const toggleFav = (id) =>
    setFavorites(
      favorites.includes(id)
        ? favorites.filter((x) => x !== id)
        : [...favorites, id],
    );
  const addToDay = (id) => {
    const activity = destination.activities.find((a) => a.id === id);
    const current = plan[selectedDay] || [];
    const exists = current.includes(id);
    if (!exists) {
      setPlan({ ...plan, [selectedDay]: [...current, id] });
    }
    const title = activity ? (lang === "en" ? activity.en : activity.de) : id;
    setToast(
      exists
        ? `${title} · ${c.alreadyAdded} ${selectedDay}`
        : `${title} · ${c.addedTo} ${selectedDay}`,
    );
    window.clearTimeout(addToDay._timer);
    addToDay._timer = window.setTimeout(() => setToast(null), 1800);
  };
  const removeFromDay = (id) =>
    setPlan({
      ...plan,
      [selectedDay]: (plan[selectedDay] || []).filter((x) => x !== id),
    });
  const applyRecommendation = () =>
    setPlan({
      ...plan,
      [selectedDay]: preferenceRecommendation.recommended.map((a) => a.id),
    });
  const toggleCheck = (idx) =>
    setChecked(
      checked.includes(idx)
        ? checked.filter((i) => i !== idx)
        : [...checked, idx],
    );

  return (
    <main>
      <section className="hero">
        <div className="topbar">
          <div className="brand-lockup">
            <img src="/brand/navo-mark.svg" alt="" aria-hidden="true" />
            <span>{APP_NAME}</span>
          </div>
          <span className="pill">
            <Home size={15} /> {c.base}: {destination.baseLocation.label} ·{" "}
            {destination.baseLocation.address}
          </span>
          <button
            className="ghost"
            onClick={() => setLang(lang === "en" ? "de" : "en")}
          >
            <Languages size={17} /> {c.language}
          </button>
        </div>
        <h1>{c.title}</h1>
        <p className="tagline">
          <span>Explore.</span> <span>Together.</span> <strong>Simply.</strong>
        </p>
        <p>{packCopy.subtitle || c.subtitle}</p>
        <NavoCapabilityStrip lang={lang} />
        <div className="hero-grid">
          <Metric
            icon={<CalendarDays />}
            label={packCopy.dateLabel}
            value={packCopy.dateValue}
          />
          <Metric
            icon={<TrainFront />}
            label={packCopy.journeyLabel}
            value={packCopy.journeyValue}
          />
          <Metric
            icon={<PiggyBank />}
            label={c.budget}
            value={`€${eur(tripBudget.minChf)}–${eur(tripBudget.maxChf)}`}
          />
        </div>
        <TransportStrip lang={lang} />
        {destination.trainJourney && (
          <TrainJourneyPanel lang={lang} journey={destination.trainJourney} />
        )}
      </section>

      <nav className="tabs" aria-label="Planner sections">
        {[
          ["today", c.today, <CloudSun />],
          ["activities", c.activities, <SlidersHorizontal />],
          ["food", c.food, <Utensils />],
          ["checklist", c.checklist, <CheckCircle2 />],
          ["safety", c.safety, <ShieldCheck />],
          ["itinerary", c.itinerary, <CalendarDays />],
        ].map(([id, label, icon]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={activeTab === id ? "active" : ""}
          >
            {React.cloneElement(icon, { size: 15 })}
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {activeTab === "today" && (
        <section className="section">
          <Header
            icon={<CloudSun />}
            title={c.today}
            subtitle={foodCopy.note || c.cookNote}
          />
          <WeatherPanel
            lang={lang}
            destination={destination}
            locationId={weatherLocation}
            setLocationId={setWeatherLocation}
            weather={liveWeather}
            tripDays={tripWeatherDays}
            setMood={setWeather}
          />
          <div className="control-grid">
            <Select
              label={c.weather}
              value={weather}
              setValue={setWeather}
              options={[
                ["normal", c.normal],
                ["rainy", c.rainy],
                ["hot", c.hot],
                ["cold", c.cold],
              ]}
            />
            <Select
              label={c.energy}
              value={energy}
              setValue={setEnergy}
              options={[
                ["low", c.low],
                ["medium", c.medium],
                ["high", c.high],
              ]}
            />
            <label className="control" htmlFor="today-budget">
              <span>
                {c.budgetToday}: €{todayBudget}
              </span>
              <input
                id="today-budget"
                name="today-budget"
                type="range"
                min="60"
                max="220"
                step="10"
                value={todayBudget}
                onChange={(e) => setTodayBudget(Number(e.target.value))}
              />
            </label>
            <Select
              label="Day"
              value={selectedDay}
              setValue={setSelectedDay}
              options={destination.dayTemplates.map((d) => [
                d.day,
                lang === "en"
                  ? `${d.day} · ${d.titleEn}`
                  : `${d.de} · ${d.titleDe}`,
              ])}
            />
          </div>

          <PreferenceRecommendationPanel
            lang={lang}
            c={c}
            intent={guestIntent}
            setIntent={setGuestIntent}
            weather={weather}
            recommendation={preferenceRecommendation}
            onApply={applyRecommendation}
            addToDay={addToDay}
          />

          <div className="smart-panel">
            <div>
              <h3>
                <Star size={18} /> {c.smartPick}
              </h3>
              <p>
                {lang === "en"
                  ? `Based on ${destination.name} weather, traveler energy, budget, and active trip preferences.`
                  : `Basierend auf ${destination.name}-Wetter, Reiseenergie, Budget und aktiven Reisepräferenzen.`}
              </p>
            </div>
            <div className="chip-row">
              {suggested.map((a) => (
                <button
                  className="chip"
                  key={a.id}
                  onClick={() => addToDay(a.id)}
                >
                  <Plus size={14} /> {lang === "en" ? a.en : a.de}
                </button>
              ))}
            </div>
          </div>

          <div className="budget-card">
            <h3>
              <Euro size={18} /> {c.buildToday}
            </h3>
            <div className="day-items">
              {customActivities.length === 0 && (
                <p className="muted">
                  {lang === "en"
                    ? "Add activities to build a realistic day."
                    : "Füge Aktivitäten hinzu, um einen realistischen Tag zu bauen."}
                </p>
              )}
              {customActivities.map((a) => (
                <div className="day-line" key={a.id}>
                  <span>{lang === "en" ? a.en : a.de}</span>
                  <strong>
                    CHF {a.cost} / €{eur(a.cost)}
                  </strong>
                  <button onClick={() => removeFromDay(a.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <div className="day-line soft">
                <span>
                  {lang === "en"
                    ? "Lunch outside estimate"
                    : "Mittagessen draußen geschätzt"}
                </span>
                <strong>
                  CHF {foodLunch} / €{eur(foodLunch)}
                </strong>
              </div>
              <div className="day-line soft">
                <span>
                  {lang === "en"
                    ? "Snacks / water buffer"
                    : "Snacks / Wasser-Puffer"}
                </span>
                <strong>
                  CHF {snackBuffer} / €{eur(snackBuffer)}
                </strong>
              </div>
            </div>
            {customIds
              .filter((id) => destination.specialPlans[id]?.[lang])
              .map((id) => (
                <SpecialPlan
                  key={id}
                  plan={destination.specialPlans[id][lang]}
                />
              ))}
            <div className={`remaining ${remaining < 0 ? "over" : ""}`}>
              <span>
                {c.selected}: €{eur(todayTotal)}
              </span>
              <strong>
                {c.remaining}: €{remaining}
              </strong>
            </div>

            <RouteAwareDayPanel
              lang={lang}
              c={c}
              variant={planVariant}
              setVariant={setPlanVariant}
              plan={routeAwarePlan}
              droppedIdeas={droppedIdeas}
              setDroppedIdeas={setDroppedIdeas}
              reflowNote={reflowNote}
              onReflow={(action) => {
                const nextVariant =
                  action === "rain"
                    ? "rain"
                    : action === "tired"
                      ? "family"
                      : action === "late"
                        ? "fast"
                        : planVariant;
                setPlanVariant(nextVariant);
                setReflowNote(action);
              }}
            />
          </div>
        </section>
      )}

      {activeTab === "activities" && (
        <section className="section">
          <Header
            icon={<SlidersHorizontal />}
            title={c.activities}
            subtitle={c.imageNote}
          />
          <div className="add-target-panel">
            <label htmlFor="activity-target-day">
              {c.chooseDay}
              <select
                id="activity-target-day"
                name="activity-target-day"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {destination.dayTemplates.map((d) => (
                  <option key={d.day} value={d.day}>
                    {lang === "en"
                      ? `${d.day} · ${d.titleEn}`
                      : `${d.de} · ${d.titleDe}`}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={() => setActiveTab("today")}>
              <CalendarDays size={16} /> {c.viewDay}
            </button>
          </div>
          <div className="searchbar">
            <Search size={18} />
            <input
              id="activity-search"
              name="activity-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={c.search}
              aria-label={c.search}
            />
          </div>
          <div className="chip-row sticky-chips">
            <button
              className={type === "All" ? "chip on" : "chip"}
              onClick={() => setType("All")}
            >
              {c.all}
            </button>
            {destination.types.map((t) => (
              <button
                key={t}
                className={type === t ? "chip on" : "chip"}
                onClick={() => setType(t)}
              >
                {lang === "en" ? t : destination.typeLabels.de[t]}
              </button>
            ))}
          </div>
          <p className="count">
            {filtered.length} {lang === "en" ? "places found" : "Orte gefunden"}
          </p>
          <div className="card-grid">
            {filtered.map((a) => (
              <ActivityCard
                key={a.id}
                a={a}
                lang={lang}
                c={c}
                expanded={expanded === a.id}
                setExpanded={setExpanded}
                favorite={favorites.includes(a.id)}
                toggleFav={toggleFav}
                addToDay={addToDay}
                specialPlans={destination.specialPlans}
                selectedDay={selectedDay}
                inDay={(plan[selectedDay] || []).includes(a.id)}
              />
            ))}
          </div>
        </section>
      )}

      {activeTab === "food" && (
        <section className="section">
          <Header
            icon={<Utensils />}
            title={c.foodPlan}
            subtitle={foodCopy.note || c.cookNote}
          />
          <div className="food-grid">
            {foodCopy.cards.map(([title, text]) => (
              <InfoCard key={title} title={title} text={text} />
            ))}
          </div>
          <Header
            icon={<ShoppingBasket />}
            title={c.groceries}
            subtitle={
              lang === "en"
                ? "Map links from the apartment. Verify opening hours on the day."
                : "Maps-Links ab Apartment. Öffnungszeiten am Tag prüfen."
            }
          />
          <div className="grocery-grid">
            {destination.groceryCards.map((g, i) => (
              <a
                key={i}
                className="grocery-card"
                href={g[5]}
                target="_blank"
                rel="noreferrer"
              >
                <ShoppingBasket size={20} />
                <div>
                  <h3>{lang === "en" ? g[0] : g[1]}</h3>
                  <p>{lang === "en" ? g[2] : g[3]}</p>
                  <strong>{g[4]}</strong>
                </div>
                <ExternalLink size={16} />
              </a>
            ))}
          </div>
        </section>
      )}

      {activeTab === "checklist" && (
        <section className="section">
          <Header
            icon={<CheckCircle2 />}
            title={c.dayBag}
            subtitle={
              lang === "en"
                ? "Reusable daily checklist saved on this device."
                : "Wiederverwendbare Tagescheckliste, auf diesem Gerät gespeichert."
            }
          />
          <div className="checklist">
            {destination.defaultChecklist.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                className={checked.includes(i) ? "checked" : ""}
              >
                <CheckCircle2 size={18} />
                <span>{lang === "en" ? item[0] : item[1]}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {activeTab === "safety" && (
        <section className="section">
          <Header
            icon={<ShieldCheck />}
            title={c.emergency}
            subtitle={
              lang === "en"
                ? "Not exciting, but valuable when travelling with kids."
                : "Nicht spannend, aber wertvoll mit Kindern."
            }
          />
          <div className="safety-grid">
            <InfoCard
              title={lang === "en" ? "Trip base" : "Reisebasis"}
              text={`${destination.baseLocation.label}, ${destination.baseLocation.address}`}
              link={maps(destination.baseLocation.mapQuery)}
            />
            <InfoCard
              title={lang === "en" ? "Emergency numbers" : "Notrufnummern"}
              text="112 emergency · 117 police · 144 ambulance · 118 fire"
            />
            <InfoCard
              title={
                lang === "en"
                  ? "Family safety habit"
                  : "Familien-Sicherheitsregel"
              }
              text={
                lang === "en"
                  ? "Take a photo of the kids each morning. Agree on a meeting point: hotel lobby or nearest tram stop."
                  : "Morgens ein Foto der Kinder machen. Treffpunkt vereinbaren: Hotellobby oder nächste Tramhaltestelle."
              }
            />
            <InfoCard
              title={lang === "en" ? "Lost-child card" : "Kinder-Notfallkarte"}
              text={
                lang === "en"
                  ? "Put hotel address and parent phone number in the older child’s pocket/backpack."
                  : "Hoteladresse und Telefonnummer in Tasche/Rucksack des älteren Kindes legen."
              }
            />
          </div>
        </section>
      )}

      {activeTab === "itinerary" && (
        <section className="section">
          <Header
            icon={<CalendarDays />}
            title={c.itinerary}
            subtitle={
              lang === "en"
                ? "Suggested rhythm. Adjust each day based on energy and weather."
                : "Vorgeschlagener Rhythmus. Jeden Tag nach Energie und Wetter anpassen."
            }
          />
          <div className="timeline">
            {destination.dayTemplates.map((d) => (
              <div className="timeline-card" key={d.day}>
                <div className="date">{lang === "en" ? d.day : d.de}</div>
                <div>
                  <h3>{lang === "en" ? d.titleEn : d.titleDe}</h3>
                  {(d.noteEn || d.noteDe) && (
                    <p className="timeline-note">
                      {lang === "en" ? d.noteEn : d.noteDe}
                    </p>
                  )}
                  <div className="mini-list">
                    {d.items
                      .map((id) =>
                        destination.activities.find((a) => a.id === id),
                      )
                      .filter(Boolean)
                      .map((a) => (
                        <span key={a.id}>{lang === "en" ? a.en : a.de}</span>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {destination.overview && (
            <div className="overview">
              <img
                src={destination.overview.src}
                alt={destination.overview.alt}
              />
              <p>{destination.overview[lang]}</p>
            </div>
          )}
        </section>
      )}

      <section className="section compact">
        <Header
          icon={<PiggyBank />}
          title={c.expectedTripBudget}
          subtitle={foodCopy.note || c.cookNote}
        />
        <div className="budget-grid">
          {destination.tripBudget.categories.map((item) => (
            <BudgetLine
              key={item.id}
              label={lang === "en" ? item.en : item.de}
              chf={item.chf}
              strong={item.strong}
            />
          ))}
        </div>
      </section>
      {toast && (
        <div className="toast">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}
    </main>
  );
}

function TrainJourneyPanel({ lang, journey }) {
  const cards = [journey.outbound, journey.return];
  return (
    <div className="train-panel">
      <div className="train-panel-head">
        <TrainFront size={20} />
        <div>
          <h3>{lang === "en" ? "Train journey" : "Zugreise"}</h3>
          <p>
            {lang === "en"
              ? "Your exact ICE times are now built into the trip logic."
              : "Eure genauen ICE-Zeiten sind jetzt in die Reiseplanung eingebaut."}
          </p>
        </div>
      </div>
      <div className="train-grid">
        {cards.map((j) => (
          <div className="train-card" key={j.train}>
            <span>{j.date}</span>
            <h4>{lang === "en" ? j.titleEn : j.titleDe}</h4>
            <strong>
              <TrainFront size={14} /> {j.train}
            </strong>
            <div className="train-times">
              <b>{j.departure}</b>
              <em>{j.departureTrack}</em>
              <b>{j.arrival}</b>
            </div>
            <p>{lang === "en" ? j.noteEn : j.noteDe}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransportStrip({ lang }) {
  const labels =
    lang === "en"
      ? {
          train: "Train",
          transit: "Tram/bus",
          taxi: "Taxi",
          flight: "Flight",
          car: "Car",
        }
      : {
          train: "Zug",
          transit: "Tram/Bus",
          taxi: "Taxi",
          flight: "Flug",
          car: "Auto",
        };
  const items = [
    [<TrainFront />, labels.train],
    [<BusFront />, labels.transit],
    [<CarTaxiFront />, labels.taxi],
    [<Plane />, labels.flight],
    [<CarFront />, labels.car],
  ];
  return (
    <div
      className="transport-strip"
      aria-label={lang === "en" ? "Mobility modes" : "Mobilitätsarten"}
    >
      {items.map(([icon, label]) => (
        <div className="transport-mode" key={label}>
          {React.cloneElement(icon, { size: 20 })}
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function NavoCapabilityStrip({ lang }) {
  const labels =
    lang === "en"
      ? ["Plan", "Organize", "Discover", "Enjoy", "Smart Recommendations"]
      : [
          "Planen",
          "Organisieren",
          "Entdecken",
          "Genießen",
          "Smarte Empfehlungen",
        ];
  const items = [
    [<MapPin />, labels[0], "teal"],
    [<CalendarDays />, labels[1], "blue"],
    [<SlidersHorizontal />, labels[2], "purple"],
    [<Heart />, labels[3], "orange"],
    [<Star />, labels[4], "green"],
  ];
  return (
    <div
      className="capability-strip"
      aria-label={lang === "en" ? "Navo capabilities" : "Navo Funktionen"}
    >
      {items.map(([icon, label, tone]) => (
        <div className="capability" data-tone={tone} key={label}>
          {React.cloneElement(icon, { size: 18 })}
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function PreferenceRecommendationPanel({
  lang,
  c,
  intent,
  setIntent,
  weather,
  recommendation,
  onApply,
  addToDay,
}) {
  const label = guestIntentOptions[intent]?.[lang] || intent;
  const weatherText =
    {
      en: {
        hot: "Hot day",
        rainy: "Rainy day",
        cold: "Cold day",
        normal: "Normal weather",
      },
      de: {
        hot: "Heißer Tag",
        rainy: "Regentag",
        cold: "Kalter Tag",
        normal: "Normales Wetter",
      },
    }[lang][weather] || weather;
  return (
    <div
      className={`preference-panel ${recommendation.conflict ? "conflict" : ""}`}
    >
      <div className="preference-head">
        <div>
          <span>{c.guestWants}</span>
          <h3>{label}</h3>
          <p>{recommendation.message}</p>
        </div>
        <label htmlFor="guest-intent">
          <span>{c.guestWants}</span>
          <select
            id="guest-intent"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            name="guest-intent"
          >
            {Object.entries(guestIntentOptions).map(([id, labels]) => (
              <option key={id} value={id}>
                {labels[lang]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="recommendation-status">
        <strong>{c.navoRecommends}</strong>
        <span>{weatherText}</span>
      </div>

      <div className="recommendation-grid">
        {recommendation.recommended.map((a, index) => (
          <button
            key={a.id}
            onClick={() => addToDay(a.id)}
            className="recommendation-card"
          >
            <b>{index + 1}</b>
            <div>
              <strong>{lang === "en" ? a.en : a.de}</strong>
              <span>
                {a.type} · CHF {a.cost} · {a.time}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="guest-match-row">
        <span>
          {lang === "en"
            ? "Closest to guest request"
            : "Am nächsten am Gastwunsch"}
        </span>
        <div>
          {recommendation.guestMatches.map((a) => (
            <button className="chip" key={a.id} onClick={() => addToDay(a.id)}>
              <Plus size={14} /> {lang === "en" ? a.en : a.de}
            </button>
          ))}
        </div>
      </div>

      <button className="apply-recommendation" onClick={onApply}>
        <CheckCircle2 size={16} /> {c.applyRecommendation}
      </button>
    </div>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="metric">
      {React.cloneElement(icon, { size: 20 })}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function Header({ icon, title, subtitle }) {
  return (
    <div className="header">
      {React.cloneElement(icon, { size: 22 })}
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
function Select({ label, value, setValue, options }) {
  const name = fieldName(label);
  return (
    <label className="control" htmlFor={name}>
      <span>{label}</span>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map(([v, l]) => (
          <option value={v} key={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
function BudgetLine({ label, chf, strong }) {
  const [min, max] = chf.split(/[–-]/).map((v) => Number(v.replace(/,/g, "")));
  const euroText = max ? `€${eur(min)}–${eur(max)}` : `€${eur(min)}`;
  return (
    <div className={strong ? "budget-line strong" : "budget-line"}>
      <span>{label}</span>
      <strong>
        CHF {chf.replaceAll("-", "–")} / {euroText}
      </strong>
    </div>
  );
}
function InfoCard({ title, text, link }) {
  const body = (
    <>
      <h3>{title}</h3>
      <p>{text}</p>
    </>
  );
  return link ? (
    <a className="info-card" href={link} target="_blank" rel="noreferrer">
      {body}
      <ExternalLink size={16} />
    </a>
  ) : (
    <div className="info-card">{body}</div>
  );
}

const dayFlowCoordinates = {
  zoo: [7.5776, 47.5482],
  rhine: [7.5906, 47.5576],
  paper: [7.6027, 47.5541],
  augusta: [7.7211, 47.5337],
  stlouis: [7.5622, 47.59],
  aquabasilea: [7.6933, 47.5214],
  lange: [7.6114, 47.5806],
  markthalle: [7.5894, 47.5497],
  tinguely: [7.6144, 47.5598],
  natural: [7.5901, 47.557],
  merian: [7.6152, 47.5362],
  kannenfeld: [7.5717, 47.5635],
  birskopfli: [7.6269, 47.545],
  dreilaendereck: [7.5885, 47.5894],
  "naturbad-riehen": [7.6456, 47.5829],
  schuetzenmatt: [7.5708, 47.5524],
  vitra: [7.6189, 47.601],
  beyeler: [7.6502, 47.587],
  kunstmuseum: [7.5941, 47.5545],
  "toy-worlds": [7.5892, 47.5547],
  "pharmacy-museum": [7.588, 47.5586],
  "botanical-garden": [7.5826, 47.5597],
  "solitude-park": [7.612, 47.56],
  "st-johanns-park": [7.579, 47.5708],
  erlenmattpark: [7.5995, 47.5734],
  margarethenpark: [7.5744, 47.5447],
  sarasinpark: [7.6475, 47.5847],
  "spalentor-oldtown": [7.5813, 47.5585],
  zurich: [8.5417, 47.3769],
};

const dayFlowBaseStop = {
  id: "base",
  en: BASE_LOCATION.label,
  de: BASE_LOCATION.label,
  area: BASE_LOCATION.address,
  time: "Base",
  transit: "Start / end",
  coordinates: [7.5993, 47.5614],
};

function lonLatToTilePoint([lng, lat], zoom) {
  const sin = Math.sin((lat * Math.PI) / 180);
  const scale = 256 * Math.pow(2, zoom);
  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

function getStopCoordinates(stop) {
  return (
    stop.coordinates ||
    dayFlowCoordinates[stop.id] ||
    dayFlowBaseStop.coordinates
  );
}

function buildDayFlowGeometry(stops) {
  const routeStops = stops.length
    ? [dayFlowBaseStop, ...stops, dayFlowBaseStop]
    : [dayFlowBaseStop];
  const coordStops = routeStops.map((stop) => ({
    ...stop,
    coordinates: getStopCoordinates(stop),
  }));
  const zoom = 13;
  const projected = coordStops.map((stop) => ({
    stop,
    point: lonLatToTilePoint(stop.coordinates, zoom),
  }));
  const padding = stops.length > 5 ? 88 : 62;
  const minX = Math.min(...projected.map((item) => item.point.x));
  const maxX = Math.max(...projected.map((item) => item.point.x));
  const minY = Math.min(...projected.map((item) => item.point.y));
  const maxY = Math.max(...projected.map((item) => item.point.y));
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  const viewWidth = 1000;
  const viewHeight = 640;
  const usableWidth = viewWidth - padding * 2;
  const usableHeight = viewHeight - padding * 2;
  const scale = Math.min(usableWidth / spanX, usableHeight / spanY);
  const offsetX = (viewWidth - spanX * scale) / 2;
  const offsetY = (viewHeight - spanY * scale) / 2;
  const points = projected.map(({ stop, point }, index) => ({
    stop,
    index,
    x: offsetX + (point.x - minX) * scale,
    y: offsetY + (point.y - minY) * scale,
  }));
  const centerLng =
    coordStops.reduce((sum, stop) => sum + stop.coordinates[0], 0) /
    coordStops.length;
  const centerLat =
    coordStops.reduce((sum, stop) => sum + stop.coordinates[1], 0) /
    coordStops.length;
  return {
    points,
    routePath: points
      .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
      .join(" "),
    center: [centerLng, centerLat],
    zoom,
    viewWidth,
    viewHeight,
  };
}

function tileListForCenter(center, zoom = 14) {
  const point = lonLatToTilePoint(center, zoom);
  const centerX = Math.floor(point.x / 256);
  const centerY = Math.floor(point.y / 256);
  const tiles = [];
  const radius = 2;
  const size = 100 / (radius * 2 + 1);
  for (let y = -radius; y <= radius; y += 1) {
    for (let x = -radius; x <= radius; x += 1) {
      tiles.push({
        key: `${centerX + x}-${centerY + y}`,
        src: `https://tile.openstreetmap.org/${zoom}/${centerX + x}/${centerY + y}.png`,
        left: `${radius * size + x * size}%`,
        top: `${radius * size + y * size}%`,
        size: `${size}%`,
      });
    }
  }
  return tiles;
}

function dayFlowMarkerOffset(point, markerPoints, dense) {
  if (!dense || point.stop.id === "base") return {};
  const closeToAnotherMarker = markerPoints.some((other) => {
    if (other === point) return false;
    return Math.hypot(point.x - other.x, point.y - other.y) < 68;
  });
  if (!closeToAnotherMarker) return {};
  const angle = ((point.index || 1) * 137.5 * Math.PI) / 180;
  return {
    "--pin-dx": `${Math.round(Math.cos(angle) * 24)}px`,
    "--pin-dy": `${Math.round(Math.sin(angle) * 24)}px`,
  };
}

function NavoDayFlowMap({ lang, plan, variant }) {
  const geometry = buildDayFlowGeometry(plan.ordered || []);
  const tiles = tileListForCenter(geometry.center, geometry.zoom + 1);
  const stopCount = Math.max(0, geometry.points.length - 2);
  const dense = stopCount > 4;
  const overloaded = stopCount > 7;
  const markerPoints = geometry.points.filter(
    (point, index) => point.stop.id !== "base" || index === 0,
  );
  const variantLabel = planVariantLabels[lang][variant] || variant;
  const title = lang === "en" ? "DayFlow Map" : "DayFlow-Karte";
  const subtitle =
    lang === "en"
      ? "Real Basel map tiles with a Navo-owned route layer, numbered stops, and day-planning controls."
      : "Echte Basel-Kartendaten mit eigener Navo-Routenschicht, nummerierten Stopps und Tagesplan-Steuerung.";
  const empty =
    lang === "en"
      ? "Add at least one activity to draw the route."
      : "Füge mindestens eine Aktivität hinzu, um die Route zu zeichnen.";

  const routeListLabel = lang === "en" ? "Route sequence" : "Routenfolge";
  const densityNote = overloaded
    ? lang === "en"
      ? "Dense route: map pins stay compact; use the route sequence below for names."
      : "Dichte Route: Karten-Pins bleiben kompakt; Namen stehen unten in der Routenfolge."
    : lang === "en"
      ? "Compact pins keep the map readable as the day fills up."
      : "Kompakte Pins halten die Karte lesbar, wenn der Tag voller wird.";

  return (
    <div className={`dayflow-map-card ${dense ? "dense" : ""}`}>
      <div className="dayflow-map-copy">
        <div>
          <span>{title}</span>
          <h4>
            {lang === "en"
              ? "A real map redesigned around your day."
              : "Eine echte Karte, neu gedacht für euren Tag."}
          </h4>
          <p>{subtitle}</p>
        </div>
        <div className="dayflow-map-meta">
          <strong>{plan.score}</strong>
          <small>{lang === "en" ? "Day Score" : "Tages-Score"}</small>
          <b>{variantLabel}</b>
        </div>
      </div>

      <div
        className={`dayflow-map-shell ${dense ? "dense" : ""} ${overloaded ? "overloaded" : ""}`}
        role="img"
        aria-label={
          lang === "en"
            ? "Navo route map for Basel day plan"
            : "Navo Routenkarte für Basel-Tagesplan"
        }
      >
        <div className="osm-tile-grid" aria-hidden="true">
          {tiles.map((tile) => (
            <img
              key={tile.key}
              src={tile.src}
              style={{
                left: tile.left,
                top: tile.top,
                width: tile.size,
                height: tile.size,
              }}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
        <div className="dayflow-map-tint" aria-hidden="true" />
        <svg
          className="dayflow-route-svg"
          viewBox={`0 0 ${geometry.viewWidth} ${geometry.viewHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="dayflowRouteGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00C2A8" />
              <stop offset="58%" stopColor="#15AFC7" />
              <stop offset="100%" stopColor="#13324A" />
            </linearGradient>
            <filter id="dayflowGlow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {geometry.points.length > 1 && (
            <polyline
              className="dayflow-route-shadow"
              points={geometry.routePath}
            />
          )}
          {geometry.points.length > 1 && (
            <polyline
              className="dayflow-route-line"
              points={geometry.routePath}
              filter="url(#dayflowGlow)"
            />
          )}
          {geometry.points.length > 1 && (
            <polyline
              className={`dayflow-route-pulse ${variant === "rain" ? "rain" : ""}`}
              points={geometry.routePath}
            />
          )}
        </svg>

        {markerPoints.map((point, i) => {
          const isBase = point.stop.id === "base";
          const number = isBase ? "B" : point.index;
          return (
            <div
              key={`${point.stop.id}-${i}`}
              className={`${isBase ? "dayflow-stop-marker base" : "dayflow-stop-marker"} ${dense ? "compact" : ""}`}
              style={{
                left: `${(point.x / geometry.viewWidth) * 100}%`,
                top: `${(point.y / geometry.viewHeight) * 100}%`,
                ...dayFlowMarkerOffset(point, markerPoints, dense),
              }}
            >
              <b>{number}</b>
              <span>{lang === "en" ? point.stop.en : point.stop.de}</span>
            </div>
          );
        })}

        {dense && <div className="dayflow-density-note">{densityNote}</div>}

        <div className="dayflow-bottom-sheet">
          <div>
            <strong>{lang === "en" ? "Your DayFlow" : "Euer DayFlow"}</strong>
            <span>
              {stopCount ? `${stopCount} stops · ${variantLabel}` : empty}
            </span>
          </div>
          <div className="dayflow-mini-stats">
            <span>{lang === "en" ? "Low backtracking" : "Wenig Rückweg"}</span>
            <span>{lang === "en" ? "Route-first" : "Route zuerst"}</span>
          </div>
        </div>
      </div>

      {plan.routeSteps?.length > 0 && (
        <ol className="dayflow-route-list" aria-label={routeListLabel}>
          {plan.routeSteps.map((step) => {
            const title = lang === "en" ? step.activity.en : step.activity.de;
            return (
              <li key={step.activity.id}>
                <b>{step.index}</b>
                <div>
                  <strong>{title}</strong>
                  <span>
                    {step.transferMinutes} min{" "}
                    {lang === "en" ? "from previous" : "vom vorherigen Stopp"} ·{" "}
                    {step.activity.type} · {step.activity.time}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function RouteAwareDayPanel({
  lang,
  c,
  variant,
  setVariant,
  plan,
  droppedIdeas,
  setDroppedIdeas,
  reflowNote,
  onReflow,
}) {
  const labels = planVariantLabels[lang];
  const variants = ["best", "family", "fast", "rain", "discovery"];
  const variantHint = {
    en: {
      best: "Balanced order with low backtracking.",
      family: "Slower pacing, better for kids and breaks.",
      fast: "Shorter blocks for limited time.",
      rain: "Indoor-first backup logic.",
      discovery: "Low-cost and exploratory stops first.",
    },
    de: {
      best: "Ausgewogene Reihenfolge mit wenig Rückweg.",
      family: "Ruhigeres Tempo, besser für Kinder und Pausen.",
      fast: "Kürzere Blöcke für begrenzte Zeit.",
      rain: "Indoor zuerst als Regenlogik.",
      discovery: "Günstige und entdeckende Stopps zuerst.",
    },
  }[lang];
  const reflowActions =
    lang === "en"
      ? [
          ["tired", "We are tired"],
          ["hungry", "We are hungry"],
          ["rain", "It started raining"],
          ["late", "We are late"],
          ["extra", "We have extra time"],
        ]
      : [
          ["tired", "Wir sind müde"],
          ["hungry", "Wir haben Hunger"],
          ["rain", "Es regnet"],
          ["late", "Wir sind spät"],
          ["extra", "Wir haben mehr Zeit"],
        ];
  const reflowText = {
    en: {
      tired: "Switched toward Family Calm. Remove one heavy stop if needed.",
      hungry:
        "Keep the next food stop close. Use the food tab before walking too far.",
      rain: "Switched toward Rain Backup. Indoor options are moved earlier.",
      late: "Switched toward Fast Track. Shorter activity blocks are preferred.",
      extra: "You can add one nearby discovery stop, but avoid a far detour.",
    },
    de: {
      tired:
        "Auf Familienruhig umgestellt. Entferne bei Bedarf einen schweren Stopp.",
      hungry:
        "Den nächsten Essensstopp nah halten. Erst Essen prüfen, bevor ihr weit lauft.",
      rain: "Auf Regenplan umgestellt. Indoor-Optionen werden vorgezogen.",
      late: "Auf Schnellroute umgestellt. Kürzere Aktivitätsblöcke werden bevorzugt.",
      extra:
        "Ihr könnt einen nahen Entdeckungsstopp ergänzen, aber keinen weiten Umweg.",
    },
  }[lang];
  const hours = Math.floor(plan.minutes / 60);
  const mins = plan.minutes % 60;
  return (
    <div className="route-aware-panel">
      <div className="route-aware-head">
        <div>
          <h3>
            <Navigation size={18} /> {labels.routeTitle}
          </h3>
          <p>
            {lang === "en"
              ? "This is the product wedge: selected places become a realistic route-aware day."
              : "Das ist der Produkt-Wedge: ausgewählte Orte werden zu einem realistischen routenbewussten Tag."}
          </p>
        </div>
        <a
          href={plan.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="route-map-link"
        >
          <MapPin size={16} /> {c.route}
        </a>
      </div>

      <NavoDayFlowMap lang={lang} plan={plan} variant={variant} />

      <div className="variant-tabs" aria-label="Route variants">
        {variants.map((v) => (
          <button
            key={v}
            className={variant === v ? "active" : ""}
            onClick={() => setVariant(v)}
          >
            <span>{labels[v]}</span>
            <small>{variantHint[v]}</small>
          </button>
        ))}
      </div>

      <div className="route-score-grid">
        <div className="day-score">
          <span>{labels.scoreTitle}</span>
          <strong>{plan.score}</strong>
          <small>
            {lang === "en"
              ? `${hours}h ${mins}m estimated · CHF ${plan.cost}`
              : `${hours} Std. ${mins} Min. geschätzt · CHF ${plan.cost}`}
          </small>
        </div>
        <div className="route-reasons">
          {plan.reasons.map((reason, i) => (
            <p key={i}>
              <CheckCircle2 size={15} /> {reason}
            </p>
          ))}
          {plan.warnings.map((warning, i) => (
            <p key={`w-${i}`} className="warning">
              <ShieldCheck size={15} /> {warning}
            </p>
          ))}
        </div>
      </div>

      <div className="smart-order-list">
        {plan.ordered.length === 0 && (
          <p className="muted">
            {lang === "en"
              ? "Add places from Activities or paste ideas below."
              : "Füge Orte aus Aktivitäten hinzu oder füge Ideen unten ein."}
          </p>
        )}
        {plan.ordered.map((a, i) => (
          <div className="smart-stop" key={a.id}>
            <b>{i + 1}</b>
            <div>
              <strong>{lang === "en" ? a.en : a.de}</strong>
              <span>
                {a.area} · {a.time} · {a.transit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="reflow-box">
        <div>
          <h4>{labels.reflowTitle}</h4>
          <p>
            {lang === "en"
              ? "Plans change. Reflow adapts the route logic without starting over."
              : "Pläne ändern sich. Reflow passt die Routenlogik an, ohne neu anzufangen."}
          </p>
        </div>
        <div className="chip-row">
          {reflowActions.map(([id, label]) => (
            <button className="chip" key={id} onClick={() => onReflow(id)}>
              {label}
            </button>
          ))}
        </div>
        {reflowNote && <p className="reflow-note">{reflowText[reflowNote]}</p>}
      </div>

      <label className="drop-ideas-box">
        <span>{labels.dropTitle}</span>
        <label className="sr-only" htmlFor="dropped-ideas">
          {lang === "en" ? "Saved trip ideas" : "Gespeicherte Reiseideen"}
        </label>
        <textarea
          id="dropped-ideas"
          name="dropped-ideas"
          value={droppedIdeas}
          onChange={(e) => setDroppedIdeas(e.target.value)}
          placeholder={
            lang === "en"
              ? "Paste Google Maps links, TikTok ideas, notes, or places you want to try. Early MVP stores this input locally."
              : "Füge Google-Maps-Links, TikTok-Ideen, Notizen oder Wunschorte ein. Im MVP wird dies lokal gespeichert."
          }
        />
      </label>
    </div>
  );
}

function WeatherPanel({
  lang,
  destination,
  locationId,
  setLocationId,
  weather,
  tripDays,
  setMood,
}) {
  const locationEntries = Object.entries(destination.weatherLocations);
  const place =
    destination.weatherLocations[locationId]?.name || destination.name;
  const tripDateLabel = destination.hero[lang]?.dateLabel || destination.name;
  const statusText =
    weather.status === "loading"
      ? lang === "en"
        ? "Loading live forecast…"
        : "Live-Wetter wird geladen…"
      : weather.status === "error"
        ? lang === "en"
          ? "Weather could not load. The app still works offline."
          : "Wetter konnte nicht geladen werden. Die App funktioniert weiter offline."
        : tripDays.length
          ? lang === "en"
            ? "Trip-date forecast available."
            : "Reisedaten-Wetter verfügbar."
          : lang === "en"
            ? `Dynamic forecast is active, but ${tripDateLabel} is not inside the forecast window yet. It will populate automatically closer to the trip.`
            : `Dynamisches Wetter ist aktiv, aber ${tripDateLabel} liegt noch nicht im Prognosefenster. Es füllt sich automatisch kurz vor der Reise.`;

  return (
    <div className="weather-panel">
      <div className="weather-head">
        <div>
          <h3>
            <CloudSun size={18} />{" "}
            {lang === "en" ? "Dynamic weather" : "Dynamisches Wetter"}
          </h3>
          <p>{statusText}</p>
        </div>
        <select
          id="weather-location"
          name="weather-location"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          aria-label={lang === "en" ? "Weather location" : "Wetterort"}
        >
          {locationEntries.map(([id, location]) => (
            <option key={id} value={id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>
      {tripDays.length > 0 ? (
        <div className="weather-days">
          {tripDays.map((d) => (
            <button
              key={d.date}
              className="weather-day"
              onClick={() => setMood(d.mood)}
            >
              <strong>
                {new Date(d.date).toLocaleDateString(
                  lang === "en" ? "en-GB" : "de-DE",
                  { weekday: "short", day: "2-digit", month: "2-digit" },
                )}
              </strong>
              <span>{d.label}</span>
              <b>
                {d.min}–{d.max}°C
              </b>
              <small>
                {d.precipitation} mm · {d.mood}
              </small>
            </button>
          ))}
        </div>
      ) : (
        <div className="weather-placeholder">
          <ThermometerSun size={20} />
          <p>
            {lang === "en"
              ? `${place} forecast will update automatically through Open-Meteo when your trip dates enter the forecast range. Until then, use the manual weather selector below.`
              : `${place}-Prognose aktualisiert sich automatisch über Open-Meteo, sobald eure Reisedaten im Prognosefenster liegen. Bis dahin den manuellen Wetterfilter unten nutzen.`}
          </p>
        </div>
      )}
    </div>
  );
}

function SpecialPlan({ plan }) {
  return (
    <div className="special-plan">
      <h4>{plan.title}</h4>
      <p>{plan.intro}</p>
      <ol>
        {plan.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <div className="link-row special-links">
        {plan.links.map(([label, url]) => (
          <a key={label} href={url} target="_blank" rel="noreferrer">
            <ExternalLink size={15} /> {label}
          </a>
        ))}
      </div>
    </div>
  );
}

function ActivityCard({
  a,
  lang,
  c,
  expanded,
  setExpanded,
  favorite,
  toggleFav,
  addToDay,
  specialPlans,
  selectedDay,
  inDay,
}) {
  const title = lang === "en" ? a.en : a.de;
  const desc = lang === "en" ? a.descEn : a.descDe;
  const tip = lang === "en" ? a.tipEn : a.tipDe;
  const missions = lang === "en" ? a.missionEn : a.missionDe;
  return (
    <article className="activity-card">
      <button
        className="image-button"
        onClick={() => setExpanded(expanded ? null : a.id)}
      >
        {a.images?.[0] ? (
          <img src={a.images[0]} alt={title} loading="lazy" decoding="async" />
        ) : (
          <div className="image-fallback">
            <MapPin size={28} />
            <span>{title}</span>
          </div>
        )}
        <span className="tier">{tierLabel[a.tier]}</span>
      </button>
      <div className="card-body">
        <div className="card-head">
          <div>
            <h3>{title}</h3>
            <p>{a.area}</p>
          </div>
          <button
            className={favorite ? "heart on" : "heart"}
            onClick={() => toggleFav(a.id)}
            aria-label={favorite ? c.saved : c.save}
          >
            <Heart size={19} fill={favorite ? "currentColor" : "none"} />
          </button>
        </div>
        <p>{desc}</p>
        <div className="facts">
          <span>
            <Euro size={14} />
            {c.cost}: CHF {a.cost} / €{eur(a.cost)}
          </span>
          <span>
            <Clock size={14} />
            {c.time}: {a.time}
          </span>
          <span>
            <Navigation size={14} />
            {c.fromBase}: {a.transit}
          </span>
        </div>
        <div className="card-actions">
          <button
            className={inDay ? "added-action" : ""}
            onClick={(e) => {
              e.stopPropagation();
              addToDay(a.id);
            }}
          >
            <Plus size={16} /> {inDay ? `${c.added} · ${selectedDay}` : c.add}
          </button>
          <button onClick={() => setExpanded(expanded ? null : a.id)}>
            {c.details}
            <ChevronDown size={16} />
          </button>
        </div>
        {expanded && (
          <div className="expand">
            {a.images?.[1] && (
              <img
                className="second-img"
                src={a.images[1]}
                alt={`${title} angle 2`}
                loading="lazy"
                decoding="async"
              />
            )}
            <h4>{c.tip}</h4>
            <p>{tip}</p>
            {specialPlans?.[a.id] && (
              <SpecialPlan plan={specialPlans[a.id][lang]} />
            )}
            <h4>{c.mission}</h4>
            <ul>
              {missions.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
            <div className="link-row">
              <a href={a.official} target="_blank" rel="noreferrer">
                <ExternalLink size={15} /> {c.official}
              </a>
              <a href={a.map || route(title)} target="_blank" rel="noreferrer">
                <MapPin size={15} /> {c.map}
              </a>
              <a href={route(title)} target="_blank" rel="noreferrer">
                <Navigation size={15} /> {c.route}
              </a>
              <a href={a.photos} target="_blank" rel="noreferrer">
                <ExternalLink size={15} /> {c.photos}
              </a>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

createRoot(document.getElementById("root")).render(<App />);
