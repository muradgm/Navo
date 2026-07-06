(() => {
  const FALLBACK_CLASS = "image-fallback";

  function titleFromImage(img) {
    return img.getAttribute("alt") || "Activity image unavailable";
  }

  function buildFallback(title) {
    const fallback = document.createElement("div");
    fallback.className = FALLBACK_CLASS;
    fallback.setAttribute("role", "img");
    fallback.setAttribute("aria-label", title);

    const icon = document.createElement("span");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "⌖";
    icon.style.fontSize = "28px";
    icon.style.lineHeight = "1";

    const label = document.createElement("span");
    label.textContent = title;

    fallback.append(icon, label);
    return fallback;
  }

  function handleActivityImageError(event) {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;

    const imageButton = img.closest(".image-button");
    const expandedImage = img.classList.contains("second-img");
    if (!imageButton && !expandedImage) return;

    const title = titleFromImage(img).replace(/ angle 2$/i, "");
    const fallback = buildFallback(title);

    if (imageButton) {
      const existingFallback = imageButton.querySelector(`.${FALLBACK_CLASS}`);
      if (!existingFallback) imageButton.prepend(fallback);
      img.remove();
      return;
    }

    img.replaceWith(fallback);
  }

  window.addEventListener("error", handleActivityImageError, true);
})();
