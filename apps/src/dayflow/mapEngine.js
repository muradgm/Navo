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
  id: DAYFLOW_MAP_ENGINES.MAPLIBRE,
  status: DAYFLOW_MAP_ENGINE_STATUS.EXPERIMENTAL,
  label: {
    en: "Interactive map preview",
    de: "Interaktive Kartenvorschau",
  },
  note: {
    en: "Interactive map engine preview. Routing intelligence comes next.",
    de: "Interaktive Karten-Engine-Vorschau. Routenintelligenz folgt als Nächstes.",
  },
});
