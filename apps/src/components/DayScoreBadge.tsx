import '../styles/routePlanner.css';

type Props = {
  score: number;
};

export function DayScoreBadge({ score }: Props) {
  const label = score >= 85 ? 'Strong day' : score >= 70 ? 'Good plan' : score >= 50 ? 'Needs tuning' : 'High risk';
  return (
    <div className="day-score" aria-label={`Day score ${score} out of 100`}>
      <span className="day-score__number">{score}</span>
      <span className="day-score__meta">/100</span>
      <span className="day-score__label">{label}</span>
    </div>
  );
}
