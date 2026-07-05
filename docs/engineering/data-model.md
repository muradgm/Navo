# Data Model

## Trip

```ts
export type Trip = {
  id: string;
  destinationId: string;
  title: string;
  startDate: string;
  endDate: string;
  arrival?: JourneyLeg;
  departure?: JourneyLeg;
  baseLocation?: BaseLocation;
  travelers: TravelerProfile;
  preferences: TripPreferences;
  dayPlans: DayPlan[];
};
```

## Activity

```ts
export type Activity = {
  id: string;
  destinationId: string;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  type: ActivityType;
  locationArea: string;
  costLevel: 'free' | 'low' | 'medium' | 'high';
  estimatedCostEUR: [number, number];
  durationMinutes: [number, number];
  kidFit: 'poor' | 'okay' | 'good' | 'excellent';
  businessFit: 'poor' | 'okay' | 'good' | 'excellent';
  weatherFit: WeatherFit[];
  energyLevel: 'low' | 'medium' | 'high';
  transport: TransportNote;
  links: ActivityLinks;
  images: ImageAsset[];
  missions?: LocalizedText[];
  tags: string[];
};
```

## Destination

```ts
export type Destination = {
  id: string;
  name: string;
  country: string;
  coordinates: { lat: number; lon: number };
  timezone: string;
  currency: string;
  publicTransportNotes: LocalizedText;
  activities: Activity[];
  essentials: EssentialPlace[];
  sideTrips: SideTrip[];
};
```

## LocalizedText

```ts
export type LocalizedText = {
  en: string;
  de: string;
};
```
