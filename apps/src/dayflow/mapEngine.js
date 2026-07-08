export const DAYFLOW_MAP_ENGINES = {
  STATIC_TILE_MOSAIC: "static-tile-mosaic",
  MAPLIBRE: "maplibre",
};

export const DAYFLOW_MAP_ENGINE_STATUS = {
  PLACEHOLDER: "placeholder",
  READY: "ready",
  EXPERIMENTAL: "experimental",
};

export const dayFlowMapEngine = Object.freeze({
  id: DAYFLOW_MAP_ENGINES.STATIC_TILE_MOSAIC,
  status: DAYFLOW_MAP_ENGINE_STATUS.PLACEHOLDER,
  label: {
    en: "Static map preview",
    de: "Statische Kartenvorschau",
  },
  note: {
    en: "Temporary visual map layer. Interactive map engine comes next.",
    de: "Temporäre Kartenansicht. Interaktive Karten-Engine folgt als Nächstes.",
  },
});
