import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { defaultDestinationPack } from "./data/destinations/index.js";
import {
  buildTodayDecision,
  formatDecisionSummary,
} from "./features/todayDecisionEngine.js";
import "./today-decision-widget.css";

const CHF_TO_EUR = 1.04;
const POLL_MS = 900;

function storageKey(destinationId, name) {
  return `navo-${destinationId}-${name}`;
}

function readJson(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readString(key, fallback) {
  return window.localStorage.getItem(key) || fallback;
}

function readNumber(key, fallback) {
  const value = Number(window.localStorage.getItem(key));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function readTodayContext(destination) {
  const selectedDay = readString(
    storageKey(destination.id, "selected-day-v1"),
    destination.defaultSelectedDay,
  );
  const plan = readJson(storageKey(destination.id, "custom-plan-v1"), {});

  return {
    lang: readString(storageKey(destination.id, "lang"), "en"),
    weather: readString(storageKey(destination.id, "weather-v1"), "normal"),
    energy: readString(storageKey(destination.id, "energy-v1"), "medium"),
    budgetEur: readNumber(storageKey(destination.id, "today-budget-v1"), 120),
    selectedDay,
    selectedIds: plan[selectedDay] || [],
    plan,
  };
}

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

function TodayDecisionWidget() {
  const destination = defaultDestinationPack;
  const [context, setContext] = useState(() => readTodayContext(destination));

  useEffect(() => {
    const timer = window.setInterval(
      () => setContext(readTodayContext(destination)),
      POLL_MS,
    );
    const onFocus = () => setContext(readTodayContext(destination));
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [destination]);

  const decision = useMemo(
    () =>
      buildTodayDecision(destination, {
        ...context,
        convertToEur: (chf) => Math.round(chf * CHF_TO_EUR),
      }),
    [destination, context],
  );
  const summary = formatDecisionSummary(decision, context.lang);
  const copy =
    context.lang === "de"
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
          empty: "Füge Aktivitäten hinzu oder nutze die Empfehlung, um einen klareren Tagesplan zu bekommen.",
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
          empty: "Add activities or use the recommendation to get a clearer day plan.",
        };

  const applyPrimaryPlan = () => {
    const ids = decision.primaryPlan.map((item) => item.activity.id);
    const nextPlan = { ...context.plan, [context.selectedDay]: ids };
    window.localStorage.setItem(
      storageKey(destination.id, "custom-plan-v1"),
      JSON.stringify(nextPlan),
    );
    window.location.reload();
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

      <DecisionList title={copy.primary} items={decision.primaryPlan} lang={context.lang} />
      <DecisionList title={copy.backup} items={decision.backupPlan} lang={context.lang} compact />
      <DecisionList title={copy.avoid} items={decision.avoidedOptions} lang={context.lang} compact />

      {!decision.primaryPlan.length && <p className="decision-empty">{copy.empty}</p>}

      {decision.primaryPlan.length > 0 && (
        <button className="decision-apply" type="button" onClick={applyPrimaryPlan}>
          {copy.apply}
        </button>
      )}
    </aside>
  );
}

function ensureMountNode() {
  const todaySection = document.querySelector("main > section.section");
  if (!todaySection) return null;

  const alreadyMounted = todaySection.querySelector("#today-decision-widget-root");
  if (alreadyMounted) return alreadyMounted;

  const weatherPanel = todaySection.querySelector(".weather-panel");
  const mount = document.createElement("div");
  mount.id = "today-decision-widget-root";

  if (weatherPanel?.parentNode) {
    weatherPanel.insertAdjacentElement("afterend", mount);
  } else {
    todaySection.prepend(mount);
  }

  return mount;
}

let mountedRoot = null;

function mountTodayDecisionWidget() {
  const mount = ensureMountNode();
  if (!mount || mount.dataset.mounted === "true") return;

  mountedRoot = createRoot(mount);
  mountedRoot.render(<TodayDecisionWidget />);
  mount.dataset.mounted = "true";
}

const observer = new MutationObserver(() => mountTodayDecisionWidget());
observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener("DOMContentLoaded", mountTodayDecisionWidget);
mountTodayDecisionWidget();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    observer.disconnect();
    mountedRoot?.unmount();
  });
}
