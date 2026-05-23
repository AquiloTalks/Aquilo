// ===== Data Models =====

let modules = {};
let tools = {};
let features = {};
let sampleBooks = [];
let translations = { en: {}, zh: {} };
let siteContent = null;
let writingPieces = [];
let criticalNotes = [];
let extraPosts = [];

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }
  return response.json();
}

async function loadContentData() {
  const [content, books, fiction, reflections, extra] = await Promise.all([
    loadJSON("data/site-content.json"),
    loadJSON("data/books.json"),
    loadJSON("data/fiction.json"),
    loadJSON("data/reflections.json"),
    loadJSON("data/extra.json"),
  ]);

  siteContent = content;
  translations = content.translations || translations;
  sampleBooks = books;
  writingPieces = normalizePublicEntries(fiction, "fiction");
  criticalNotes = normalizePublicEntries(reflections, "reflection");
  extraPosts = normalizePublicEntries(extra, "extra");
  setLanguageContent(currentLanguage);
}

function cloneContent(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function setLanguageContent(language) {
  const content = siteContent?.[language] || siteContent?.en || {};
  modules = cloneContent(content.modules);
  tools = cloneContent(content.tools);
  features = cloneContent(content.features);
}

let currentLanguage = "en";
let selectedModuleId = "reading";
let selectedToolId = "motifs";
let selectedFeatureId = "bookDeepDive";
let activeLibraryFilter = "all";
let activeBook = null;
let lastFocusedElement = null;

// ===== Helper Functions =====

function normalizePublicEntries(items, prefix) {
  return (Array.isArray(items) ? items : []).map((item, index) => ({
    ...item,
    id: item.id || `${prefix}-${index + 1}`,
    source: "public",
  }));
}

function getVisibleBooks() {
  return sampleBooks;
}

function refreshBookViews() {
  renderLibrary(activeLibraryFilter);
  renderTimeline();
  updateDynamicCards();
  renderModule(selectedModuleId);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createDetailList(items) {
  const list = document.createElement("ul");
  list.className = "detail-list";

  items.forEach(([title, body]) => {
    const item = document.createElement("li");
    const heading = document.createElement("strong");
    const text = document.createElement("span");

    heading.textContent = title;
    text.textContent = body;
    item.append(heading, text);
    list.append(item);
  });

  return list;
}

function createChipList(items) {
  const row = document.createElement("div");
  row.className = "chip-row";

  items.forEach((item) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = item;
    row.append(chip);
  });

  return row;
}

function formatDate(value) {
  return new Date(value || Date.now()).toLocaleDateString();
}

function makePreview(value, fallback = "") {
  const clean = String(value || fallback || "").trim().replace(/\s+/g, " ");
  return clean.length > 135 ? `${clean.slice(0, 132)}...` : clean;
}

function getTopTags(books, limit = 4) {
  const counts = new Map();
  books.forEach((book) => {
    (book.tags || []).forEach((tag) => {
      const key = String(tag).trim();
      if (!key) return;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag);
}

function getModuleView(moduleId) {
  const base = modules[moduleId] || modules.reading;
  const module = JSON.parse(JSON.stringify(base));

  if (moduleId === "reading") {
    const books = getVisibleBooks();
    const completed = books.filter((book) => book.status === "completed").length;
    const unread = books.filter((book) => book.status === "unread").length;
    const topTags = getTopTags(books);
    const featured = books.slice(0, 3);

    if (books.length) {
      module.includes = [
        [t("libraryShelfCount"), t("libraryShelfCountBody").replace("{count}", books.length)],
        [t("libraryUnreadCount"), t("libraryUnreadCountBody").replace("{count}", unread)],
        [t("libraryCompletedCount"), t("libraryCompletedCountBody").replace("{count}", completed)],
      ];
      module.sampleTitle = t("libraryShelfSample");
      module.sample = featured.map((book) => [
        book.title,
        `${book.author}${book.tags?.length ? ` · ${book.tags.slice(0, 2).join(", ")}` : ""}`,
      ]);
    }
  }

  if (moduleId === "criticism") {
    const latest = writingPieces[0];
    module.summary = writingPieces.length
      ? t("fictionModuleSummary").replace("{count}", writingPieces.length).replace("{title}", latest.title)
      : base.summary;
    module.description = writingPieces.length
      ? t("fictionModuleDescription").replace("{count}", writingPieces.length)
      : base.description;
    module.includes = writingPieces.length
      ? writingPieces.slice(0, 3).map((piece) => [
          piece.title,
          `${piece.category || t("draftLabel")} · ${formatDate(piece.createdAt)}`,
        ])
      : base.includes;
    module.sampleTitle = writingPieces.length ? t("latestFiction") : base.sampleTitle;
    module.sample = writingPieces.length
      ? [[latest.title, makePreview(latest.body, latest.category || t("draftLabel"))]]
      : base.sample;
  }

  if (moduleId === "context") {
    const latest = criticalNotes[0];
    module.summary = criticalNotes.length
      ? t("criticalModuleSummary").replace("{count}", criticalNotes.length).replace("{title}", latest.title)
      : base.summary;
    module.description = criticalNotes.length
      ? t("criticalModuleDescription").replace("{count}", criticalNotes.length)
      : base.description;
    module.includes = criticalNotes.length
      ? criticalNotes.slice(0, 3).map((note) => [
          note.title,
          `${note.category || t("criticalDefaultCategory")} · ${formatDate(note.createdAt)}`,
        ])
      : base.includes;
    module.sampleTitle = criticalNotes.length ? t("latestCritical") : base.sampleTitle;
    module.sample = criticalNotes.length
      ? [[latest.title, makePreview(latest.body, latest.category || t("criticalDefaultCategory"))]]
      : base.sample;
  }

  if (moduleId === "fiction") {
    const latest = extraPosts[0];
    module.summary = extraPosts.length
      ? t("extraModuleSummary").replace("{count}", extraPosts.length).replace("{title}", latest.title)
      : base.summary;
    module.description = extraPosts.length
      ? t("extraModuleDescription").replace("{count}", extraPosts.length)
      : base.description;
    module.includes = extraPosts.length
      ? extraPosts.slice(0, 3).map((post) => [
          post.title,
          formatDate(post.createdAt),
        ])
      : base.includes;
    module.sampleTitle = extraPosts.length ? t("latestExtra") : base.sampleTitle;
    module.sample = extraPosts.length
      ? [[latest.title, makePreview(latest.body, t("extraDefaultBody"))]]
      : base.sample;
  }

  return module;
}

function t(key) {
  return translations[currentLanguage][key] || translations.en[key] || key;
}

function applyStaticTranslations() {
  const dictionary = translations[currentLanguage];
  document.documentElement.lang = dictionary.htmlLang;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = dictionary[key] || translations.en[key] || element.textContent;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    element.placeholder = dictionary[key] || translations.en[key] || element.placeholder;
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    element.setAttribute("aria-label", dictionary[key] || translations.en[key] || element.getAttribute("aria-label"));
  });
  const languageToggle = document.querySelector("#language-toggle");
  languageToggle.textContent = dictionary.toggle;
  languageToggle.setAttribute("aria-pressed", String(currentLanguage === "zh"));
  languageToggle.setAttribute("aria-label", dictionary.toggle);
}

function applyLanguage(language) {
  currentLanguage = language;
  setLanguageContent(language);

  applyStaticTranslations();
  updateDynamicCards();
  renderModule(selectedModuleId);
  if (document.querySelector("#tool-detail")) renderTool(selectedToolId);
  if (document.querySelector("#feature-detail")) renderFeature(selectedFeatureId);
  refreshBookViews();
  renderWritingPieces();
  renderCriticalNotes();
  renderExtraPosts();

  if (document.querySelector("#book-modal").open && activeBook) {
    const translatedBook = sampleBooks.find((book) => book.id === activeBook.id) || activeBook;
    openBookDetail(translatedBook);
  }
}

function updateDynamicCards() {
  Object.keys(modules).forEach((id) => {
    const module = getModuleView(id);
    const card = document.querySelector(`.module-card[data-module="${id}"]`);
    if (!card) return;
    card.querySelector(".module-number").textContent = module.number;
    card.querySelector("strong").textContent = module.label;
    card.querySelector("span:last-child").textContent = module.summary;
  });

  Object.entries(tools).forEach(([id, tool]) => {
    const card = document.querySelector(`.tool-card[data-tool="${id}"]`);
    if (!card) return;
    card.querySelector("span:first-child").textContent = tool.group;
    card.querySelector("strong").textContent = tool.label;
    card.querySelector("span:last-child").textContent = tool.body;
  });

  Object.entries(features).forEach(([id, feature]) => {
    const card = document.querySelector(`.feature-card[data-feature="${id}"]`);
    if (!card) return;
    card.querySelector("span:first-child").textContent = feature.group;
    card.querySelector("strong").textContent = feature.label;
    card.querySelector("span:last-child").textContent = feature.body;
  });
}

// ===== Render Modules =====

function renderModule(moduleId) {
  selectedModuleId = moduleId;
  const module = getModuleView(moduleId);
  const intro = document.createElement("div");
  const kicker = document.createElement("p");
  const heading = document.createElement("h2");
  const description = document.createElement("p");
  const sample = document.createElement("div");
  const sampleTitle = document.createElement("h3");

  kicker.className = "kicker";
  kicker.textContent = module.label;
  heading.textContent = module.title;
  description.textContent = module.description;
  intro.append(kicker, heading, description);

  sample.className = "sample-panel";
  sampleTitle.textContent = module.sampleTitle;
  sample.append(sampleTitle, createDetailList(module.sample.slice(0, 2)));

  const moduleDetail = document.querySelector("#module-detail");
  moduleDetail.replaceChildren(intro, createDetailList(module.includes.slice(0, 2)), sample);

  document.querySelectorAll(".module-card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.module === moduleId);
  });
}

function createContentList(items, emptyText, type) {
  const list = document.createElement("div");
  list.className = "content-list";

  if (!items.length) {
    list.innerHTML = `<div class="library-empty compact-empty"><p>${emptyText}</p></div>`;
    return list;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "content-mini-card";
    card.id = `${type}-${item.id}`;
    card.innerHTML = `
      <p class="writing-meta">${escapeHTML(item.category || type)} · ${formatDate(item.createdAt)}</p>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(makePreview(item.body, item.category))}</p>
    `;
    list.append(card);
  });

  return list;
}

// ===== Render Tools =====

function renderTool(toolId) {
  selectedToolId = toolId;
  const tool = tools[toolId] || tools.motifs;
  const intro = document.createElement("div");
  const kicker = document.createElement("p");
  const heading = document.createElement("h2");
  const description = document.createElement("p");
  const examples = document.createElement("div");
  const examplesTitle = document.createElement("h3");

  kicker.className = "kicker";
  kicker.textContent = tool.group;
  heading.textContent = tool.title;
  description.textContent = tool.description;
  intro.append(kicker, heading, description);

  examples.className = "sample-panel";
  examplesTitle.textContent = t("examples");
  examples.append(examplesTitle, createChipList(tool.examples.slice(0, 2)));

  const toolDetail = document.querySelector("#tool-detail");
  toolDetail.replaceChildren(intro, createDetailList(tool.fields.slice(0, 2)), examples);

  document.querySelectorAll(".tool-card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.tool === toolId);
  });
}

// ===== Render Features =====

function renderFeature(featureId) {
  selectedFeatureId = featureId;
  const feature = features[featureId] || features.bookDeepDive;
  const intro = document.createElement("div");
  const kicker = document.createElement("p");
  const heading = document.createElement("h2");
  const description = document.createElement("p");
  const examples = document.createElement("div");
  const examplesTitle = document.createElement("h3");

  kicker.className = "kicker";
  kicker.textContent = feature.group;
  heading.textContent = feature.title;
  description.textContent = feature.description;
  intro.append(kicker, heading, description);

  examples.className = "sample-panel";
  examplesTitle.textContent = t("examples");
  examples.append(examplesTitle, createChipList(feature.examples.slice(0, 2)));

  const featureDetail = document.querySelector("#feature-detail");
  featureDetail.replaceChildren(intro, createDetailList(feature.fields.slice(0, 3)), examples);

  document.querySelectorAll(".feature-card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.feature === featureId);
  });
}

// ===== Render Library =====

function renderLibrary(filter = "all") {
  activeLibraryFilter = filter;
  const libraryGrid = document.querySelector("#library-grid");
  const searchInput = document.querySelector("#book-search");
  const query = searchInput?.value.trim().toLowerCase() || "";
  
  const filtered = getVisibleBooks().filter((book) => {
    if (filter === "all") return true;
    return book.status === filter;
  }).filter((book) => {
    if (!query) return true;
    return getBookSearchText(book).includes(query);
  });

  if (filtered.length === 0) {
    libraryGrid.innerHTML = `<div class="library-empty"><p>${t("noBooksFilter")}</p></div>`;
    return;
  }

  libraryGrid.innerHTML = "";
  filtered.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="book-cover">${escapeHTML(book.title.charAt(0))}</div>
      <div class="book-info">
        <div class="book-title">${escapeHTML(book.title)}</div>
        <div class="book-author">${escapeHTML(book.author)}</div>
        <div class="book-meta">${escapeHTML(book.year)}</div>
        <p class="book-note">${escapeHTML(makePreview(book.mood || book.why || (book.tags || []).join(", "), ""))}</p>
      </div>
    `;
    card.addEventListener("click", () => openBookDetail(book));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openBookDetail(book);
      }
    });
    libraryGrid.append(card);
  });
}

function getBookSearchText(book) {
  return [
    book.title,
    book.author,
    book.year,
    book.mood,
    book.why,
    book.keyThemes,
    book.literaryContext,
    book.personalReview,
    ...(book.tags || []),
    ...(book.relatedBooks || []),
  ].filter(Boolean).join(" ").toLowerCase();
}

// ===== Render Timeline =====

function renderTimeline() {
  const timelineContainer = document.querySelector("#timeline-container");

  const bookEntries = getVisibleBooks()
    .filter((book) => book.status !== "unread")
    .map((book) => ({
      type: "book",
      date: book.readDates?.[0] || new Date().toISOString().slice(0, 10),
      title: book.title,
      body: book.mood || book.author,
      source: book,
    }));
  const writingEntries = writingPieces.map((piece) => ({
    type: "writing",
    date: piece.createdAt || new Date().toISOString(),
    title: piece.title,
    body: piece.category || piece.body?.slice(0, 120) || "",
    source: piece,
  }));
  const criticalEntries = criticalNotes.map((note) => ({
    type: "critical",
    date: note.createdAt || new Date().toISOString(),
    title: note.title,
    body: note.category || note.body?.slice(0, 120) || "",
    source: note,
  }));
  const extraEntries = extraPosts.map((post) => ({
    type: "extra",
    date: post.createdAt || new Date().toISOString(),
    title: post.title,
    body: post.body?.slice(0, 120) || t("extraDefaultBody"),
    source: post,
  }));
  const entries = [...bookEntries, ...writingEntries, ...criticalEntries, ...extraEntries].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (entries.length === 0) {
    timelineContainer.innerHTML = `<div class="timeline-empty"><p>${t("timelineEmpty")}</p></div>`;
    return;
  }

  const grouped = {};
  entries.forEach((entry) => {
    const year = new Date(entry.date).getFullYear();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(entry);
  });

  timelineContainer.innerHTML = "";
  Object.keys(grouped)
    .sort()
    .reverse()
    .forEach((year) => {
      const yearDiv = document.createElement("div");
      yearDiv.className = "timeline-year";
      yearDiv.textContent = year;
      timelineContainer.append(yearDiv);

      grouped[year].forEach((item) => {
        const entry = document.createElement("div");
        entry.className = `timeline-entry timeline-entry-${item.type}`;
        const typeLabel = {
          book: t("timelineBookType"),
          writing: t("timelineWritingType"),
          critical: t("timelineCriticalType"),
          extra: t("timelineExtraType"),
        }[item.type];
        entry.innerHTML = `
          <time>${new Date(item.date).toLocaleDateString()} · ${typeLabel}</time>
          <h4>${escapeHTML(item.title)}</h4>
          <p class="mood">${escapeHTML(item.body)}</p>
        `;
        if (item.type === "book") {
          entry.addEventListener("click", () => openBookDetail(item.source));
        } else if (item.type === "writing") {
          entry.addEventListener("click", () => {
            switchSection("fiction");
            document.querySelector(`#writing-${item.source.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        } else {
          entry.addEventListener("click", () => {
            switchSection(item.type === "critical" ? "critical" : "extra");
            document.querySelector(`#${item.type}-${item.source.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        }
        timelineContainer.append(entry);
      });
    });
}

function renderWritingPieces() {
  const writingList = document.querySelector("#writing-list");
  if (!writingList) return;

  if (writingPieces.length === 0) {
    writingList.innerHTML = `<div class="library-empty"><p>${t("noWriting")}</p></div>`;
    return;
  }

  writingList.innerHTML = "";
  writingPieces.forEach((piece) => {
    const card = document.createElement("article");
    card.className = "writing-card";
    card.id = `writing-${piece.id}`;
    card.innerHTML = `
      <p class="writing-meta">${escapeHTML(piece.category || "Draft")} · ${new Date(piece.createdAt).toLocaleDateString()}</p>
      <h3>${escapeHTML(piece.title)}</h3>
      <div class="writing-body">${escapeHTML(piece.body || "")}</div>
    `;
    writingList.append(card);
  });
}

function renderCriticalNotes() {
  const criticalList = document.querySelector("#critical-list");
  if (!criticalList) return;
  criticalList.replaceChildren(createContentList(criticalNotes, t("noCritical"), "critical"));
}

function renderExtraPosts() {
  const extraList = document.querySelector("#extra-list");
  if (!extraList) return;
  extraList.replaceChildren(createContentList(extraPosts, t("noExtra"), "extra"));
}

// ===== Book Detail Modal =====

function openBookDetail(book) {
  lastFocusedElement = document.activeElement;
  activeBook = book;
  const modal = document.querySelector("#book-modal");
  const panels = document.querySelector("#book-panels");
  const tags = book.tags || [];
  const relatedBooks = book.relatedBooks || [];
  const authorInfo = book.authorInfo || book.author_info || {};
  const authorBody = [
    authorInfo.nationality,
    authorInfo.genre,
    authorInfo.knownFor || authorInfo.known_for,
  ].filter(Boolean).join(" · ");
  
  panels.innerHTML = `
    <div class="book-panel is-active" data-tab="overview">
      <h3>${escapeHTML(book.title)}</h3>
      <div class="book-section">
        <h4>${t("whyIReadThis")}</h4>
        <p>${escapeHTML(book.why || book.mood || t("firstImpressionsBody"))}</p>
      </div>
      <div class="book-section">
        <h4>${t("modalAuthor")}</h4>
        <p>${escapeHTML(book.author)}</p>
      </div>
      <div class="book-section">
        <h4>${t("modalPublication")}</h4>
        <p>${escapeHTML(book.year || "")}</p>
      </div>
      <div class="book-section">
        <h4>${t("favoriteQuote")}</h4>
        <p>${escapeHTML(book.favoriteQuote || t("closeReadingsBody"))}</p>
      </div>
      <div class="book-section">
        <h4>${t("modalStatus")}</h4>
        <p style="text-transform: capitalize;">${escapeHTML(book.status || "")}</p>
      </div>
      <div class="book-section">
        <h4>${t("modalTags")}</h4>
        <div class="tag-list">
          ${tags.map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join("")}
        </div>
      </div>
    </div>

    <div class="book-panel" data-tab="author">
      <h3>${t("aboutAuthor")}</h3>
      <div class="book-section">
        <h4>${escapeHTML(book.author)}</h4>
        <p>${escapeHTML(authorBody || t("authorPlaceholder"))}</p>
      </div>
    </div>

    <div class="book-panel" data-tab="context">
      <h3>${t("historicalContext")}</h3>
      <div class="book-section">
        <h4>${t("historicalEvents")}</h4>
        <p>${escapeHTML(book.literaryContext || t("historicalEventsBody"))}</p>
      </div>
    </div>

    <div class="book-panel" data-tab="themes">
      <h3>${t("themesMotifs")}</h3>
      <div class="book-section">
        <h4>${t("mainThemes")}</h4>
        <p>${escapeHTML(book.keyThemes || tags.join(", ") || t("mainThemesBody"))}</p>
      </div>
      <div class="book-section">
        <h4>${t("relatedBooks")}</h4>
        <p>${escapeHTML(relatedBooks.join(", ") || t("recurringImagesBody"))}</p>
      </div>
    </div>

    <div class="book-panel" data-tab="review">
      <h3>${t("yourReview")}</h3>
      <div class="book-section">
        <h4>${t("firstImpressions")}</h4>
        <p>${escapeHTML(book.mood || t("firstImpressionsBody"))}</p>
      </div>
      <div class="book-section">
        <h4>${t("closeReadings")}</h4>
        <p>${escapeHTML(book.favoriteQuote || t("closeReadingsBody"))}</p>
      </div>
      <div class="book-section">
        <h4>${t("yourReview")}</h4>
        <p>${escapeHTML(book.personalReview || t("essayIdeasBody"))}</p>
      </div>
    </div>
  `;

  // Tab switching
  document.querySelectorAll(".book-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.tab === "overview");
    tab.addEventListener("click", () => {
      document.querySelectorAll(".book-tab").forEach(t => t.classList.remove("is-active"));
      document.querySelectorAll(".book-panel").forEach(p => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      panels.querySelector(`.book-panel[data-tab="${tab.dataset.tab}"]`)?.classList.add("is-active");
    });
  });

  if (!modal.open) {
    modal.showModal();
  }
  document.querySelector(".modal-close").focus();
}

// ===== Navigation =====

function switchSection(sectionId, updateHash = true) {
  const target = document.querySelector(`#${sectionId}`);
  if (!target) return;

  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("is-active");
  });
  target.classList.add("is-active");

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.section === sectionId);
  });

  if (updateHash && window.location.hash !== `#${sectionId}`) {
    history.pushState(null, "", `#${sectionId}`);
  }
}

// ===== Event Listeners =====

function renderContentCards() {
  const moduleGrid = document.querySelector("#module-grid");
  moduleGrid.replaceChildren();

  // Module cards
  Object.entries(modules).forEach(([id, module]) => {
    const card = document.createElement("button");
    const number = document.createElement("span");
    const title = document.createElement("strong");
    const summary = document.createElement("span");
  
    card.className = "module-card";
    card.type = "button";
    card.dataset.module = id;
    number.className = "module-number";
    number.textContent = module.number;
    title.textContent = module.label;
    summary.textContent = module.summary;
  
    card.append(number, title, summary);
    card.addEventListener("click", () => renderModule(id));
    document.querySelector("#module-grid").append(card);
  });
  
  // Tool cards
  Object.entries(tools).forEach(([id, tool]) => {
    const toolGrid = document.querySelector("#tool-grid");
    if (!toolGrid) return;
    const card = document.createElement("button");
    const group = document.createElement("span");
    const title = document.createElement("strong");
    const body = document.createElement("span");
  
    card.className = "tool-card";
    card.type = "button";
    card.dataset.tool = id;
    group.textContent = tool.group;
    title.textContent = tool.label;
    body.textContent = tool.body;
    card.append(group, title, body);
    card.addEventListener("click", () => renderTool(id));
    toolGrid.append(card);
  });
  
  // Feature cards
  Object.entries(features).forEach(([id, feature]) => {
    const featureGrid = document.querySelector("#feature-grid");
    if (!featureGrid) return;
    const card = document.createElement("button");
    const group = document.createElement("span");
    const title = document.createElement("strong");
    const body = document.createElement("span");
  
    card.className = "feature-card";
    card.type = "button";
    card.dataset.feature = id;
    group.textContent = feature.group;
    title.textContent = feature.label;
    body.textContent = feature.body;
    card.append(group, title, body);
    card.addEventListener("click", () => renderFeature(id));
    featureGrid.append(card);
  });
}

function attachEventListeners() {
  // Navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      switchSection(link.dataset.section);
    });
  });
  
  // Language toggle
  document.querySelector("#language-toggle").addEventListener("click", () => {
    applyLanguage(currentLanguage === "en" ? "zh" : "en");
  });
  
  // Library filters
  document.querySelectorAll(".filter-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      renderLibrary(btn.dataset.filter);
    });
  });
  
  // Book search
  document.querySelector("#book-search").addEventListener("input", (e) => {
    renderLibrary(activeLibraryFilter);
  });
  
  function closeBookModal() {
    activeBook = null;
    document.querySelector("#book-modal").close();
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }
  
  // Modal close button
  document.querySelector(".modal-close").addEventListener("click", closeBookModal);
  
  // Close modal on backdrop click
  document.querySelector(".modal-backdrop").addEventListener("click", closeBookModal);
  
  document.querySelector("#book-modal").addEventListener("close", () => {
    activeBook = null;
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  });
}

// ===== Initialize =====

async function initializeApp() {
  try {
    await loadContentData();
  } catch (error) {
    console.error(error);
    document.querySelector(".page-shell").insertAdjacentHTML(
      "afterbegin",
      '<div class="library-empty"><p>Could not load site content. Please preview through a local server.</p></div>'
    );
    return;
  }

  renderContentCards();
  attachEventListeners();
  renderModule("reading");
  applyStaticTranslations();
  refreshBookViews();
  renderWritingPieces();
  renderCriticalNotes();
  renderExtraPosts();

  const initialSection = window.location.hash.replace("#", "") || "cabinet";
  switchSection(initialSection, false);

  window.addEventListener("popstate", () => {
    switchSection(window.location.hash.replace("#", "") || "cabinet", false);
  });
}

initializeApp();
