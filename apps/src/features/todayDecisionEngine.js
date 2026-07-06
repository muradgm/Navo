const DEFAULT_COPY = {
  en: {
    noPlan: "Add activities to get a primary plan.",
    primary: "Best next move",
    backup: "Backup move",
    avoid: "Avoid for now",
    hot: "Hot weather favors indoor, shaded, water, or shorter outdoor blocks.",
    rainy: "Rain favors indoor anchors and shorter walking segments.",
    cold: "Cold weather favors shorter walks and indoor anchors.",
    lowEnergy: "Low energy favors calm, nearby, lower-friction choices.",
    highEnergy: "High energy can support a bigger headline activity.",
    budget: "Budget pressure favors low-cost or free activities.",
    route: "Route pressure favors closer, lower-transfer choices.",
    selected: "Already selected for today, so it stays in the primary plan.",
    fallback: "Kept as a backup because it still fits at least one current constraint.",
  },
  de: {
    noPlan: "Füge Aktivitäten hinzu, um einen Hauptplan zu bekommen.",
    primary: "Beste nächste Entscheidung",
    backup: "Ersatzoption",
    avoid: "Jetzt eher vermeiden",
    hot: "Hitze spricht für Indoor, Schatten, Wasser oder kurze Outdoor-Blöcke.",
    rainy: "Regen spricht für Indoor-Anker und kürzere Wege.",
    cold: "Kälte spricht für kürzere Wege und Indoor-Anker.",
    lowEnergy: "Niedrige Energie spricht für ruhige, nahe, einfache Optionen.",
    highEnergy: "Hohe Energie erlaubt eine größere Hauptaktivität.",
    budget: "Budgetdruck spricht für günstige oder kostenlose Aktivitäten.",
    route: "Routendruck spricht für nahe Optionen mit wenig Umstieg.",
    selected: "Schon für heute ausgewählt, deshalb bleibt es im Hauptplan.",
    fallback: "Bleibt als Backup, weil es mindestens eine aktuelle Bedingung erfüllt.",
  },
};

function activityLabel(activity, lang) {
  return lang === "de" ? activity.de : activity.en;
}

function weatherScore(activity, meta, weather) {
  if (weather === "rainy") return meta.indoor ? 28 : -22;
  if (weather === "cold") return meta.indoor ? 22 : -12;
  if (weather === "hot") {
    if (activity.type === "Water" || activity.type === "Lake/Water") return 24;
    if (meta.indoor) return 18;
    return activity.weather.includes("hot") ? 6 : -12;
  }
  return activity.weather.includes("normal") ? 10 : 0;
}

function energyScore(activity, meta, energy) {
  if (energy === "low") return meta.calm <= 3 ? 20 : activity.energy.includes("low") ? 12 : -14;
  if (energy === "high") return activity.energy.includes("high") ? 14 : 4;
  return activity.energy.includes("medium") || activity.energy.includes("low") ? 10 : 0;
}

function budgetScore(activity, budgetEur, convertToEur) {
  const costEur = convertToEur(activity.cost || 0);
  if (costEur === 0) return 14;
  if (costEur <= budgetEur * 0.25) return 10;
  if (costEur <= budgetEur * 0.45) return 4;
  if (costEur > budgetEur * 0.75) return -18;
  return -4;
}

function routeScore(meta) {
  return Math.max(-18, 16 - (meta.minutes || 90) / 6 - (meta.route || 8));
}

function decisionReasons({ activity, meta, weather, energy, budgetEur, convertToEur, selected, lang }) {
  const copy = DEFAULT_COPY[lang] || DEFAULT_COPY.en;
  const reasons = [];
  if (selected) reasons.push(copy.selected);
  if (weather === "hot") reasons.push(copy.hot);
  if (weather === "rainy") reasons.push(copy.rainy);
  if (weather === "cold") reasons.push(copy.cold);
  if (energy === "low") reasons.push(copy.lowEnergy);
  if (energy === "high") reasons.push(copy.highEnergy);
  if (convertToEur(activity.cost || 0) > budgetEur * 0.6) reasons.push(copy.budget);
  if ((meta.minutes || 0) > 90 || (meta.route || 0) > 8) reasons.push(copy.route);
  return reasons.slice(0, 3);
}

export function scoreTodayActivity(activity, context) {
  const {
    weather = "normal",
    energy = "medium",
    budgetEur = 120,
    selectedIds = [],
    routeMeta = {},
    convertToEur = (value) => value,
  } = context;
  const meta = routeMeta[activity.id] || {
    minutes: 90,
    family: 70,
    calm: 5,
    indoor: false,
    route: 8,
  };

  const selected = selectedIds.includes(activity.id);
  let score = 40;
  score += selected ? 30 : 0;
  score += Math.min(18, (meta.family || 70) / 7);
  score += weatherScore(activity, meta, weather);
  score += energyScore(activity, meta, energy);
  score += budgetScore(activity, budgetEur, convertToEur);
  score += routeScore(meta);
  if ((activity.cost || 0) >= 120) score -= 10;

  return {
    activity,
    selected,
    score: Math.round(Math.max(0, Math.min(100, score))),
    reasons: decisionReasons({
      activity,
      meta,
      weather,
      energy,
      budgetEur,
      convertToEur,
      selected,
      lang: context.lang || "en",
    }),
  };
}

export function buildTodayDecision(destination, context = {}) {
  const lang = context.lang || "en";
  const copy = DEFAULT_COPY[lang] || DEFAULT_COPY.en;
  const selectedIds = context.selectedIds || [];
  const activities = destination.activities || [];
  const scored = activities
    .map((activity) =>
      scoreTodayActivity(activity, {
        ...context,
        selectedIds,
        routeMeta: destination.routeMeta || {},
      }),
    )
    .sort((a, b) => b.score - a.score);

  const selectedScored = scored.filter((item) => item.selected);
  const pool = selectedScored.length ? selectedScored : scored;
  const primary = pool.slice(0, 4);
  const primaryIds = new Set(primary.map((item) => item.activity.id));
  const backup = scored
    .filter((item) => !primaryIds.has(item.activity.id) && item.score >= 55)
    .slice(0, 3)
    .map((item) => ({ ...item, reasons: item.reasons.length ? item.reasons : [copy.fallback] }));
  const avoid = scored
    .filter((item) => !primaryIds.has(item.activity.id) && item.score < 45)
    .slice(-3)
    .reverse();

  const confidence = primary.length
    ? Math.round(primary.reduce((sum, item) => sum + item.score, 0) / primary.length)
    : 0;

  const riskFlags = [];
  if (!primary.length) riskFlags.push(copy.noPlan);
  if (context.weather === "rainy" && primary.some((item) => !(destination.routeMeta?.[item.activity.id]?.indoor))) {
    riskFlags.push(copy.rainy);
  }
  if (context.energy === "low" && primary.some((item) => item.score < 65)) {
    riskFlags.push(copy.lowEnergy);
  }

  return {
    destinationId: destination.id,
    label: copy.primary,
    primaryPlan: primary,
    backupPlan: backup,
    avoidedOptions: avoid,
    confidence,
    riskFlags,
  };
}

export function formatDecisionSummary(decision, lang = "en") {
  const copy = DEFAULT_COPY[lang] || DEFAULT_COPY.en;
  const primary = decision.primaryPlan?.[0]?.activity;
  const backup = decision.backupPlan?.[0]?.activity;
  return {
    headline: primary ? `${copy.primary}: ${activityLabel(primary, lang)}` : copy.noPlan,
    backup: backup ? `${copy.backup}: ${activityLabel(backup, lang)}` : null,
    confidence: `${decision.confidence || 0}%`,
  };
}
