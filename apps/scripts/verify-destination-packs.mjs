import { destinationRegistry } from "../src/data/destinations/index.js";

const requiredTopLevelFields = [
  "id",
  "name",
  "country",
  "timezone",
  "baseLocation",
  "tripDates",
  "defaultSelectedDay",
  "defaultWeatherLocation",
  "primaryWeatherLocation",
  "weatherLocations",
  "hero",
  "foodStrategy",
  "dailyCosts",
  "tripBudget",
  "trainJourney",
  "activities",
  "types",
  "typeLabels",
  "specialPlans",
  "groceryCards",
  "defaultChecklist",
  "dayTemplates",
  "overview",
  "routeMeta",
];

const requiredActivityFields = [
  "id",
  "type",
  "tier",
  "area",
  "cost",
  "time",
  "transit",
  "distance",
  "weather",
  "energy",
  "en",
  "de",
  "descEn",
  "descDe",
];

const requiredRouteMetaFields = [
  "zone",
  "minutes",
  "family",
  "indoor",
  "outdoor",
  "route",
  "calm",
];

const errors = [];

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (isObject(value)) return Object.keys(value).length > 0;
  return value !== undefined && value !== null && value !== "";
}

function expect(condition, message) {
  if (!condition) errors.push(message);
}

for (const [destinationId, pack] of Object.entries(destinationRegistry)) {
  expect(pack.id === destinationId, `${destinationId}: pack id mismatch`);

  for (const field of requiredTopLevelFields) {
    expect(hasValue(pack[field]), `${destinationId}: missing ${field}`);
  }

  expect(
    pack.weatherLocations?.[pack.defaultWeatherLocation],
    `${destinationId}: defaultWeatherLocation is not in weatherLocations`,
  );
  expect(
    pack.weatherLocations?.[pack.primaryWeatherLocation],
    `${destinationId}: primaryWeatherLocation is not in weatherLocations`,
  );

  expect(
    hasValue(pack.baseLocation?.label) &&
      hasValue(pack.baseLocation?.address) &&
      hasValue(pack.baseLocation?.mapQuery),
    `${destinationId}: baseLocation must include label, address, and mapQuery`,
  );

  const activityIds = new Set();
  for (const activity of pack.activities || []) {
    const prefix = `${destinationId}/${activity?.id || "unknown"}`;

    expect(!activityIds.has(activity.id), `${prefix}: duplicate activity id`);
    activityIds.add(activity.id);

    for (const field of requiredActivityFields) {
      expect(hasValue(activity[field]), `${prefix}: missing activity.${field}`);
    }

    expect(pack.types.includes(activity.type), `${prefix}: type is not registered`);
    expect(
      Array.isArray(activity.weather) && activity.weather.length > 0,
      `${prefix}: weather must be a non-empty array`,
    );
    expect(
      Array.isArray(activity.energy) && activity.energy.length > 0,
      `${prefix}: energy must be a non-empty array`,
    );

    const meta = pack.routeMeta?.[activity.id];
    expect(meta, `${prefix}: missing routeMeta`);

    for (const field of requiredRouteMetaFields) {
      expect(
        typeof meta?.[field] === "number" || typeof meta?.[field] === "boolean",
        `${prefix}: invalid routeMeta.${field}`,
      );
    }
  }

  for (const routeMetaId of Object.keys(pack.routeMeta || {})) {
    expect(
      activityIds.has(routeMetaId),
      `${destinationId}/${routeMetaId}: routeMeta has no matching activity`,
    );
  }

  for (const template of pack.dayTemplates || []) {
    const prefix = `${destinationId}/dayTemplates/${template?.day || "unknown"}`;

    expect(hasValue(template.day), `${prefix}: missing day`);
    expect(hasValue(template.de), `${prefix}: missing de`);
    expect(hasValue(template.titleEn), `${prefix}: missing titleEn`);
    expect(hasValue(template.titleDe), `${prefix}: missing titleDe`);
    expect(
      Array.isArray(template.items) && template.items.length > 0,
      `${prefix}: items must be a non-empty array`,
    );

    for (const activityId of template.items || []) {
      expect(
        activityIds.has(activityId),
        `${prefix}: unknown activity id ${activityId}`,
      );
    }
  }

  expect(
    pack.dayTemplates.some((template) => template.day === pack.defaultSelectedDay),
    `${destinationId}: defaultSelectedDay does not match a dayTemplate`,
  );
}

if (errors.length) {
  console.error("Destination pack verification failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Destination pack verification passed for ${Object.keys(destinationRegistry).length} destinations.`,
);
