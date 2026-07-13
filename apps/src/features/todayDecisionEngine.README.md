# Today Decision Engine foundation

The Today Decision Engine is the product layer that turns the active destination pack plus current trip context into a recommended next move.

## Contract

Input:

```js
buildTodayDecision(destination, {
  weather,
  energy,
  budgetEur,
  selectedIds,
  lang,
  convertToEur,
});
```

Output:

```js
{
  destinationId,
  label,
  primaryPlan,
  backupPlan,
  avoidedOptions,
  confidence,
  riskFlags,
}
```

## Current scope

This is a deterministic foundation, not an AI call.

It scores activities by:

- already selected items
- weather fit
- traveler energy
- budget pressure
- family suitability
- route friction from destination route metadata

## Product rule

The engine must never pretend to know live conditions it does not have. It can use the active weather mood and destination data, but it should keep explanations practical and constraint-based.

## Next integration step

Wire `buildTodayDecision()` into the Today tab as a visible “Best next move” panel above the current route-aware day builder.
