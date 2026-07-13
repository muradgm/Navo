const CHF_TO_EUR = 1.04;

export const eur = (chf) => Math.round(chf * CHF_TO_EUR);

const baseOrigin = (baseLocation) =>
  `${baseLocation.label}, ${baseLocation.address}`;

const route = (q, baseLocation, origin = baseOrigin(baseLocation)) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(q)}&travelmode=transit`;

export const planVariantLabels = {
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

export function metaFor(a, routeMeta = {}) {
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

export function buildPreferenceRecommendation(
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

export function buildRouteAwarePlan(
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
