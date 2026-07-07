export const GEO_CATEGORIES = [
  "activity",
  "food",
  "grocery",
  "transport",
  "emergency",
  "toilet",
  "playground",
  "viewpoint",
  "event",
];

export const GEO_CONFIDENCE_LEVELS = ["verified", "good", "needs-check"];

export function isValidLatitude(value) {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

export function isValidLongitude(value) {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}

export function isValidGeoPoint(point) {
  return Boolean(
    point &&
      typeof point.id === "string" &&
      point.id.length > 0 &&
      typeof point.destinationId === "string" &&
      point.destinationId.length > 0 &&
      GEO_CATEGORIES.includes(point.category) &&
      point.name &&
      typeof point.name.en === "string" &&
      point.name.en.length > 0 &&
      point.coordinates &&
      isValidLatitude(point.coordinates.lat) &&
      isValidLongitude(point.coordinates.lng) &&
      GEO_CONFIDENCE_LEVELS.includes(point.confidence),
  );
}

export function createGeoPoint(point) {
  if (!isValidGeoPoint(point)) {
    throw new Error(`Invalid geo point: ${point?.id || "unknown"}`);
  }

  return Object.freeze({
    ...point,
    name: Object.freeze({ ...point.name }),
    coordinates: Object.freeze({ ...point.coordinates }),
    tags: Object.freeze([...(point.tags || [])]),
  });
}

export function createGeoManifest(destinationId, points) {
  const normalized = points.map((point) =>
    createGeoPoint({
      ...point,
      destinationId: point.destinationId || destinationId,
    }),
  );

  return Object.freeze({
    destinationId,
    points: Object.freeze(normalized),
    byId: Object.freeze(Object.fromEntries(normalized.map((point) => [point.id, point]))),
  });
}

export function getGeoPoint(manifest, id) {
  return manifest?.byId?.[id] || null;
}

export function getGeoPointsByCategory(manifest, category) {
  return manifest?.points?.filter((point) => point.category === category) || [];
}

export function getLowConfidenceGeoPoints(manifest) {
  return manifest?.points?.filter((point) => point.confidence !== "verified") || [];
}
