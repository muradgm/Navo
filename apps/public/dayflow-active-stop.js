(() => {
  const markerSelector = ".dayflow-stop-marker";
  const listItemSelector = ".dayflow-route-list li";

  function readMarkerNumber(marker) {
    return marker?.querySelector("b")?.textContent?.trim() || "";
  }

  function readListNumber(item) {
    return item?.querySelector("b")?.textContent?.trim() || "";
  }

  function readListTitle(item) {
    return item?.querySelector("strong")?.textContent?.trim() || "";
  }

  function readListMeta(item) {
    return item?.querySelector("span")?.textContent?.trim() || "";
  }

  function ensureActivePanel(card) {
    let panel = card.querySelector(".dayflow-active-stop");
    if (panel) return panel;

    panel = document.createElement("div");
    panel.className = "dayflow-active-stop";
    panel.setAttribute("aria-live", "polite");
    const mapShell = card.querySelector(".dayflow-map-shell");
    mapShell?.insertAdjacentElement("afterend", panel);
    return panel;
  }

  function clearActive(card) {
    card.querySelectorAll(`${markerSelector}.is-active, ${listItemSelector}.is-active`).forEach((node) => {
      node.classList.remove("is-active");
      node.removeAttribute("aria-current");
    });
  }

  function setActive(card, number) {
    if (!number || number === "B") return;
    clearActive(card);

    const marker = [...card.querySelectorAll(markerSelector)].find(
      (node) => readMarkerNumber(node) === number,
    );
    const item = [...card.querySelectorAll(listItemSelector)].find(
      (node) => readListNumber(node) === number,
    );

    marker?.classList.add("is-active");
    item?.classList.add("is-active");
    marker?.setAttribute("aria-current", "step");
    item?.setAttribute("aria-current", "step");

    const panel = ensureActivePanel(card);
    if (item && panel) {
      panel.innerHTML = `
        <span>Selected stop ${number}</span>
        <strong>${readListTitle(item)}</strong>
        <small>${readListMeta(item)}</small>
      `;
    }
  }

  function enhanceCard(card) {
    card.querySelectorAll(markerSelector).forEach((marker) => {
      const number = readMarkerNumber(marker);
      marker.tabIndex = 0;
      marker.setAttribute("role", "button");
      marker.setAttribute("aria-label", number === "B" ? "Base stop" : `Select stop ${number}`);
    });

    card.querySelectorAll(listItemSelector).forEach((item) => {
      const number = readListNumber(item);
      if (!number) return;
      item.tabIndex = 0;
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", `Select route stop ${number}: ${readListTitle(item)}`);
    });
  }

  function handleEvent(event) {
    const target = event.target.closest(`${markerSelector}, ${listItemSelector}`);
    if (!target) return;
    const card = target.closest(".dayflow-map-card");
    if (!card) return;

    if (event.type === "keydown" && !["Enter", " "].includes(event.key)) return;
    if (event.type === "keydown") event.preventDefault();

    const number = target.matches(markerSelector)
      ? readMarkerNumber(target)
      : readListNumber(target);
    setActive(card, number);
  }

  function enhanceAll() {
    document.querySelectorAll(".dayflow-map-card").forEach(enhanceCard);
  }

  document.addEventListener("mouseover", handleEvent);
  document.addEventListener("focusin", handleEvent);
  document.addEventListener("click", handleEvent);
  document.addEventListener("keydown", handleEvent);

  const observer = new MutationObserver(enhanceAll);
  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceAll, { once: true });
  } else {
    enhanceAll();
  }
})();
