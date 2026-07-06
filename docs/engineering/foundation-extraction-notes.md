# Foundation Extraction Notes

This branch starts the extraction from a single large Basel prototype into a reusable Navo app foundation.

## What exists in this branch

- `apps/src/services/weatherService.js`
  - Open-Meteo forecast fetching
  - weather code labeling
  - current app-compatible weather mood classification
  - preserves the current returned day shape

- `apps/src/hooks/useTripWeather.js`
  - reusable weather hook
  - preserves the current loading and error state shape from `main.jsx`
  - delegates API fetch and parsing to `weatherService.js`

- `apps/src/hooks/useStoredState.js`
  - reusable localStorage-backed state hook
  - safe read and write handling

- `apps/src/data/destinations/basel/index.js`
  - Basel destination metadata scaffold
  - base location
  - weather locations
  - trip dates
  - food strategy
  - budget model

- `apps/src/data/destinations/basel/routeMeta.js`
  - first pass at extracting Basel route metadata

## Not done yet

`apps/src/main.jsx` is partially wired to the new hooks and destination registry, but it still retains the full local Basel pack data. The registry scaffolding exists, however the external Basel destination pack is not yet complete enough to replace the local pack safely.

## Next safe commit

1. Import `useStoredState` from `hooks/useStoredState.js`.
2. Delete the local `useStoredState` implementation from `main.jsx`.
3. Import `useTripWeather` from `hooks/useTripWeather.js`.
4. Delete the local weather helper and hook implementation from `main.jsx`.
5. Import Basel base metadata from `data/destinations/basel/index.js`.
6. Replace only the matching constants in `main.jsx`.

## Rule

No UI redesign and no feature changes until the app shell and destination pack are separated.
