import React, { useEffect, useMemo, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const rasterStyle = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};

function routeGeoJson(coordinates = []) {
  return {
    type: "FeatureCollection",
    features:
      coordinates.length > 1
        ? [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates,
              },
            },
          ]
        : [],
  };
}

function fitRoute(map, coordinates = []) {
  if (!coordinates.length) return;

  const bounds = coordinates.reduce(
    (acc, coordinate) => acc.extend(coordinate),
    new maplibregl.LngLatBounds(coordinates[0], coordinates[0]),
  );

  map.fitBounds(bounds, {
    padding: 72,
    maxZoom: 14,
    duration: 0,
  });
}

function syncRouteLayer(map, coordinates) {
  const data = routeGeoJson(coordinates);
  const existing = map.getSource("dayflow-route");

  if (existing) {
    existing.setData(data);
    return;
  }

  map.addSource("dayflow-route", {
    type: "geojson",
    data,
  });

  map.addLayer({
    id: "dayflow-route-shadow",
    type: "line",
    source: "dayflow-route",
    paint: {
      "line-color": "#0b1220",
      "line-opacity": 0.22,
      "line-width": 14,
      "line-blur": 4,
    },
  });

  map.addLayer({
    id: "dayflow-route-line",
    type: "line",
    source: "dayflow-route",
    paint: {
      "line-color": "#00c2a8",
      "line-width": 6,
      "line-opacity": 0.95,
    },
  });
}

export function DayFlowMapLibreLayer({
  geometry,
  markerPoints,
  lang,
  activeStopId,
  onSelectStop,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const routeCoordinates = useMemo(
    () => geometry.routeCoordinates || [],
    [geometry.routeCoordinates],
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: rasterStyle,
      center: geometry.center,
      zoom: 12.5,
      attributionControl: false,
    });

    mapRef.current.addControl(
      new maplibregl.NavigationControl({ visualizePitch: false }),
      "top-right",
    );

    mapRef.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right",
    );

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [geometry.center]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const sync = () => {
      syncRouteLayer(map, routeCoordinates);
      fitRoute(map, routeCoordinates);

      markersRef.current.forEach((marker) => marker.remove());

      markersRef.current = markerPoints.map((point) => {
        const isBase = point.stop.id === "base";
        const isActive = activeStopId === point.stop.id;
        const number = isBase ? "B" : point.index;
        const title = lang === "en" ? point.stop.en : point.stop.de;

        const element = document.createElement("button");
        element.type = "button";
        element.className = [
          "dayflow-maplibre-marker",
          isBase ? "base" : "",
          isActive ? "is-active" : "",
        ]
          .filter(Boolean)
          .join(" ");

        element.setAttribute(
          "aria-label",
          isBase
            ? lang === "en"
              ? "Base stop"
              : "Basis-Stopp"
            : lang === "en"
              ? `Select stop ${number}: ${title}`
              : `Stopp ${number} auswählen: ${title}`,
        );

        element.innerHTML = `<b>${number}</b><span>${title}</span>`;

        if (!isBase) {
          element.addEventListener("click", () => onSelectStop(point.stop));
          element.addEventListener("mouseenter", () => onSelectStop(point.stop));
          element.addEventListener("focus", () => onSelectStop(point.stop));
        }

        return new maplibregl.Marker({
          element,
          anchor: "center",
        })
          .setLngLat(point.stop.coordinates)
          .addTo(map);
      });
    };

    if (map.loaded()) {
      sync();
    } else {
      map.once("load", sync);
    }
  }, [activeStopId, lang, markerPoints, onSelectStop, routeCoordinates]);

  return <div className="dayflow-maplibre-layer" ref={containerRef} />;
}
