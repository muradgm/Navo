import {
  destinationRegistry,
  defaultDestinationId,
  defaultDestinationPack,
  getDestinationPack as getDestinationPackFromData,
} from "../data/destinations/index.js";

export { destinationRegistry, defaultDestinationId, defaultDestinationPack };

export function getDestinationPack(id) {
  return getDestinationPackFromData(id);
}
