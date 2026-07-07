import React, { useMemo } from "react";
import {
  buildTodayDecision,
  formatDecisionSummary,
} from "./features/todayDecisionEngine.js";
import "./today-decision-widget.css";

const CHF_TO_EUR = 1.04;

function activityName(activity, lang) {
  return lang === "de" ? activity.de : activity.en;
}

function DecisionList({ title, items, lang, compact = false }) {
  if (!items?.length) return null;

  return (
    <div className={compact ? "decision-list compact" : "decision-list"}>
      <h4>{title}</h4>
      {items.map((item) => (
        <div className="decision-item" key={item.activity.id}>
          <div>
            <strong>{activityName(item.activity, lang)}</strong>
            <span>
              {item.activity.area} · CHF {item.activity.cost}
            </span>
          </div>
          <b>{item.score}</b>
          {!compact && item.reasons?.length > 0 && <p>{item.reasons[0]}</p>}
        </div>
      ))}
    </div>
  );
}

export function TodayDecisionWidget({
  destination,
  lang = "en",
  weather = "normal",
  energy = "medium",
  budgetEur = 120,
  selectedDay,
  selectedIds = [],
  onApplyPlan,
}) {
  const decision = useMemo(
    () =>
      buildTodayDecision(destination, {
        lang,
        weather,
        energy,
        budgetEur,
        selectedIds,
        convertToEur: (chf) => Math.round(chf * CHF_TO_EUR),
      }),
    [destination, lang, weather, energy, budgetEur, selectedIds],
  );

  const summary = formatDecisionSummary(decision, lang);

  const copy =
    lang === "de"
      ? {
          kicker: "Navo Entscheidung",
          title: "Beste nächste Entscheidung",
          subtitle:
            "Basierend auf Wetter, Energie, Budget, Tagesauswahl und Routen-Reibung.",
          primary: "Hauptplan",
          backup: "Backup",
          avoid: "Jetzt vermeiden",
          confidence: "Vertrauen",
          apply: "Hauptplan nutzen",
          empty:
            "Füge Aktivitäten hinzu oder nutze die Empfehlung, um einen klareren Tagesplan zu bekommen.",
        }
      : {
          kicker: "Navo Decision",
          title: "Best next move",
          subtitle:
            "Based on weather, energy, budget, selected day items, and route friction.",
          primary: "Primary plan",
          backup: "Backup",
          avoid: "Avoid now",
          confidence: "Confidence",
          apply: "Use primary plan",
          empty:
            "Add activities or use the recommendation to get a clearer day plan.",
        };

  const applyPrimaryPlan = () => {
    const ids = decision.primaryPlan.map((item) => item.activity.id);
    onApplyPlan?.(ids, selectedDay);
  };

  return (
    <aside className="today-decision-card" aria-label={copy.title}>
      <div className="decision-head">
        <div>
          <span>{copy.kicker}</span>
          <h3>{summary.headline}</h3>
          <p>{copy.subtitle}</p>
        </div>

        <div className="decision-confidence">
          <strong>{summary.confidence}</strong>
          <small>{copy.confidence}</small>
        </div>
      </div>

      {decision.riskFlags?.length > 0 && (
        <div className="decision-risks">
          {decision.riskFlags.slice(0, 2).map((flag) => (
            <span key={flag}>{flag}</span>
          ))}
        </div>
      )}

      <DecisionList
        title={copy.primary}
        items={decision.primaryPlan}
        lang={lang}
      />
      <DecisionList
        title={copy.backup}
        items={decision.backupPlan}
        lang={lang}
        compact
      />
      <DecisionList
        title={copy.avoid}
        items={decision.avoidedOptions}
        lang={lang}
        compact
      />

      {!decision.primaryPlan.length && (
        <p className="decision-empty">{copy.empty}</p>
      )}

      {decision.primaryPlan.length > 0 && (
        <button
          className="decision-apply"
          type="button"
          onClick={applyPrimaryPlan}
        >
          {copy.apply}
        </button>
      )}
    </aside>
  );
}

export default TodayDecisionWidget;
