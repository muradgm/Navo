# Foundation Extraction Notes

This branch starts the extraction from a single large Basel prototype into a reusable Navo app foundation.

## What exists in this branch

- `apps/src/services/weatherService.js`
  - Open-Meteo forecast fetching
  - weather code labeling
  - weather classification into app-level states

- `apps/src/hooks/useStoredState.js`
  - reusable localStorage-backed state hook
  - safe read/write handling

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

`apps/src/main.jsx` is not wired to these modules in this branch. That should be the next commit after reviewing the scaffolding, because the current file is large and behavior-heavy.

## Next safe commit

1. Import `useStoredState` from `hooks/useStoredState.js`.
2. Delete the local `useStoredState` implementation from `main.jsx`.
3. Import weather helpers from `services/weatherService.js`.
4. Keep the current `useTripWeather` hook behavior unchanged while delegating fetch/parsing to the service.
5. Import Basel base metadata from `data/destinations/basel/index.js`.
6. Replace only the matching constants in `main.jsx`.

## Rule

No UI redesign and no feature changes until the app shell and destination pack are separated.
