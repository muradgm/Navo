import { destinationPacks } from "../src/data/destinations/index.js";
import {
  buildDayFlowRouteStops,
  getMissingDayFlowCoordinates,
} from "../src/dayflow/routeStops.js";

const errors = [];

for (const [destinationId, pack] of Object.entries(destinationPacks)) {
  const routeCandidateStops = pack.activities;
  const routeStops = buildDayFlowRouteStops({
    baseLocation: pack.baseLocation,
    orderedStops: routeCandidateStops,
  });
  const missing = getMissingDayFlowCoordinates(routeStops);

  if (!routeStops.some((stop) => stop.id === "base")) {
    errors.push(`${destinationId}: missing base stop`);
  }

  if (missing.length > 0) {
    errors.push(
      `${destinationId}: missing coordinates for ${missing.map((stop) => stop.id).join(", ")}`,
    );
  }
}

if (errors.length) {
  console.error("DayFlow route stop verification failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`DayFlow route stop verification passed for ${Object.keys(destinationPacks).length} destinations.`);
