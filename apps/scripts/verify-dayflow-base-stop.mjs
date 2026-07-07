import { destinationPacks } from "../src/data/destinations/index.js";
import { createDayFlowBaseStop, hasGeoBackedBaseStop } from "../src/dayflow/baseStop.js";

const errors = [];

for (const [destinationId, pack] of Object.entries(destinationPacks)) {
  const baseStop = createDayFlowBaseStop(pack.baseLocation);

  if (!hasGeoBackedBaseStop(pack.baseLocation)) {
    errors.push(`${destinationId}: baseLocation is missing geo-backed coordinates`);
  }

  if (!Array.isArray(baseStop.coordinates) || baseStop.coordinates.length !== 2) {
    errors.push(`${destinationId}: generated DayFlow base stop has invalid coordinates`);
  }

  if (baseStop.geoConfidence === "needs-check") {
    errors.push(`${destinationId}: generated DayFlow base stop is still needs-check`);
  }
}

if (errors.length) {
  console.error("DayFlow base stop verification failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`DayFlow base stop verification passed for ${Object.keys(destinationPacks).length} destinations.`);
