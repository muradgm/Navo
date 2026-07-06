import React from "react";
import { createRoot } from "react-dom/client";
import {
  defaultDestinationId,
  destinationIds,
  destinationRegistry,
} from "./data/destinations/index.js";

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

function DestinationSwitcher() {
  const handleChange = (event) => {
    const nextDestination = event.target.value;
    const params = new URLSearchParams(window.location.search);

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

if (root) {
  createRoot(root).render(<DestinationSwitcher />);
}
