# TripOS Web — Basel Destination Pack

Mobile-first bilingual React + Vite trip companion shell. Basel is currently loaded as the first destination pack, preserving the original family-trip proof case while moving the app toward a reusable TripOS structure.

## Product shape

- Generic app shell: TripOS top-level naming, tabs, weather panel, day builder, activity discovery, food, checklist, safety, itinerary, and budget.
- First destination pack: Basel, including local activities, side trips, food/grocery guidance, train journey details, and local images.
- Destination-aware behavior: weather locations, base location, trip dates, day templates, budget categories, special plans, and checklist content come from the active pack.

## Basel pack

- Dates: 13.07–17.07
- Arrival Basel: 15:30
- Departure: 14:30
- Base: Aparthotel Adagio Basel City, Hammerstrasse 46, Basel
- Family food preference: vegetarian + halal, Middle Eastern cuisine welcome

## Current Basel features

- Dynamic weather panel using Open-Meteo no-key API
  - Basel / Zürich switch
  - Shows trip-date weather when those dates enter the forecast window
  - Falls back cleanly when July 13–17 is not available yet
- Parks and water options around Basel
  - Kannenfeldpark
  - Schützenmattpark
  - Merian Gardens / Park im Grünen
  - Birsköpfli water-side walk
  - Naturbad Riehen
- Optional Zürich half-day mode
  - Zürich activity card
  - When added to the day plan, Zürich suggestions appear automatically
  - Includes links for Zürich HB, Lindenhof, Lake Zürich/Bürkliplatz, halal/vegetarian lunch, and SBB
- Saint-Louis, France mode
  - When added to the day plan, Saint-Louis suggestions appear automatically
  - Includes tram/cross-border notes, bakery/park/playground ideas, and Google Maps links
- Existing v5 features retained
  - EN/DE language toggle
  - mobile-first layout
  - expandable cards
  - active favorites saved with localStorage
  - itinerary builder
  - budget calculator
  - food/grocery planner
  - emergency/safety tab
  - checklist saved with localStorage
  - local cinematic images

## Run locally

```bash
npm config set registry https://registry.npmjs.org/
npm install
npm run dev -- --host
```

Open the Network URL on your phone while both devices are on the same Wi‑Fi.

## Build

```bash
npm run build
```

## Weather note

The app fetches weather dynamically from Open-Meteo in the browser. Since the trip is future-dated, exact 13–17 July forecast appears only when the dates are within the API forecast window. Until then, the app tells the user clearly and keeps manual weather filters active.


## v7 image completion

All activity cards now have at least two local AI-generated image assets. Some secondary assets for newly added activities are cropped from generated multi-card sheets and upscaled for use as card imagery. They are planning visuals, not documentary photographs.

## v9 breakfast-included update

Breakfast is now marked as included in the reservation. This changes the food and budget model:

- Morning meal is covered by the hotel/aparthotel reservation.
- Main paid meal is lunch outside.
- Dinner is planned as a simple apartment meal when useful.
- Grocery shopping is reduced to snacks, water, fruit, picnic items, and simple dinner basics.
- Expected trip budget excluding hotel/flights adjusted to CHF 610–980 / approx. €634–1,019.
- Checklist now includes confirming breakfast times.

## v10 train-journey update

The trip now includes confirmed ICE journey details:

- Berlin → Basel: 13.07, ICE 371, departure 08:31, Gleis 8, arrival Basel 15:36.
- Basel → Berlin: 17.07, ICE 278, departure 14:25, Gleis 4, arrival Berlin 21:33.

App changes:

- Hero section now includes a Train Journey panel.
- Arrival/departure metric updated to 15:36 / 14:25.
- Arrival day itinerary is now train-aware and light.
- Departure day itinerary avoids risky half-day trips and stays near hotel/station.
- Checklist includes DB/ICE tickets, seat reservations, and train snacks.
- Budget wording now excludes hotel/train tickets rather than hotel/flights.
