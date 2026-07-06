import { baselDestinationPack } from "./basel/index.js";
import { barcelonaDestinationPack } from "./barcelona/index.js";
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

export const destinationPacks = Object.fromEntries(
  Object.entries(baseDestinationPacks).map(([id, pack]) => [
    id,
    {
      ...pack,
      ...(destinationVisuals[id] || fallbackDestinationVisuals),
    },
  ]),
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
