import { baselDestinationPack } from "./basel/index.js";
import { barcelonaDestinationPack } from "./barcelona/index.js";
import { getDestinationGeoManifest } from "../geo/index.js";
import {
  destinationVisuals,
  fallbackDestinationVisuals,
} from "./visuals.js";

const FALLBACK_DESTINATION_ID = "basel";
const DESTINATION_STORAGE_KEY = "navo-active-destination-id";

const baseDestinationPacks = {
  basel: baselDestinationPack,
  barcelona: barcelonaDestinationPack,
};

function lonLat(geoPoint) {
  if (!geoPoint) return undefined;
  return [geoPoint.coordinates.lng, geoPoint.coordinates.lat];
}

function attachGeoData(id, pack) {
  const manifest = getDestinationGeoManifest(id);
  const baseGeo = manifest?.byId?.base;
  const baseLocation = baseGeo
    ? {
        ...pack.baseLocation,
        coordinates: lonLat(baseGeo),
        geoPointId: baseGeo.id,
        geoConfidence: baseGeo.confidence,
      }
    : pack.baseLocation;

  const activities = pack.activities.map((activity) => {
    const geo = manifest?.byId?.[activity.id];
    if (!geo) return activity;

    return {
      ...activity,
      coordinates: lonLat(geo),
      geoPointId: geo.id,
      geoCategory: geo.category,
      geoConfidence: geo.confidence,
      sourceUrl: activity.sourceUrl || geo.sourceUrl,
    };
  });

  return {
    ...pack,
    baseLocation,
    activities,
  };
}

export const destinationPacks = Object.fromEntries(
  Object.entries(baseDestinationPacks).map(([id, pack]) => {
    const geoPack = attachGeoData(id, pack);
    return [
      id,
      {
        ...geoPack,
        ...(destinationVisuals[id] || fallbackDestinationVisuals),
      },
    ];
  }),
);

export const destinationIds = Object.keys(destinationPacks);
export const destinationRegistry = destinationPacks;

function getInitialDestinationId() {
  if (typeof window === "undefined") return FALLBACK_DESTINATION_ID;

  const params = new URLSearchParams(window.location.search);
  const requestedDestination =
    params.get("destination") ||
    window.localStorage.getItem(DESTINATION_STORAGE_KEY) ||
    FALLBACK_DESTINATION_ID;

  return destinationRegistry[requestedDestination]
    ? requestedDestination
    : FALLBACK_DESTINATION_ID;
}

export const defaultDestinationId = getInitialDestinationId();
export const defaultDestinationPack = destinationRegistry[defaultDestinationId];

export function getDestinationPack(id) {
  return destinationRegistry[id] || destinationRegistry[FALLBACK_DESTINATION_ID];
}
