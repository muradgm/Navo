import { baselGeoManifest } from "./basel.js";
import { barcelonaGeoManifest } from "./barcelona.js";
import {
  getGeoPoint,
  getGeoPointsByCategory,
  getLowConfidenceGeoPoints,
} from "./model.js";

export { baselGeoManifest } from "./basel.js";
export { barcelonaGeoManifest } from "./barcelona.js";
export {
  GEO_CATEGORIES,
  GEO_CONFIDENCE_LEVELS,
  createGeoManifest,
  createGeoPoint,
  getGeoPoint,
  getGeoPointsByCategory,
  getLowConfidenceGeoPoints,
  isValidGeoPoint,
  isValidLatitude,
  isValidLongitude,
} from "./model.js";

export const geoManifests = Object.freeze({
  basel: baselGeoManifest,
  barcelona: barcelonaGeoManifest,
});

export function getDestinationGeoManifest(destinationId) {
  return geoManifests[destinationId] || null;
}

export function getDestinationGeoPoint(destinationId, geoPointId) {
  return getGeoPoint(getDestinationGeoManifest(destinationId), geoPointId);
}

export function getDestinationGeoPointsByCategory(destinationId, category) {
  return getGeoPointsByCategory(getDestinationGeoManifest(destinationId), category);
}

export function getDestinationGeoCoverage(destinationId) {
  const manifest = getDestinationGeoManifest(destinationId);
  if (!manifest) {
    return {
      destinationId,
      total: 0,
      verified: 0,
      good: 0,
      needsCheck: 0,
      lowConfidence: [],
    };
  }

  const lowConfidence = getLowConfidenceGeoPoints(manifest);

  return {
    destinationId,
    total: manifest.points.length,
    verified: manifest.points.filter((point) => point.confidence === "verified").length,
    good: manifest.points.filter((point) => point.confidence === "good").length,
    needsCheck: manifest.points.filter((point) => point.confidence === "needs-check").length,
    lowConfidence,
  };
}
