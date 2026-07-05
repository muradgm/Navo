export type TravelerType = 'solo' | 'couple' | 'family' | 'business';
export type Pace = 'fast' | 'normal' | 'relaxed';
export type TransportMode = 'walking' | 'public' | 'mixed';
export type PlanVariant = 'best-flow' | 'family-calm' | 'fast-track' | 'rain-backup' | 'discovery';

export type Activity = {
  id: string;
  name: string;
  category: string;
  area: string;
  lat: number;
  lng: number;
  durationMinutes: number;
  kidFit: number; // 0-10
  energy: 'low' | 'medium' | 'high';
  indoor: boolean;
  outdoor: boolean;
  costLevel: '$' | '$$' | '$$$';
  priority?: number; // 1-5, user importance
  openingRisk?: 'low' | 'medium' | 'high';
  tags?: string[];
  parentNote?: string;
};

export type PlannerInput = {
  start: { label: string; lat: number; lng: number };
  end?: { label: string; lat: number; lng: number };
  availableMinutes: number;
  travelerType: TravelerType;
  pace: Pace;
  transportMode: TransportMode;
  variant: PlanVariant;
  weather?: 'sunny' | 'cloudy' | 'rainy' | 'hot' | 'cold';
  selectedActivities: Activity[];
};

export type RouteStop = Activity & {
  order: number;
  arrivalMinute: number;
  leaveMinute: number;
  travelFromPreviousMinutes: number;
  routeReason: string;
};

export type RoutePlan = {
  variant: PlanVariant;
  stops: RouteStop[];
  totalActivityMinutes: number;
  totalTravelMinutes: number;
  totalMinutes: number;
  dayScore: number;
  strengths: string[];
  risks: string[];
  routeReasons: string[];
};

const EARTH_RADIUS_KM = 6371;

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

export function estimateTravelMinutes(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
  mode: TransportMode,
) {
  const km = haversineKm(a, b);
  const multiplier = mode === 'walking' ? 1.35 : mode === 'public' ? 1.75 : 1.55;
  const speedKmh = mode === 'walking' ? 4.6 : mode === 'public' ? 15 : 9;
  const minutes = (km * multiplier) / speedKmh * 60;
  return Math.max(4, Math.round(minutes));
}

function paceFactor(pace: Pace) {
  if (pace === 'fast') return 0.85;
  if (pace === 'relaxed') return 1.2;
  return 1;
}

function energyPenalty(activity: Activity, input: PlannerInput) {
  if (input.variant === 'family-calm' || input.travelerType === 'family') {
    if (activity.energy === 'high') return 10;
    if (activity.energy === 'medium') return 4;
  }
  if (input.variant === 'fast-track' && activity.energy === 'low') return 2;
  return 0;
}

function weatherPenalty(activity: Activity, input: PlannerInput) {
  if (input.weather === 'rainy' && activity.outdoor && !activity.indoor) return 18;
  if (input.weather === 'hot' && activity.outdoor && activity.energy === 'high') return 10;
  return 0;
}

function activityFitBonus(activity: Activity, input: PlannerInput) {
  let bonus = 0;
  bonus += (activity.priority ?? 3) * 3;

  if (input.travelerType === 'family') bonus += activity.kidFit * 1.3;
  if (input.variant === 'family-calm') bonus += activity.kidFit * 1.8;
  if (input.variant === 'rain-backup' && activity.indoor) bonus += 16;
  if (input.variant === 'discovery' && activity.tags?.includes('hidden-gem')) bonus += 14;
  if (input.variant === 'fast-track' && activity.durationMinutes <= 90) bonus += 8;

  return bonus;
}

function scoreNextStop(
  current: { lat: number; lng: number },
  activity: Activity,
  input: PlannerInput,
) {
  const travel = estimateTravelMinutes(current, activity, input.transportMode);
  const travelCost = input.variant === 'fast-track' ? travel * 1.55 : travel * 1.15;
  return activityFitBonus(activity, input) - travelCost - energyPenalty(activity, input) - weatherPenalty(activity, input);
}

function chooseNextStop(
  current: { lat: number; lng: number },
  remaining: Activity[],
  input: PlannerInput,
) {
  return [...remaining].sort((a, b) => scoreNextStop(current, b, input) - scoreNextStop(current, a, input))[0];
}

export function buildRoutePlan(input: PlannerInput): RoutePlan {
  const remaining = [...input.selectedActivities];
  const ordered: Activity[] = [];
  let current = input.start;

  while (remaining.length) {
    const next = chooseNextStop(current, remaining, input);
    ordered.push(next);
    current = next;
    remaining.splice(remaining.findIndex((item) => item.id === next.id), 1);
  }

  const stops: RouteStop[] = [];
  let minute = 0;
  let totalTravelMinutes = 0;

  ordered.forEach((activity, index) => {
    const previous = index === 0 ? input.start : ordered[index - 1];
    const travel = estimateTravelMinutes(previous, activity, input.transportMode);
    const duration = Math.round(activity.durationMinutes * paceFactor(input.pace));
    totalTravelMinutes += travel;
    minute += travel;

    stops.push({
      ...activity,
      order: index + 1,
      arrivalMinute: minute,
      leaveMinute: minute + duration,
      travelFromPreviousMinutes: travel,
      routeReason: createStopReason(activity, index, input, travel),
    });

    minute += duration;
  });

  if (input.end) {
    const last = ordered[ordered.length - 1] ?? input.start;
    const back = estimateTravelMinutes(last, input.end, input.transportMode);
    totalTravelMinutes += back;
    minute += back;
  }

  const totalActivityMinutes = stops.reduce((sum, stop) => sum + Math.round(stop.durationMinutes * paceFactor(input.pace)), 0);
  const totalMinutes = totalActivityMinutes + totalTravelMinutes;

  return {
    variant: input.variant,
    stops,
    totalActivityMinutes,
    totalTravelMinutes,
    totalMinutes,
    dayScore: calculateDayScore(input, totalMinutes, totalTravelMinutes, stops),
    strengths: buildStrengths(input, stops, totalMinutes, totalTravelMinutes),
    risks: buildRisks(input, stops, totalMinutes, totalTravelMinutes),
    routeReasons: buildRouteReasons(input, stops),
  };
}

function createStopReason(activity: Activity, index: number, input: PlannerInput, travel: number) {
  if (index === 0) return `Strong starting stop: ${activity.name} is a practical first move from ${input.start.label}.`;
  if (input.variant === 'family-calm' && activity.kidFit >= 8) return `Placed here as a kid-friendly reset after earlier movement.`;
  if (input.variant === 'rain-backup' && activity.indoor) return `Kept in the route because it works well as a rain-safe stop.`;
  if (travel <= 12) return `Good sequence: the previous stop is close, keeping movement low.`;
  return `Included here because it still fits the route without excessive backtracking.`;
}

function calculateDayScore(input: PlannerInput, totalMinutes: number, travelMinutes: number, stops: RouteStop[]) {
  let score = 100;
  const overTime = Math.max(0, totalMinutes - input.availableMinutes);
  score -= overTime * 0.45;
  score -= Math.max(0, travelMinutes - input.availableMinutes * 0.25) * 0.3;

  if (input.travelerType === 'family') {
    const averageKidFit = stops.reduce((sum, s) => sum + s.kidFit, 0) / Math.max(1, stops.length);
    score += (averageKidFit - 6) * 2;
    if (stops.filter((s) => s.energy === 'high').length > 1) score -= 8;
  }

  if (input.weather === 'rainy') {
    const outdoorOnly = stops.filter((s) => s.outdoor && !s.indoor).length;
    score -= outdoorOnly * 8;
  }

  if (stops.length >= 3 && stops.length <= 6) score += 4;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function buildStrengths(input: PlannerInput, stops: RouteStop[], totalMinutes: number, travelMinutes: number) {
  const strengths: string[] = [];
  if (totalMinutes <= input.availableMinutes) strengths.push('Fits inside your available time.');
  if (travelMinutes <= input.availableMinutes * 0.25) strengths.push('Keeps travel time controlled.');
  if (input.travelerType === 'family' && stops.some((s) => s.kidFit >= 8)) strengths.push('Includes strong kid-friendly stops.');
  if (input.variant === 'rain-backup' && stops.some((s) => s.indoor)) strengths.push('Includes indoor backup options.');
  if (stops.length > 1) strengths.push('Creates a clear stop order instead of a loose list.');
  return strengths.slice(0, 5);
}

function buildRisks(input: PlannerInput, stops: RouteStop[], totalMinutes: number, travelMinutes: number) {
  const risks: string[] = [];
  if (totalMinutes > input.availableMinutes) risks.push(`Plan is ${totalMinutes - input.availableMinutes} minutes over your available time.`);
  if (travelMinutes > input.availableMinutes * 0.3) risks.push('Travel time is high compared with the day length.');
  if (input.weather === 'rainy' && stops.some((s) => s.outdoor && !s.indoor)) risks.push('Some outdoor stops may be weak in rain.');
  if (stops.some((s) => s.openingRisk === 'high')) risks.push('One or more stops needs opening hours verified.');
  if (input.travelerType === 'family' && stops.filter((s) => s.energy === 'high').length > 1) risks.push('The plan may be too demanding with kids.');
  if (!risks.length) risks.push('No major route risk detected, but verify opening hours and transport on the day.');
  return risks.slice(0, 5);
}

function buildRouteReasons(input: PlannerInput, stops: RouteStop[]) {
  const reasons = [
    `Starts from ${input.start.label}.`,
    'Orders selected places by route fit, travel time, traveler type, and day mode.',
  ];

  if (input.end) reasons.push(`Ends near ${input.end.label}.`);
  if (input.travelerType === 'family') reasons.push('Balances kid fit and energy level instead of only shortest distance.');
  if (input.variant === 'fast-track') reasons.push('Prioritizes short stops and low travel time.');
  if (input.variant === 'family-calm') reasons.push('Prioritizes calmer stops, fewer high-energy jumps, and kid-friendly pacing.');
  if (input.variant === 'rain-backup') reasons.push('Prioritizes indoor and weather-safe options.');
  if (stops.length) reasons.push(`First recommended stop: ${stops[0].name}.`);

  return reasons;
}

export function minutesToLabel(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins}m`;
  if (!mins) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function reflowPlan(input: PlannerInput, reason: 'tired' | 'hungry' | 'rain' | 'late' | 'skip-next' | 'extra-hour'): PlannerInput {
  if (reason === 'tired') return { ...input, pace: 'relaxed', variant: 'family-calm', selectedActivities: input.selectedActivities.filter((a) => a.energy !== 'high') };
  if (reason === 'hungry') return { ...input, selectedActivities: [...input.selectedActivities].sort((a, b) => Number(b.tags?.includes('food')) - Number(a.tags?.includes('food'))) };
  if (reason === 'rain') return { ...input, weather: 'rainy', variant: 'rain-backup' };
  if (reason === 'late') return { ...input, availableMinutes: Math.max(90, input.availableMinutes - 60), variant: 'fast-track' };
  if (reason === 'skip-next') return { ...input, selectedActivities: input.selectedActivities.slice(1) };
  if (reason === 'extra-hour') return { ...input, availableMinutes: input.availableMinutes + 60 };
  return input;
}
