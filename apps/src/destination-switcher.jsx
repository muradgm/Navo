import React from "react";
import { createRoot } from "react-dom/client";
import {
  defaultDestinationId,
  destinationIds,
  destinationRegistry,
} from "./data/destinations/index.js";
import "./destination-theme.css";

const DESTINATION_STORAGE_KEY = "navo-active-destination-id";

const wrapperStyle = {
  position: "fixed",
  right: "16px",
  bottom: "16px",
  zIndex: 50,
  display: "flex",
  gap: "8px",
  alignItems: "center",
  padding: "10px 12px",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "999px",
  background: "rgba(4,13,29,0.86)",
  color: "white",
  font: "600 12px Poppins, sans-serif",
  boxShadow: "0 14px 40px rgba(0,0,0,0.28)",
  backdropFilter: "blur(12px)",
};

const selectStyle = {
  border: "1px solid rgba(255,255,255,0.24)",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.1)",
  color: "white",
  padding: "6px 10px",
  font: "600 12px Poppins, sans-serif",
};

function applyDestinationTheme(destination) {
  if (typeof document === "undefined" || !destination) return;

  const theme = destination.theme || {};
  const heroImage = destination.heroImage || {};
  const root = document.documentElement;

  root.dataset.destination = destination.id;
  root.style.setProperty("--destination-hero-image", `url("${heroImage.src || ""}")`);
  root.style.setProperty("--destination-accent", theme.accent || "#0e7c86");
  root.style.setProperty(
    "--destination-accent-soft",
    theme.accentSoft || "rgba(14, 124, 134, 0.16)",
  );
  root.style.setProperty(
    "--destination-accent-strong",
    theme.accentStrong || "#0f545a",
  );
  root.style.setProperty("--destination-dark", theme.dark || "#0d292d");
  root.style.setProperty(
    "--destination-page-glow",
    theme.pageGlow || "rgba(14, 124, 134, 0.18)",
  );
  root.style.setProperty(
    "--destination-surface-tint",
    theme.surfaceTint || "rgba(255, 250, 242, 0.86)",
  );
  root.style.setProperty(
    "--destination-hero-overlay-from",
    theme.heroOverlayFrom || "rgba(7, 19, 28, 0.72)",
  );
  root.style.setProperty(
    "--destination-hero-overlay-to",
    theme.heroOverlayTo || "rgba(13, 41, 45, 0.36)",
  );
}

function DestinationSwitcher() {
  const handleChange = (event) => {
    const nextDestination = event.target.value;
    const params = new URLSearchParams(window.location.search);

    applyDestinationTheme(destinationRegistry[nextDestination]);
    window.localStorage.setItem(DESTINATION_STORAGE_KEY, nextDestination);
    params.set("destination", nextDestination);
    window.location.search = params.toString();
  };

  return (
    <div id="destination-switcher" style={wrapperStyle}>
      <label htmlFor="destination-select">Destination</label>
      <select
        id="destination-select"
        name="destination"
        value={defaultDestinationId}
        onChange={handleChange}
        style={selectStyle}
      >
        {destinationIds.map((id) => (
          <option key={id} value={id}>
            {destinationRegistry[id].name}
          </option>
        ))}
      </select>
    </div>
  );
}

const root = document.getElementById("destination-switcher-root");

applyDestinationTheme(destinationRegistry[defaultDestinationId]);

if (root) {
  createRoot(root).render(<DestinationSwitcher />);
}
