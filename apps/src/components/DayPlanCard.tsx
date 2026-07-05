import { minutesToLabel, type RoutePlan } from '../lib/routePlanner';
import { DayScoreBadge } from './DayScoreBadge';
import '../styles/routePlanner.css';

type Props = {
  plan: RoutePlan;
};

export function DayPlanCard({ plan }: Props) {
  return (
    <section className="planner-card plan-output">
      <div className="plan-output__header">
        <div>
          <p className="eyebrow">Smart Order</p>
          <h2>Your route-aware day plan</h2>
          <p>
            {minutesToLabel(plan.totalMinutes)} total · {minutesToLabel(plan.totalTravelMinutes)} movement · {plan.stops.length} stops
          </p>
        </div>
        <DayScoreBadge score={plan.dayScore} />
      </div>

      <ol className="route-timeline">
        {plan.stops.map((stop) => (
          <li key={stop.id} className="route-stop">
            <div className="route-stop__index">{stop.order}</div>
            <div className="route-stop__body">
              <div className="route-stop__topline">
                <h3>{stop.name}</h3>
                <span>{minutesToLabel(stop.travelFromPreviousMinutes)} from previous</span>
              </div>
              <p className="route-stop__meta">
                Arrive around +{minutesToLabel(stop.arrivalMinute)} · Leave around +{minutesToLabel(stop.leaveMinute)} · {stop.area}
              </p>
              <p>{stop.routeReason}</p>
              {stop.parentNote ? <p className="route-stop__note">Parent note: {stop.parentNote}</p> : null}
            </div>
          </li>
        ))}
      </ol>

      <div className="route-insights">
        <div>
          <h3>Why this route?</h3>
          <ul>
            {plan.routeReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Strengths</h3>
          <ul>
            {plan.strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Risks</h3>
          <ul>
            {plan.risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
