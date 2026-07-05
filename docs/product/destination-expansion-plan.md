# Destination Expansion Plan

## Purpose

Expand Navo from a Basel proof-of-concept into a reusable, intelligent destination-decision system.

This is not a "more cities" exercise. The real goal is:

> **Navo becomes a reusable, intelligent destination-decision system**
> with Barcelona, Munich, and Málaga as the next validation cities.

That means building the system first, then validating it with city packs, not just dumping raw city content into the app.

---

## Why this matters

Adding three new cities directly into `main.jsx` is the wrong first move. That approach makes the repo bigger without proving the core product.

The right move is to:

- build a reusable destination pack architecture,
- keep destination data isolated from app logic,
- and develop an intelligence layer that can rank, explain, and adapt plans.

---

## What “aware” means

A destination-aware planner should know:

- city content and destination metadata
- weather and forecast impact
- budget assumptions
- traveler context and intent
- route/area logic and friction

---

## What “intelligent” means

Intelligence is not just sorting or route-aware ordering.
It means Navo can:

- rank tradeoffs,
- adapt to weather, energy, time, and budget,
- explain why the chosen plan is best,
- surface backup and avoided options,
- flag risk factors.

---

## Recommended system structure

### Destination packs
Each city should be a structured destination pack, not hardcoded UI logic.

Suggested folder layout:

```txt
apps/src/data/destinations/
  basel/
    index.js
    activities.js
    food.js
    budget.js
    checklist.js
    routeMeta.js
    heroImages.js
  barcelona/
    index.js
    activities.js
    food.js
    budget.js
    checklist.js
    routeMeta.js
    heroImages.js
  munich/
    index.js
    activities.js
    food.js
    budget.js
    checklist.js
    routeMeta.js
    heroImages.js
  malaga/
    index.js
    activities.js
    food.js
    budget.js
    checklist.js
    routeMeta.js
    heroImages.js
```

Each pack should include:

- base location defaults
- weather coordinates
- activities
- food strategy
- grocery guidance
- daily budget assumptions
- route metadata
- safety notes
- checklists
- special plans
- hero image metadata
- tags for kids-friendly, rainy-safe, hot-weather fit, indoor/outdoor, low-cost, etc.

---

## Intelligence layer

Navo should answer more than “what fits.” It should answer:

- What is the best plan today?
- What is the backup plan?
- Why is this plan better?

Suggested result shape for Today Plan:

```json
{
  "primaryPlan": { ... },
  "backupPlan": { ... },
  "avoidedOptions": [ ... ],
  "explanation": [
    "Chosen because weather is hot and this route reduces outdoor walking.",
    "Budget stays under the target while keeping one premium activity."
  ],
  "confidence": 84,
  "riskFlags": [ "heat risk", "budget pressure" ]
}
```

The engine should consider:

- weather
- traveler energy
- available time
- budget
- interests
- city-specific friction
- route spread

---

## Image system

The current visual direction is strong, but images must be treated as a design system asset, not the product itself.

Use image assets as the official visual spec for future city hero generation, not just as decoration.

---

## Recommended rollout order

### Phase 1
- create destination pack contract and registry
- make Basel a first pack that follows the contract
- define the image style system

### Phase 2
- add Barcelona as the first full non-Basel destination pack

### Phase 3
- add the Navo intelligence engine v1

### Phase 4
- add Munich

### Phase 5
- add Málaga

---

## Acceptance criteria

- the destination pack system is reusable
- Basel remains the working example
- the app does not hardcode new city content into `main.jsx`
- the intelligence layer is defined separately
- the image system is documented
