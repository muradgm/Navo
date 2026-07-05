import type { Activity } from '../lib/routePlanner';
import '../styles/routePlanner.css';

type Props = {
  activities: Activity[];
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function ActivitySelector({ activities, selectedIds, onToggle }: Props) {
  return (
    <section className="planner-card">
      <div className="section-heading">
        <p className="eyebrow">Drop ideas</p>
        <h2>Choose places for the day</h2>
        <p>Select 3–7 stops. The planner will turn them into a route-aware day.</p>
      </div>

      <div className="activity-grid">
        {activities.map((activity) => {
          const active = selectedIds.includes(activity.id);
          return (
            <button
              key={activity.id}
              type="button"
              className={`activity-card ${active ? 'is-selected' : ''}`}
              onClick={() => onToggle(activity.id)}
            >
              <span className="activity-card__category">{activity.category}</span>
              <strong>{activity.name}</strong>
              <span>{activity.area}</span>
              <span className="activity-card__badges">
                <em>{activity.costLevel}</em>
                <em>{activity.energy}</em>
                {activity.indoor ? <em>Indoor</em> : null}
                {activity.outdoor ? <em>Outdoor</em> : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
