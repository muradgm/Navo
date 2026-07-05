# Personalization Engine

## Purpose

The personalization engine ranks and explains recommendations based on context.

## Inputs

Trip context:
- destination
- dates
- arrival/departure windows
- base location
- day selected

Traveler context:
- adults/children
- children ages
- business/leisure/family
- mobility
- food preferences
- interests
- budget
- energy

External context:
- weather
- opening hours
- public transport estimate
- distance
- cost

## Activity Score Draft

Activity score should not be purely popularity-based.

Suggested rough model:

```txt
score = purposeFit * 30
      + ageFit * 20
      + weatherFit * 15
      + distanceFit * 15
      + budgetFit * 10
      + timeWindowFit * 10
      - overloadPenalty
      - closedPenalty
```

## Explanation Requirement

Every recommendation should explain itself:

- why it fits
- what to watch out for
- best time to go
- expected cost
- transport note
- backup option

## Avoid Fake Precision

If opening hours, transport times, or weather are uncertain, say so clearly.
