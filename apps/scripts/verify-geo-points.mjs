import { geoManifests, isValidGeoPoint } from "../src/data/geo/index.js";

const errors = [];
const warnings = [];

for (const [destinationId, manifest] of Object.entries(geoManifests)) {
  const seen = new Set();

  if (manifest.destinationId !== destinationId) {
    errors.push(`${destinationId}: manifest.destinationId mismatch`);
  }

  for (const point of manifest.points) {
    if (!isValidGeoPoint(point)) {
      errors.push(`${destinationId}/${point?.id || "unknown"}: invalid geo point shape`);
      continue;
    }

    if (seen.has(point.id)) {
      errors.push(`${destinationId}/${point.id}: duplicate geo id`);
    }
    seen.add(point.id);

    if (point.destinationId !== destinationId) {
      errors.push(`${destinationId}/${point.id}: destinationId mismatch`);
    }

    if (point.confidence === "needs-check") {
      warnings.push(`${destinationId}/${point.id}: needs coordinate verification`);
    }

    if (!point.mapQuery && !point.sourceUrl && !point.address) {
      warnings.push(`${destinationId}/${point.id}: missing mapQuery/sourceUrl/address`);
    }
  }
}

if (warnings.length) {
  console.warn("Geo warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error("Geo verification failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const total = Object.values(geoManifests).reduce(
  (sum, manifest) => sum + manifest.points.length,
  0,
);

console.log(`Geo verification passed for ${Object.keys(geoManifests).length} destinations and ${total} points.`);
