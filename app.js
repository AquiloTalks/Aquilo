// ===== Data Models =====

let modules = {};
let sampleBooks = [];
let translations = { en: {}, zh: {} };
let siteContent = null;
let writingPieces = [];
let criticalNotes = [];
let extraPosts = [];
let experiments = [];

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }
  return response.json();
}

async function loadContentData() {
  const [content, books, fiction, reflections, extra, experimentIndex] = await Promise.all([
    loadJSON("data/site-content.json"),
    loadJSON("data/books.json"),
    loadJSON("data/fiction.json"),
    loadJSON("data/reflections.json"),
    loadJSON("data/extra.json"),
    loadJSON("data/experiments.json").catch(() => []),
  ]);

  siteContent = content;
  translations = content.translations || translations;
  sampleBooks = books;
  writingPieces = normalizePublicEntries(fiction, "fiction");
  criticalNotes = normalizePublicEntries(reflections, "reflection");
  extraPosts = normalizePublicEntries(extra, "extra");
  experiments = Array.isArray(experimentIndex) ? experimentIndex : [];
  setLanguageContent(currentLanguage);
}

function cloneContent(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function setLanguageContent(language) {
  const content = siteContent?.[language] || siteContent?.en || {};
  modules = cloneContent(content.modules);
}

const LANGUAGE_STORAGE_KEY = "aquilo-language";

function savedLanguage() {
  const urlLanguage = new URLSearchParams(window.location.search).get("lang");
  if (["en", "zh"].includes(urlLanguage)) return urlLanguage;
  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return ["en", "zh"].includes(storedLanguage) ? storedLanguage : "en";
  } catch {
    return "en";
  }
}

function rememberLanguage(language) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // The URL still keeps the preference when browser storage is unavailable.
  }
  const url = new URL(window.location.href);
  url.searchParams.set("lang", language);
  history.replaceState(null, "", url);
}

let currentLanguage = savedLanguage();
let selectedModuleId = "reading";
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

function localizeEntry(entry) {
  const localized = entry.translations?.[currentLanguage] || {};
  return {
    ...entry,
    title: localized.title || entry.title,
    category: localized.category || entry.category,
    body: localized.body || entry.body,
  };
}

function localizeBook(book) {
  const localized = book.translations?.[currentLanguage] || {};
  return {
    ...book,
    title: localized.title || book.title,
    author: localized.author || book.author,
    mood: localized.mood || book.mood,
    why: localized.why || book.why,
    favoriteQuote: localized.favoriteQuote || book.favoriteQuote,
    keyThemes: localized.keyThemes || book.keyThemes,
    literaryContext: localized.literaryContext || book.literaryContext,
    personalReview: localized.personalReview || book.personalReview,
  };
}

function getVisibleBooks() {
  return sampleBooks.map(localizeBook);
}

function refreshBookViews() {
  renderLibrary(activeLibraryFilter);
  renderRecentReads();
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

function setSamplePanel(panel, title, rows) {
  const heading = document.createElement("h3");
  heading.textContent = title;
  panel.replaceChildren(heading, createDetailList(rows));
}

function getLibrarySampleRows(filter = "all") {
  const sorted = sortBooks(getVisibleBooks());
  const books = filter === "all"
    ? sorted
    : sorted.filter((book) => book.status === filter);

  if (!books.length) {
    return [[t("libraryShelfSample"), t("noBooksFilter")]];
  }

  return books.slice(0, 2).map((book) => [
    book.title,
    `${book.author}${book.tags?.length ? ` · ${book.tags.slice(0, 2).join(", ")}` : ""}`,
  ]);
}

function getLibrarySampleTitle(filter = "all") {
  if (filter === "unread") return t("libraryUnreadShelfSample");
  if (filter === "completed") return t("libraryCompletedCount");
  return t("libraryAllShelfSample");
}

function setLibraryFilter(filter) {
  document.querySelectorAll(".filter-tab").forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderLibrary(filter);
}

function openLibraryFilter(filter) {
  const searchInput = document.querySelector("#book-search");
  if (searchInput) searchInput.value = "";
  switchSection("library");
  setLibraryFilter(filter);
}

function createReadingDetailList(items, samplePanel) {
  const list = createDetailList(items.slice(0, 3));
  const actions = ["all", "unread", "completed"];

  Array.from(list.children).forEach((item, index) => {
    const filter = actions[index];
    if (!filter) return;
    item.classList.add("is-link");
    item.tabIndex = 0;
    item.setAttribute("role", "link");
    item.addEventListener("click", () => openLibraryFilter(filter));
    item.addEventListener("mouseenter", () => {
      setSamplePanel(samplePanel, getLibrarySampleTitle(filter), getLibrarySampleRows(filter));
    });
    item.addEventListener("focus", () => {
      setSamplePanel(samplePanel, getLibrarySampleTitle(filter), getLibrarySampleRows(filter));
    });
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLibraryFilter(filter);
      }
    });
  });

  list.addEventListener("mouseleave", () => {
    setSamplePanel(samplePanel, getLibrarySampleTitle("all"), getLibrarySampleRows("all"));
  });

  return list;
}

function formatDate(value) {
  if (!value || String(value).startsWith("1970-01-01")) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString();
  }
  return new Date(value).toLocaleDateString();
}

function makePreview(value, fallback = "", limit = 135) {
  const clean = String(value || fallback || "").trim().replace(/\s+/g, " ");
  const chars = [...clean];
  return chars.length > limit ? `${chars.slice(0, limit - 1).join("")}…` : clean;
}

function getBookReview(book) {
  return String(book.personalReview || "").trim();
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

function makeRowLink(item, action) {
  item.classList.add("is-link");
  item.tabIndex = 0;
  item.setAttribute("role", "link");
  item.addEventListener("click", action);
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  });
}

function openExtraSection(targetId) {
  switchSection("extra");
  if (targetId) {
    document.querySelector(`#${targetId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// On Home, the Extra rows open the Extra page; the Experiments row jumps to its list.
function createExtraDetailList(items) {
  const list = createDetailList(items.slice(0, 2));
  const [postsRow, experimentsRow] = list.children;
  if (postsRow) makeRowLink(postsRow, () => openExtraSection("extra-list-heading"));
  if (experimentsRow && experiments.length) {
    makeRowLink(experimentsRow, () => openExtraSection("experiments-heading"));
  }
  return list;
}

function localizeExperiment(item) {
  const versions = item.languages || {};
  return versions[currentLanguage] || versions.default || versions.en || versions.zh || {};
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
    const pieces = writingPieces.map(localizeEntry);
    const latest = pieces[0];
    module.summary = pieces.length
      ? t("fictionModuleSummary").replace("{count}", pieces.length).replace("{title}", latest.title)
      : base.summary;
    module.description = pieces.length
      ? t("fictionModuleDescription").replace("{count}", pieces.length)
      : base.description;
    module.includes = pieces.length
      ? pieces.slice(0, 3).map((piece) => [
          piece.title,
          `${piece.category || t("draftLabel")} · ${formatDate(piece.createdAt)}`,
        ])
      : base.includes;
    module.sampleTitle = pieces.length ? t("latestFiction") : base.sampleTitle;
    module.sample = pieces.length
      ? [[latest.title, makePreview(latest.body, latest.category || t("draftLabel"))]]
      : base.sample;
  }

  if (moduleId === "context") {
    const notes = criticalNotes.map(localizeEntry);
    const latest = notes[0];
    module.summary = notes.length
      ? t("criticalModuleSummary").replace("{count}", notes.length).replace("{title}", latest.title)
      : base.summary;
    module.description = notes.length
      ? t("criticalModuleDescription").replace("{count}", notes.length)
      : base.description;
    module.includes = notes.length
      ? notes.slice(0, 3).map((note) => [
          note.title,
          `${note.category || t("criticalDefaultCategory")} · ${formatDate(note.createdAt)}`,
        ])
      : base.includes;
    module.sampleTitle = notes.length ? t("latestCritical") : base.sampleTitle;
    module.sample = notes.length
      ? [[latest.title, makePreview(latest.body, latest.category || t("criticalDefaultCategory"))]]
      : base.sample;
  }

  if (moduleId === "fiction") {
    const posts = extraPosts.map(localizeEntry);
    const latest = posts[0];
    module.summary = posts.length
      ? t("extraModuleSummary").replace("{count}", posts.length).replace("{title}", latest.title)
      : base.summary;
    module.description = posts.length
      ? t("extraModuleDescription").replace("{count}", posts.length)
      : base.description;
    module.includes = posts.length
      ? posts.slice(0, 3).map((post) => [
          post.title,
          formatDate(post.createdAt),
        ])
      : base.includes;
    module.sampleTitle = posts.length ? t("latestExtra") : base.sampleTitle;
    module.sample = posts.length
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
  rememberLanguage(language);
  setLanguageContent(language);

  applyStaticTranslations();
  refreshBookViews();
  renderWritingPieces();
  renderCriticalNotes();
  renderExtraPosts();

  if (document.querySelector("#book-modal").open && activeBook) {
    const translatedBook = getVisibleBooks().find((book) => book.id === activeBook.id) || activeBook;
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

  kicker.className = "kicker";
  kicker.textContent = module.label;
  heading.textContent = module.title;
  description.textContent = module.description;
  intro.append(kicker, heading, description);

  sample.className = "sample-panel";
  if (moduleId === "reading") {
    setSamplePanel(sample, getLibrarySampleTitle("all"), getLibrarySampleRows("all"));
  } else {
    setSamplePanel(sample, module.sampleTitle, module.sample.slice(0, 2));
  }

  const moduleDetail = document.querySelector("#module-detail");
  let detailList;
  if (moduleId === "reading") {
    detailList = createReadingDetailList(module.includes, sample);
  } else if (moduleId === "fiction") {
    detailList = createExtraDetailList(module.includes);
  } else {
    detailList = createDetailList(module.includes.slice(0, 2));
  }
  moduleDetail.replaceChildren(intro, detailList, sample);

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

  items.map(localizeEntry).forEach((item) => {
    const card = document.createElement("article");
    card.className = "content-mini-card";
    card.id = `${type}-${item.id}`;
    card.innerHTML = `
      <p class="writing-meta">${[escapeHTML(item.category || type), formatDate(item.createdAt)].filter(Boolean).join(" · ")}</p>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(makePreview(item.body, item.category))}</p>
    `;
    list.append(card);
  });

  return list;
}

// ===== Render Library =====

const STATUS_ORDER = { reading: 0, completed: 1, unread: 2 };
const STATUS_KEYS = { unread: "filterUnread", completed: "filterCompleted", reading: "filterReading" };

function statusLabel(status) {
  return STATUS_KEYS[status] ? t(STATUS_KEYS[status]) : String(status || "");
}

function getLatestReadKey(book) {
  const keys = (Array.isArray(book.readDates) ? book.readDates : [])
    .map(getTimelineMonthKey)
    .filter(Boolean)
    .sort();
  return keys[keys.length - 1] || "";
}

function sortBooks(books) {
  return [...books].sort((a, b) =>
    (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3)
    || getLatestReadKey(b).localeCompare(getLatestReadKey(a))
    || (Number(a.id) || 0) - (Number(b.id) || 0)
  );
}

function coverGlyph(title) {
  const clean = String(title || "").replace(/^[\s"'“‘《「（(]+/, "");
  return [...clean][0] || "·";
}

function coverTone(book) {
  const tones = ["#7c94a5", "#8fa069", "#b0907a", "#8a9cb8", "#9a8fa8", "#6f9c98"];
  const seed = [...String(book.title || "")].reduce((sum, char) => sum + char.codePointAt(0), 0);
  return tones[seed % tones.length];
}

function updateFilterCounts() {
  const books = getVisibleBooks();
  document.querySelectorAll(".filter-tab").forEach((button) => {
    const filter = button.dataset.filter;
    const count = filter === "all" ? books.length : books.filter((book) => book.status === filter).length;
    const key = button.dataset.i18n;
    button.innerHTML = `${escapeHTML(t(key))} <span class="filter-count">${count}</span>`;
  });
}

function renderLibrary(filter = "all") {
  activeLibraryFilter = filter;
  updateFilterCounts();
  const libraryGrid = document.querySelector("#library-grid");
  const searchInput = document.querySelector("#book-search");
  const query = searchInput?.value.trim().toLowerCase() || "";

  const filtered = sortBooks(getVisibleBooks()).filter((book) => {
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
    const review = getBookReview(book);
    const readKey = getLatestReadKey(book);
    const card = document.createElement("div");
    card.className = `book-card is-${escapeHTML(book.status || "unread")}`;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${book.title} — ${book.author}`);
    card.innerHTML = `
      <div class="book-cover" style="--cover-tone: ${coverTone(book)}" aria-hidden="true">${escapeHTML(coverGlyph(book.title))}</div>
      <div class="book-info">
        <div class="book-status-row">
          <span class="status-badge is-${escapeHTML(book.status || "unread")}">${escapeHTML(statusLabel(book.status))}</span>
          ${readKey ? `<span class="book-read-date">${formatTimelineMonth(readKey)}</span>` : ""}
        </div>
        <div class="book-title">${escapeHTML(book.title)}</div>
        <div class="book-author">${escapeHTML(book.author)}${book.year ? ` · ${escapeHTML(book.year)}` : ""}</div>
        ${book.mood || book.why ? `<p class="book-note">${escapeHTML(makePreview(book.mood || book.why))}</p>` : ""}
      </div>
      ${review ? `
        <div class="book-review-preview">
          <span>${t("reviewPreviewLabel")}</span>
          <p>${escapeHTML(makePreview(review, "", 160))}</p>
          <button type="button" class="book-review-link">${t("readFullReview")} →</button>
        </div>
      ` : ""}
    `;
    card.addEventListener("click", () => openBookDetail(book));
    card.querySelector(".book-review-link")?.addEventListener("click", (event) => {
      event.stopPropagation();
      openBookDetail(book, "review");
    });
    card.addEventListener("keydown", (event) => {
      if (event.target !== card) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openBookDetail(book);
      }
    });
    libraryGrid.append(card);
  });
}

// ===== Home: Recently Read =====

function renderRecentReads() {
  const grid = document.querySelector("#recent-grid");
  if (!grid) return;
  const recent = getVisibleBooks()
    .filter((book) => book.status === "completed" && getLatestReadKey(book))
    .sort((a, b) => getLatestReadKey(b).localeCompare(getLatestReadKey(a)))
    .slice(0, 3);

  const section = grid.closest(".recent-section");
  if (section) section.hidden = recent.length === 0;

  grid.replaceChildren(...recent.map((book) => {
    const review = getBookReview(book);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "recent-card";
    card.innerHTML = `
      <span class="recent-date">${formatTimelineMonth(getLatestReadKey(book))}</span>
      <strong class="recent-title">${escapeHTML(book.title)}</strong>
      <span class="recent-author">${escapeHTML(book.author)}</span>
      ${review ? `<span class="recent-excerpt">${escapeHTML(makePreview(review, "", 140))}</span>` : ""}
    `;
    card.addEventListener("click", () => openBookDetail(book, review ? "review" : "overview"));
    return card;
  }));
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

function getTimelineMonthKey(value) {
  if (!value) return "";
  const raw = String(value).trim();
  if (raw === "1970-01-01" || raw.startsWith("1970-01-01T00:00:00.000Z")) return "";
  const yearFirst = raw.match(/^(\d{4})[-/](\d{1,2})/);
  if (yearFirst) {
    return `${yearFirst[1]}-${yearFirst[2].padStart(2, "0")}`;
  }
  const monthFirst = raw.match(/^(\d{1,2})[-/](\d{4})$/);
  if (monthFirst) {
    return `${monthFirst[2]}-${monthFirst[1].padStart(2, "0")}`;
  }
  return "";
}

function formatTimelineMonth(monthKey) {
  const [year, month] = monthKey.split("-");
  if (!year || !month) return monthKey;
  if (currentLanguage === "zh") {
    return `${year}年${Number(month)}月`;
  }
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function renderTimeline() {
  const timelineContainer = document.querySelector("#timeline-container");

  const bookEntries = getVisibleBooks().flatMap((book) => {
    const readDates = Array.isArray(book.readDates) ? book.readDates : [];
    return readDates.filter(getTimelineMonthKey).map((date) => ({
      type: "book",
      date,
      title: book.title,
      source: book,
    }));
  });
  const writingEntries = writingPieces.flatMap((piece) => {
    const item = localizeEntry(piece);
    if (!getTimelineMonthKey(item.createdAt)) return [];
    return {
      type: "writing",
      date: item.createdAt,
      title: item.title,
      source: item,
    };
  });
  const criticalEntries = criticalNotes.flatMap((note) => {
    const item = localizeEntry(note);
    if (!getTimelineMonthKey(item.createdAt)) return [];
    return {
      type: "critical",
      date: item.createdAt,
      title: item.title,
      source: item,
    };
  });
  const extraEntries = extraPosts.flatMap((post) => {
    const item = localizeEntry(post);
    if (!getTimelineMonthKey(item.createdAt)) return [];
    return {
      type: "extra",
      date: item.createdAt,
      title: item.title,
      source: item,
    };
  });
  const entries = [...bookEntries, ...writingEntries, ...criticalEntries, ...extraEntries];

  if (entries.length === 0) {
    timelineContainer.innerHTML = `<div class="timeline-empty"><p>${t("timelineEmpty")}</p></div>`;
    return;
  }

  const groupedEntries = entries.reduce((groups, item) => {
    const monthKey = getTimelineMonthKey(item.date);
    if (!monthKey) return groups;
    if (!groups.has(monthKey)) groups.set(monthKey, []);
    groups.get(monthKey).push(item);
    return groups;
  }, new Map());
  const monthGroups = Array.from(groupedEntries.entries()).sort(([a], [b]) => b.localeCompare(a));

  timelineContainer.innerHTML = "";
  monthGroups.forEach(([monthKey, items], index) => {
    const monthEntry = document.createElement("div");
    monthEntry.className = `timeline-month ${index % 2 === 0 ? "is-right" : "is-left"}`;
    monthEntry.innerHTML = `
      <div class="timeline-marker">
        <span class="timeline-node" aria-hidden="true"></span>
        <time>${formatTimelineMonth(monthKey)}</time>
      </div>
      <div class="timeline-month-content"></div>
    `;
    const content = monthEntry.querySelector(".timeline-month-content");
    items.forEach((item) => {
      const entry = document.createElement("button");
      entry.className = `timeline-item timeline-item-${item.type}`;
      entry.type = "button";
      const typeLabel = {
        book: t("timelineBookType"),
        writing: t("timelineWritingType"),
        critical: t("timelineCriticalType"),
        extra: t("timelineExtraType"),
      }[item.type];
      const subtitle = item.type === "book" ? item.source.author : "";
      entry.innerHTML = `
        <span class="timeline-label">${typeLabel}</span>
        <span class="timeline-text">
          <strong>${escapeHTML(item.title)}</strong>
          ${subtitle ? `<span class="timeline-sub">${escapeHTML(subtitle)}</span>` : ""}
        </span>
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
      content.append(entry);
    });
    timelineContainer.append(monthEntry);
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
  writingPieces.map(localizeEntry).forEach((piece) => {
    const card = document.createElement("article");
    card.className = "writing-card";
    card.id = `writing-${piece.id}`;
    card.innerHTML = `
      <p class="writing-meta">${[escapeHTML(piece.category || t("draftLabel")), formatDate(piece.createdAt)].filter(Boolean).join(" · ")}</p>
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
  renderExperiments();
}

function experimentHref(item) {
  return `experiment.html?id=${encodeURIComponent(item.id)}&lang=${currentLanguage}`;
}

function renderExperiments() {
  const list = document.querySelector("#experiment-list");
  if (!list) return;

  if (!experiments.length) {
    list.innerHTML = `<div class="library-empty compact-empty"><p>${t("noExperiments")}</p></div>`;
    return;
  }

  list.innerHTML = experiments.map((item) => {
    const localized = localizeExperiment(item);
    const href = experimentHref(item);
    const meta = [t("experimentTypeStory"), t("experimentSteps").replace("{count}", item.steps)].join(" · ");
    return `
      <a class="experiment-card" href="${href}">
        <p class="writing-meta">${escapeHTML(meta)}</p>
        <h3>${escapeHTML(localized.title)}</h3>
        ${localized.author ? `<p class="experiment-author">${escapeHTML(localized.author)}</p>` : ""}
        <p class="experiment-summary">${escapeHTML(localized.summary)}</p>
        <span class="experiment-open">${t("experimentOpen")} →</span>
      </a>`;
  }).join("");
}

// ===== Book Detail Modal =====

function reviewParagraphs(text) {
  return String(text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHTML(line)}</p>`)
    .join("");
}

function quoteBlocks(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const chinese = /[\u3400-\u9fff]/.test(block) ? " is-chinese" : "";
      return `<blockquote class="quote-text${chinese}">${escapeHTML(block)}</blockquote>`;
    })
    .join("");
}

function setActiveBookTab(tabName) {
  document.querySelectorAll(".book-tab").forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  document.querySelectorAll(".book-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.tab === tabName);
  });
}

function openBookDetail(book, initialTab = "overview") {
  if (!document.querySelector("#book-modal").open) {
    lastFocusedElement = document.activeElement;
  }
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
  const review = getBookReview(book);
  const readKeys = (book.readDates || []).map(getTimelineMonthKey).filter(Boolean).sort();
  const experiment = experiments.find((item) => String(item.book) === String(book.id));

  const available = {
    overview: true,
    author: Boolean(authorBody),
    context: Boolean(book.literaryContext),
    themes: Boolean(book.keyThemes || relatedBooks.length),
    review: Boolean(review || book.favoriteQuote),
  };
  const activeTab = available[initialTab] ? initialTab : (available.review && initialTab === "review" ? "review" : "overview");

  document.querySelector("#book-modal-head").innerHTML = `
    <p class="modal-kicker">
      <span class="status-badge is-${escapeHTML(book.status || "unread")}">${escapeHTML(statusLabel(book.status))}</span>
      ${readKeys.length ? `<span>${t("readOn")} ${readKeys.map(formatTimelineMonth).join(" · ")}</span>` : ""}
    </p>
    <h2 id="book-modal-title">${escapeHTML(book.title)}</h2>
    <p class="modal-byline">${escapeHTML(book.author)}${book.year ? ` · ${escapeHTML(book.year)}` : ""}</p>
  `;

  const section = (heading, body) => `
    <div class="book-section">
      <h4>${heading}</h4>
      ${body}
    </div>`;

  panels.innerHTML = `
    <div class="book-panel" data-tab="overview">
      ${book.why ? section(t("whyIReadThis"), `<p>${escapeHTML(book.why)}</p>`) : ""}
      ${book.mood ? section(t("readingMood"), `<p>${escapeHTML(book.mood)}</p>`) : ""}
      ${tags.length ? section(t("modalTags"), `<div class="tag-list">${tags.map((tag) => `<span class="tag">${escapeHTML(tag)}</span>`).join("")}</div>`) : ""}
      ${review ? `
        <div class="book-section overview-review">
          <h4>${t("reviewPreviewLabel")}</h4>
          <p>${escapeHTML(makePreview(review, "", 200))}</p>
          <button type="button" class="book-review-link" data-goto-tab="review">${t("readFullReview")} →</button>
        </div>` : ""}
      ${experiment ? `
        <a class="book-section overview-experiment" href="${experimentHref(experiment)}">
          <h4>${t("experimentsHeading")}</h4>
          <span>${t("experimentRead")} →</span>
        </a>` : ""}
      ${!book.why && !book.mood && !tags.length && !review && !experiment ? `<p class="panel-empty">${t("noNotesYet")}</p>` : ""}
    </div>

    <div class="book-panel" data-tab="author">
      ${section(escapeHTML(book.author), `<p>${escapeHTML(authorBody)}</p>`)}
    </div>

    <div class="book-panel" data-tab="context">
      ${section(t("historicalContext"), `<p>${escapeHTML(book.literaryContext)}</p>`)}
    </div>

    <div class="book-panel" data-tab="themes">
      ${book.keyThemes ? section(t("mainThemes"), `<p>${escapeHTML(book.keyThemes)}</p>`) : ""}
      ${relatedBooks.length ? section(t("relatedBooks"), `<p>${escapeHTML(relatedBooks.join(", "))}</p>`) : ""}
    </div>

    <div class="book-panel" data-tab="review">
      ${book.favoriteQuote ? section(t("favoriteQuote"), quoteBlocks(book.favoriteQuote)) : ""}
      ${review ? section(t("yourReview"), `<div class="review-body">${reviewParagraphs(review)}</div>`) : ""}
    </div>
  `;

  document.querySelectorAll(".book-tab").forEach((tab) => {
    tab.hidden = !available[tab.dataset.tab];
  });
  document.querySelector(".book-detail-tabs").hidden =
    Object.values(available).filter(Boolean).length < 2;
  setActiveBookTab(activeTab);

  if (!modal.open) {
    modal.showModal();
  }
  document.querySelector(".modal-content").scrollTop = 0;
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
    window.scrollTo({ top: 0 });
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
    btn.addEventListener("click", () => setLibraryFilter(btn.dataset.filter));
  });
  
  // Book search
  document.querySelector("#book-search").addEventListener("input", (e) => {
    renderLibrary(activeLibraryFilter);
  });
  
  function closeBookModal() {
    document.querySelector("#book-modal").close();
  }
  
  // Book detail tabs (attached once)
  document.querySelectorAll(".book-tab").forEach((tab) => {
    tab.addEventListener("click", () => setActiveBookTab(tab.dataset.tab));
  });
  document.querySelector("#book-panels").addEventListener("click", (event) => {
    const target = event.target.closest("[data-goto-tab]");
    if (target) setActiveBookTab(target.dataset.gotoTab);
  });

  document.querySelector("#recent-all")?.addEventListener("click", (event) => {
    event.preventDefault();
    openLibraryFilter("completed");
  });

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
  rememberLanguage(currentLanguage);
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
