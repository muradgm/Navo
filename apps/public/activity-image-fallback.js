(() => {
  const FALLBACK_CLASS = "image-fallback";
  const GENERATED_FLAG = "generatedActivityImage";

  const SCENE_COLORS = {
    sagrada: ["#12395B", "#F3A45F", "#D09264"],
    park: ["#173E5A", "#68B99A", "#F4C85A"],
    gothic: ["#162C44", "#B97E62", "#E0B27A"],
    beach: ["#0B5D7A", "#55C7D3", "#EBC578"],
    montjuic: ["#13344E", "#6EA16C", "#C89764"],
    science: ["#112F4F", "#83D4D3", "#F2C45F"],
    park2: ["#173A50", "#5AA06A", "#DCA966"],
    aquarium: ["#063A61", "#1597A5", "#F4B662"],
    tibidabo: ["#122C4A", "#547E66", "#D1A46E"],
    market: ["#3A2336", "#C84E53", "#F1C66F"],
    food: ["#263B3E", "#CB815A", "#E9D6A3"],
    village: ["#2D344A", "#D4945C", "#E8C88A"],
    labyrinth: ["#15364A", "#4E8F5E", "#DABD76"],
  };

  const BARCA_SCENE_MATCHERS = [
    [/sagrada/, "sagrada"],
    [/park-guell/, "park"],
    [/gothic/, "gothic"],
    [/barceloneta/, "beach"],
    [/montjuic/, "montjuic"],
    [/cosmocaixa/, "science"],
    [/ciutadella/, "park2"],
    [/aquarium/, "aquarium"],
    [/tibidabo/, "tibidabo"],
    [/boqueria/, "market"],
    [/halal-vegetarian/, "food"],
    [/poble-espanyol/, "village"],
    [/labyrinth/, "labyrinth"],
  ];

  function titleFromImage(img) {
    return img.getAttribute("alt") || "Activity image unavailable";
  }

  function imageFileName(img) {
    const src = img.currentSrc || img.src || "";
    return decodeURIComponent(src.split("/").pop() || "");
  }

  function sceneFromFileName(fileName) {
    if (!fileName.startsWith("barcelona-")) return null;
    return BARCA_SCENE_MATCHERS.find(([matcher]) => matcher.test(fileName))?.[1] || null;
  }

  function svgDataUri(svg) {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function skyline(color = "#274B63") {
    return `
      <path d="M0 255h960v285H0z" fill="#153247"/>
      <path d="M0 304h960v236H0z" fill="#10253A"/>
      <path d="M30 256h38v-58h45v58h42v-94h54v94h35v-45h56v45h48v-78h50v78h45v-110h62v110h45v-54h42v54h55v-88h50v88h44v-42h62v42h55v-74h43v74h68v284H0z" fill="${color}" opacity="0.62"/>
      <circle cx="810" cy="94" r="48" fill="#FFC46E" opacity="0.95"/>
    `;
  }

  function sceneSvg(scene, variant) {
    const [top, mid, accent] = SCENE_COLORS[scene] || SCENE_COLORS.gothic;
    const alt = variant === "02";
    const common = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" role="img">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${top}"/>
            <stop offset="0.55" stop-color="${mid}"/>
            <stop offset="1" stop-color="#F2A160"/>
          </linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#49C4D2"/>
            <stop offset="1" stop-color="#126A87"/>
          </linearGradient>
          <filter id="soft"><feGaussianBlur stdDeviation="0.4"/></filter>
        </defs>
        <rect width="960" height="540" fill="url(#bg)"/>
        ${skyline()}
    `;

    const end = `
        <rect x="5" y="5" width="950" height="530" rx="28" fill="none" stroke="rgba(255,255,255,0.32)" stroke-width="8"/>
      </svg>`;

    const drawings = {
      sagrada: `
        <g transform="translate(${alt ? 40 : 0} 0)">
          <rect x="335" y="235" width="290" height="200" rx="24" fill="#C98261"/>
          ${[-150, -90, -30, 35, 95, 155].map((dx, i) => `<g transform="translate(${480 + dx} 0)"><rect x="-26" y="${alt ? 130 + (i % 2) * 18 : 112 + (i % 3) * 14}" width="52" height="324" rx="16" fill="${i % 2 ? '#E2A36F' : '#B9705C'}"/><path d="M-34 ${alt ? 132 + (i % 2) * 18 : 114 + (i % 3) * 14}L0 ${alt ? 50 + (i % 2) * 14 : 34 + (i % 3) * 12}L34 ${alt ? 132 + (i % 2) * 18 : 114 + (i % 3) * 14}Z" fill="#6E4C54"/><circle cx="0" cy="205" r="12" fill="#28374D"/><circle cx="0" cy="264" r="12" fill="#28374D"/><circle cx="0" cy="323" r="12" fill="#28374D"/></g>`).join('')}
          <path d="M417 435a63 88 0 0 1 126 0" fill="none" stroke="#26364D" stroke-width="20"/>
        </g>`,
      park: `
        <path d="M0 412c190-152 314-166 488-90 172 75 304 20 472-86v304H0z" fill="#3C946D"/>
        <path d="M120 278c130-60 285-60 420-15 109 37 196 36 300-20v72c-169 88-312 86-459 25-96-40-180-28-261 17z" fill="#EAD28A"/>
        ${Array.from({ length: 13 }).map((_, i) => `<circle cx="${150 + i * 55}" cy="${alt ? 280 + (i % 3) * 9 : 262 + (i % 2) * 11}" r="24" fill="${['#35A7A5', '#F0BD46', '#D85761', '#F5ECC7'][i % 4]}"/>`).join('')}
        <ellipse cx="${alt ? 575 : 405}" cy="391" rx="84" ry="33" fill="#2FA49C"/><path d="M${alt ? 640 : 470} 385l84-42-34 62z" fill="#2FA49C"/>
        <circle cx="${alt ? 600 : 430}" cy="380" r="8" fill="#1C2B3F"/>
        <path d="M690 260h100v168H690z" fill="#D98E5C"/><path d="M675 260l65-78 65 78z" fill="#9C5754"/>`,
      gothic: `
        <path d="M0 112l360-42v410H0z" fill="#725C5C"/><path d="M960 90L605 120v360h355z" fill="#9B6D5C"/>
        ${Array.from({ length: 6 }).map((_, i) => `<rect x="${70 + (i % 2) * 120}" y="${150 + Math.floor(i / 2) * 83}" width="42" height="60" rx="7" fill="#28364A"/><rect x="${720 + (i % 2) * 105}" y="${150 + Math.floor(i / 2) * 82}" width="42" height="60" rx="7" fill="#28364A"/>`).join('')}
        <path d="M360 480l120-260 125 260z" fill="#D5A678"/><path d="M422 480a58 100 0 0 1 116 0" fill="none" stroke="#2A3548" stroke-width="24"/>
        <path d="M360 480h245l240 60H115z" fill="#494555"/>`,
      beach: `
        <rect y="245" width="960" height="295" fill="url(#water)"/>
        ${Array.from({ length: 7 }).map((_, i) => `<path d="M${i * 160 - 40} ${298 + i % 2 * 22}c60 30 120 30 185 0" fill="none" stroke="#BCEBEE" stroke-width="8" opacity="0.75"/>`).join('')}
        <path d="M0 405c210-55 430-85 960-135v270H0z" fill="#EAC07B"/>
        <path d="M${alt ? 515 : 210} 328h128l-64-75z" fill="#D84F58"/><path d="M${alt ? 579 : 274} 328v112" stroke="#69464B" stroke-width="8"/>
        <path d="M40 248h38v-55h47v55h45v-86h55v86h54v-46h58v46h70v-70h46v70h60v-38h54v38z" fill="#526B80"/>`,
      montjuic: `
        <path d="M0 395c190-152 450-190 960-120v265H0z" fill="#527F5A"/>
        <rect x="300" y="238" width="360" height="200" fill="#B5825D"/>
        ${[300, 420, 540, 660].map((x) => `<rect x="${x - 35}" y="190" width="70" height="248" fill="#976C55"/><rect x="${x - 45}" y="160" width="90" height="40" fill="#74514B"/>`).join('')}
        <path d="M420 437a60 82 0 0 1 120 0" fill="none" stroke="#28364A" stroke-width="24"/>
        <rect x="0" y="454" width="960" height="86" fill="#1E526D"/>`,
      science: `
        <rect x="130" y="125" width="700" height="300" rx="38" fill="#DDE4DE"/><rect x="190" y="175" width="580" height="190" rx="28" fill="#4C6078"/>
        ${[150, 105, 68].map((r, i) => `<ellipse cx="480" cy="270" rx="${r}" ry="${Math.round(r * 0.45)}" fill="none" stroke="${['#F3BD54', '#63CEC5', '#DF5D67'][i]}" stroke-width="10"/><ellipse cx="480" cy="270" rx="${Math.round(r * 0.48)}" ry="${r}" fill="none" stroke="${['#F3BD54', '#63CEC5', '#DF5D67'][i]}" stroke-width="8"/>`).join('')}
        <circle cx="480" cy="270" r="34" fill="#F2D56E"/>`,
      park2: `
        <rect y="250" width="960" height="290" fill="#4D9769"/>
        <ellipse cx="480" cy="390" rx="190" ry="70" fill="#7AC7C5"/>
        <rect x="365" y="225" width="230" height="135" rx="24" fill="#D59A63"/><path d="M410 345a70 75 0 0 1 140 0" fill="none" stroke="#5A4C55" stroke-width="18"/>
        ${[160, 260, 700, 800].map((x) => `<circle cx="${x}" cy="300" r="58" fill="#317D58"/><rect x="${x - 8}" y="330" width="16" height="90" fill="#6A4B3D"/>`).join('')}`, 
      aquarium: `
        <rect width="960" height="540" fill="#0E6F8D"/><path d="M120 190c200-150 520-150 720 0" fill="none" stroke="#ACE6E8" stroke-width="28" opacity="0.7"/><path d="M205 248c160-98 390-98 550 0" fill="none" stroke="#63C2D1" stroke-width="12" opacity="0.75"/>
        ${Array.from({ length: 7 }).map((_, i) => `<g transform="translate(${100 + i * 118} ${150 + (i * 47 + (alt ? 60 : 0)) % 210})"><ellipse cx="0" cy="0" rx="45" ry="20" fill="${['#F4B662', '#EF767A', '#73D8C2', '#E6E7B7'][i % 4]}"/><path d="M42 0l34-22v44z" fill="${['#F4B662', '#EF767A', '#73D8C2', '#E6E7B7'][i % 4]}"/><circle cx="-18" cy="-5" r="5" fill="#183047"/></g>`).join('')}
        ${Array.from({ length: 16 }).map((_, i) => `<circle cx="${(i * 71 + 50) % 920}" cy="${80 + (i * 37) % 360}" r="${5 + (i % 4) * 3}" fill="none" stroke="#C5F4F4" stroke-width="3" opacity="0.75"/>`).join('')}`, 
      tibidabo: `
        <path d="M0 390c210-170 520-190 960-75v225H0z" fill="#4A765F"/>
        <rect x="360" y="210" width="240" height="220" fill="#C99B6A"/><path d="M330 210l150-120 150 120z" fill="#765755"/>
        <rect x="445" y="110" width="70" height="320" fill="#B68462"/><path d="M430 110l50-80 50 80z" fill="#6C4C51"/>
        <circle cx="${alt ? 725 : 190}" cy="310" r="82" fill="none" stroke="#E6CD89" stroke-width="10"/>${Array.from({ length: 6 }).map((_, i) => `<line x1="${alt ? 725 : 190}" y1="310" x2="${(alt ? 725 : 190) + Math.cos((i * 30) * Math.PI / 180) * 82}" y2="${310 + Math.sin((i * 30) * Math.PI / 180) * 82}" stroke="#E6CD89" stroke-width="4"/>`).join('')}`, 
      market: `
        <rect x="105" y="92" width="750" height="330" rx="30" fill="#B94B50"/><rect x="145" y="160" width="670" height="250" fill="#F0C776"/>
        ${Array.from({ length: 10 }).map((_, i) => `<rect x="${145 + i * 67}" y="160" width="67" height="58" fill="${i % 2 ? '#F6EACB' : '#C94D52'}"/>`).join('')}
        ${Array.from({ length: 5 }).map((_, i) => `<g transform="translate(${190 + i * 130} 300)"><rect x="0" y="0" width="90" height="100" rx="16" fill="#724D45"/>${Array.from({ length: 9 }).map((__, j) => `<circle cx="${18 + (j % 3) * 25}" cy="${24 + Math.floor(j / 3) * 23}" r="11" fill="${['#E24C57', '#F0B64D', '#5AA05F', '#8D5DA6'][(i + j) % 4]}"/>`).join('')}</g>`).join('')}`, 
      food: `
        <rect y="255" width="960" height="285" fill="#344F4D"/><rect x="145" y="300" width="670" height="150" rx="40" fill="#A4674E"/>
        ${[270, 410, 550, 690].map((x, i) => `<g><ellipse cx="${x}" cy="350" rx="65" ry="45" fill="#EFE3C8"/><ellipse cx="${x}" cy="350" rx="42" ry="28" fill="${['#61A969', '#EBC45F', '#D97864', '#DCE8B8'][i]}"/>${Array.from({ length: 5 }).map((_, j) => `<circle cx="${x - 25 + j * 13}" cy="${345 + (j % 2) * 10}" r="5" fill="#3E7658"/>`).join('')}</g>`).join('')}
        ${Array.from({ length: 5 }).map((_, i) => `<path d="M${160 + i * 150} 110a54 54 0 0 1 108 0" fill="none" stroke="#E8B45E" stroke-width="8"/><circle cx="${214 + i * 150}" cy="168" r="18" fill="#F6CE78"/>`).join('')}`, 
      village: `
        <rect y="360" width="960" height="180" fill="#63554C"/>
        ${Array.from({ length: 7 }).map((_, i) => `<g transform="translate(${80 + i * 118} 0)"><rect y="${240 - (i % 3) * 25}" width="92" height="200" fill="${['#D5925D', '#E4BA78', '#B96359', '#EACD94'][i % 4]}"/><path d="M-12 ${240 - (i % 3) * 25}L46 ${180 - (i % 3) * 25}L104 ${240 - (i % 3) * 25}Z" fill="#76504B"/><rect x="32" y="${292 - (i % 3) * 25}" width="32" height="44" rx="6" fill="#2D374B"/></g>`).join('')}
        <ellipse cx="480" cy="455" rx="150" ry="38" fill="#504746"/>`,
      labyrinth: `
        <rect y="235" width="960" height="305" fill="#3E845A"/>
        ${Array.from({ length: 9 }).map((_, i) => Array.from({ length: 5 }).map((__, j) => ((i + j + (alt ? 1 : 0)) % 3 ? `<rect x="${160 + i * 55}" y="${145 + j * 45}" width="42" height="34" rx="8" fill="#276D48"/>` : '')).join('')).join('')}
        <path d="M180 170h430v180H300v-90" fill="none" stroke="#DDC17A" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="700" y="285" width="100" height="140" fill="#C49B68"/><path d="M675 285l75-70 75 70z" fill="#76504B"/>`,
    };

    return common + drawings[scene] + end;
  }

  function generatedBarcelonaImage(fileName) {
    const scene = sceneFromFileName(fileName);
    if (!scene) return null;
    const variant = fileName.includes("-02") ? "02" : "01";
    return svgDataUri(sceneSvg(scene, variant));
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

  function replaceWithFallback(img, title, imageButton) {
    const fallback = buildFallback(title);

    if (imageButton) {
      const existingFallback = imageButton.querySelector(`.${FALLBACK_CLASS}`);
      if (!existingFallback) imageButton.prepend(fallback);
      img.remove();
      return;
    }

    img.replaceWith(fallback);
  }

  function handleActivityImageError(event) {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;
    if (img.dataset[GENERATED_FLAG] === "true") return;

    const imageButton = img.closest(".image-button");
    const expandedImage = img.classList.contains("second-img");
    if (!imageButton && !expandedImage) return;

    const title = titleFromImage(img).replace(/ angle 2$/i, "");
    const fileName = imageFileName(img);
    const generatedImage = generatedBarcelonaImage(fileName);

    if (generatedImage) {
      img.dataset[GENERATED_FLAG] = "true";
      img.src = generatedImage;
      return;
    }

    replaceWithFallback(img, title, imageButton);
  }

  window.addEventListener("error", handleActivityImageError, true);
})();
