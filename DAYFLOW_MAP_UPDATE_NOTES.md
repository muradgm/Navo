# TripOS DayFlow Map Update Notes

## What changed

This update adds a first production-ready **TripOS DayFlow Map** to the existing Today planning flow.

The goal is to support the intended product wedge:

> Turn scattered places into the best route-aware day plan.

## Best-fit technical choice

For this project stage, the best fit is **real OpenStreetMap tile data with a custom TripOS route layer**.

This avoids locking the MVP into Google Maps UI while still showing real geographic map data. The app now uses:

- real Basel map tiles from OpenStreetMap
- real latitude/longitude coordinates for Basel activity stops
- a custom TripOS visual treatment over the map
- branded animated route line
- numbered route markers
- base/start marker
- Day Score overlay
- route variant status
- bottom-sheet UX inspired by mobility apps like Uber

## Why this option fits the project

A full Mapbox/MapLibre integration is still a good future step, but for this MVP the better move is a lightweight custom map layer because it:

- keeps the current app simple
- avoids new runtime dependencies
- builds successfully inside the current Vite app
- proves the branded route-map experience quickly
- creates a real visual difference from generic Google Maps
- supports the “ownable experience layer” strategy

## Files changed

- `apps/src/main.jsx`
  - Added `TripOSDayFlowMap`
  - Added real coordinate mapping for Basel activities
  - Added Web Mercator projection utilities
  - Added OpenStreetMap tile-grid rendering
  - Added branded SVG route layer
  - Inserted the DayFlow Map into the existing `RouteAwareDayPanel`

- `apps/src/navo.css`
  - Added DayFlow Map visual system
  - Added custom map tile treatment
  - Added animated gradient route line
  - Added stop marker UI
  - Added bottom-sheet UX
  - Added responsive behavior

- `apps/dist/`
  - Rebuilt production output successfully

## Validation

Ran:

```bash
npm install --no-audit --no-fund
npm run build
```

Result:

```txt
✓ built successfully
```

## Current limitation

This MVP uses real map tiles and real stop coordinates, but the route line is currently drawn as a branded route path between ordered stops. It does not yet call a live routing engine for exact walking/transit street geometry.

## Next technical step

The next step is to connect a real routing engine:

- Mapbox Directions API
- OpenRouteService
- GraphHopper
- Google Directions API
- MapLibre + custom vector tiles

The best next feature should be:

> Selected places → optimized stop order → exact walking/transit route geometry → TripOS styled route layer.
