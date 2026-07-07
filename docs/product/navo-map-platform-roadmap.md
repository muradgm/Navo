# Navo Map Platform Roadmap

## Purpose

The map should become one of Navo's strongest product advantages. The goal is not to clone a generic map app. The goal is to build a decision-first travel map that helps a family choose the best next move based on place accuracy, route friction, weather, energy, budget, timing, accessibility, and local context.

Navo's map should answer:

> Where should we go next, how should we get there, what could go wrong, and what is the easiest backup?

## Product wedge

Generic maps optimize for navigation. Navo optimizes for a realistic day.

The map should combine:

- verified points of interest
- route-aware day planning
- multimodal transport comparison
- family pacing
- weather and energy context
- activity discovery
- offline trip safety
- user feedback loops

## Core principles

1. **Accuracy before beauty**
   - Every place must have verified coordinates, address, source URL, and confidence level.
   - Do not rely on approximate manual coordinates once the real map work begins.

2. **Decision-first, not layer-first**
   - The user should not see 100 pins by default.
   - Show the best next options, backups, and avoid-now options.

3. **Route friction matters more than distance**
   - Walking distance, transit transfers, stairs risk, weather exposure, kids' energy, food gaps, and return-to-base risk matter.

4. **Progressive enhancement**
   - Start with reliable route and POI data.
   - Add real map rendering.
   - Add real-time feeds only after the core map model is stable.

5. **Offline safety first**
   - Full offline map tiles can come later.
   - First offline feature should be a trip card with saved stops, addresses, coordinates, emergency info, and fallback directions.

## Map feature pillars

### 1. Verified POI source of truth

Each activity, food place, grocery, transport hub, park, and emergency location should have a normalized geo record.

Required fields:

```ts
export type NavoGeoPoint = {
  id: string;
  destinationId: string;
  category:
    | "activity"
    | "food"
    | "grocery"
    | "transport"
    | "emergency"
    | "toilet"
    | "playground"
    | "viewpoint"
    | "event";
  name: {
    en: string;
    de?: string;
    local?: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  address?: string;
  area?: string;
  sourceUrl?: string;
  mapQuery?: string;
  openingHours?: string;
  phone?: string;
  website?: string;
  confidence: "verified" | "good" | "needs-check";
  lastChecked?: string;
  tags?: string[];
};
```

Quality rules:

- `verified`: exact coordinates checked against a trusted map/source.
- `good`: likely correct, but not manually verified yet.
- `needs-check`: usable only as a planning placeholder.
- No route engine should treat `needs-check` as high confidence.

### 2. Real interactive map shell

Target behavior:

- zoom and pan
- clickable markers
- marker popups
- selected route overlay
- category layers
- current base location
- route sequence
- mobile bottom sheet
- keyboard navigation
- high-contrast mode

Candidate frontend map stack:

- MapLibre GL JS for the interactive map shell.
- GeoJSON sources for Navo-owned POIs, routes, and layers.
- Provider adapter layer for tiles, geocoding, directions, and transit.

Do not lock business logic to one provider.

### 3. Multimodal routing

The user should compare:

- walking
- public transit
- cycling
- driving
- taxi or ride-share estimate later

Each route option should expose:

```ts
export type NavoRouteOption = {
  id: string;
  mode: "walk" | "transit" | "bike" | "drive" | "taxi";
  durationMinutes: number;
  distanceMeters?: number;
  transferCount?: number;
  walkingMinutes?: number;
  costEstimate?: string;
  confidence: "live" | "estimated" | "static";
  warnings: NavoRouteWarning[];
  polyline?: string;
  provider: string;
};
```

Route warnings:

```ts
export type NavoRouteWarning =
  | "too-much-walking"
  | "many-transfers"
  | "weather-exposed"
  | "traffic-delay"
  | "transit-delay"
  | "late-arrival-risk"
  | "low-energy-risk"
  | "kids-fatigue-risk"
  | "accessibility-risk";
```

### 4. Decision Map

Every visible map item should have a contextual status:

- **Best now**
- **Good backup**
- **Maybe later**
- **Avoid now**

Inputs:

- weather
- live or estimated travel time
- energy level
- day budget
- trip purpose
- kids/family mode
- open/closed status
- food gap
- route friction
- distance from base/current location

This is where Navo becomes different from generic map tools.

### 5. Family Friction Score

Navo should calculate more than travel time.

Suggested scoring factors:

| Factor | Meaning |
|---|---|
| Walking load | Total walking minutes and distance |
| Transfer load | Number and complexity of transit changes |
| Weather exposure | Outdoor route and activity exposure |
| Food gap | Time until realistic food option |
| Toilet gap | Useful for families with kids |
| Stairs/accessibility risk | Future data source needed |
| Return-to-base risk | How hard it is to get back |
| Energy fit | Match with selected energy level |
| Cost pressure | Fit with selected day budget |

Output:

```ts
export type NavoFrictionScore = {
  score: number; // 0-100
  label: "easy" | "moderate" | "hard" | "avoid";
  reasons: string[];
};
```

### 6. Panic Reflow

A key Navo feature should be instant route repair.

Buttons:

- Kids are tired
- It started raining
- We are hungry
- We are late
- We have extra time
- We need a toilet
- We need to go back to base

Expected behavior:

- re-rank visible stops
- suggest one near alternative
- shorten route
- reduce walking
- prioritize indoor/food/base-safe options
- preserve already completed stops later

### 7. Smart Radius

The map should support distance/time filtering:

- 10 minutes from base
- 20 minutes from base
- 40 minutes from base
- near current stop
- near next meal
- near public transport

This is especially useful on travel arrival/departure days.

### 8. Activity and event integration

The map should become the visual layer for activity discovery.

Layers:

- selected day route
- all activities
- indoor options
- kids/family options
- low-cost options
- food
- groceries
- toilets
- parks/playgrounds
- hidden gems
- rainy-day backups
- events later

Filters:

- category
- date
- opening status
- budget
- distance/time radius
- weather-safe
- child-friendly
- accessibility-friendly

### 9. User feedback loop

Every marker should allow feedback:

- wrong location
- closed / wrong opening hours
- missing place
- bad for kids
- too expensive
- inaccessible
- duplicate

Feedback model:

```ts
export type NavoMapFeedback = {
  geoPointId: string;
  destinationId: string;
  type:
    | "wrong-location"
    | "wrong-hours"
    | "closed"
    | "missing-place"
    | "duplicate"
    | "accessibility-issue"
    | "not-family-friendly"
    | "other";
  note?: string;
  createdAt: string;
};
```

### 10. Offline trip pack

Start with lightweight offline support.

Offline pack v1 should include:

- selected stops
- coordinates
- addresses
- route order
- source links
- emergency contacts
- hotel/base address
- fallback Google/Apple Maps links
- food/grocery fallback list
- basic safety notes

Do not start with offline vector tile downloads. That is a later-stage feature.

## Technical architecture

### Layered map architecture

```txt
Destination pack data
  -> verified geo point model
  -> route provider adapters
  -> Navo route intelligence
  -> map presentation layer
  -> feedback and offline cache
```

### Provider adapters

Use adapters so Navo can switch providers later.

```ts
export interface RouteProvider {
  getRoute(input: RouteRequest): Promise<NavoRouteOption[]>;
}

export interface GeocodeProvider {
  geocode(query: string): Promise<NavoGeoPoint[]>;
  reverseGeocode(lat: number, lng: number): Promise<NavoGeoPoint | null>;
}

export interface TransitProvider {
  getDepartures(stopId: string): Promise<NavoTransitDeparture[]>;
  getServiceAlerts(destinationId: string): Promise<NavoTransitAlert[]>;
}
```

### Suggested provider categories

- map rendering: MapLibre-compatible map shell
- tile source: configurable
- geocoding: configurable
- directions: configurable
- transit: GTFS / GTFS-Realtime where available
- local events: destination-specific adapter later

## Implementation sequence

### Phase 1 — map source of truth

Goal: stop hardcoding scattered coordinate logic.

Tasks:

1. Create `apps/src/data/geo/`.
2. Add `geoPoints` model.
3. Add Basel geo manifest.
4. Add Barcelona geo manifest.
5. Add validation script for missing or invalid lat/lng.
6. Connect DayFlow to geo manifest instead of inline coordinates.

PR sequence:

1. `feat: add verified POI coordinate model`
2. `chore: add geo manifest validation script`
3. `refactor: route DayFlow coordinates through geo manifest`

### Phase 2 — interactive map shell

Goal: replace static tile composition with real map interaction.

Tasks:

1. Add map shell component.
2. Render GeoJSON markers.
3. Add popup content.
4. Add layers/toggles.
5. Preserve DayFlow route order.
6. Keep a fallback static map for failure/offline mode.

PR sequence:

1. `feat: add interactive map shell foundation`
2. `feat: render POI markers from geo manifest`
3. `feat: add map layer toggles`

### Phase 3 — route options

Goal: route comparison without overcomplicating the first version.

Tasks:

1. Add route provider interface.
2. Add mock/static route provider first.
3. Add walking/transit/driving route cards.
4. Add route warnings.
5. Add route score explanations.

PR sequence:

1. `feat: add route provider interface`
2. `feat: add multimodal route option cards`
3. `feat: add route friction warnings`

### Phase 4 — decision map

Goal: turn the map into a decision engine.

Tasks:

1. Add marker statuses: best now, backup, maybe later, avoid now.
2. Connect status to Today Decision Engine.
3. Add map legend.
4. Add decision explanations inside marker popups.
5. Add route repair suggestions.

PR sequence:

1. `feat: add map decision statuses`
2. `feat: connect map markers to Today Decision Engine`
3. `feat: add panic reflow map actions`

### Phase 5 — live data adapters

Goal: add real-time only after the local model works.

Tasks:

1. Add provider configuration layer.
2. Add live route adapter.
3. Add transit alerts/departures where available.
4. Add traffic warnings where available.
5. Add cache/fallback behavior.

PR sequence:

1. `feat: add map provider configuration`
2. `feat: add live route adapter foundation`
3. `feat: add transit alert adapter foundation`

### Phase 6 — offline trip pack

Goal: make the app useful when internet is weak.

Tasks:

1. Save selected route and POIs locally.
2. Add offline trip card.
3. Add export/share view.
4. Add fallback external map links.
5. Add emergency and base info.

PR sequence:

1. `feat: add offline trip pack model`
2. `feat: add offline trip card UI`
3. `feat: add exportable route summary`

## UX requirements

### Marker popup must show

- name
- category
- address
- opening hours if available
- route from base/current stop
- estimated time by mode
- why Navo recommends or avoids it
- add/remove from day
- report issue

### Route card must show

- mode
- duration
- walking load
- transfers
- cost estimate if available
- warnings
- why this route is good or bad

### Accessibility requirements

- keyboard navigation for markers and route list
- visible focus state
- screen-reader labels
- high-contrast mode
- reduced-motion support
- no information conveyed only by color

### Mobile requirements

- bottom sheet for selected stop
- thumb-friendly controls
- no horizontal overflow
- layer toggles collapsed by default
- route summary visible without zooming

## Acceptance criteria for the first serious map milestone

Navo Map v1 is acceptable when:

- all visible POIs come from a geo manifest
- every visible POI has lat/lng and confidence
- DayFlow route uses geo manifest coordinates
- user can select markers and route rows
- map has a selected stop detail surface
- route order and stop list stay synced
- map works on mobile without overflow
- app has a fallback when map data fails

## Non-goals for the next immediate milestone

Do not do these yet:

- full offline vector tile downloads
- full traffic heatmap
- complete event marketplace
- paid provider dependency lock-in
- complex account-based feedback moderation
- replacing all current DayFlow logic at once

## Immediate next PR after this document

```txt
feat: add verified POI coordinate model
```

This should create the first durable source of truth for map work.
