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
import "./destination-theme.css";
import {
  defaultDestinationId,
  destinationIds,
  destinationRegistry,
  getDestinationPack,
} from "./data/destinations/index.js";
import { TodayDecisionWidget } from "./today-decision-widget.jsx";
import { NavoDayFlowMap } from "./dayflow/NavoDayFlowMap.jsx";

const CHF_TO_EUR = 1.04;
const APP_NAME = "Navo";
const DESTINATION_STORAGE_KEY = "navo-active-destination-id";
const eur = (chf) => Math.round(chf * CHF_TO_EUR);
const maps = (q) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const baseOrigin = (baseLocation) =>
  `${baseLocation.label}, ${baseLocation.address}`;
const route = (
  q,
  baseLocation,
  origin = baseOrigin(baseLocation),
) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(q)}&travelmode=transit`;
const tierLabel = { $: "€", $$: "€€", $$$: "€€€" };
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

function fieldName(label) {
  return (
    String(label)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "field"
  );
}

const guestIntentOptions = {
  outdoor: { en: "Outdoor places", de: "Outdoor-Orte" },
  parks: { en: "Parks and playgrounds", de: "Parks und Spielplätze" },
  indoor: { en: "Indoor / weather-safe", de: "Indoor / wettersicher" },
  museums: { en: "Museums and learning", de: "Museen und Lernen" },
  water: { en: "Water and swimming", de: "Wasser und Baden" },
  budget: { en: "Low-cost day", de: "Günstiger Tag" },
  balanced: { en: "Balanced family day", de: "Ausgewogener Familientag" },
};

function applyDestinationTheme(destination) {
  if (typeof document === "undefined" || !destination) return;

  const theme = destination.theme || {};
  const heroImage = destination.heroImage || {};
  const root = document.documentElement;

  root.dataset.destination = destination.id;
  root.style.setProperty("--destination-hero-image", `url("${heroImage.src || ""}")`);
  root.style.setProperty("--destination-accent", theme.accent || "#0e7c86");
  root.style.setProperty(
    "--destination-accent-soft",
    theme.accentSoft || "rgba(14, 124, 134, 0.16)",
  );
  root.style.setProperty(
    "--destination-accent-strong",
    theme.accentStrong || "#0f545a",
  );
  root.style.setProperty("--destination-dark", theme.dark || "#0d292d");
  root.style.setProperty(
    "--destination-page-glow",
    theme.pageGlow || "rgba(14, 124, 134, 0.18)",
  );
  root.style.setProperty(
    "--destination-surface-tint",
    theme.surfaceTint || "rgba(255, 250, 242, 0.86)",
  );
  root.style.setProperty(
    "--destination-hero-overlay-from",
    theme.heroOverlayFrom || "rgba(7, 19, 28, 0.72)",
  );
  root.style.setProperty(
    "--destination-hero-overlay-to",
    theme.heroOverlayTo || "rgba(13, 41, 45, 0.36)",
  );
}

function preferenceMatch(activity, intent, routeMeta) {
  const meta = metaFor(activity, routeMeta);
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
  { intent, weather, energy, budget, lang, routeMeta },
) {
  const weatherRisk =
    weather === "hot" || weather === "rainy" || weather === "cold";
  const intentConflicts =
    weatherRisk && ["outdoor", "parks", "water"].includes(intent);
  const scored = activities
    .map((activity) => {
      const meta = metaFor(activity, routeMeta);
      let score = meta.family / 2;
      const preferred = preferenceMatch(activity, intent, routeMeta);
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

function metaFor(a, routeMeta = {}) {
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

function routeUrlForStops(stops, baseLocation) {
  const origin = baseOrigin(baseLocation);
  if (!stops.length) return route(origin, baseLocation);
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

function estimateSegmentMinutes(from, to, routeMeta) {
  const fromMeta =
    from?.id === "base" ? { zone: 2, minutes: 0 } : metaFor(from, routeMeta);
  const toMeta = metaFor(to, routeMeta);
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
    routeMeta = {},
    baseLocation,
    destinationName = "your destination",
  } = {},
) {
  const ordered = [...items].sort((a, b) => {
    const ma = metaFor(a, routeMeta);
    const mb = metaFor(b, routeMeta);
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
    ordered.reduce((sum, a) => sum + metaFor(a, routeMeta).minutes, 0) +
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
        sum +
        Math.abs(
          metaFor(a, routeMeta).zone - metaFor(ordered[idx], routeMeta).zone,
        ),
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
        ? `Stops are ordered to reduce backtracking from your ${destinationName} base.`
        : `Stopps werden so geordnet, dass unnötiges Hin und Her ab der Basis in ${destinationName} reduziert wird.`,
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
      routeMeta,
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
    mapUrl: routeUrlForStops(ordered, baseLocation),
  };
}

function DestinationSwitcher({ activeDestinationId, onChange }) {
  return (
    <div id="destination-switcher" className="destination-switcher">
      <label htmlFor="destination-select">Destination</label>
      <select
        id="destination-select"
        name="destination"
        value={activeDestinationId}
        onChange={(event) => onChange(event.target.value)}
      >
        {destinationIds.map((id) => (
          <option key={id} value={id}>
            {destinationRegistry[id].name}
          </option>
        ))}
      </select>
    </div>
  );
}

function App() {
  const [activeDestinationId, setActiveDestinationId] = useStoredState(
    DESTINATION_STORAGE_KEY,
    defaultDestinationId,
  );
  const destination = getDestinationPack(activeDestinationId);
  const activeDestinationKey = destinationRegistry[activeDestinationId]
    ? activeDestinationId
    : defaultDestinationId;
  const routeMeta = destination.routeMeta || {};
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

  useEffect(() => {
    applyDestinationTheme(destination);
  }, [destination]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("destination") === destination.id) return;
    params.set("destination", destination.id);
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
  }, [destination.id]);

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
        routeMeta,
        baseLocation: destination.baseLocation,
        destinationName: destination.name,
      }),
    [
      customActivities,
      planVariant,
      weather,
      energy,
      todayBudget,
      lang,
      routeMeta,
      destination.baseLocation,
      destination.name,
    ],
  );
  const preferenceRecommendation = useMemo(
    () =>
      buildPreferenceRecommendation(destination.activities, {
        intent: guestIntent,
        weather,
        energy,
        budget: todayBudget,
        lang,
        routeMeta,
      }),
    [
      destination.activities,
      guestIntent,
      weather,
      energy,
      todayBudget,
      lang,
      routeMeta,
    ],
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

  const applyTodayDecisionPlan = (ids) => {
    setPlan({ ...plan, [selectedDay]: ids });
    setToast(
      lang === "en"
        ? `Navo Decision · ${c.addedTo} ${selectedDay}`
        : `Navo Entscheidung · ${c.addedTo} ${selectedDay}`,
    );
    window.clearTimeout(applyTodayDecisionPlan._timer);
    applyTodayDecisionPlan._timer = window.setTimeout(
      () => setToast(null),
      1800,
    );
  };

  const toggleCheck = (idx) =>
    setChecked(
      checked.includes(idx)
        ? checked.filter((i) => i !== idx)
        : [...checked, idx],
    );

  return (
    <main>
      <DestinationSwitcher
        activeDestinationId={activeDestinationKey}
        onChange={setActiveDestinationId}
      />
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

          <TodayDecisionWidget
            destination={destination}
            lang={lang}
            weather={weather}
            energy={energy}
            budgetEur={todayBudget}
            selectedDay={selectedDay}
            selectedIds={customIds}
            onApplyPlan={applyTodayDecisionPlan}
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
              baseLocation={destination.baseLocation}
              destinationName={destination.name}
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
                baseLocation={destination.baseLocation}
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


function RouteAwareDayPanel({
  lang,
  c,
  variant,
  setVariant,
  plan,
  baseLocation,
  destinationName,
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

      <NavoDayFlowMap
        lang={lang}
        plan={plan}
        variant={variant}
        variantLabel={labels[variant] || variant}
        baseLocation={baseLocation}
        destinationName={destinationName}
      />

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
  baseLocation,
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
              <a href={a.map || route(title, baseLocation)} target="_blank" rel="noreferrer">
                <MapPin size={15} /> {c.map}
              </a>
              <a href={route(title, baseLocation)} target="_blank" rel="noreferrer">
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
