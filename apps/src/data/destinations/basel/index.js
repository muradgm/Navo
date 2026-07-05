export const BASEL_BASE_LOCATION = {
  label: 'Aparthotel Adagio Basel City',
  address: 'Hammerstrasse 46, Basel',
  mapQuery: 'Aparthotel Adagio Basel City Hammerstrasse 46 Basel'
};

export const BASEL_WEATHER_LOCATIONS = {
  basel: {
    label: 'Basel',
    latitude: 47.5596,
    longitude: 7.5886
  },
  zurich: {
    label: 'Zürich',
    latitude: 47.3769,
    longitude: 8.5417
  }
};

export const BASEL_TRIP_DATES = [
  '2026-07-13',
  '2026-07-14',
  '2026-07-15',
  '2026-07-16',
  '2026-07-17'
];

export const BASEL_FOOD_STRATEGY = {
  breakfastIncluded: true,
  lunchOutsideOnly: true,
  dinner: 'simple apartment meal',
  preferences: ['vegetarian', 'family-friendly']
};

export const BASEL_BUDGET_MODEL = {
  currency: 'CHF',
  excludes: ['hotel', 'train tickets'],
  expectedTripBudget: {
    min: 610,
    max: 980
  },
  dailyCosts: {
    lunch: 65,
    snackBuffer: 12
  }
};

export const baselDestinationPack = {
  id: 'basel',
  name: 'Basel',
  country: 'Switzerland',
  timezone: 'Europe/Zurich',
  baseLocation: BASEL_BASE_LOCATION,
  weatherLocations: BASEL_WEATHER_LOCATIONS,
  tripDates: BASEL_TRIP_DATES,
  foodStrategy: BASEL_FOOD_STRATEGY,
  budgetModel: BASEL_BUDGET_MODEL
};
