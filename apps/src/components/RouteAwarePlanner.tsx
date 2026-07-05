import { useMemo, useState } from 'react';
import { baselBase, sampleActivities } from '../data/sampleActivities';
import {
  buildRoutePlan,
  reflowPlan,
  type Pace,
  type PlanVariant,
  type TransportMode,
  type TravelerType,
} from '../lib/routePlanner';
import { ActivitySelector } from './ActivitySelector';
import { DayPlanCard } from './DayPlanCard';
import { DropIdeasBox } from './DropIdeasBox';
import { PlanVariantTabs } from './PlanVariantTabs';
import { ReflowPanel, type ReflowReason } from './ReflowPanel';
import '../styles/routePlanner.css';

export function RouteAwarePlanner() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['rhine-walk', 'basel-old-town', 'paper-mill', 'toy-worlds']);
  const [variant, setVariant] = useState<PlanVariant>('best-flow');
  const [travelerType, setTravelerType] = useState<TravelerType>('family');
  const [pace, setPace] = useState<Pace>('relaxed');
  const [transportMode, setTransportMode] = useState<TransportMode>('mixed');
  const [availableMinutes, setAvailableMinutes] = useState(300);
  const [weather, setWeather] = useState<'sunny' | 'cloudy' | 'rainy' | 'hot' | 'cold'>('cloudy');
  const [ideas, setIdeas] = useState('');

  const selectedActivities = useMemo(
    () => sampleActivities.filter((activity) => selectedIds.includes(activity.id)),
    [selectedIds],
  );

  const plannerInput = useMemo(
    () => ({
      start: baselBase,
      end: baselBase,
      availableMinutes,
      travelerType,
      pace,
      transportMode,
      variant,
      weather,
      selectedActivities,
    }),
    [availableMinutes, travelerType, pace, transportMode, variant, weather, selectedActivities],
  );

  const plan = useMemo(() => buildRoutePlan(plannerInput), [plannerInput]);

  function toggleActivity(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function handleReflow(reason: ReflowReason) {
    const next = reflowPlan(plannerInput, reason);
    setVariant(next.variant);
    setPace(next.pace);
    setAvailableMinutes(next.availableMinutes);
    if (next.weather) setWeather(next.weather);
    setSelectedIds(next.selectedActivities.map((activity) => activity.id));
  }

  return (
    <main className="route-planner-page">
      <section className="route-hero">
        <div>
          <p className="eyebrow">Route-aware city planner</p>
          <h1>Turn places into a plan.</h1>
          <p>
            Choose what you want to do, set your time, and get the smartest route for your city day.
          </p>
        </div>
        <div className="route-hero__promise">
          <strong>Product wedge</strong>
          <span>The best order for your day — not another loose attraction list.</span>
        </div>
      </section>

      <section className="planner-controls planner-card">
        <div>
          <label>Available time</label>
          <select value={availableMinutes} onChange={(event) => setAvailableMinutes(Number(event.target.value))}>
            <option value={180}>3 hours</option>
            <option value={240}>4 hours</option>
            <option value={300}>5 hours</option>
            <option value={420}>7 hours</option>
          </select>
        </div>
        <div>
          <label>Traveler type</label>
          <select value={travelerType} onChange={(event) => setTravelerType(event.target.value as TravelerType)}>
            <option value="family">Family</option>
            <option value="business">Business free time</option>
            <option value="couple">Couple</option>
            <option value="solo">Solo</option>
          </select>
        </div>
        <div>
          <label>Pace</label>
          <select value={pace} onChange={(event) => setPace(event.target.value as Pace)}>
            <option value="relaxed">Relaxed</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>
        <div>
          <label>Movement</label>
          <select value={transportMode} onChange={(event) => setTransportMode(event.target.value as TransportMode)}>
            <option value="mixed">Mixed</option>
            <option value="walking">Walking</option>
            <option value="public">Public transport</option>
          </select>
        </div>
        <div>
          <label>Weather</label>
          <select value={weather} onChange={(event) => setWeather(event.target.value as typeof weather)}>
            <option value="sunny">Sunny</option>
            <option value="cloudy">Cloudy</option>
            <option value="rainy">Rainy</option>
            <option value="hot">Hot</option>
            <option value="cold">Cold</option>
          </select>
        </div>
      </section>

      <PlanVariantTabs active={variant} onChange={setVariant} />
      <DropIdeasBox value={ideas} onChange={setIdeas} />
      <ActivitySelector activities={sampleActivities} selectedIds={selectedIds} onToggle={toggleActivity} />
      <DayPlanCard plan={plan} />
      <ReflowPanel onReflow={handleReflow} />
    </main>
  );
}
