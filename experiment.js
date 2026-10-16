// ===== Interactive story review =====
// Loaded only by experiment.html, so the main site never pays for it.

const UI = {
  en: {
    htmlLang: "en",
    toggle: "中文",
    back: "← Extra",
    kicker: "Experiment · Story",
    begin: "Begin the story",
    next: "Continue",
    finish: "Finish the story",
    showAll: "Show all",
    restart: "Start again",
    count: "{current} / {total}",
    comment: "My take",
    endKicker: "The end",
    endHeading: "How the story ends",
    toLibrary: "See the book in the library",
    toExtra: "Back to Extra",
    missing: "This experiment could not be found.",
    loadError: "Could not load this experiment. Please preview through a local server.",
  },
  zh: {
    htmlLang: "zh-CN",
    toggle: "EN",
    back: "← 其他",
    kicker: "实验 · 讲故事",
    begin: "开始讲故事",
    next: "继续",
    finish: "讲完这个故事",
    showAll: "全部展开",
    restart: "重新开始",
    count: "{current} / {total}",
    comment: "我的看法",
    endKicker: "终章",
    endHeading: "故事讲完了",
    toLibrary: "在书库中查看这本书",
    toExtra: "回到「其他」",
    missing: "找不到这个实验。",
    loadError: "无法加载这个实验，请通过本地服务器预览。",
  },
};

const params = new URLSearchParams(window.location.search);
let language = params.get("lang") === "zh" ? "zh" : "en";
let experiment = null;
let revealed = 0; // 0 = only the summary; nodes.length + 1 = closing shown

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

function content() {
  const versions = experiment.languages;
  return versions[language] || versions.default || versions.en || versions.zh;
}

function totalSteps() {
  return content().nodes.length;
}

function renderBlock(block) {
  if (block.type === "quote") {
    const [original, ...rest] = block.paragraphs;
    return `
      <blockquote class="story-quote">
        <p class="story-quote-original">${escapeHTML(original)}</p>
        ${rest.map((line) => `<p class="story-quote-translation">${escapeHTML(line)}</p>`).join("")}
      </blockquote>`;
  }
  return `<p class="story-comment-text">${escapeHTML(block.text)}</p>`;
}

function renderNode(node, index) {
  const quotes = node.blocks.filter((block) => block.type === "quote");
  const comments = node.blocks.filter((block) => block.type !== "quote");
  return `
    <li class="story-node" data-index="${index}" id="story-node-${index + 1}">
      <span class="story-marker" aria-hidden="true">${index + 1}</span>
      <article class="story-card">
        ${node.label ? `<p class="story-label">${escapeHTML(node.label)}</p>` : ""}
        <h2 class="story-title">${escapeHTML(node.title)}</h2>
        <div class="story-quotes">${quotes.map(renderBlock).join("")}</div>
        ${comments.length ? `
          <div class="story-comment">
            <p class="story-comment-label">${ui("comment")}</p>
            ${comments.map(renderBlock).join("")}
          </div>` : ""}
      </article>
    </li>`;
}

function render() {
  const data = content();
  document.documentElement.lang = ui("htmlLang");
  document.title = `${data.title} · Aquilo`;
  document.querySelector("#language-toggle").textContent = ui("toggle");
  document.querySelector("#language-toggle").setAttribute("aria-pressed", String(language === "zh"));
  document.querySelector("#experiment-back").textContent = ui("back");
  document.querySelector("#experiment-back").href = `index.html#extra`;

  document.querySelector("#experiment-root").innerHTML = `
    <header class="story-hero">
      <p class="kicker">${ui("kicker")}</p>
      <h1 class="story-book-title">${escapeHTML(data.title)}</h1>
      ${data.author ? `<p class="story-author">${escapeHTML(data.author)}</p>` : ""}
      <p class="story-summary">${escapeHTML(data.summary)}</p>
      ${data.notice ? `<p class="story-notice">${escapeHTML(data.notice)}</p>` : ""}
      <button type="button" class="story-begin" id="story-begin">${ui("begin")} ↓</button>
    </header>

    <ol class="storyline" id="storyline">
      ${data.nodes.map(renderNode).join("")}
    </ol>

    <section class="story-closing" id="story-closing">
      <p class="kicker">${ui("endKicker")}</p>
      <h2>${ui("endHeading")}</h2>
      ${data.closing.map((line) => `<p>${escapeHTML(line)}</p>`).join("")}
      <p class="story-closing-summary">${escapeHTML(data.summary)}</p>
      <div class="story-closing-links">
        <button type="button" class="story-button is-quiet" id="story-restart">${ui("restart")}</button>
        ${experiment.book !== "" ? `<a class="story-button is-quiet" href="index.html#library">${ui("toLibrary")}</a>` : ""}
        <a class="story-button" href="index.html#extra">${ui("toExtra")}</a>
      </div>
    </section>
  `;

  document.querySelector("#story-dots").innerHTML = data.nodes
    .map((node, index) => `<button type="button" class="story-dot" data-step="${index + 1}" aria-label="${index + 1}. ${escapeHTML(node.title)}" title="${escapeHTML(node.title)}"></button>`)
    .join("");
  document.querySelector("#story-all").textContent = ui("showAll");

  document.querySelector("#story-begin").addEventListener("click", () => goTo(1));
  document.querySelector("#story-restart").addEventListener("click", restart);
  updateReveal(false);
}

function updateReveal(scroll = true) {
  const total = totalSteps();
  document.querySelectorAll(".story-node").forEach((node) => {
    const index = Number(node.dataset.index);
    node.classList.toggle("is-revealed", index < revealed);
    node.classList.toggle("is-current", index === revealed - 1);
  });
  document.querySelector("#story-closing").classList.toggle("is-revealed", revealed > total);
  document.querySelector("#story-begin").hidden = revealed > 0;

  const controls = document.querySelector("#story-controls");
  controls.hidden = revealed === 0;
  const shown = Math.min(revealed, total);
  document.querySelector("#story-count").textContent = ui("count", { current: shown, total });
  document.querySelector("#story-progress-bar").style.width = `${(Math.min(revealed, total + 1) / (total + 1)) * 100}%`;
  document.querySelectorAll(".story-dot").forEach((dot) => {
    const step = Number(dot.dataset.step);
    dot.classList.toggle("is-revealed", step <= revealed);
    dot.classList.toggle("is-current", step === revealed);
    dot.disabled = step > revealed;
  });

  const nextButton = document.querySelector("#story-next");
  nextButton.hidden = revealed > total;
  nextButton.textContent = revealed === total ? `${ui("finish")} →` : `${ui("next")} →`;
  document.querySelector("#story-all").hidden = revealed >= total;

  if (scroll && revealed > 0) {
    const target = revealed > total
      ? document.querySelector("#story-closing")
      : document.querySelector(`#story-node-${revealed}`);
    target?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function goTo(step) {
  revealed = Math.max(0, Math.min(step, totalSteps() + 1));
  updateReveal();
}

function next() {
  if (revealed <= totalSteps()) goTo(revealed + 1);
}

function revealAll() {
  revealed = totalSteps();
  updateReveal(false);
}

function restart() {
  revealed = 0;
  updateReveal(false);
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
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
  document.querySelector("#story-next").addEventListener("click", next);
  document.querySelector("#story-all").addEventListener("click", revealAll);
  document.querySelector("#story-dots").addEventListener("click", (event) => {
    const dot = event.target.closest(".story-dot");
    if (!dot || dot.disabled) return;
    document.querySelector(`#story-node-${dot.dataset.step}`)?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  });
  document.addEventListener("keydown", (event) => {
    if (!experiment || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest("button, a, input, textarea")) return;
    if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") {
      event.preventDefault();
      next();
    }
  });
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
