export const destinationVisuals = {
  basel: {
    heroImage: {
      src: "/images/heroes/basel-hero.webp",
      alt: "Cinematic sunset view of Basel",
    },
    theme: {
      accent: "#4EC7E0",
      accentSoft: "rgba(78, 199, 224, 0.18)",
      accentStrong: "#0A5268",
      dark: "#071A2B",
      pageGlow: "rgba(80, 181, 214, 0.2)",
      surfaceTint: "rgba(235, 248, 252, 0.86)",
      heroOverlayFrom: "rgba(4, 12, 24, 0.72)",
      heroOverlayTo: "rgba(7, 26, 43, 0.35)",
    },
  },
  barcelona: {
    heroImage: {
      src: "/images/heroes/barcelona-hero.webp",
      alt: "Cinematic sunset view of Barcelona",
    },
    theme: {
      accent: "#F2A160",
      accentSoft: "rgba(242, 161, 96, 0.2)",
      accentStrong: "#B85B2E",
      dark: "#201433",
      pageGlow: "rgba(242, 161, 96, 0.22)",
      surfaceTint: "rgba(255, 246, 236, 0.88)",
      heroOverlayFrom: "rgba(18, 10, 34, 0.7)",
      heroOverlayTo: "rgba(117, 55, 36, 0.28)",
    },
  },
};

export const fallbackDestinationVisuals = destinationVisuals.basel;
