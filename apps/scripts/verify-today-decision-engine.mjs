import { destinationPacks } from "../src/data/destinations/index.js";
import { buildTodayDecision } from "../src/features/todayDecisionEngine.js";

const CHF_TO_EUR = 1.04;
const convertToEur = (chf) => Math.round(chf * CHF_TO_EUR);
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function hasContractShape(decision) {
  return (
    Array.isArray(decision.primaryPlan) &&
    Array.isArray(decision.backupPlan) &&
    Array.isArray(decision.avoidedOptions) &&
    typeof decision.confidence === "number" &&
    Array.isArray(decision.riskFlags)
  );
}

function activityType(item) {
  return item?.activity?.type || "";
}

function routeMetaFor(destination, item) {
  return destination.routeMeta?.[item?.activity?.id] || {};
}

function runScenario(name, destination, context, checks) {
  const decision = buildTodayDecision(destination, {
    lang: "en",
    convertToEur,
    ...context,
  });

  assert(hasContractShape(decision), `${name}: output contract shape is invalid`);
  assert(decision.destinationId === destination.id, `${name}: destination id mismatch`);
  assert(decision.confidence >= 0 && decision.confidence <= 100, `${name}: confidence out of range`);
  assert(decision.primaryPlan.length > 0, `${name}: primary plan is empty`);

  checks?.(decision);

  return decision;
}

for (const [id, destination] of Object.entries(destinationPacks)) {
  runScenario(`${id} baseline`, destination, {
    weather: "normal",
    energy: "medium",
    budgetEur: 120,
    selectedIds: [],
  });

  runScenario(`${id} rainy`, destination, {
    weather: "rainy",
    energy: "medium",
    budgetEur: 120,
    selectedIds: [],
  }, (decision) => {
    const primary = decision.primaryPlan[0];
    const meta = routeMetaFor(destination, primary);
    assert(
      meta.indoor || ["Museum", "Food", "Market", "History"].includes(activityType(primary)),
      `${id} rainy: primary choice should favor indoor/weather-safe activities`,
    );
  });

  runScenario(`${id} low energy`, destination, {
    weather: "normal",
    energy: "low",
    budgetEur: 120,
    selectedIds: [],
  }, (decision) => {
    const primary = decision.primaryPlan[0];
    const meta = routeMetaFor(destination, primary);
    assert(
      (meta.calm || 99) <= 6 || primary.activity.energy.includes("low"),
      `${id} low energy: primary choice should favor calm/low-energy activities`,
    );
  });

  runScenario(`${id} budget pressure`, destination, {
    weather: "normal",
    energy: "medium",
    budgetEur: 65,
    selectedIds: [],
  }, (decision) => {
    const expensivePrimary = decision.primaryPlan.some(
      (item) => convertToEur(item.activity.cost || 0) > 65,
    );
    assert(!expensivePrimary, `${id} budget pressure: primary plan should stay under budget`);
  });

  const selectedIds = destination.activities.slice(0, 3).map((activity) => activity.id);
  runScenario(`${id} selected plan`, destination, {
    weather: "normal",
    energy: "medium",
    budgetEur: 160,
    selectedIds,
  }, (decision) => {
    const primaryIds = decision.primaryPlan.map((item) => item.activity.id);
    assert(
      selectedIds.some((id) => primaryIds.includes(id)),
      `${id} selected plan: primary plan should respect selected activities`,
    );
  });
}

if (failures.length) {
  console.error("Today Decision Engine verification failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Today Decision Engine verification passed.");
console.log(`Destinations checked: ${Object.keys(destinationPacks).join(", ")}`);
