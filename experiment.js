// ===== Interactive story review =====
// Loaded only by experiment.html, so the main site never pays for it.
// The story unfolds as the reader scrolls, like the Timeline page.

const UI = {
  en: {
    htmlLang: "en",
    toggle: "中文",
    back: "← Extra",
    scrollHint: "Scroll down",
    original: "Original",
    restart: "Back to the top",
    toLibrary: "See the book in the library",
    toExtra: "Back to Extra",
    missing: "This experiment could not be found.",
    loadError: "Could not load this experiment. Please preview through a local server.",
  },
  zh: {
    htmlLang: "zh-CN",
    toggle: "EN",
    back: "← 其他",
    scrollHint: "向下滚动",
    original: "英文原文",
    restart: "回到开头",
    toLibrary: "在书库中查看这本书",
    toExtra: "回到「其他」",
    missing: "找不到这个实验。",
    loadError: "无法加载这个实验，请通过本地服务器预览。",
  },
};

const params = new URLSearchParams(window.location.search);
let language = params.get("lang") === "zh" ? "zh" : "en";
let experiment = null;
let revealObserver = null;
let scrollFrame = 0;

function ui(key, values = {}) {
  const text = UI[language][key] || UI.en[key] || key;
  return text.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function content() {
  const versions = experiment.languages;
  return versions[language] || versions.default || versions.en || versions.zh;
}

// A quote is the original line, optionally followed by a translation. When the
// page is in Chinese and a translation exists, the translation leads and the
// original opens on request.
function renderQuote(paragraphs) {
  const [original, ...translation] = paragraphs;
  if (language === "zh" && translation.length) {
    return `
      <blockquote class="story-quote">
        ${translation.map((line) => `<p class="story-quote-main">${escapeHTML(line)}</p>`).join("")}
        <details class="story-original">
          <summary>${ui("original")}</summary>
          <p lang="en">${escapeHTML(original)}</p>
        </details>
      </blockquote>`;
  }
  return `
    <blockquote class="story-quote">
      <p class="story-quote-main">${escapeHTML(original)}</p>
      ${translation.map((line) => `<p class="story-quote-translation">${escapeHTML(line)}</p>`).join("")}
    </blockquote>`;
}

// The earlier quote and this part's quote, side by side, so the change shows.
function renderEcho(echo, quote, nodes) {
  const earlier = nodes[echo.index];
  return `
    <div class="story-compare">
      <div class="story-compare-side is-then">
        <a class="story-compare-title" href="#story-node-${echo.index + 1}" data-step="${echo.index + 1}">↑ ${escapeHTML(earlier.title)}</a>
        ${renderQuote(echo.paragraphs)}
      </div>
      <span class="story-compare-arrow" aria-hidden="true">→</span>
      <div class="story-compare-side is-now">
        ${quote ? renderQuote(quote.paragraphs) : ""}
      </div>
    </div>`;
}

function renderNode(node, index, nodes) {
  const image = node.blocks.find((block) => block.type === "image");
  const text = node.blocks.filter((block) => block.type === "text");
  const echo = node.blocks.find((block) => block.type === "echo");
  let quotes = node.blocks.filter((block) => block.type === "quote");
  let compare = "";
  if (echo) {
    compare = renderEcho(echo, quotes[0], nodes);
    quotes = quotes.slice(1);
  }
  return `
    <li class="story-node${image ? "" : " has-no-figure"}" data-index="${index}" id="story-node-${index + 1}">
      <span class="story-marker" aria-hidden="true"></span>
      <article class="story-body">
        <h2 class="story-title">${escapeHTML(node.title)}</h2>
        ${text.map((block) => `<p class="story-text">${escapeHTML(block.text)}</p>`).join("")}
        ${compare || quotes.length ? `
          <div class="story-evidence">
            ${compare}
            ${quotes.map((block) => renderQuote(block.paragraphs)).join("")}
          </div>` : ""}
      </article>
      ${image ? `
        <figure class="story-figure">
          <img src="${escapeHTML(image.src)}" alt="${escapeHTML(image.alt)}" loading="lazy" />
          ${image.alt ? `<figcaption>${escapeHTML(image.alt)}</figcaption>` : ""}
        </figure>` : ""}
    </li>`;
}

function render() {
  const data = content();
  document.documentElement.lang = ui("htmlLang");
  document.title = `${data.title} · Aquilo`;
  const toggle = document.querySelector("#language-toggle");
  toggle.textContent = ui("toggle");
  toggle.setAttribute("aria-pressed", String(language === "zh"));
  document.querySelector("#experiment-back").textContent = ui("back");

  document.querySelector("#experiment-root").innerHTML = `
    <header class="story-hero">
      <h1 class="story-book-title">${escapeHTML(data.title)}</h1>
      ${data.author ? `<p class="story-author">${escapeHTML(data.author)}</p>` : ""}
      <p class="story-summary">${escapeHTML(data.summary)}</p>
      ${data.notice ? `<p class="story-notice">${escapeHTML(data.notice)}</p>` : ""}
      <a class="story-scroll-hint" href="#story-node-1" aria-label="${ui("scrollHint")}"><span aria-hidden="true">↓</span></a>
    </header>

    <div class="storyline" id="storyline">
      <span class="storyline-fill" id="storyline-fill" aria-hidden="true"></span>
      <ol class="story-list">
        ${data.nodes.map((node, index) => renderNode(node, index, data.nodes)).join("")}
      </ol>
    </div>

    <section class="story-closing story-reveal" id="story-closing">
      ${data.closing.map((line) => `<p>${escapeHTML(line)}</p>`).join("")}
      <div class="story-closing-links">
        <a class="story-button is-quiet" href="#top" id="story-restart">${ui("restart")} ↑</a>
        ${experiment.book !== "" ? `<a class="story-button is-quiet" href="index.html#library">${ui("toLibrary")}</a>` : ""}
        <a class="story-button" href="index.html#extra">${ui("toExtra")}</a>
      </div>
    </section>
  `;

  document.querySelector("#story-dots").innerHTML = data.nodes
    .map((node, index) => `<button type="button" class="story-dot" data-step="${index + 1}" aria-label="${index + 1}. ${escapeHTML(node.title)}" title="${escapeHTML(node.title)}"></button>`)
    .join("");

  document.querySelector(".story-scroll-hint").addEventListener("click", (event) => {
    event.preventDefault();
    scrollToStep(1);
  });
  document.querySelectorAll(".story-compare-title[data-step]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToStep(link.dataset.step);
    });
  });
  document.querySelector("#story-restart").addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });

  observeReveals();
  updateScrollState();
}

// Each node fades in once it scrolls into view and then stays visible.
function observeReveals() {
  revealObserver?.disconnect();
  const targets = document.querySelectorAll(".story-node, .story-closing");
  const canAnimate = "IntersectionObserver" in window && !prefersReducedMotion();
  document.documentElement.classList.toggle("story-animate", canAnimate);
  if (!canAnimate) {
    targets.forEach((target) => target.classList.add("is-revealed"));
    return;
  }
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
  targets.forEach((target) => revealObserver.observe(target));
}

// The line fills down to just above the middle of the screen; the part above that point is current.
function updateScrollState() {
  scrollFrame = 0;
  if (!experiment) return;
  const storyline = document.querySelector("#storyline");
  const nodes = [...document.querySelectorAll(".story-node")];
  const total = nodes.length;
  const focusY = window.innerHeight * 0.4;

  const lineBox = storyline.getBoundingClientRect();
  const filled = Math.max(0, Math.min(lineBox.height, focusY - lineBox.top));
  document.querySelector("#storyline-fill").style.height = `${filled}px`;

  let current = 0;
  nodes.forEach((node, index) => {
    if (node.getBoundingClientRect().top <= focusY) current = index + 1;
  });
  nodes.forEach((node, index) => {
    node.classList.toggle("is-current", index + 1 === current);
    node.classList.toggle("is-passed", index + 1 <= current);
  });

  const closingTop = document.querySelector("#story-closing").getBoundingClientRect().top;
  const finished = closingTop <= focusY;
  document.querySelector("#story-controls").hidden = current === 0;
  const progress = finished ? 1 : current / (total + 1);
  document.querySelector("#story-progress-bar").style.width = `${progress * 100}%`;
  document.querySelectorAll(".story-dot").forEach((dot) => {
    const step = Number(dot.dataset.step);
    dot.classList.toggle("is-passed", step <= current);
    dot.classList.toggle("is-current", step === current && !finished);
  });
}

function requestScrollUpdate() {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollState);
}

function scrollToStep(step) {
  document.querySelector(`#story-node-${step}`)?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

function setLanguage(nextLanguage) {
  language = nextLanguage;
  const url = new URL(window.location.href);
  url.searchParams.set("lang", language);
  history.replaceState(null, "", url);
  if (experiment) render();
}

function showMessage(text) {
  document.querySelector("#experiment-root").innerHTML = `<div class="library-empty"><p>${escapeHTML(text)}</p></div>`;
}

function attachControls() {
  document.querySelector("#language-toggle").addEventListener("click", () => {
    setLanguage(language === "en" ? "zh" : "en");
  });
  document.querySelector("#story-dots").addEventListener("click", (event) => {
    const dot = event.target.closest(".story-dot");
    if (dot) scrollToStep(dot.dataset.step);
  });
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
}

async function initialize() {
  attachControls();
  const id = params.get("id") || "";
  if (!/^[a-z0-9-]+$/.test(id)) {
    showMessage(UI[language].missing);
    return;
  }
  try {
    const response = await fetch(`data/experiments/${id}.json`);
    if (response.status === 404) {
      showMessage(UI[language].missing);
      return;
    }
    if (!response.ok) throw new Error(`Unable to load experiment ${id}`);
    experiment = await response.json();
  } catch (error) {
    console.error(error);
    showMessage(UI[language].loadError);
    return;
  }
  render();
}

initialize();
