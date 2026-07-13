# Navo Decision Engine V2 Architecture

## Status

Proposed architecture direction.

This document turns the senior technical review into an executable product and engineering plan. It should guide the next phase after the current DayFlow map cleanup is completed.

## Executive direction

Navo must not become a broad destination dashboard, generic AI travel assistant, booking marketplace, or social travel product.

The defensible core is narrower:

> Navo builds a feasible route-aware day plan, explains why that sequence is better, and adapts the remaining day when reality changes.

The next product milestone is one reliable vertical slice:

1. The user enters 3-7 places.
2. Navo builds a feasible day route.
3. Navo explains the order, tradeoffs, and data confidence.
4. The user can reflow the remaining day when late, tired, hungry, or blocked by weather.

## Product rules

1. The recommendation must come before supporting data.
2. The engine must never pretend estimated data is live.
3. The engine must separate impossible options from merely weak options.
4. The UI must not expose raw internal scores by default.
5. Reflow must preserve completed stops.
6. Destination packs must be validated before registration.
7. LLMs may parse, summarize, translate, and explain, but must not override deterministic feasibility.

## Current architectural gap

The current system has useful surfaces:

- destination packs
- Today decision logic
- DayFlow map
- route metadata
- selected stop state
- bilingual UI

But the central intelligence is still closer to an activity sorter than a feasible route planner.

The biggest problem is that the current route metadata is not a route model. A day planner needs stop-to-stop relationships, not only approximate per-place metadata.

Example of insufficient information:

```txt
hotel -> museum = 20 minutes
hotel -> park = 25 minutes
```

What the engine also needs:

```txt
museum -> park
park -> lunch
lunch -> old town
old town -> hotel
```

## Target domain model

### GeoPoint

```ts
interface GeoPoint {
  lat: number;
  lng: number;
}
```

### Money

```ts
interface Money {
  amount: number;
  currency: string;
  basis: "per_person" | "group" | "unknown";
  confidence: "verified" | "estimated" | "unknown";
}
```

### Place

```ts
interface Place {
  id: string;
  name: {
    en: string;
    de: string;
  };
  location: GeoPoint;
  address?: string;
  area?: string;
  sourceUrl?: string;
  geoConfidence: "verified" | "good" | "needs-check";
}
```

### Activity

```ts
interface Activity extends Place {
  type: string;
  category: string;
  indoor: boolean;
  outdoor: boolean;
  familyScore: number;
  defaultDurationMin: number;
  cost?: Money;
  openingHours?: OpeningHours;
  reservation?: ReservationRequirement;
}
```

### TravelEdge

```ts
interface TravelEdge {
  fromPlaceId: string;
  toPlaceId: string;
  mode: "walk" | "transit" | "bike" | "car";
  durationMin: number;
  distanceMeters?: number;
  transfers?: number;
  exposedWalkMin?: number;
  confidence: "estimated" | "cached" | "live";
  retrievedAt?: string;
  source?: string;
}
```

### DecisionContext

```ts
interface DecisionContext {
  now: string;
  timezone: string;
  startLocation: GeoPoint;
  endLocation?: GeoPoint;
  availableFrom: string;
  availableUntil: string;

  traveler: {
    adults: number;
    childrenAges: number[];
    mobility?: "standard" | "reduced";
    pace: "slow" | "normal" | "fast";
  };

  preferences: {
    mustDoIds: string[];
    preferredIds: string[];
    optionalIds: string[];
    excludedIds: string[];
    categories: string[];
    maxWalkingMin?: number;
    maxTransfers?: number;
  };

  state: {
    energy: "low" | "medium" | "high";
    hunger: "not_hungry" | "soon" | "hungry";
    weather: WeatherSnapshot;
    remainingBudget?: Money;
    completedIds: string[];
    skippedIds: string[];
  };
}
```

### DayPlan

```ts
interface DayPlan {
  id: string;
  variant: PlanVariant;
  stops: PlanStop[];
  travelSegments: TravelSegment[];
  totalDurationMin: number;
  totalTravelMin: number;
  totalWalkingMin?: number;
  totalCost?: Money;
  score: PlanScore;
  confidence: ConfidenceSummary;
  reasons: ReasonCode[];
  warnings: WarningCode[];
  rejected: RejectedActivity[];
}
```

## Engine pipeline

```txt
Context ingestion
      ↓
Data normalization
      ↓
Hard-constraint filtering
      ↓
Candidate plan generation
      ↓
Route and schedule simulation
      ↓
Multi-objective scoring
      ↓
Plan diversification
      ↓
Structured explanation generation
      ↓
Confidence calculation
```

## Stage A: hard-constraint filtering

An activity becomes infeasible when any hard constraint is violated:

- explicitly excluded
- closed during every available time window
- cannot be reached in time
- cannot be completed before the day ends
- exceeds a strict budget ceiling
- violates accessibility requirements
- violates age restrictions
- requires an unavailable reservation
- route data is missing for a mandatory transfer

Every rejection must return a machine-readable code.

```ts
interface RejectedActivity {
  activityId: string;
  codes: RejectionCode[];
  severity: "hard" | "warning";
}
```

## Stage B: candidate generation

For the MVP, candidate generation can stay simple because selected places are usually small in number.

Rules:

- For 3-7 selected places, generate permutations with pruning.
- For larger lists, use greedy insertion.
- Always simulate the schedule before scoring.
- Always include the return-to-base edge when needed.

With seven places, 7! is 5,040 permutations. This is acceptable in the browser if we prune impossible paths early.

## Stage C: schedule simulation

Each candidate sequence must be converted into a timeline.

The simulation must account for:

- start time
- travel edges
- visit duration
- buffer time
- opening hours
- meal/rest anchors
- return-to-base time

The engine must never schedule overlapping activities or stops after closing.

## Stage D: plan scoring

Plan score must use named normalized dimensions rather than opaque magic numbers.

```ts
interface PlanScore {
  total: number;
  dimensions: {
    feasibility: number;
    routeEfficiency: number;
    timeFit: number;
    preferenceFit: number;
    familyFit: number;
    energyFit: number;
    weatherFit: number;
    budgetFit: number;
    variety: number;
    resilience: number;
  };
}
```

Suggested MVP weights:

| Dimension | Weight |
|---|---:|
| Feasibility | hard gate |
| Time fit | 20% |
| Route efficiency | 20% |
| User preference | 15% |
| Energy fit | 10% |
| Family fit | 10% |
| Weather fit | 10% |
| Budget fit | 10% |
| Variety | 3% |
| Resilience | 2% |

These weights are starting hypotheses. They must be tested against fixtures and adjusted through review.

## Plan variants

Variants should modify constraints and weights, not just UI copy.

### Best Flow

- balanced pace
- minimize backtracking
- moderate stop count

### Family Calm

- fewer transfers
- larger buffers
- fewer stops
- higher weight for family fit and low friction

### Fast Track

- maximize completed priorities
- shorter dwell times
- tolerate more movement

### Rain Backup

- prefer indoor stops
- reduce exposed walking
- avoid outdoor-heavy sequences

### Discovery

- add one novelty stop
- tolerate mild route deviation

## Reflow model

Reflow updates the remaining day. It must not rewrite completed history.

```ts
interface ReflowRequest {
  trigger:
    | "RUNNING_LATE"
    | "LOW_ENERGY"
    | "HUNGRY"
    | "WEATHER_CHANGED"
    | "SKIP_STOP"
    | "EXTRA_TIME";

  currentLocation: GeoPoint;
  now: string;
  completedIds: string[];
  skippedIds: string[];
}
```

Reflow outputs a new remaining plan plus an explanation of what changed.

## Confidence model

A score is not confidence.

Confidence should depend on:

- data completeness
- data freshness
- route reliability
- cost reliability
- opening-hours reliability
- weather freshness
- plan separation from alternatives

Display confidence as words:

- High confidence
- Moderate confidence
- Low confidence

Avoid percentage confidence until there is real calibration.

## Reason and rejection codes

The engine must return structured codes, not translated sentences.

Example:

```ts
interface ReasonCode {
  code: string;
  impact: "positive" | "negative" | "warning" | "neutral";
  dimension: keyof PlanScore["dimensions"];
  params?: Record<string, string | number | boolean>;
}
```

UI localization converts codes into German and English copy.

## Testing fixtures

The decision engine needs scenario fixtures.

Minimum fixture set:

```txt
family-rainy-half-day.json
low-energy-near-hotel.json
selected-place-is-closed.json
over-budget-must-do.json
two-distant-city-zones.json
late-start-with-booking-anchor.json
hungry-with-children.json
unknown-route-data.json
missing-opening-hours.json
all-options-infeasible.json
```

Each fixture must assert:

- feasible activities
- rejected activities
- chosen sequence
- total time
- travel time
- cost
- reason codes
- warning codes
- confidence level

## Engine invariants

The engine must never:

1. schedule overlapping activities
2. schedule a stop after closing
3. exceed available time without warning
4. exceed a hard budget
5. omit a must-do place silently
6. suggest completed activities again
7. route through an unavailable travel edge
8. describe estimated data as live
9. return an unexplained recommendation

## UI implications

The Today UI should become decision-first.

Recommended hierarchy:

```txt
Context header
Best Next Move
Today Flow
Why this plan
Reflow actions
Map
Alternatives
```

Raw activity scores, visible avoid lists, and confidence percentages should be removed or hidden behind detail views.

## Execution roadmap

### PR A — complete current map cleanup

- promote MapLibre wiring if it was pushed after merge
- confirm `main` renders
- confirm no red runtime console errors

### PR B — architecture source of truth

- add this document
- align roadmap to Decision Engine V2

### PR C — route edge model

- add `TravelEdge`
- add route matrix contract
- keep old `routeMeta` temporarily

### PR D — Basel cached travel matrix

- add first cached travel edges for Basel
- validate required stop-to-stop relationships

### PR E — decision context contract

- add `DecisionContext`
- separate traveler constraints, live context, and plan state

### PR F — first decision fixtures

- add fixture runner
- add rainy half-day, low-energy, over-budget, and closed-place cases

### PR G — candidate plan generation

- generate feasible candidate sequences
- simulate schedule
- score full plans instead of isolated activities

## Non-goals for this phase

Defer:

- bookings
- social features
- generic AI chat
- broad vacation automation
- more destinations
- creator/content feed
- full expense tracking

## Lead decision

Proceed with Navo, but narrow the next phase.

Do not expand breadth until the engine can prove that a recommended sequence is feasible, explain why it is better, and adapt the remaining day when reality changes.
