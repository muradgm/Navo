import { baselDestinationPack } from "./basel/index.js";

export const destinationPacks = {
  basel: baselDestinationPack,
};

export const destinationIds = Object.keys(destinationPacks);
export const destinationRegistry = destinationPacks;
export const defaultDestinationId = "basel";
export const defaultDestinationPack = baselDestinationPack;

export function getDestinationPack(id) {
  return destinationRegistry[id] || defaultDestinationPack;
}
