import { useState } from "react";
import { buildDayFlowRouteStops } from "./routeStops.js";

function lonLatToTilePoint([lng, lat], zoom) {
  const sin = Math.sin((lat * Math.PI) / 180);
  const scale = 256 * Math.pow(2, zoom);
  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

function buildDayFlowGeometry(stops, baseLocation) {
  const routeStops = buildDayFlowRouteStops({
    baseLocation,
    orderedStops: stops,
  });

  const coordStops =
    routeStops.length > 1 ? [...routeStops, routeStops[0]] : routeStops;
  const zoom = 13;
  const projected = coordStops.map((stop) => ({
    stop,
    point: lonLatToTilePoint(stop.coordinates, zoom),
  }));
  const padding = stops.length > 5 ? 88 : 62;
  const minX = Math.min(...projected.map((item) => item.point.x));
  const maxX = Math.max(...projected.map((item) => item.point.x));
  const minY = Math.min(...projected.map((item) => item.point.y));
  const maxY = Math.max(...projected.map((item) => item.point.y));
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  const viewWidth = 1000;
  const viewHeight = 640;
  const usableWidth = viewWidth - padding * 2;
  const usableHeight = viewHeight - padding * 2;
  const scale = Math.min(usableWidth / spanX, usableHeight / spanY);
  const offsetX = (viewWidth - spanX * scale) / 2;
  const offsetY = (viewHeight - spanY * scale) / 2;
  const points = projected.map(({ stop, point }, index) => ({
    stop,
    index,
    x: offsetX + (point.x - minX) * scale,
    y: offsetY + (point.y - minY) * scale,
  }));
  const centerLng =
    coordStops.reduce((sum, stop) => sum + stop.coordinates[0], 0) /
    coordStops.length;
  const centerLat =
    coordStops.reduce((sum, stop) => sum + stop.coordinates[1], 0) /
    coordStops.length;
  return {
    points,
    routePath: points
      .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
      .join(" "),
    center: [centerLng, centerLat],
    zoom,
    viewWidth,
    viewHeight,
  };
}

function tileListForCenter(center, zoom = 14) {
  const point = lonLatToTilePoint(center, zoom);
  const centerX = Math.floor(point.x / 256);
  const centerY = Math.floor(point.y / 256);
  const tiles = [];
  const radius = 2;
  const size = 100 / (radius * 2 + 1);
  for (let y = -radius; y <= radius; y += 1) {
    for (let x = -radius; x <= radius; x += 1) {
      tiles.push({
        key: `${centerX + x}-${centerY + y}`,
        src: `https://tile.openstreetmap.org/${zoom}/${centerX + x}/${centerY + y}.png`,
        left: `${radius * size + x * size}%`,
        top: `${radius * size + y * size}%`,
        size: `${size}%`,
      });
    }
  }
  return tiles;
}

function dayFlowMarkerOffset(point, markerPoints, dense) {
  if (!dense || point.stop.id === "base") return {};
  const closeToAnotherMarker = markerPoints.some((other) => {
    if (other === point) return false;
    return Math.hypot(point.x - other.x, point.y - other.y) < 68;
  });
  if (!closeToAnotherMarker) return {};
  const angle = ((point.index || 1) * 137.5 * Math.PI) / 180;
  return {
    "--pin-dx": `${Math.round(Math.cos(angle) * 24)}px`,
    "--pin-dy": `${Math.round(Math.sin(angle) * 24)}px`,
  };
}

function mapSearchUrl(activity) {
  const query = activity?.mapQuery || activity?.en || activity?.de || "";
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
}

function geoConfidenceText(lang, value) {
  const labels = {
    en: {
      verified: "Verified",
      good: "Good",
      "needs-check": "Needs check",
    },
    de: {
      verified: "Verifiziert",
      good: "Gut",
      "needs-check": "Prüfen",
    },
  };

  return labels[lang]?.[value] || value || labels[lang]["needs-check"];
}

function formatCoordinates(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) return "";
  const [lng, lat] = coordinates;
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return "";
  return lat.toFixed(4) + ", " + lng.toFixed(4);
}

export function NavoDayFlowMap({ lang, plan, variant, variantLabel, baseLocation }) {
  const geometry = buildDayFlowGeometry(plan.ordered || [], baseLocation);
  const tiles = tileListForCenter(geometry.center, geometry.zoom + 1);
  const stopCount = Math.max(0, geometry.points.length - 2);
  const dense = stopCount > 4;
  const overloaded = stopCount > 7;
  const markerPoints = geometry.points.filter(
    (point, index) => point.stop.id !== "base" || index === 0,
  );
  const [activeStopId, setActiveStopId] = useState(null);
  const activeStep = plan.routeSteps?.find(
    (step) => step.activity.id === activeStopId,
  );
  const activeActivity = activeStep?.activity || null;
  const activeTitle = activeActivity
    ? lang === "en"
      ? activeActivity.en
      : activeActivity.de
    : "";
  const activeMeta = activeActivity
    ? [
        activeActivity.area,
        activeActivity.time,
        activeActivity.transit,
      ].filter(Boolean).join(" · ")
    : "";
  const activeMapUrl = activeActivity ? mapSearchUrl(activeActivity) : "";
  const activeCoordinates = activeActivity
    ? formatCoordinates(activeActivity.coordinates)
    : "";
  const activeConfidence = activeActivity?.geoConfidence || "needs-check";

  const activateStop = (stop) => {
    if (!stop || stop.id === "base") return;
    setActiveStopId(stop.id);
  };

  const handleStopKeyDown = (event, stop) => {
    if (!["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    activateStop(stop);
  };

  const title = lang === "en" ? "DayFlow Map" : "DayFlow-Karte";
  const subtitle =
    lang === "en"
      ? "Real Basel map tiles with a Navo-owned route layer, numbered stops, and day-planning controls."
      : "Echte Basel-Kartendaten mit eigener Navo-Routenschicht, nummerierten Stopps und Tagesplan-Steuerung.";
  const empty =
    lang === "en"
      ? "Add at least one activity to draw the route."
      : "Füge mindestens eine Aktivität hinzu, um die Route zu zeichnen.";

  const routeListLabel = lang === "en" ? "Route sequence" : "Routenfolge";
  const densityNote = overloaded
    ? lang === "en"
      ? "Dense route: map pins stay compact; use the route sequence below for names."
      : "Dichte Route: Karten-Pins bleiben kompakt; Namen stehen unten in der Routenfolge."
    : lang === "en"
      ? "Compact pins keep the map readable as the day fills up."
      : "Kompakte Pins halten die Karte lesbar, wenn der Tag voller wird.";

  return (
    <div className={`dayflow-map-card ${dense ? "dense" : ""}`}>
      <div className="dayflow-map-copy">
        <div>
          <span>{title}</span>
          <h4>
            {lang === "en"
              ? "A real map redesigned around your day."
              : "Eine echte Karte, neu gedacht für euren Tag."}
          </h4>
          <p>{subtitle}</p>
        </div>
        <div className="dayflow-map-meta">
          <strong>{plan.score}</strong>
          <small>{lang === "en" ? "Day Score" : "Tages-Score"}</small>
          <b>{variantLabel}</b>
        </div>
      </div>

      <div
        className={`dayflow-map-shell ${dense ? "dense" : ""} ${overloaded ? "overloaded" : ""}`}
        role="img"
        aria-label={
          lang === "en"
            ? "Navo route map for Basel day plan"
            : "Navo Routenkarte für Basel-Tagesplan"
        }
      >
        <div className="osm-tile-grid" aria-hidden="true">
          {tiles.map((tile) => (
            <img
              key={tile.key}
              src={tile.src}
              style={{
                left: tile.left,
                top: tile.top,
                width: tile.size,
                height: tile.size,
              }}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
        <div className="dayflow-map-tint" aria-hidden="true" />
        <svg
          className="dayflow-route-svg"
          viewBox={`0 0 ${geometry.viewWidth} ${geometry.viewHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="dayflowRouteGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00C2A8" />
              <stop offset="58%" stopColor="#15AFC7" />
              <stop offset="100%" stopColor="#13324A" />
            </linearGradient>
            <filter id="dayflowGlow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {geometry.points.length > 1 && (
            <polyline
              className="dayflow-route-shadow"
              points={geometry.routePath}
            />
          )}
          {geometry.points.length > 1 && (
            <polyline
              className="dayflow-route-line"
              points={geometry.routePath}
              filter="url(#dayflowGlow)"
            />
          )}
          {geometry.points.length > 1 && (
            <polyline
              className={`dayflow-route-pulse ${variant === "rain" ? "rain" : ""}`}
              points={geometry.routePath}
            />
          )}
        </svg>

        {markerPoints.map((point, i) => {
          const isBase = point.stop.id === "base";
          const number = isBase ? "B" : point.index;
          const title = lang === "en" ? point.stop.en : point.stop.de;
          const isActive = !isBase && activeStopId === point.stop.id;

          return (
            <div
              key={`${point.stop.id}-${i}`}
              className={`${isBase ? "dayflow-stop-marker base" : "dayflow-stop-marker"} ${dense ? "compact" : ""} ${isActive ? "is-active" : ""}`}
              style={{
                left: `${(point.x / geometry.viewWidth) * 100}%`,
                top: `${(point.y / geometry.viewHeight) * 100}%`,
                ...dayFlowMarkerOffset(point, markerPoints, dense),
              }}
              role="button"
              tabIndex={0}
              aria-current={isActive ? "step" : undefined}
              aria-label={
                isBase
                  ? lang === "en"
                    ? "Base stop"
                    : "Basis-Stopp"
                  : lang === "en"
                    ? `Select stop ${number}: ${title}`
                    : `Stopp ${number} auswählen: ${title}`
              }
              onMouseEnter={() => activateStop(point.stop)}
              onFocus={() => activateStop(point.stop)}
              onClick={() => activateStop(point.stop)}
              onKeyDown={(event) => handleStopKeyDown(event, point.stop)}
            >
              <b>{number}</b>
              <span>{title}</span>
            </div>
          );
        })}

        {dense && <div className="dayflow-density-note">{densityNote}</div>}

        <div className="dayflow-bottom-sheet">
          <div>
            <strong>{lang === "en" ? "Your DayFlow" : "Euer DayFlow"}</strong>
            <span>
              {stopCount ? `${stopCount} stops · ${variantLabel}` : empty}
            </span>
          </div>
          <div className="dayflow-mini-stats">
            <span>{lang === "en" ? "Low backtracking" : "Wenig Rückweg"}</span>
            <span>{lang === "en" ? "Route-first" : "Route zuerst"}</span>
          </div>
        </div>
      </div>

      {activeStep && activeActivity && (
        <div
          className="dayflow-active-stop dayflow-selected-stop-panel"
          aria-live="polite"
        >
          <div className="dayflow-selected-stop-main">
            <span>
              {lang === "en"
                ? "Selected stop " + activeStep.index
                : "Ausgewählter Stopp " + activeStep.index}
            </span>
            <strong>{activeTitle}</strong>
            <small>{activeMeta}</small>
          </div>

          <div className="dayflow-selected-stop-grid">
            <div>
              <span>{lang === "en" ? "Transfer" : "Transfer"}</span>
              <strong>
                {activeStep.transferMinutes} min{" "}
                {lang === "en" ? "from previous" : "vom vorherigen Stopp"}
              </strong>
            </div>
            <div>
              <span>{lang === "en" ? "Type" : "Typ"}</span>
              <strong>{activeActivity.type}</strong>
            </div>
            <div>
              <span>{lang === "en" ? "Geo confidence" : "Geo-Sicherheit"}</span>
              <strong>{geoConfidenceText(lang, activeConfidence)}</strong>
            </div>
            {activeCoordinates && (
              <div>
                <span>{lang === "en" ? "Coordinates" : "Koordinaten"}</span>
                <strong>{activeCoordinates}</strong>
              </div>
            )}
          </div>

          <div className="dayflow-selected-stop-actions">
            <a href={activeMapUrl} target="_blank" rel="noreferrer">
              {lang === "en" ? "Open in Maps" : "In Maps öffnen"}
            </a>
            {activeActivity.sourceUrl && (
              <a href={activeActivity.sourceUrl} target="_blank" rel="noreferrer">
                {lang === "en" ? "Source" : "Quelle"}
              </a>
            )}
          </div>
        </div>
      )}

      {plan.routeSteps?.length > 0 && (
        <ol className="dayflow-route-list" aria-label={routeListLabel}>
          {plan.routeSteps.map((step) => {
            const title = lang === "en" ? step.activity.en : step.activity.de;
            const isActive = activeStopId === step.activity.id;

            return (
              <li
                key={step.activity.id}
                className={isActive ? "is-active" : ""}
                role="button"
                tabIndex={0}
                aria-current={isActive ? "step" : undefined}
                aria-label={
                  lang === "en"
                    ? `Select route stop ${step.index}: ${title}`
                    : `Routenstopp ${step.index} auswählen: ${title}`
                }
                onMouseEnter={() => activateStop(step.activity)}
                onFocus={() => activateStop(step.activity)}
                onClick={() => activateStop(step.activity)}
                onKeyDown={(event) => handleStopKeyDown(event, step.activity)}
              >
                <b>{step.index}</b>
                <div>
                  <strong>{title}</strong>
                  <span>
                    {step.transferMinutes} min{" "}
                    {lang === "en" ? "from previous" : "vom vorherigen Stopp"} ·{" "}
                    {step.activity.type} · {step.activity.time}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
