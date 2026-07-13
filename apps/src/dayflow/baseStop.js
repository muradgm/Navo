export function createDayFlowBaseStop(baseLocation) {
  const fallbackCoordinates = [7.5993, 47.5614];
  const coordinates = Array.isArray(baseLocation?.coordinates)
    ? baseLocation.coordinates
    : fallbackCoordinates;

  return {
    id: "base",
    en: baseLocation?.label || "Base",
    de: baseLocation?.label || "Basis",
    area: baseLocation?.address || "Base location",
    time: "Base",
    transit: "Start / end",
    coordinates,
    geoPointId: baseLocation?.geoPointId || "base",
    geoConfidence: baseLocation?.geoConfidence || "needs-check",
  };
}

export function hasGeoBackedBaseStop(baseLocation) {
  return Boolean(
    Array.isArray(baseLocation?.coordinates) &&
      baseLocation.coordinates.length === 2 &&
      Number.isFinite(baseLocation.coordinates[0]) &&
      Number.isFinite(baseLocation.coordinates[1]),
  );
}
