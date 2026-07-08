import { createDayFlowBaseStop } from "./baseStop.js";

export function hasStopCoordinates(stop) {
  return Boolean(
    Array.isArray(stop?.coordinates) &&
      stop.coordinates.length === 2 &&
      Number.isFinite(stop.coordinates[0]) &&
      Number.isFinite(stop.coordinates[1]),
  );
}

export function coordinatesForStop(stop) {
  return hasStopCoordinates(stop) ? stop.coordinates : null;
}

export function buildDayFlowRouteStops({
  baseLocation,
  orderedStops = [],
} = {}) {
  const baseStop = createDayFlowBaseStop(baseLocation);

  return [
    baseStop,
    ...orderedStops.map((stop) => ({
      ...stop,
      coordinates: coordinatesForStop(stop),
    })),
  ].filter((stop) => hasStopCoordinates(stop));
}

export function getMissingDayFlowCoordinates(stops = []) {
  return stops.filter((stop) => !hasStopCoordinates(stop));
}
