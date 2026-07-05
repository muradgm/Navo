import '../styles/routePlanner.css';

export type ReflowReason = 'tired' | 'hungry' | 'rain' | 'late' | 'skip-next' | 'extra-hour';

const actions: { id: ReflowReason; label: string; description: string }[] = [
  { id: 'tired', label: 'We are tired', description: 'Lower energy, calmer stops.' },
  { id: 'hungry', label: 'We are hungry', description: 'Move food-friendly logic earlier.' },
  { id: 'rain', label: 'It started raining', description: 'Switch to indoor backup.' },
  { id: 'late', label: 'We are late', description: 'Compress the plan.' },
  { id: 'skip-next', label: 'Skip next stop', description: 'Remove the first remaining stop.' },
  { id: 'extra-hour', label: 'We have extra time', description: 'Loosen the time limit.' },
];

type Props = {
  onReflow: (reason: ReflowReason) => void;
};

export function ReflowPanel({ onReflow }: Props) {
  return (
    <section className="planner-card">
      <div className="section-heading">
        <p className="eyebrow">Reflow</p>
        <h2>When the day changes, fix the plan</h2>
        <p>Travel days rarely go perfectly. Reflow recalculates around what changed.</p>
      </div>

      <div className="reflow-grid">
        {actions.map((action) => (
          <button key={action.id} type="button" onClick={() => onReflow(action.id)}>
            <strong>{action.label}</strong>
            <span>{action.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
