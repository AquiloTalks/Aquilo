// ===== Data Models =====

let modules = {
  reading: {
    number: "01",
    label: "Reading Archive",
    title: "I am what I read",
    summary: "A personal archive for books, moods, notes, and the traces reading leaves behind.",
    description:
      "This is the central reading archive: the place for books, dates, quotes, first impressions, rereads, and the small evidence of how a text stayed with you.",
    includes: [
      ["Book notes", "Title, author, dates, quotes, reading mood, and quick response."],
      ["Reading traces", "Questions, obsessions, and small details that keep returning after you finish."],
      ["Reading timeline", "A chronological view of what you read and what themes occupied you then."],
    ],
    sampleTitle: "Book entry",
    sample: [
      ["Book", "Mrs Dalloway / Virginia Woolf / 1925"],
      ["Reading mood", "quiet, fragmented, alert to city sounds"],
      ["Motifs", "time, city, flowers, consciousness"],
      ["Next link", "Close Reading Lab: opening sentence and movement through London"],
    ],
  },
  criticism: {
    number: "02",
    label: "My fiction",
    title: "Welcome to my silly world",
    summary: "Characters, fragments, scenes, and the private logic of unfinished stories.",
    description:
      "This is the writing room: playful, strange, unfinished, and full of fragments that may become characters, scenes, or entire worlds.",
    includes: [
      ["Characters", "Names, voices, contradictions, desires, and private histories."],
      ["Fragments", "Loose scenes, images, opening lines, endings, and sentences that want a home."],
      ["World notes", "Rules, places, atmospheres, and recurring objects."],
    ],
    sampleTitle: "Fiction seed",
    sample: [
      ["World", "A house that remembers more than its owner does"],
      ["Voice", "Tender, suspicious, sometimes too dramatic on purpose"],
      ["Object", "A blue cup that appears in every room"],
      ["Status", "collecting fragments"],
    ],
  },
  context: {
    number: "03",
    label: "Reflection",
    title: "Don't lie to me",
    summary: "Close reading, sharper claims, uncomfortable questions, and honest criticism.",
    description:
      "This is where the archive becomes more exacting. It asks whether an interpretation is honest, whether the evidence holds, and what the text is really doing.",
    includes: [
      ["Close reading", "Quote, image, syntax, rhythm, context, and claim."],
      ["Argument check", "What the claim says, what supports it, and where it might be weak."],
      ["Theory notes", "Terms, methods, and frameworks that clarify the reading."],
    ],
    sampleTitle: "Critical note",
    sample: [
      ["Claim", "The room is not only private space; it is a test of who is allowed to think."],
      ["Evidence", "Woolf's rooms, Morrison's houses, inherited memory"],
      ["Weak point", "Needs a clearer distinction between room and house"],
      ["Status", "revising"],
    ],
  },
  fiction: {
    number: "04",
    label: "Extra",
    title: "And more...",
    summary: "Loose notes, side quests, experiments, and anything that does not fit neatly elsewhere.",
    description:
      "This is the overflow drawer: extra thoughts, small experiments, lists, links, and future sections that are not ready to become their own room yet.",
    includes: [
      ["Loose notes", "Small thoughts, saved lines, links, and ideas to revisit later."],
      ["Experiments", "Formats, visual ideas, interactive sketches, and possible future blocks."],
      ["Parking lot", "Things that may become a full section later."],
    ],
    sampleTitle: "Extra note",
    sample: [
      ["Idea", "A small page for favorite sentences"],
      ["Maybe later", "A map of books by emotional weather"],
      ["Status", "not urgent"],
      ["Next step", "Decide whether it belongs on Home or Extra"],
    ],
  },
};

let tools = {
  motifs: {
    label: "Motif Atlas",
    group: "Reading + criticism",
    body: "Track images like room, mirror, city, sea, silence, body, and memory across books and drafts.",
    title: "Motif Atlas",
    description:
      "A cross-book map for recurring images. Motifs help you notice what your reading and writing keep returning to.",
    fields: [
      ["Motif", "room, mirror, city, sea, silence, body, garden, illness, memory"],
      ["Appears in", "Books, passages, authors, essays, and fiction drafts"],
      ["Question", "What changes when the same image appears in another context?"],
    ],
    examples: ["room → privacy / gender / thought", "sea → migration / scale / return", "mirror → identity / gaze / doubling"],
  },
  closeReading: {
    label: "Close Reading Lab",
    group: "Critical studio",
    body: "Build a small analysis from quote, image, syntax, rhythm, context, and claim.",
    title: "Close Reading Lab",
    description:
      "A compact workspace for one passage. It is smaller than an essay but deep enough to become one.",
    fields: [
      ["Quote", "Exact passage, page number, edition, and translation"],
      ["Language", "Diction, image, syntax, rhythm, repetition, silence"],
      ["Claim", "What this passage reveals about the whole work"],
    ],
    examples: ["Opening sentence analysis", "One image across three paragraphs", "Narrator reliability in a single scene"],
  },
  author: {
    label: "Author Dossier",
    group: "Author & context",
    body: "Collect life timeline, historical pressure, places, works, influence, and reception.",
    title: "Author Dossier",
    description:
      "A contextual file for understanding form, not a biography dump. The point is to ask why this writer's work sounds and moves the way it does.",
    fields: [
      ["Timeline", "Life events, works, publication dates, historical events"],
      ["Context", "Class, gender, migration, politics, language, education, publishing world"],
      ["Patterns", "Themes, motifs, formal habits, repeated tensions"],
    ],
    examples: ["Virginia Woolf and rooms", "Toni Morrison and historical memory", "Calvino and imaginary structures"],
  },
  seeds: {
    label: "Essay Seeds",
    group: "Critical studio",
    body: "Keep unfinished questions until they become outlines, comparisons, or essays.",
    title: "Essay Seeds",
    description:
      "A holding place for questions that are not ready to become essays yet. This keeps ideas alive without forcing them to be polished too early.",
    fields: [
      ["Question", "A sharp problem, not a topic"],
      ["Evidence to collect", "Books, quotes, motifs, author context, theory terms"],
      ["Status", "seed, collecting quotes, outline, draft, published"],
    ],
    examples: ["Why do some novels break time?", "When does silence become narration?", "Can a house be a memory container?"],
  },
  comparison: {
    label: "Comparison Desk",
    group: "Comparative literature",
    body: "Place two books, authors, motifs, or periods side by side around one clear question.",
    title: "Comparison Desk",
    description:
      "A structured space for comparative literature. It prevents comparison from becoming two separate summaries.",
    fields: [
      ["Pair", "Book/book, author/author, motif/motif, period/period"],
      ["Shared question", "The one problem both texts help you think about"],
      ["Difference", "What changes across form, history, language, or politics"],
    ],
    examples: ["Woolf / Morrison on memory", "Calvino / Borges on imaginary systems", "Rooms / houses across women writers"],
  },
  fictionStudio: {
    label: "Fiction Studio",
    group: "Writing workshop",
    body: "Develop characters, scenes, fragments, deleted lines, voice tests, and influences.",
    title: "Fiction Studio",
    description:
      "A creative area for your own writing. It keeps drafts connected to the reading archive without making them feel secondary.",
    fields: [
      ["Characters", "Desire, contradiction, fear, voice, history"],
      ["Scenes", "Place, action, sensory detail, conflict, emotional turn"],
      ["Influence trail", "Books, motifs, forms, and sentences that shaped the draft"],
    ],
    examples: ["Character card", "Scene fragment", "Deleted line archive"],
  },
};

let features = {
  bookDeepDive: {
    label: "Book Deep Dive",
    group: "Research Hub",
    body: "Comprehensive research space for a single book—author, context, themes, and your analysis.",
    title: "Book Deep Dive",
    description:
      "A detailed research hub connected to all your reading notes. Organize author biography, historical context, themes, and your close readings in one place.",
    fields: [
      ["Overview", "Basic bibliographic info, your rating, reading dates, and initial mood"],
      ["Author", "Life timeline, influences, recurring concerns, and other works"],
      ["Context", "Historical events, cultural movements, publication story"],
      ["Themes", "Main ideas, motifs, recurring images, questions the book raises"],
      ["Your Review", "Close readings, essay seeds, favorite quotes, your interpretation"],
    ],
    examples: ["Create a deep dive for a favorite novel", "Research an author's influences", "Map themes across multiple books"],
  },
  interactiveReview: {
    label: "Interactive Reviews",
    group: "Engagement Tools",
    body: "Turn your thoughts into interactive Q&A, comparisons, and explorations for readers.",
    title: "Interactive Reviews",
    description:
      "Make your reading reflections engaging and dynamic. Create Q&A formats, side-by-side comparisons, or interactive explorations of the book.",
    fields: [
      ["Q&A Format", "Ask yourself questions and reveal your thoughts progressively"],
      ["Comparison", "Place two books side-by-side to highlight differences and similarities"],
      ["Timeline", "Map out key events or character arcs visually"],
      ["Theme Explorer", "Click through different themes and their manifestations"],
    ],
    examples: ["Key questions about the novel", "Compare with similar works", "Character relationship map", "Timeline of events"],
  },
  motifMapper: {
    label: "Motif Mapper",
    group: "Visual Tools",
    body: "See connections between recurring images and themes across your entire library.",
    title: "Motif & Theme Mapper",
    description:
      "Visualize how certain images, themes, or ideas appear across different books and your own writing. Discover your reading and writing patterns.",
    fields: [
      ["Track Motifs", "room, silence, memory, death, garden, mirror, journey, inheritance"],
      ["Cross-book Links", "See which books share the same themes"],
      ["Your Patterns", "Discover what your reading and writing obsess over"],
      ["Create New", "Define custom themes to track across your library"],
    ],
    examples: ["Room across Woolf, Morrison, and your novel", "Inheritance and family secrets", "Urban spaces and isolation", "Time as a character"],
  },
};

// Sample books data
let sampleBooks = [
  { id: 1, title: "Lessons in Chemistry", author: "Bonnie Garmus", year: "", status: "unread", readDates: [], mood: "female-led literary fiction", tags: ["fiction", "women", "science"], authorInfo: { nationality: "American", genre: "Contemporary Fiction", knownFor: "female-led literary fiction" } },
  { id: 2, title: "Dark Matter", author: "Blake Crouch", year: "", status: "unread", readDates: [], mood: "multiverse and speculative fiction", tags: ["science fiction", "multiverse", "thriller"], authorInfo: { nationality: "American", genre: "Science Fiction Thriller", knownFor: "multiverse and speculative fiction" } },
  { id: 3, title: "Siddhartha", author: "Hermann Hesse", year: "", status: "unread", readDates: [], mood: "spiritual and existential literature", tags: ["philosophy", "spirituality", "classic"], authorInfo: { nationality: "German-Swiss", genre: "Philosophical Fiction", knownFor: "spiritual and existential literature" } },
  { id: 4, title: "Yours Truly", author: "Abby Jimenez", year: "", status: "unread", readDates: [], mood: "emotional contemporary romance", tags: ["romance", "contemporary"], authorInfo: { nationality: "American", genre: "Romance", knownFor: "emotional contemporary romance" } },
  { id: 5, title: "The Heaven & Earth Grocery Store", author: "James McBride", year: "", status: "unread", readDates: [], mood: "community-centered storytelling", tags: ["literary fiction", "community", "history"], authorInfo: { nationality: "American", genre: "Literary Fiction", knownFor: "community-centered storytelling" } },
  { id: 6, title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", year: "", status: "unread", readDates: [], mood: "Latin American literary fiction", tags: ["magical realism", "family", "history"], authorInfo: { nationality: "Colombian", genre: "Magical Realism", knownFor: "Latin American literary fiction" } },
  { id: 7, title: "The Snows of Kilimanjaro", author: "Ernest Hemingway", year: "", status: "unread", readDates: [], mood: "minimalist prose and war writing", tags: ["classic", "short stories", "existential"], authorInfo: { nationality: "American", genre: "Modernist Fiction", knownFor: "minimalist prose and war writing" } },
  { id: 8, title: "Lady Chatterley's Lover", author: "D. H. Lawrence", year: "", status: "unread", readDates: [], mood: "relationships and emotional intimacy", tags: ["relationships", "desire", "classic"], authorInfo: { nationality: "British", genre: "Psychological Fiction", knownFor: "relationships and emotional intimacy" } },
  { id: 9, title: "Women in Love", author: "D. H. Lawrence", year: "", status: "unread", readDates: [], mood: "modern relationships and industrial society", tags: ["psychology", "relationships", "modernism"], authorInfo: { nationality: "British", genre: "Psychological Fiction", knownFor: "modern relationships and industrial society" } },
  { id: 10, title: "Sense and Sensibility", author: "Jane Austen", year: "", status: "unread", readDates: [], mood: "social satire and relationships", tags: ["classic", "romance", "society"], authorInfo: { nationality: "British", genre: "Classic Romance", knownFor: "social satire and relationships" } },
  { id: 11, title: "Persuasion", author: "Jane Austen", year: "", status: "unread", readDates: [], mood: "subtle emotional realism", tags: ["classic", "romance"], authorInfo: { nationality: "British", genre: "Classic Romance", knownFor: "subtle emotional realism" } },
  { id: 12, title: "Wuthering Heights", author: "Emily Brontë", year: "", status: "unread", readDates: [], mood: "dark emotional intensity", tags: ["gothic", "love", "classic"], authorInfo: { nationality: "British", genre: "Gothic Fiction", knownFor: "dark emotional intensity" } },
  { id: 13, title: "Talking to Strangers", author: "Malcolm Gladwell", year: "", status: "unread", readDates: [], mood: "popular social psychology writing", tags: ["psychology", "society", "communication"], authorInfo: { nationality: "Canadian", genre: "Nonfiction", knownFor: "popular social psychology writing" } },
  { id: 14, title: "The Years", author: "Annie Ernaux", year: "", status: "unread", readDates: [], mood: "memory and collective history", tags: ["memory", "identity", "history"], authorInfo: { nationality: "French", genre: "Memoir / Autofiction", knownFor: "memory and collective history" } },
  { id: 15, title: "Kafka on the Shore", author: "Haruki Murakami", year: "", status: "unread", readDates: [], mood: "dreamlike surrealism and loneliness", tags: ["surreal", "identity", "dream"], authorInfo: { nationality: "Japanese", genre: "Literary Fiction", knownFor: "dreamlike surrealism and loneliness" } },
  { id: 16, title: "Pride and Prejudice", author: "Jane Austen", year: "", status: "unread", readDates: [], mood: "social observation and wit", tags: ["classic", "romance", "society"], authorInfo: { nationality: "British", genre: "Classic Romance", knownFor: "social observation and wit" } },
  { id: 17, title: "Moby-Dick", author: "Herman Melville", year: "", status: "unread", readDates: [], mood: "obsession and symbolism", tags: ["sea", "obsession", "classic"], authorInfo: { nationality: "American", genre: "Adventure / Philosophical Fiction", knownFor: "obsession and symbolism" } },
  { id: 18, title: "All the Lovers in the Night", author: "Mieko Kawakami", year: "", status: "unread", readDates: [], mood: "loneliness and urban alienation", tags: ["loneliness", "urban life", "identity"], authorInfo: { nationality: "Japanese", genre: "Contemporary Literary Fiction", knownFor: "loneliness and urban alienation" } },
  { id: 19, title: "To Kill a Mockingbird", author: "Harper Lee", year: "", status: "unread", readDates: [], mood: "justice and morality in America", tags: ["justice", "childhood", "america"], authorInfo: { nationality: "American", genre: "Southern Gothic", knownFor: "justice and morality in America" } },
  { id: 20, title: "East of Eden", author: "John Steinbeck", year: "", status: "unread", readDates: [], mood: "family sagas and moral conflict", tags: ["family", "good and evil", "america"], authorInfo: { nationality: "American", genre: "American Literary Fiction", knownFor: "family sagas and moral conflict" } },
  { id: 21, title: "The Grapes of Wrath", author: "John Steinbeck", year: "", status: "unread", readDates: [], mood: "Depression-era American fiction", tags: ["poverty", "migration", "america"], authorInfo: { nationality: "American", genre: "Social Realism", knownFor: "Depression-era American fiction" } },
  { id: 22, title: "Jane Eyre", author: "Charlotte Brontë", year: "", status: "unread", readDates: [], mood: "female independence and emotional realism", tags: ["gothic", "romance", "independence"], authorInfo: { nationality: "British", genre: "Gothic Romance", knownFor: "female independence and emotional realism" } },
  { id: 23, title: "The Hunger Games", author: "Suzanne Collins", year: "", status: "unread", readDates: [], mood: "political young adult fiction", tags: ["dystopia", "survival", "power"], authorInfo: { nationality: "American", genre: "Dystopian Fiction", knownFor: "political young adult fiction" } },
  { id: 24, title: "Dune", author: "Frank Herbert", year: "", status: "unread", readDates: [], mood: "Dune series", tags: ["empire", "ecology", "religion", "power"], authorInfo: { nationality: "American", genre: "Science Fiction", knownFor: "Dune series" } },
  { id: 25, title: "Foundation", author: "Isaac Asimov", year: "", status: "unread", readDates: [], mood: "Foundation and Robot series", tags: ["civilization", "empire", "systems"], authorInfo: { nationality: "American", genre: "Science Fiction", knownFor: "Foundation and Robot series" } },
  { id: 26, title: "Solaris", author: "Stanisław Lem", year: "", status: "unread", readDates: [], mood: "AI and consciousness themes", tags: ["consciousness", "alien intelligence", "philosophy"], authorInfo: { nationality: "Polish", genre: "Philosophical Science Fiction", knownFor: "AI and consciousness themes" } },
  { id: 27, title: "A Wizard of Earthsea", author: "Ursula K. Le Guin", year: "", status: "unread", readDates: [], mood: "Earthsea cycle and Taoist themes", tags: ["fantasy", "balance", "identity"], authorInfo: { nationality: "American", genre: "Fantasy", knownFor: "Earthsea cycle and Taoist themes" } },
  { id: 28, title: "2001: A Space Odyssey", author: "Arthur C. Clarke", year: "", status: "unread", readDates: [], mood: "space exploration and futurism", tags: ["space", "AI", "cosmos"], authorInfo: { nationality: "British", genre: "Science Fiction", knownFor: "space exploration and futurism" } },
  { id: 29, title: "美的历程", author: "李泽厚", year: "", status: "unread", readDates: [], mood: "Chinese aesthetics and philosophy", tags: ["aesthetics", "culture", "philosophy"], authorInfo: { nationality: "Chinese", genre: "Philosophy / Aesthetics", knownFor: "Chinese aesthetics and philosophy" } },
  { id: 30, title: "浮生六记", author: "沈复", year: "", status: "unread", readDates: [], mood: "everyday life and emotional intimacy", tags: ["memoir", "qing dynasty", "daily life"], authorInfo: { nationality: "Chinese", genre: "Classical Memoir", knownFor: "everyday life and emotional intimacy" } },
  { id: 31, title: "庆余年", author: "猫腻", year: "", status: "unread", readDates: [], mood: "political web fiction", tags: ["web novel", "power", "strategy"], authorInfo: { nationality: "Chinese", genre: "Historical Fantasy", knownFor: "political web fiction" } },
  { id: 32, title: "静静的顿河", author: "米哈伊尔·肖洛霍夫", year: "", status: "unread", readDates: [], mood: "Cossack life and war", tags: ["war", "history", "russian literature"], authorInfo: { nationality: "Russian", genre: "Historical Fiction", knownFor: "Cossack life and war" } },
  { id: 33, title: "卡拉马佐夫兄弟", author: "费奥多尔·陀思妥耶夫斯基", year: "", status: "unread", readDates: [], mood: "existential and moral psychology", tags: ["faith", "morality", "psychology"], authorInfo: { nationality: "Russian", genre: "Philosophical Fiction", knownFor: "existential and moral psychology" } },
  { id: 34, title: "罪与罚", author: "费奥多尔·陀思妥耶夫斯基", year: "", status: "unread", readDates: [], mood: "crime, guilt, and redemption", tags: ["guilt", "morality", "psychology"], authorInfo: { nationality: "Russian", genre: "Psychological Fiction", knownFor: "crime, guilt, and redemption" } },
  { id: 35, title: "沉默的大多数", author: "王小波", year: "", status: "unread", readDates: [], mood: "individual freedom and rational thought", tags: ["freedom", "individualism", "essay"], authorInfo: { nationality: "Chinese", genre: "Essay", knownFor: "individual freedom and rational thought" } },
  { id: 36, title: "1984", author: "George Orwell", year: "", status: "unread", readDates: [], mood: "anti-authoritarian political fiction", tags: ["surveillance", "authoritarianism", "dystopia"], authorInfo: { nationality: "British", genre: "Dystopian Fiction", knownFor: "anti-authoritarian political fiction" } },
  { id: 37, title: "Animal Farm", author: "George Orwell", year: "", status: "unread", readDates: [], mood: "anti-totalitarian allegory", tags: ["power", "politics", "revolution"], authorInfo: { nationality: "British", genre: "Political Satire", knownFor: "anti-totalitarian allegory" } },
  { id: 38, title: "秋园", author: "杨本芬", year: "", status: "unread", readDates: [], mood: "family memory and women's lives", tags: ["family", "memory", "women"], authorInfo: { nationality: "Chinese", genre: "Literary Fiction", knownFor: "family memory and women's lives" } },
  { id: 39, title: "战争与和平", author: "列夫·托尔斯泰", year: "", status: "unread", readDates: [], mood: "epic realism", tags: ["war", "history", "society"], authorInfo: { nationality: "Russian", genre: "Historical Fiction", knownFor: "epic realism" } },
  { id: 40, title: "安娜·卡列尼娜", author: "列夫·托尔斯泰", year: "", status: "unread", readDates: [], mood: "realism and emotional complexity", tags: ["love", "society", "family"], authorInfo: { nationality: "Russian", genre: "Literary Fiction", knownFor: "realism and emotional complexity" } },
  { id: 41, title: "复活", author: "列夫·托尔斯泰", year: "", status: "unread", readDates: [], mood: "morality and redemption", tags: ["morality", "religion", "redemption"], authorInfo: { nationality: "Russian", genre: "Philosophical Fiction", knownFor: "morality and redemption" } },
];

const englishContent = {
  modules: JSON.parse(JSON.stringify(modules)),
  tools: JSON.parse(JSON.stringify(tools)),
  features: JSON.parse(JSON.stringify(features)),
  sampleBooks: JSON.parse(JSON.stringify(sampleBooks)),
};

const chineseContent = {
  modules: {
    reading: {
      number: "01",
      label: "阅读档案",
      title: "我即我所读",
      summary: "保存书、心情、笔记，以及阅读留下的痕迹。",
      description: "这里是核心阅读档案：书目、日期、摘录、第一印象、重读，以及一本书如何留在你身上的证据。",
      includes: [
        ["书籍笔记", "标题、作者、日期、摘录、阅读心情和快速回应。"],
        ["阅读痕迹", "读完后仍反复出现的问题、迷恋和细节。"],
      ],
      sampleTitle: "书籍条目",
      sample: [
        ["书名", "《达洛维夫人》 / 弗吉尼亚·伍尔夫 / 1925"],
        ["阅读心情", "安静、碎片化、对城市声音很敏感"],
      ],
    },
    criticism: {
      number: "02",
      label: "我的小说",
      title: "欢迎来到我的荒唐世界",
      summary: "人物、片段、场景，以及未完成故事的私人逻辑。",
      description: "这里是写作房间：好玩、奇怪、未完成，充满可能变成人物、场景或完整世界的碎片。",
      includes: [
        ["人物", "名字、声音、矛盾、欲望和私人历史。"],
        ["片段", "松散场景、意象、开头句、结尾和等待归处的句子。"],
      ],
      sampleTitle: "小说种子",
      sample: [
        ["世界", "一栋比主人记得更多的房子"],
        ["声音", "温柔、多疑，有时故意过分戏剧化"],
      ],
    },
    context: {
      number: "03",
      label: "思考札记",
      title: "不要对我说谎",
      summary: "细读、更锋利的论点、不舒服的问题和诚实的批评。",
      description: "这里让档案变得更严格：解释是否诚实，证据是否站得住，文本到底在做什么。",
      includes: [
        ["文本细读", "引文、意象、句法、节奏、语境和论点。"],
        ["论点检查", "论点说了什么、证据在哪里、薄弱处是什么。"],
      ],
      sampleTitle: "批评笔记",
      sample: [
        ["论点", "房间不只是私人空间，也测试谁被允许思考。"],
        ["证据", "伍尔夫的房间、莫里森的房屋、继承的记忆"],
      ],
    },
    fiction: {
      number: "04",
      label: "其他",
      title: "还有更多……",
      summary: "松散笔记、支线任务、实验，以及暂时无处安放的东西。",
      description: "这里是溢出的抽屉：额外想法、小实验、清单、链接和还没准备好成为独立房间的未来 section。",
      includes: [
        ["松散笔记", "小想法、保存的句子、链接和以后再看的东西。"],
        ["实验", "形式、视觉想法、互动草图和未来可能的 block。"],
      ],
      sampleTitle: "额外笔记",
      sample: [
        ["想法", "做一个喜欢的句子页面"],
        ["也许以后", "按情绪天气给书做地图"],
      ],
    },
  },
  tools: {
    motifs: {
      label: "母题地图",
      group: "阅读 + 批评",
      body: "追踪房间、镜子、城市、海、沉默、身体和记忆等反复出现的意象。",
      title: "母题地图",
      description: "跨书追踪反复出现的意象，帮助你看见阅读和写作持续回到哪里。",
      fields: [
        ["母题", "房间、镜子、城市、海、沉默、身体、花园、疾病、记忆"],
        ["出现位置", "书籍、段落、作者、论文和小说草稿"],
      ],
      examples: ["房间 → 私密 / 性别 / 思想", "海 → 迁徙 / 尺度 / 返回"],
    },
    closeReading: {
      label: "文本细读",
      group: "批评工作室",
      body: "从引文、意象、句法、节奏、语境和论点搭建小型分析。",
      title: "文本细读",
      description: "这是一个处理单个段落的小工作区，比论文更轻，但足够深入。",
      fields: [
        ["引文", "准确段落、页码、版本和译本"],
        ["语言", "措辞、意象、句法、节奏、重复和沉默"],
      ],
      examples: ["开头句分析", "一个意象在三段中的变化"],
    },
    author: {
      label: "作者档案",
      group: "作者与语境",
      body: "收集生命时间线、历史压力、地点、作品、影响和接受史。",
      title: "作者档案",
      description: "这里不是传记堆积，而是用语境理解形式。",
      fields: [
        ["时间线", "生命事件、作品、出版日期、历史事件"],
        ["语境", "阶级、性别、迁徙、政治、语言、教育和出版环境"],
      ],
      examples: ["伍尔夫与房间", "莫里森与历史记忆"],
    },
    seeds: {
      label: "论文种子",
      group: "批评工作室",
      body: "保存尚未完成的问题，直到它们成为提纲、比较或文章。",
      title: "论文种子",
      description: "这里容纳还没有准备好成为论文的问题，让想法先活着。",
      fields: [
        ["问题", "一个尖锐的问题，而不只是一个主题"],
        ["待收集证据", "书籍、引文、母题、作者语境、理论词"],
      ],
      examples: ["为什么有些小说打碎时间？", "沉默什么时候成为叙述？"],
    },
    comparison: {
      label: "比较书桌",
      group: "比较文学",
      body: "围绕一个清晰问题并置两本书、两位作者、两个母题或两个时期。",
      title: "比较书桌",
      description: "这里让比较不只是两段摘要，而是真正围绕同一个问题展开。",
      fields: [
        ["并置对象", "书/书、作者/作者、母题/母题、时期/时期"],
        ["共同问题", "两部文本共同帮助你思考的问题"],
      ],
      examples: ["伍尔夫 / 莫里森与记忆", "卡尔维诺 / 博尔赫斯与想象系统"],
    },
    fictionStudio: {
      label: "小说工作室",
      group: "写作",
      body: "发展人物、场景、片段、删去的句子、声音实验和影响来源。",
      title: "小说工作室",
      description: "这里保存你自己的创作，同时让草稿和阅读档案保持联系。",
      fields: [
        ["人物", "欲望、矛盾、恐惧、声音、历史"],
        ["场景", "地点、行动、感官细节、冲突、情绪转折"],
      ],
      examples: ["人物卡", "场景片段"],
    },
  },
  features: {
    bookDeepDive: {
      label: "单书深读",
      group: "研究中心",
      body: "为一本书整理作者、语境、主题和你的分析。",
      title: "单书深读",
      description: "把作者、历史语境、主题和细读集中到同一个研究页面。",
      fields: [
        ["概览", "书目信息、评分、阅读日期和初始心情"],
        ["作者", "生命时间线、影响、反复关切和其他作品"],
        ["语境", "历史事件、文化运动、出版故事"],
      ],
      examples: ["为喜欢的小说建立深读页", "研究作者的影响来源"],
    },
    interactiveReview: {
      label: "互动书评",
      group: "互动工具",
      body: "把想法变成问答、比较和可探索的阅读笔记。",
      title: "互动书评",
      description: "用问答、并置比较或主题探索，让书评更有层次。",
      fields: [
        ["问答形式", "逐步展开你的想法"],
        ["比较", "并排放置两本书，显示差异与相似"],
        ["时间线", "视觉化关键事件或人物弧线"],
      ],
      examples: ["关于小说的关键问题", "和相近作品比较"],
    },
    motifMapper: {
      label: "母题关系图",
      group: "视觉工具",
      body: "查看意象和主题如何在整个书库中互相连接。",
      title: "母题与主题图",
      description: "可视化主题、意象和想法在不同书籍及你自己的写作中如何出现。",
      fields: [
        ["追踪母题", "房间、沉默、记忆、死亡、花园、镜子、旅程、继承"],
        ["跨书连接", "查看哪些书共享相同主题"],
        ["个人模式", "发现你的阅读和写作反复迷恋什么"],
      ],
      examples: ["房间横跨伍尔夫、莫里森和你的小说", "继承与家族秘密"],
    },
  },
  sampleBooks: JSON.parse(JSON.stringify(sampleBooks)),
};

const translations = {
  en: {
    htmlLang: "en",
    toggle: "中文",
    navHome: "Home",
    navFiction: "Fiction",
    navCritical: "Reflection",
    navExtra: "Extra",
    navLibrary: "Library",
    navTimeline: "Timeline",
    heroKicker: "A private literature cabinet",
    heroTagline: "What survives after reading.",
    heroDeck: "Books, fragments, reflection, and memory.",
    toolsKicker: "Inside the cabinet",
    toolsHeading: "A few tools that make the archive feel alive",
    toolsDescription: "The main structure stays simple, but these recurring tools give the site room for criticism, comparison, and creative work.",
    featuresKicker: "Enhanced: Interactive & Visual",
    featuresHeading: "New ways to explore your reading",
    featuresDescription: "Interactive reviews, motif mapping, and deep research hubs help you understand what you read.",
    fictionTitle: "Fiction",
    fictionSubtitle: "Characters, scenes, fragments, and voice experiments",
    fictionCardOneKicker: "Characters",
    fictionCardOneTitle: "Character Notes",
    fictionCardOneBody: "Desire, contradiction, voice, backstory, and private history.",
    fictionCardTwoKicker: "Scenes",
    fictionCardTwoTitle: "Scene Fragments",
    fictionCardTwoBody: "Place, sensory detail, conflict, and the emotional turn.",
    fictionCardThreeKicker: "Influence",
    fictionCardThreeTitle: "Influence Trail",
    fictionCardThreeBody: "Books, motifs, structures, and sentences that shape a draft.",
    libraryTitle: "Library",
    librarySubtitle: "A shelf of books, notes, moods, and traces",
    libraryModuleSummary: "{count} books in the cabinet: {unread} unread, {completed} completed.",
    libraryModuleDescription: "This archive is generated from your Library. Its current traces gather around: {themes}.",
    libraryShelfCount: "Books in cabinet",
    libraryShelfCountBody: "{count} volumes currently gathered.",
    libraryUnreadCount: "Unread shelf",
    libraryUnreadCountBody: "{count} books are waiting to be read.",
    libraryCompletedCount: "Read traces",
    libraryCompletedCountBody: "{count} books have been marked completed.",
    libraryShelfSample: "From the shelf",
    noThemeTrace: "unlabeled traces",
    searchPlaceholder: "Search the cabinet...",
    filterAll: "All",
    filterUnread: "Unread",
    filterCompleted: "Completed",
  filterReading: "Reading",
  filterReread: "Reread",
    addBook: "Add book",
    updateBook: "Update book",
    cancelEdit: "Cancel edit",
    editBook: "Edit",
    markAsRead: "Mark read",
    markAsUnread: "Mark unread",
    bookTitlePlaceholder: "Title",
    bookAuthorPlaceholder: "Author",
    bookYearPlaceholder: "Year",
    bookMoodPlaceholder: "Mood or short note",
    bookTagsPlaceholder: "Tags, comma separated",
    bookRelatedPlaceholder: "Related books",
    bookWhyPlaceholder: "Why I read this",
    bookQuotePlaceholder: "Favorite quote",
    bookThemesPlaceholder: "Key themes",
    bookContextPlaceholder: "Historical or literary context",
    bookReviewPlaceholder: "Personal review",
    addBookPanel: "Add a book to the cabinet",
    libraryEmpty: "No books yet. Start by adding your first book to the library.",
    timelineTitle: "Reading Timeline",
    timelineSubtitle: "Books, reviews, and writing activity by date",
    timelineEmpty: "No timeline entries yet. Add a book or save a review to begin.",
    noBooksFilter: "No books with this filter.",
    tabOverview: "Overview",
    tabAuthor: "Author",
    tabContext: "Context",
    tabThemes: "Themes",
    tabReview: "Review",
    examples: "Examples",
    modalAuthor: "Author",
    modalPublication: "Publication",
    modalMood: "Your Mood",
    modalStatus: "Status",
    modalTags: "Tags",
    aboutAuthor: "About the Author",
    authorPlaceholder: "Add author biography, life timeline, influences, and recurring themes in their work here. Update this as you research the author.",
    historicalContext: "Historical Context",
    historicalEvents: "Historical Events",
    historicalEventsBody: "Document the historical period, cultural movements, and events that influenced this work.",
    publicationStory: "Publication Story",
    publicationStoryBody: "Add notes about how the book was received, its reception history, and its impact.",
    themesMotifs: "Themes & Motifs",
    mainThemes: "Main Themes",
    mainThemesBody: "List the primary ideas and questions the book explores.",
    recurringImages: "Recurring Images",
    recurringImagesBody: "Document motifs and symbols that appear throughout the work.",
    yourReview: "Your Review",
    firstImpressions: "First Impressions",
    firstImpressionsBody: "Your initial thoughts and reactions to the book.",
    closeReadings: "Close Readings",
    closeReadingsBody: "Passages you want to analyze in detail, with notes on significance.",
    essayIdeas: "Essay Ideas",
    essayIdeasBody: "Questions and topics for potential essays or deeper exploration.",
    whyIReadThis: "Why I read this",
    favoriteQuote: "Favorite quote",
    relatedBooks: "Related books",
    closeModal: "Close",
    writingKicker: "Your writing",
    writingHeading: "Add a writing piece",
    writingTitlePlaceholder: "Title",
    writingCategoryPlaceholder: "Category or project",
    writingBodyPlaceholder: "Paste your writing here...",
    uploadWriting: "Upload .txt / .md",
    saveWriting: "Save writing",
    noWriting: "No writing pieces yet.",
    deleteItem: "Delete",
    timelineBookType: "Book",
    timelineWritingType: "Review",
    timelineCriticalType: "Critical note",
    timelineExtraType: "Extra",
    draftLabel: "Draft",
    latestFiction: "Latest fiction piece",
    fictionModuleSummary: "{count} fiction piece(s) saved. Latest: {title}.",
    fictionModuleDescription: "This block now follows your Fiction page. It updates when you save or upload writing.",
    criticalModuleSummary: "{count} critical note(s) saved. Latest: {title}.",
    criticalModuleDescription: "This studio now holds your uploaded or pasted criticism notes.",
    criticalDefaultCategory: "Critical note",
    criticalPageTitle: "Reflection",
    criticalPageSubtitle: "Close readings, essay seeds, evidence, and honest criticism",
    latestCritical: "Latest critical note",
    criticalFormKicker: "Reflection",
    criticalFormHeading: "Upload or paste a critical note",
    criticalTitlePlaceholder: "Title or claim",
    criticalCategoryPlaceholder: "Book, theme, or method",
    criticalBodyPlaceholder: "Paste close reading, evidence, essay seed, or criticism here...",
    uploadCritical: "Upload .txt / .md",
    saveCritical: "Save critical note",
    noCritical: "No critical notes yet.",
    latestExtra: "Latest extra post",
    extraModuleSummary: "{count} extra post(s) saved. Latest: {title}.",
    extraModuleDescription: "This block is your overflow drawer. It updates whenever you post a loose note.",
    extraDefaultBody: "Loose note",
    extraPageTitle: "Extra",
    extraPageSubtitle: "Loose notes, links, side quests, and experiments",
    extraFormKicker: "Extra",
    extraFormHeading: "Post something extra",
    extraTitlePlaceholder: "Post title",
    extraBodyPlaceholder: "Small thought, link, list, idea, or experiment...",
    saveExtra: "Post",
    noExtra: "No extra posts yet.",
    openFictionPage: "Open Fiction page",
    openCriticalPage: "Open Critical page",
    openExtraPage: "Open Extra page",
  },
  zh: {
    htmlLang: "zh-CN",
    toggle: "EN",
    navHome: "首页",
    navFiction: "小说",
    navCritical: "思考",
    navExtra: "其他",
    navLibrary: "书库",
    navTimeline: "时间线",
    heroKicker: "私人文学档案柜",
    heroTagline: "窣地春袍",
    heroDeck: "书、碎片、反思与记忆。",
    toolsKicker: "档案柜内部",
    toolsHeading: "让档案保持活力的小工具",
    toolsDescription: "主结构保持简单，这些工具为批评、比较和创作留下空间。",
    featuresKicker: "增强：互动与视觉",
    featuresHeading: "用新的方式探索阅读",
    featuresDescription: "互动书评、母题地图和深读页面帮助你理解读过的书。",
    fictionTitle: "小说",
    fictionSubtitle: "人物、场景、片段和声音实验",
    fictionCardOneKicker: "人物",
    fictionCardOneTitle: "人物笔记",
    fictionCardOneBody: "欲望、矛盾、声音、背景和私人历史。",
    fictionCardTwoKicker: "场景",
    fictionCardTwoTitle: "场景片段",
    fictionCardTwoBody: "地点、感官细节、冲突和情绪转折。",
    fictionCardThreeKicker: "影响",
    fictionCardThreeTitle: "影响轨迹",
    fictionCardThreeBody: "塑造草稿的书籍、母题、结构和句子。",
    libraryTitle: "书库",
    librarySubtitle: "一架保存书、笔记、心情和痕迹的私人书架",
    libraryModuleSummary: "档案柜里有 {count} 本书：{unread} 本未读，{completed} 本已读。",
    libraryModuleDescription: "这个阅读档案根据你的书库自动生成。现在反复出现的痕迹有：{themes}。",
    libraryShelfCount: "档案柜藏书",
    libraryShelfCountBody: "目前收有 {count} 本书。",
    libraryUnreadCount: "未读书架",
    libraryUnreadCountBody: "{count} 本书还在等待被阅读。",
    libraryCompletedCount: "已读痕迹",
    libraryCompletedCountBody: "{count} 本书已标记为读完。",
    libraryShelfSample: "书架摘录",
    noThemeTrace: "尚未标记的痕迹",
    searchPlaceholder: "搜索档案柜...",
    filterAll: "全部",
    filterUnread: "未读",
    filterCompleted: "已读完",
    filterReading: "在读",
    filterReread: "重读",
    addBook: "添加书籍",
    updateBook: "更新书籍",
    cancelEdit: "取消编辑",
    editBook: "编辑",
    markAsRead: "标记已读",
    markAsUnread: "标记未读",
    bookTitlePlaceholder: "书名",
    bookAuthorPlaceholder: "作者",
    bookYearPlaceholder: "年份",
    bookMoodPlaceholder: "心情或短笔记",
    bookTagsPlaceholder: "标签，用逗号分隔",
    bookRelatedPlaceholder: "相关书籍",
    bookWhyPlaceholder: "为什么读这本书",
    bookQuotePlaceholder: "喜欢的句子",
    bookThemesPlaceholder: "关键主题",
    bookContextPlaceholder: "历史或文学语境",
    bookReviewPlaceholder: "个人书评",
    addBookPanel: "把一本书放入档案柜",
    libraryEmpty: "还没有书。先添加第一本书吧。",
    timelineTitle: "阅读时间线",
    timelineSubtitle: "按日期排列的书籍、书评和写作记录",
    timelineEmpty: "还没有时间线记录。添加书籍或保存书评后会出现在这里。",
    noBooksFilter: "这个筛选下没有书。",
    tabOverview: "概览",
    tabAuthor: "作者",
    tabContext: "语境",
    tabThemes: "主题",
    tabReview: "书评",
    examples: "示例",
    modalAuthor: "作者",
    modalPublication: "出版",
    modalMood: "阅读心情",
    modalStatus: "状态",
    modalTags: "标签",
    aboutAuthor: "关于作者",
    authorPlaceholder: "在这里添加作者生平、生命时间线、影响来源和作品中反复出现的主题。",
    historicalContext: "历史语境",
    historicalEvents: "历史事件",
    historicalEventsBody: "记录影响这部作品的历史时期、文化运动和事件。",
    publicationStory: "出版故事",
    publicationStoryBody: "添加这本书的接受史、出版背景和影响。",
    themesMotifs: "主题与母题",
    mainThemes: "主要主题",
    mainThemesBody: "列出这本书探索的核心想法和问题。",
    recurringImages: "反复出现的意象",
    recurringImagesBody: "记录贯穿作品的母题和象征。",
    yourReview: "我的书评",
    firstImpressions: "第一印象",
    firstImpressionsBody: "你对这本书最初的想法和反应。",
    closeReadings: "文本细读",
    closeReadingsBody: "想深入分析的段落，以及它们的重要性。",
    essayIdeas: "论文想法",
    essayIdeasBody: "可以继续发展为文章或研究的问题。",
    whyIReadThis: "为什么读这本书",
    favoriteQuote: "喜欢的句子",
    relatedBooks: "相关书籍",
    closeModal: "关闭",
    writingKicker: "你的写作",
    writingHeading: "添加写作片段",
    writingTitlePlaceholder: "标题",
    writingCategoryPlaceholder: "分类或项目",
    writingBodyPlaceholder: "把你的文字粘贴到这里……",
    uploadWriting: "上传 .txt / .md",
    saveWriting: "保存写作",
    noWriting: "还没有写作片段。",
    deleteItem: "删除",
    timelineBookType: "书籍",
    timelineWritingType: "书评",
    timelineCriticalType: "批评笔记",
    timelineExtraType: "其他",
    draftLabel: "草稿",
    latestFiction: "最新小说片段",
    fictionModuleSummary: "已保存 {count} 个小说/写作片段。最新：{title}。",
    fictionModuleDescription: "这个 block 现在会跟随 Fiction 页面：保存或上传写作后会自动更新。",
    criticalModuleSummary: "已保存 {count} 条批评笔记。最新：{title}。",
    criticalModuleDescription: "这里现在可以保存你上传或粘贴的批评笔记。",
    criticalDefaultCategory: "批评笔记",
    criticalPageTitle: "思考札记",
    criticalPageSubtitle: "细读、论文种子、证据和诚实的批评",
    latestCritical: "最新批评笔记",
    criticalFormKicker: "思考札记",
    criticalFormHeading: "上传或粘贴批评笔记",
    criticalTitlePlaceholder: "标题或论点",
    criticalCategoryPlaceholder: "书名、主题或方法",
    criticalBodyPlaceholder: "在这里粘贴细读、证据、论文种子或批评内容……",
    uploadCritical: "上传 .txt / .md",
    saveCritical: "保存批评笔记",
    noCritical: "还没有批评笔记。",
    latestExtra: "最新其他内容",
    extraModuleSummary: "已保存 {count} 条其他内容。最新：{title}。",
    extraModuleDescription: "这个 block 是你的溢出抽屉。每次发布松散笔记后都会自动更新。",
    extraDefaultBody: "松散笔记",
    extraPageTitle: "其他",
    extraPageSubtitle: "松散笔记、链接、支线任务和实验",
    extraFormKicker: "其他",
    extraFormHeading: "发布其他内容",
    extraTitlePlaceholder: "标题",
    extraBodyPlaceholder: "小想法、链接、清单、点子或实验……",
    saveExtra: "发布",
    noExtra: "还没有其他内容。",
    openFictionPage: "打开 Fiction 页面",
    openCriticalPage: "打开 Critical 页面",
    openExtraPage: "打开 Extra 页面",
  },
};

let currentLanguage = "en";
let selectedModuleId = "reading";
let selectedToolId = "motifs";
let selectedFeatureId = "bookDeepDive";
let activeLibraryFilter = "all";
let activeBook = null;
let lastFocusedElement = null;
let editingBookId = null;
let customBooks = loadFromStorage("aquilo.customBooks", []);
let bookEdits = loadFromStorage("aquilo.bookEdits", {});
let deletedBookIds = loadFromStorage("aquilo.deletedBookIds", []);
let writingPieces = loadFromStorage("aquilo.writingPieces", []);
let criticalNotes = loadFromStorage("aquilo.criticalNotes", []);
let extraPosts = loadFromStorage("aquilo.extraPosts", []);

// ===== Helper Functions =====

function loadFromStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getVisibleBooks() {
  const deleted = new Set(deletedBookIds.map(String));
  const editedSamples = sampleBooks.map((book) => ({ ...book, ...(bookEdits[String(book.id)] || {}) }));
  return [...editedSamples, ...customBooks].filter((book) => !deleted.has(String(book.id)));
}

function refreshBookViews() {
  renderLibrary(activeLibraryFilter);
  renderTimeline();
  updateDynamicCards();
  renderModule(selectedModuleId);
}

function normalizeTags(value) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
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
  const content = language === "zh" ? chineseContent : englishContent;
  modules = JSON.parse(JSON.stringify(content.modules));
  tools = JSON.parse(JSON.stringify(content.tools));
  features = JSON.parse(JSON.stringify(content.features));
  sampleBooks = JSON.parse(JSON.stringify(content.sampleBooks));

  applyStaticTranslations();
  updateDynamicCards();
  renderModule(selectedModuleId);
  if (document.querySelector("#tool-detail")) renderTool(selectedToolId);
  if (document.querySelector("#feature-detail")) renderFeature(selectedFeatureId);
  refreshBookViews();
  renderWritingPieces();
  renderCriticalNotes();
  renderExtraPosts();
  if (editingBookId === null) clearBookEditMode();

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

function createContentList(items, emptyText, type, deleteHandler) {
  const list = document.createElement("div");
  list.className = "content-list";

  if (!items.length) {
    list.innerHTML = `<div class="library-empty compact-empty"><p>${emptyText}</p></div>`;
    return list;
  }

  items.slice(0, 4).forEach((item) => {
    const card = document.createElement("article");
    card.className = "content-mini-card";
    card.id = `${type}-${item.id}`;
    card.innerHTML = `
      <p class="writing-meta">${escapeHTML(item.category || type)} · ${formatDate(item.createdAt)}</p>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(makePreview(item.body, item.category))}</p>
      ${deleteHandler ? `<button class="delete-button" type="button" data-entry-id="${escapeHTML(item.id)}">${t("deleteItem")}</button>` : ""}
    `;
    if (deleteHandler) {
      card.querySelector(".delete-button").addEventListener("click", () => deleteHandler(item.id));
    }
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
    card.innerHTML = `
      <div class="book-cover">${escapeHTML(book.title.charAt(0))}</div>
      <div class="book-info">
        <div class="book-title">${escapeHTML(book.title)}</div>
        <div class="book-author">${escapeHTML(book.author)}</div>
        <div class="book-meta">${escapeHTML(book.year)}</div>
        <p class="book-note">${escapeHTML(makePreview(book.mood || book.why || (book.tags || []).join(", "), ""))}</p>
      </div>
      <div class="book-actions">
        <button class="delete-button book-status-toggle" type="button" data-book-id="${book.id}">
          ${book.status === "unread" ? t("markAsRead") : t("markAsUnread")}
        </button>
        <button class="delete-button book-edit" type="button" data-book-id="${book.id}">${t("editBook")}</button>
        <button class="delete-button book-delete" type="button" data-book-id="${book.id}">${t("deleteItem")}</button>
      </div>
    `;
    card.addEventListener("click", () => openBookDetail(book));
    card.querySelector(".book-status-toggle").addEventListener("click", (event) => {
      event.stopPropagation();
      toggleBookReadStatus(book.id);
    });
    card.querySelector(".book-edit").addEventListener("click", (event) => {
      event.stopPropagation();
      startBookEdit(book.id);
    });
    card.querySelector(".book-delete").addEventListener("click", (event) => {
      event.stopPropagation();
      deleteBook(book.id);
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

function getBookById(bookId) {
  return getVisibleBooks().find((book) => String(book.id) === String(bookId));
}

function persistBookUpdate(bookId, updates) {
  const id = String(bookId);
  const customIndex = customBooks.findIndex((book) => String(book.id) === id);
  if (customIndex >= 0) {
    customBooks[customIndex] = { ...customBooks[customIndex], ...updates };
    saveToStorage("aquilo.customBooks", customBooks);
  } else {
    bookEdits = {
      ...bookEdits,
      [id]: { ...(bookEdits[id] || {}), ...updates },
    };
    saveToStorage("aquilo.bookEdits", bookEdits);
  }
}

function toggleBookReadStatus(bookId) {
  const book = getBookById(bookId);
  if (!book) return;
  const nextStatus = book.status === "unread" ? "completed" : "unread";
  persistBookUpdate(bookId, {
    status: nextStatus,
    readDates: nextStatus === "completed" ? [new Date().toISOString().slice(0, 10)] : [],
  });
  refreshBookViews();
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

function addBookFromForm(event) {
  event.preventDefault();
  const title = document.querySelector("#book-title-input").value.trim();
  const author = document.querySelector("#book-author-input").value.trim();
  if (!title || !author) return;

  const bookData = getBookFormData();
  if (editingBookId !== null) {
    persistBookUpdate(editingBookId, bookData);
    clearBookEditMode();
    event.currentTarget.reset();
    refreshBookViews();
    return;
  }

  const book = {
    id: `custom-${Date.now()}`,
    ...bookData,
  };

  customBooks = [book, ...customBooks];
  saveToStorage("aquilo.customBooks", customBooks);
  event.currentTarget.reset();
  refreshBookViews();
}

function getBookFormData() {
  const yearValue = document.querySelector("#book-year-input").value;
  const dateValue = document.querySelector("#book-date-input").value;
  const status = document.querySelector("#book-status-input").value;
  return {
    title: document.querySelector("#book-title-input").value.trim(),
    author: document.querySelector("#book-author-input").value.trim(),
    year: yearValue ? Number(yearValue) : "",
    status,
    rating: null,
    readDates: status === "unread" ? [] : [dateValue || new Date().toISOString().slice(0, 10)],
    mood: document.querySelector("#book-mood-input").value.trim(),
    tags: normalizeTags(document.querySelector("#book-tags-input").value),
    why: document.querySelector("#book-why-input").value.trim(),
    favoriteQuote: document.querySelector("#book-quote-input").value.trim(),
    keyThemes: document.querySelector("#book-themes-input").value.trim(),
    literaryContext: document.querySelector("#book-context-input").value.trim(),
    personalReview: document.querySelector("#book-review-input").value.trim(),
    relatedBooks: normalizeTags(document.querySelector("#book-related-input").value),
  };
}

function startBookEdit(bookId) {
  const book = getBookById(bookId);
  if (!book) return;

  editingBookId = bookId;
  document.querySelector(".archive-entry-panel").open = true;
  document.querySelector("#book-title-input").value = book.title || "";
  document.querySelector("#book-author-input").value = book.author || "";
  document.querySelector("#book-year-input").value = book.year || "";
  document.querySelector("#book-status-input").value = book.status || "unread";
  document.querySelector("#book-date-input").value = book.readDates?.[0] || "";
  document.querySelector("#book-mood-input").value = book.mood || "";
  document.querySelector("#book-tags-input").value = (book.tags || []).join(", ");
  document.querySelector("#book-related-input").value = (book.relatedBooks || []).join(", ");
  document.querySelector("#book-why-input").value = book.why || "";
  document.querySelector("#book-quote-input").value = book.favoriteQuote || "";
  document.querySelector("#book-themes-input").value = book.keyThemes || "";
  document.querySelector("#book-context-input").value = book.literaryContext || "";
  document.querySelector("#book-review-input").value = book.personalReview || "";

  document.querySelector("#book-form .form-submit").textContent = t("updateBook");
  document.querySelector("#book-edit-cancel").classList.remove("is-hidden");
  document.querySelector(".archive-entry-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  document.querySelector("#book-title-input").focus();
}

function clearBookEditMode() {
  editingBookId = null;
  document.querySelector("#book-form .form-submit").textContent = t("addBook");
  document.querySelector("#book-edit-cancel").classList.add("is-hidden");
}

function deleteBook(bookId) {
  customBooks = customBooks.filter((book) => String(book.id) !== String(bookId));
  const editCopy = { ...bookEdits };
  delete editCopy[String(bookId)];
  bookEdits = editCopy;
  if (!deletedBookIds.map(String).includes(String(bookId))) {
    deletedBookIds = [...deletedBookIds, bookId];
  }
  saveToStorage("aquilo.customBooks", customBooks);
  saveToStorage("aquilo.bookEdits", bookEdits);
  saveToStorage("aquilo.deletedBookIds", deletedBookIds);
  if (activeBook && String(activeBook.id) === String(bookId)) {
    document.querySelector("#book-modal").close();
    activeBook = null;
  }
  refreshBookViews();
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
      <button class="delete-button writing-delete" type="button" data-writing-id="${piece.id}">${t("deleteItem")}</button>
    `;
    card.querySelector(".writing-delete").addEventListener("click", () => deleteWritingPiece(piece.id));
    writingList.append(card);
  });
}

function addWritingFromForm(event) {
  event.preventDefault();
  const title = document.querySelector("#writing-title").value.trim();
  if (!title) return;

  const piece = {
    id: `writing-${Date.now()}`,
    title,
    category: document.querySelector("#writing-category").value.trim(),
    body: document.querySelector("#writing-body").value.trim(),
    createdAt: new Date().toISOString(),
  };

  writingPieces = [piece, ...writingPieces];
  saveToStorage("aquilo.writingPieces", writingPieces);
  event.currentTarget.reset();
  renderWritingPieces();
  renderTimeline();
  updateDynamicCards();
  renderModule(selectedModuleId);
}

function deleteWritingPiece(pieceId) {
  writingPieces = writingPieces.filter((piece) => String(piece.id) !== String(pieceId));
  saveToStorage("aquilo.writingPieces", writingPieces);
  renderWritingPieces();
  renderTimeline();
  updateDynamicCards();
  renderModule(selectedModuleId);
}

function handleWritingUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    document.querySelector("#writing-title").value = file.name.replace(/\.(txt|md)$/i, "");
    document.querySelector("#writing-body").value = String(reader.result || "");
  });
  reader.readAsText(file);
}

function renderCriticalNotes() {
  const criticalList = document.querySelector("#critical-list");
  if (!criticalList) return;
  criticalList.replaceChildren(createContentList(criticalNotes, t("noCritical"), "critical", deleteCriticalNote));
}

function renderExtraPosts() {
  const extraList = document.querySelector("#extra-list");
  if (!extraList) return;
  extraList.replaceChildren(createContentList(extraPosts, t("noExtra"), "extra", deleteExtraPost));
}

function addCriticalFromForm(event) {
  event.preventDefault();
  const title = document.querySelector("#critical-title")?.value.trim();
  if (!title) return;

  const note = {
    id: `critical-${Date.now()}`,
    title,
    category: document.querySelector("#critical-category")?.value.trim() || t("criticalDefaultCategory"),
    body: document.querySelector("#critical-body")?.value.trim() || "",
    createdAt: new Date().toISOString(),
  };

  criticalNotes = [note, ...criticalNotes];
  saveToStorage("aquilo.criticalNotes", criticalNotes);
  event.currentTarget.reset();
  renderCriticalNotes();
  renderTimeline();
  updateDynamicCards();
  renderModule(selectedModuleId);
}

function deleteCriticalNote(noteId) {
  criticalNotes = criticalNotes.filter((note) => String(note.id) !== String(noteId));
  saveToStorage("aquilo.criticalNotes", criticalNotes);
  renderCriticalNotes();
  renderTimeline();
  updateDynamicCards();
  renderModule(selectedModuleId);
}

function handleCriticalUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    document.querySelector("#critical-title").value = file.name.replace(/\.(txt|md)$/i, "");
    document.querySelector("#critical-body").value = String(reader.result || "");
  });
  reader.readAsText(file);
}

function addExtraFromForm(event) {
  event.preventDefault();
  const title = document.querySelector("#extra-title")?.value.trim();
  if (!title) return;

  const post = {
    id: `extra-${Date.now()}`,
    title,
    body: document.querySelector("#extra-body")?.value.trim() || "",
    createdAt: new Date().toISOString(),
  };

  extraPosts = [post, ...extraPosts];
  saveToStorage("aquilo.extraPosts", extraPosts);
  event.currentTarget.reset();
  renderExtraPosts();
  renderTimeline();
  updateDynamicCards();
  renderModule(selectedModuleId);
}

function deleteExtraPost(postId) {
  extraPosts = extraPosts.filter((post) => String(post.id) !== String(postId));
  saveToStorage("aquilo.extraPosts", extraPosts);
  renderExtraPosts();
  renderTimeline();
  updateDynamicCards();
  renderModule(selectedModuleId);
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

// Editable library
document.querySelector("#book-form").addEventListener("submit", addBookFromForm);
document.querySelector("#book-edit-cancel").addEventListener("click", () => {
  document.querySelector("#book-form").reset();
  clearBookEditMode();
});

// Editable writing
document.querySelector("#writing-form").addEventListener("submit", addWritingFromForm);
document.querySelector("#writing-upload").addEventListener("change", handleWritingUpload);

// Editable critical studio
document.querySelector("#critical-form").addEventListener("submit", addCriticalFromForm);
document.querySelector("#critical-upload").addEventListener("change", handleCriticalUpload);

// Editable extra
document.querySelector("#extra-form").addEventListener("submit", addExtraFromForm);

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

// ===== Initialize =====

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
