// ===== Data Models =====

let modules = {};
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
}

let currentLanguage = "en";
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
  const books = filter === "all"
    ? getVisibleBooks()
    : getVisibleBooks().filter((book) => book.status === filter);

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
  if (!value) return new Date().toLocaleDateString();
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString();
  }
  return new Date(value).toLocaleDateString();
}

function makePreview(value, fallback = "") {
  const clean = String(value || fallback || "").trim().replace(/\s+/g, " ");
  return clean.length > 135 ? `${clean.slice(0, 132)}...` : clean;
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
  const detailList = moduleId === "reading"
    ? createReadingDetailList(module.includes, sample)
    : createDetailList(module.includes.slice(0, 2));
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
      <p class="writing-meta">${escapeHTML(item.category || type)} · ${formatDate(item.createdAt)}</p>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(makePreview(item.body, item.category))}</p>
    `;
    list.append(card);
  });

  return list;
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
    const review = getBookReview(book);
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
        ${review ? `
          <div class="book-review-preview">
            <span>${t("reviewPreviewLabel")}</span>
            <p>${escapeHTML(makePreview(review))}</p>
            <button type="button" class="book-review-link">${t("readFullReview")}</button>
          </div>
        ` : ""}
      </div>
    `;
    card.addEventListener("click", () => openBookDetail(book));
    card.querySelector(".book-review-link")?.addEventListener("click", (event) => {
      event.stopPropagation();
      openBookDetail(book, "review");
    });
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
      entry.innerHTML = `
        <span class="timeline-label">${typeLabel}</span>
        <strong>${escapeHTML(item.title)}</strong>
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

function openBookDetail(book, initialTab = "overview") {
  lastFocusedElement = document.activeElement;
  activeBook = book;
  const modal = document.querySelector("#book-modal");
  const panels = document.querySelector("#book-panels");
  const activeTab = ["overview", "author", "context", "themes", "review"].includes(initialTab) ? initialTab : "overview";
  const tags = book.tags || [];
  const relatedBooks = book.relatedBooks || [];
  const authorInfo = book.authorInfo || book.author_info || {};
  const authorBody = [
    authorInfo.nationality,
    authorInfo.genre,
    authorInfo.knownFor || authorInfo.known_for,
  ].filter(Boolean).join(" · ");
  
  panels.innerHTML = `
    <div class="book-panel ${activeTab === "overview" ? "is-active" : ""}" data-tab="overview">
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

    <div class="book-panel ${activeTab === "author" ? "is-active" : ""}" data-tab="author">
      <h3>${t("aboutAuthor")}</h3>
      <div class="book-section">
        <h4>${escapeHTML(book.author)}</h4>
        <p>${escapeHTML(authorBody || t("authorPlaceholder"))}</p>
      </div>
    </div>

    <div class="book-panel ${activeTab === "context" ? "is-active" : ""}" data-tab="context">
      <h3>${t("historicalContext")}</h3>
      <div class="book-section">
        <h4>${t("historicalEvents")}</h4>
        <p>${escapeHTML(book.literaryContext || t("historicalEventsBody"))}</p>
      </div>
    </div>

    <div class="book-panel ${activeTab === "themes" ? "is-active" : ""}" data-tab="themes">
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

    <div class="book-panel ${activeTab === "review" ? "is-active" : ""}" data-tab="review">
      <h3>${t("yourReview")}</h3>
      <div class="book-section">
        <h4>${t("firstImpressions")}</h4>
        <p>${escapeHTML(book.mood || t("firstImpressionsBody"))}</p>
      </div>
      <div class="book-section">
        <h4>${t("favoriteQuote")}</h4>
        <p class="quote-text">${escapeHTML(book.favoriteQuote || t("favoriteQuoteBody"))}</p>
      </div>
      <div class="book-section">
        <h4>${t("yourReview")}</h4>
        <p>${escapeHTML(book.personalReview || t("essayIdeasBody"))}</p>
      </div>
    </div>
  `;

  // Tab switching
  document.querySelectorAll(".book-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.tab === activeTab);
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
