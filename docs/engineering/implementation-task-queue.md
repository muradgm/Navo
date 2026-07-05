# Implementation Task Queue

## P1 — Extract Generic Product Foundation

### FS-P1-001 — Convert Basel app into generic TripOS shell

Owner: FS

Objective:
- Replace Basel-specific top-level app naming with generic TripOS structure.
- Keep Basel as first destination pack.

Acceptance:
- Basel still works.
- Generic components do not hardcode Basel-specific side trips.

### DATA-P1-001 — Create destination pack schema

Owner: DATA

Objective:
- Define typed destination/activity schema.
- Move Basel content into `data/destinations/basel`.

Acceptance:
- every activity has cost, duration, image, links, transport note.

### UX-P1-001 — Design trip setup wizard

Owner: UX

Objective:
- Create mobile-first flow for entering destination, dates, base, travelers, food, budget.

Acceptance:
- flow can be completed in under 2 minutes.

### AI-P1-001 — Build recommendation scoring service

Owner: AI

Objective:
- Create deterministic scoring logic for activity recommendations.

Acceptance:
- score changes based on weather, budget, traveler type, time window.

### QA-P1-001 — Build regression checklist

Owner: QA

Objective:
- Define manual and automated checks for planner behavior.

Acceptance:
- covers Add, favorite, filters, day builder, weather fallback, language toggle.
