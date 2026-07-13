# Navo Geo Manifests

This folder is the source of truth for map-ready points of interest.

The goal is to stop scattering coordinates across UI components and destination files. Every POI used by DayFlow, map layers, route providers, offline trip packs, and future feedback tools should eventually be represented here.

## Files

- `model.js`: geo point factory, validation helpers, categories, confidence levels.
- `basel.js`: Basel geo manifest.
- `barcelona.js`: Barcelona geo manifest.
- `index.js`: registry helpers for app-level access.

## Confidence levels

- `verified`: exact coordinates manually checked against a trusted map/source.
- `good`: coordinates are likely correct and safe for planning, but still need final verification.
- `needs-check`: usable as a placeholder only. Do not treat as high-confidence routing data.

## Rules

1. UI components should read coordinates from this folder, not from local hardcoded maps.
2. New map features should use `getDestinationGeoManifest(destinationId)`.
3. A point with `needs-check` must stay visible as low-confidence data until verified.
4. Route providers should surface confidence in warnings.
5. User feedback should eventually attach to `geoPointId`.

## Next integration step

Refactor DayFlow to read coordinates through this registry instead of the inline `dayFlowCoordinates` object in `main.jsx`.
