import React from "react";
import {
  BusFront,
  CalendarDays,
  CarFront,
  CarTaxiFront,
  CheckCircle2,
  ChevronDown,
  Clock,
  CloudSun,
  Euro,
  ExternalLink,
  Heart,
  MapPin,
  Navigation,
  Plane,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  ThermometerSun,
  TrainFront,
} from "lucide-react";
import { NavoDayFlowMap } from "../dayflow/NavoDayFlowMap.jsx";
import { eur, planVariantLabels } from "../lib/dayPlanner.js";

const baseOrigin = (baseLocation) =>
  `${baseLocation.label}, ${baseLocation.address}`;
const route = (q, baseLocation, origin = baseOrigin(baseLocation)) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(q)}&travelmode=transit`;
const tierLabel = { $: "€", $$: "€€", $$$: "€€€" };

function fieldName(label) {
  return (
    String(label)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "field"
  );
}

const guestIntentOptions = {
  outdoor: { en: "Outdoor places", de: "Outdoor-Orte" },
  parks: { en: "Parks and playgrounds", de: "Parks und Spielplätze" },
  indoor: { en: "Indoor / weather-safe", de: "Indoor / wettersicher" },
  museums: { en: "Museums and learning", de: "Museen und Lernen" },
  water: { en: "Water and swimming", de: "Wasser und Baden" },
  budget: { en: "Low-cost day", de: "Günstiger Tag" },
  balanced: { en: "Balanced family day", de: "Ausgewogener Familientag" },
};

function TrainJourneyPanel({ lang, journey }) {
  const cards = [journey.outbound, journey.return];
  return (
    <div className="train-panel">
      <div className="train-panel-head">
        <TrainFront size={20} />
        <div>
          <h3>{lang === "en" ? "Train journey" : "Zugreise"}</h3>
          <p>
            {lang === "en"
              ? "Your exact ICE times are now built into the trip logic."
              : "Eure genauen ICE-Zeiten sind jetzt in die Reiseplanung eingebaut."}
          </p>
        </div>
      </div>
      <div className="train-grid">
        {cards.map((j) => (
          <div className="train-card" key={j.train}>
            <span>{j.date}</span>
            <h4>{lang === "en" ? j.titleEn : j.titleDe}</h4>
            <strong>
              <TrainFront size={14} /> {j.train}
            </strong>
            <div className="train-times">
              <b>{j.departure}</b>
              <em>{j.departureTrack}</em>
              <b>{j.arrival}</b>
            </div>
            <p>{lang === "en" ? j.noteEn : j.noteDe}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransportStrip({ lang }) {
  const labels =
    lang === "en"
      ? {
          train: "Train",
          transit: "Tram/bus",
          taxi: "Taxi",
          flight: "Flight",
          car: "Car",
        }
      : {
          train: "Zug",
          transit: "Tram/Bus",
          taxi: "Taxi",
          flight: "Flug",
          car: "Auto",
        };
  const items = [
    [<TrainFront />, labels.train],
    [<BusFront />, labels.transit],
    [<CarTaxiFront />, labels.taxi],
    [<Plane />, labels.flight],
    [<CarFront />, labels.car],
  ];
  return (
    <div
      className="transport-strip"
      aria-label={lang === "en" ? "Mobility modes" : "Mobilitätsarten"}
    >
      {items.map(([icon, label]) => (
        <div className="transport-mode" key={label}>
          {React.cloneElement(icon, { size: 20 })}
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function NavoCapabilityStrip({ lang }) {
  const labels =
    lang === "en"
      ? ["Plan", "Organize", "Discover", "Enjoy", "Smart Recommendations"]
      : [
          "Planen",
          "Organisieren",
          "Entdecken",
          "Genießen",
          "Smarte Empfehlungen",
        ];
  const items = [
    [<MapPin />, labels[0], "teal"],
    [<CalendarDays />, labels[1], "blue"],
    [<SlidersHorizontal />, labels[2], "purple"],
    [<Heart />, labels[3], "orange"],
    [<Star />, labels[4], "green"],
  ];
  return (
    <div
      className="capability-strip"
      aria-label={lang === "en" ? "Navo capabilities" : "Navo Funktionen"}
    >
      {items.map(([icon, label, tone]) => (
        <div className="capability" data-tone={tone} key={label}>
          {React.cloneElement(icon, { size: 18 })}
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function PreferenceRecommendationPanel({
  lang,
  c,
  intent,
  setIntent,
  weather,
  recommendation,
  onApply,
  addToDay,
}) {
  const label = guestIntentOptions[intent]?.[lang] || intent;
  const weatherText =
    {
      en: {
        hot: "Hot day",
        rainy: "Rainy day",
        cold: "Cold day",
        normal: "Normal weather",
      },
      de: {
        hot: "Heißer Tag",
        rainy: "Regentag",
        cold: "Kalter Tag",
        normal: "Normales Wetter",
      },
    }[lang][weather] || weather;
  return (
    <div
      className={`preference-panel ${recommendation.conflict ? "conflict" : ""}`}
    >
      <div className="preference-head">
        <div>
          <span>{c.guestWants}</span>
          <h3>{label}</h3>
          <p>{recommendation.message}</p>
        </div>
        <label htmlFor="guest-intent">
          <span>{c.guestWants}</span>
          <select
            id="guest-intent"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            name="guest-intent"
          >
            {Object.entries(guestIntentOptions).map(([id, labels]) => (
              <option key={id} value={id}>
                {labels[lang]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="recommendation-status">
        <strong>{c.navoRecommends}</strong>
        <span>{weatherText}</span>
      </div>

      <div className="recommendation-grid">
        {recommendation.recommended.map((a, index) => (
          <button
            key={a.id}
            onClick={() => addToDay(a.id)}
            className="recommendation-card"
          >
            <b>{index + 1}</b>
            <div>
              <strong>{lang === "en" ? a.en : a.de}</strong>
              <span>
                {a.type} · CHF {a.cost} · {a.time}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="guest-match-row">
        <span>
          {lang === "en"
            ? "Closest to guest request"
            : "Am nächsten am Gastwunsch"}
        </span>
        <div>
          {recommendation.guestMatches.map((a) => (
            <button className="chip" key={a.id} onClick={() => addToDay(a.id)}>
              <Plus size={14} /> {lang === "en" ? a.en : a.de}
            </button>
          ))}
        </div>
      </div>

      <button className="apply-recommendation" onClick={onApply}>
        <CheckCircle2 size={16} /> {c.applyRecommendation}
      </button>
    </div>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="metric">
      {React.cloneElement(icon, { size: 20 })}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function Header({ icon, title, subtitle }) {
  return (
    <div className="header">
      {React.cloneElement(icon, { size: 22 })}
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
function Select({ label, value, setValue, options }) {
  const name = fieldName(label);
  return (
    <label className="control" htmlFor={name}>
      <span>{label}</span>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map(([v, l]) => (
          <option value={v} key={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
function BudgetLine({ label, chf, strong }) {
  const [min, max] = chf.split(/[–-]/).map((v) => Number(v.replace(/,/g, "")));
  const euroText = max ? `€${eur(min)}–${eur(max)}` : `€${eur(min)}`;
  return (
    <div className={strong ? "budget-line strong" : "budget-line"}>
      <span>{label}</span>
      <strong>
        CHF {chf.replaceAll("-", "–")} / {euroText}
      </strong>
    </div>
  );
}
function InfoCard({ title, text, link }) {
  const body = (
    <>
      <h3>{title}</h3>
      <p>{text}</p>
    </>
  );
  return link ? (
    <a className="info-card" href={link} target="_blank" rel="noreferrer">
      {body}
      <ExternalLink size={16} />
    </a>
  ) : (
    <div className="info-card">{body}</div>
  );
}


function RouteAwareDayPanel({
  lang,
  c,
  variant,
  setVariant,
  plan,
  baseLocation,
  destinationName,
  droppedIdeas,
  setDroppedIdeas,
  reflowNote,
  onReflow,
}) {
  const labels = planVariantLabels[lang];
  const variants = ["best", "family", "fast", "rain", "discovery"];
  const variantHint = {
    en: {
      best: "Balanced order with low backtracking.",
      family: "Slower pacing, better for kids and breaks.",
      fast: "Shorter blocks for limited time.",
      rain: "Indoor-first backup logic.",
      discovery: "Low-cost and exploratory stops first.",
    },
    de: {
      best: "Ausgewogene Reihenfolge mit wenig Rückweg.",
      family: "Ruhigeres Tempo, besser für Kinder und Pausen.",
      fast: "Kürzere Blöcke für begrenzte Zeit.",
      rain: "Indoor zuerst als Regenlogik.",
      discovery: "Günstige und entdeckende Stopps zuerst.",
    },
  }[lang];
  const reflowActions =
    lang === "en"
      ? [
          ["tired", "We are tired"],
          ["hungry", "We are hungry"],
          ["rain", "It started raining"],
          ["late", "We are late"],
          ["extra", "We have extra time"],
        ]
      : [
          ["tired", "Wir sind müde"],
          ["hungry", "Wir haben Hunger"],
          ["rain", "Es regnet"],
          ["late", "Wir sind spät"],
          ["extra", "Wir haben mehr Zeit"],
        ];
  const reflowText = {
    en: {
      tired: "Switched toward Family Calm. Remove one heavy stop if needed.",
      hungry:
        "Keep the next food stop close. Use the food tab before walking too far.",
      rain: "Switched toward Rain Backup. Indoor options are moved earlier.",
      late: "Switched toward Fast Track. Shorter activity blocks are preferred.",
      extra: "You can add one nearby discovery stop, but avoid a far detour.",
    },
    de: {
      tired:
        "Auf Familienruhig umgestellt. Entferne bei Bedarf einen schweren Stopp.",
      hungry:
        "Den nächsten Essensstopp nah halten. Erst Essen prüfen, bevor ihr weit lauft.",
      rain: "Auf Regenplan umgestellt. Indoor-Optionen werden vorgezogen.",
      late: "Auf Schnellroute umgestellt. Kürzere Aktivitätsblöcke werden bevorzugt.",
      extra:
        "Ihr könnt einen nahen Entdeckungsstopp ergänzen, aber keinen weiten Umweg.",
    },
  }[lang];
  const hours = Math.floor(plan.minutes / 60);
  const mins = plan.minutes % 60;
  return (
    <div className="route-aware-panel">
      <div className="route-aware-head">
        <div>
          <h3>
            <Navigation size={18} /> {labels.routeTitle}
          </h3>
          <p>
            {lang === "en"
              ? "This is the product wedge: selected places become a realistic route-aware day."
              : "Das ist der Produkt-Wedge: ausgewählte Orte werden zu einem realistischen routenbewussten Tag."}
          </p>
        </div>
        <a
          href={plan.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="route-map-link"
        >
          <MapPin size={16} /> {c.route}
        </a>
      </div>

      <NavoDayFlowMap
        lang={lang}
        plan={plan}
        variant={variant}
        variantLabel={labels[variant] || variant}
        baseLocation={baseLocation}
        destinationName={destinationName}
      />

      <div className="variant-tabs" aria-label="Route variants">
        {variants.map((v) => (
          <button
            key={v}
            className={variant === v ? "active" : ""}
            onClick={() => setVariant(v)}
          >
            <span>{labels[v]}</span>
            <small>{variantHint[v]}</small>
          </button>
        ))}
      </div>

      <div className="route-score-grid">
        <div className="day-score">
          <span>{labels.scoreTitle}</span>
          <strong>{plan.score}</strong>
          <small>
            {lang === "en"
              ? `${hours}h ${mins}m estimated · CHF ${plan.cost}`
              : `${hours} Std. ${mins} Min. geschätzt · CHF ${plan.cost}`}
          </small>
        </div>
        <div className="route-reasons">
          {plan.reasons.map((reason, i) => (
            <p key={i}>
              <CheckCircle2 size={15} /> {reason}
            </p>
          ))}
          {plan.warnings.map((warning, i) => (
            <p key={`w-${i}`} className="warning">
              <ShieldCheck size={15} /> {warning}
            </p>
          ))}
        </div>
      </div>

      <div className="smart-order-list">
        {plan.ordered.length === 0 && (
          <p className="muted">
            {lang === "en"
              ? "Add places from Activities or paste ideas below."
              : "Füge Orte aus Aktivitäten hinzu oder füge Ideen unten ein."}
          </p>
        )}
        {plan.ordered.map((a, i) => (
          <div className="smart-stop" key={a.id}>
            <b>{i + 1}</b>
            <div>
              <strong>{lang === "en" ? a.en : a.de}</strong>
              <span>
                {a.area} · {a.time} · {a.transit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="reflow-box">
        <div>
          <h4>{labels.reflowTitle}</h4>
          <p>
            {lang === "en"
              ? "Plans change. Reflow adapts the route logic without starting over."
              : "Pläne ändern sich. Reflow passt die Routenlogik an, ohne neu anzufangen."}
          </p>
        </div>
        <div className="chip-row">
          {reflowActions.map(([id, label]) => (
            <button className="chip" key={id} onClick={() => onReflow(id)}>
              {label}
            </button>
          ))}
        </div>
        {reflowNote && <p className="reflow-note">{reflowText[reflowNote]}</p>}
      </div>

      <label className="drop-ideas-box">
        <span>{labels.dropTitle}</span>
        <label className="sr-only" htmlFor="dropped-ideas">
          {lang === "en" ? "Saved trip ideas" : "Gespeicherte Reiseideen"}
        </label>
        <textarea
          id="dropped-ideas"
          name="dropped-ideas"
          value={droppedIdeas}
          onChange={(e) => setDroppedIdeas(e.target.value)}
          placeholder={
            lang === "en"
              ? "Paste Google Maps links, TikTok ideas, notes, or places you want to try. Early MVP stores this input locally."
              : "Füge Google-Maps-Links, TikTok-Ideen, Notizen oder Wunschorte ein. Im MVP wird dies lokal gespeichert."
          }
        />
      </label>
    </div>
  );
}

function WeatherPanel({
  lang,
  destination,
  locationId,
  setLocationId,
  weather,
  tripDays,
  setMood,
}) {
  const locationEntries = Object.entries(destination.weatherLocations);
  const place =
    destination.weatherLocations[locationId]?.name || destination.name;
  const tripDateLabel = destination.hero[lang]?.dateLabel || destination.name;
  const statusText =
    weather.status === "loading"
      ? lang === "en"
        ? "Loading live forecast…"
        : "Live-Wetter wird geladen…"
      : weather.status === "error"
        ? lang === "en"
          ? "Weather could not load. The app still works offline."
          : "Wetter konnte nicht geladen werden. Die App funktioniert weiter offline."
        : tripDays.length
          ? lang === "en"
            ? "Trip-date forecast available."
            : "Reisedaten-Wetter verfügbar."
          : lang === "en"
            ? `Dynamic forecast is active, but ${tripDateLabel} is not inside the forecast window yet. It will populate automatically closer to the trip.`
            : `Dynamisches Wetter ist aktiv, aber ${tripDateLabel} liegt noch nicht im Prognosefenster. Es füllt sich automatisch kurz vor der Reise.`;

  return (
    <div className="weather-panel">
      <div className="weather-head">
        <div>
          <h3>
            <CloudSun size={18} />{" "}
            {lang === "en" ? "Dynamic weather" : "Dynamisches Wetter"}
          </h3>
          <p>{statusText}</p>
        </div>
        <select
          id="weather-location"
          name="weather-location"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          aria-label={lang === "en" ? "Weather location" : "Wetterort"}
        >
          {locationEntries.map(([id, location]) => (
            <option key={id} value={id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>
      {tripDays.length > 0 ? (
        <div className="weather-days">
          {tripDays.map((d) => (
            <button
              key={d.date}
              className="weather-day"
              onClick={() => setMood(d.mood)}
            >
              <strong>
                {new Date(d.date).toLocaleDateString(
                  lang === "en" ? "en-GB" : "de-DE",
                  { weekday: "short", day: "2-digit", month: "2-digit" },
                )}
              </strong>
              <span>{d.label}</span>
              <b>
                {d.min}–{d.max}°C
              </b>
              <small>
                {d.precipitation} mm · {d.mood}
              </small>
            </button>
          ))}
        </div>
      ) : (
        <div className="weather-placeholder">
          <ThermometerSun size={20} />
          <p>
            {lang === "en"
              ? `${place} forecast will update automatically through Open-Meteo when your trip dates enter the forecast range. Until then, use the manual weather selector below.`
              : `${place}-Prognose aktualisiert sich automatisch über Open-Meteo, sobald eure Reisedaten im Prognosefenster liegen. Bis dahin den manuellen Wetterfilter unten nutzen.`}
          </p>
        </div>
      )}
    </div>
  );
}

function SpecialPlan({ plan }) {
  return (
    <div className="special-plan">
      <h4>{plan.title}</h4>
      <p>{plan.intro}</p>
      <ol>
        {plan.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <div className="link-row special-links">
        {plan.links.map(([label, url]) => (
          <a key={label} href={url} target="_blank" rel="noreferrer">
            <ExternalLink size={15} /> {label}
          </a>
        ))}
      </div>
    </div>
  );
}

function ActivityCard({
  a,
  lang,
  c,
  expanded,
  setExpanded,
  favorite,
  toggleFav,
  addToDay,
  specialPlans,
  baseLocation,
  selectedDay,
  inDay,
}) {
  const title = lang === "en" ? a.en : a.de;
  const desc = lang === "en" ? a.descEn : a.descDe;
  const tip = lang === "en" ? a.tipEn : a.tipDe;
  const missions = lang === "en" ? a.missionEn : a.missionDe;
  return (
    <article className="activity-card">
      <button
        className="image-button"
        onClick={() => setExpanded(expanded ? null : a.id)}
      >
        {a.images?.[0] ? (
          <img src={a.images[0]} alt={title} loading="lazy" decoding="async" />
        ) : (
          <div className="image-fallback">
            <MapPin size={28} />
            <span>{title}</span>
          </div>
        )}
        <span className="tier">{tierLabel[a.tier]}</span>
      </button>
      <div className="card-body">
        <div className="card-head">
          <div>
            <h3>{title}</h3>
            <p>{a.area}</p>
          </div>
          <button
            className={favorite ? "heart on" : "heart"}
            onClick={() => toggleFav(a.id)}
            aria-label={favorite ? c.saved : c.save}
          >
            <Heart size={19} fill={favorite ? "currentColor" : "none"} />
          </button>
        </div>
        <p>{desc}</p>
        <div className="facts">
          <span>
            <Euro size={14} />
            {c.cost}: CHF {a.cost} / €{eur(a.cost)}
          </span>
          <span>
            <Clock size={14} />
            {c.time}: {a.time}
          </span>
          <span>
            <Navigation size={14} />
            {c.fromBase}: {a.transit}
          </span>
        </div>
        <div className="card-actions">
          <button
            className={inDay ? "added-action" : ""}
            onClick={(e) => {
              e.stopPropagation();
              addToDay(a.id);
            }}
          >
            <Plus size={16} /> {inDay ? `${c.added} · ${selectedDay}` : c.add}
          </button>
          <button onClick={() => setExpanded(expanded ? null : a.id)}>
            {c.details}
            <ChevronDown size={16} />
          </button>
        </div>
        {expanded && (
          <div className="expand">
            {a.images?.[1] && (
              <img
                className="second-img"
                src={a.images[1]}
                alt={`${title} angle 2`}
                loading="lazy"
                decoding="async"
              />
            )}
            <h4>{c.tip}</h4>
            <p>{tip}</p>
            {specialPlans?.[a.id] && (
              <SpecialPlan plan={specialPlans[a.id][lang]} />
            )}
            <h4>{c.mission}</h4>
            <ul>
              {missions.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
            <div className="link-row">
              <a href={a.official} target="_blank" rel="noreferrer">
                <ExternalLink size={15} /> {c.official}
              </a>
              <a href={a.map || route(title, baseLocation)} target="_blank" rel="noreferrer">
                <MapPin size={15} /> {c.map}
              </a>
              <a href={route(title, baseLocation)} target="_blank" rel="noreferrer">
                <Navigation size={15} /> {c.route}
              </a>
              <a href={a.photos} target="_blank" rel="noreferrer">
                <ExternalLink size={15} /> {c.photos}
              </a>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export {
  ActivityCard,
  BudgetLine,
  Header,
  InfoCard,
  Metric,
  NavoCapabilityStrip,
  PreferenceRecommendationPanel,
  RouteAwareDayPanel,
  Select,
  TransportStrip,
  TrainJourneyPanel,
  WeatherPanel,
};
