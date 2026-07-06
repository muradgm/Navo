import { baselDestinationPack } from "./basel/index.js";
import { barcelonaDestinationPack } from "./barcelona/index.js";

export const destinationPacks = {
  basel: baselDestinationPack,
  barcelona: barcelonaDestinationPack,
};

export const destinationIds = Object.keys(destinationPacks);
export const destinationRegistry = destinationPacks;
export const defaultDestinationId = "basel";
export const defaultDestinationPack = baselDestinationPack;

export function getDestinationPack(id) {
  return destinationRegistry[id] || defaultDestinationPack;
}
