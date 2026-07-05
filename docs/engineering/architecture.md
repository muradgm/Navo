# Architecture

## Recommended MVP Architecture

Frontend-first MVP:

- React + Vite + TypeScript
- local static city packs
- browser localStorage for saved trips
- Open-Meteo for weather
- Google Maps links for routing/photos

Backend later:

- Node.js + Express
- MongoDB
- auth/saved trips
- city data CMS/admin
- API integrations for places/weather/transport

## Frontend Modules

```txt
src/
  app/
  components/
  data/
  features/
    trip-setup/
    activities/
    day-builder/
    weather/
    budget/
    food/
    safety/
    favorites/
  hooks/
  services/
  types/
  utils/
```

## Core Domain Types

- Trip
- TravelerProfile
- Destination
- Activity
- DayPlan
- FoodPreference
- BudgetProfile
- WeatherSnapshot
- TransportNote
- EssentialPlace
- SideTrip

## Data Principle

Separate generic product logic from city-specific content.

Bad:

```txt
if city === Basel show Saint-Louis
```

Good:

```txt
destination.sideTrips[]
```

## Weather

Use a service wrapper:

```txt
weatherService.getForecast({ lat, lon, startDate, endDate })
```

Do not let components call APIs directly.
