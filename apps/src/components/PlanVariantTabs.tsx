import type { PlanVariant } from '../lib/routePlanner';
import '../styles/routePlanner.css';

const variants: { id: PlanVariant; label: string; description: string }[] = [
  { id: 'best-flow', label: 'Best Flow', description: 'Balanced route, time, and variety.' },
  { id: 'family-calm', label: 'Family Calm', description: 'Less chaos, better kid pacing.' },
  { id: 'fast-track', label: 'Fast Track', description: 'Best for short time windows.' },
  { id: 'rain-backup', label: 'Rain Backup', description: 'Indoor and weather-safe stops.' },
  { id: 'discovery', label: 'Discovery', description: 'Adds more hidden-gem logic.' },
];

type Props = {
  active: PlanVariant;
  onChange: (variant: PlanVariant) => void;
};

export function PlanVariantTabs({ active, onChange }: Props) {
  return (
    <div className="variant-tabs" role="tablist" aria-label="Plan variants">
      {variants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          className={`variant-tab ${active === variant.id ? 'is-active' : ''}`}
          onClick={() => onChange(variant.id)}
        >
          <span>{variant.label}</span>
          <small>{variant.description}</small>
        </button>
      ))}
    </div>
  );
}
