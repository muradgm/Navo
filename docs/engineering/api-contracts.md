# API Contracts — Future Backend

## Trip Create

`POST /api/trips`

Request:

```json
{
  "destinationId": "basel",
  "startDate": "2026-07-13",
  "endDate": "2026-07-17",
  "baseLocation": {
    "label": "Aparthotel Adagio Basel City",
    "address": "Hammerstrasse 46, Basel"
  },
  "travelers": {
    "adults": 2,
    "childrenAges": [5, 11]
  },
  "preferences": {
    "food": ["vegetarian", "halal", "middleEastern"],
    "budgetMode": "careful",
    "transportMode": "publicTransport"
  }
}
```

Response:

```json
{
  "tripId": "trip_123",
  "status": "created"
}
```

## Recommendation Request

`POST /api/recommendations/day`

Request:

```json
{
  "tripId": "trip_123",
  "date": "2026-07-14",
  "weatherMode": "auto",
  "energy": "medium",
  "budgetEUR": 120
}
```

Response:

```json
{
  "recommendations": [],
  "warnings": [],
  "budgetEstimateEUR": [80, 130]
}
```
