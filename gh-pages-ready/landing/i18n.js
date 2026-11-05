(function () {
  var STORAGE = "czm-lang";

  var EN = {
    "meta-title": "CzechMate — the chessboard that teaches you to play better",
    "meta-desc":
      "An LED chessboard and app in one: hints right on the squares, games and analysis with Stockfish (adjustable strength), and an AI coach. For families, clubs, and schools. Download CzechMate for Android (APK), macOS (DMG), or Windows (installer from GitHub Releases).",
    "og-title": "CzechMate — chess that teaches",
    "og-desc":
      "A living chessboard and app: LED lessons, Stockfish tuned to your level, and an AI coach. For every age. Android, macOS, and Windows downloads on this page (files from GitHub Releases).",
    skip: "Skip to content",
    "nav-board": "Board",
    "nav-lamp": "Lamp",
    "nav-pieces": "Pieces",
    "nav-app": "App",
    "nav-download": "Download",
    "nav-docs": "Docs",
    "nav-survey": "Survey",
    "nav-menu": "Menu",
    "nav-sections": "Page sections",
    "nav-mobile-label": "Mobile menu",
    "lang-label": "Language",
    "hero-title": "Chess on a living board.",
    "hero-survey": "Take the survey",
    "hero-download": "Download the app",
    "hero-board": "See the board",
    "hero-video": "CzechMate: board wake-up, square occupancy sensing, guided play, and mate",
    "learn-label": "Education",
    "learn-title": "Why CzechMate is a learning system — not just a “smart board”",
    "learn-intro":
      "Chess clicks best when the pieces are under your hands and you can see right away whether a move makes sense. CzechMate brings together <strong>real pieces</strong>, <strong>lights on the squares</strong>, and an <strong>app</strong> with rules, position, and analysis. Set your opponent from calm lessons up to a top engine; when you need an explanation, bring in the AI coach.",
    "age-h": "Every age group",
    "age-p":
      "Kids find their bearings with colors on the board; adults get depth of analysis and a calm game pace. Parents, after-school clubs, cafés, and home clubs — one board, many ways to learn.",
    "skill-h": "Every skill level",
    "skill-p":
      "Beginners see where they may move and what check or mate means. Advanced players work on tactics, plans, and evaluations — including a top chess engine and coach conversations.",
    "sense-h": "Learning with every sense",
    "sense-p":
      "You touch a piece, see a lit square, and optionally hear a human explanation or read an AI reply. The more senses you use, the better rules and patterns stick.",
    "pieces-label": "The set",
    "pieces-title": "Printed pieces designed for magnetic sensing",
    "pieces-intro":
      "The set is faceted PLA: wide feet, thick tips, and no overhang that needs support. Magnets in each foot provide reliable square presence sensing today, arranged so future V2 revisions can decode <strong>piece type and color</strong> directly from magnetic field patterns beneath the square.",
    "piece-king": "King",
    "piece-queen": "Queen",
    "piece-bishop": "Bishop",
    "piece-knight": "Knight",
    "piece-rook": "Rook",
    "piece-pawn": "Pawn",
    "alt-king": "King — white PLA set",
    "alt-queen": "Queen — white PLA set",
    "alt-bishop": "Bishop — white PLA set",
    "alt-knight": "Knight — white PLA set",
    "alt-rook": "Rook — white PLA set",
    "alt-pawn": "Pawn — white PLA set",
    "piece-toggle": "Show black pieces",
    "board-label": "The board as tutor",
    "board-title": "Lights on the squares show what you need right now",
    "board-intro":
      "Sensors under every square track piece presence with high accuracy, while the V2 architecture is engineered to resolve <strong>piece type</strong> from the magnet patterns in the foot. Hints land on a real chessboard, not “some picture.” The board runs the game in real time and the LEDs match the pieces. You can refresh firmware <strong>without cables to the chip</strong> from the app, the board’s web UI, or Wi‑Fi.",
    "board-h": "From the first game to master habits",
    "board-p":
      "<strong>Physical pieces</strong> and <strong>lights on the squares</strong> stay in sync: on every move you know whether the system sees what you see. Less guessing, more confidence. Connect a phone or computer and you get a game overview, move history, and hints from the board web UI and the CzechMate app on the same position.",
    "loading-video": "Loading video",
    "vid-led": "CzechMate LED chessboard in action",
    "vid-build": "CzechMate board, layer by layer, then assembled",
    "vid-board": "CzechMate board, from the glass to a finished game",
    "vid-players": "Two players at a CzechMate board",
    "lamp-label": "After the game",
    "lamp-title": "Leave it on the nightstand. It becomes a lamp you already own in Home Assistant.",
    "lamp-intro":
      "After a few minutes idle, CzechMate switches from chess to <strong>one colour across all 64 squares</strong>. Home Assistant sees it as a normal MQTT RGB light — brightness, colour, on and off, same as any other lamp. Pick a piece up and the board is a chessboard again.",
    "vid-lamp": "CzechMate glowing as a nightstand lamp in a dark room",
    "lamp-h": "The board is the light",
    "lamp-p":
      "Sit it flat on a table or nightstand so the glass faces the room. There is no extra lamp inside — the same square LEDs that teach a game become a warm wash on the wall. Colour and brightness come from your smart home, not from a second app.",
    "lamp-note":
      "The clip above is a 3D placeholder. A real-room recording of the board as a lamp will replace it.",
    "sf-label": "An opponent from another league",
    "sf-title": "Stockfish — play a system stronger at chess than any human alive",
    "sf-intro":
      "CzechMate runs <strong>Stockfish</strong>: an engine that, in raw strength, beats any living player. For learning, pick a weaker engine level and a calmer game with a readable pace. Start a game from the app or the board’s web UI over Wi‑Fi. On every move you get engine suggestions, position analysis, and a comparison with your choice.",
    more: "More",
    "sf-a-aria": "Open details: Games stronger than any human",
    "sf-a-h": "Games stronger than any human",
    "sf-a-p":
      "Train against an opponent at top-engine level — above the human ceiling. Dial strength down for a slower pace or a gentle mode for beginners.",
    "sf-b-aria": "Open details: Rough evaluation",
    "sf-b-h": "Rough evaluation",
    "sf-b-p":
      "An estimate of advantage in approximate pawns from an engine that can beat grandmasters helps you read the position — especially in the middlegame and endgames.",
    "sf-c-aria": "Open details: Board and app linked",
    "sf-c-h": "Board ↔ app linked",
    "sf-c-p":
      "The same game logic on the board and in the app means lessons on the lights and on the screen speak the same language.",
    "coach-label": "AI coach in the app",
    "coach-title": "AI coach: strategy, mistakes, and a plan right at the board",
    "coach-intro":
      "In the app you get a <strong>conversation on the current position</strong>: a multi-move plan, typical mistakes, and deeper strategy. Set the <strong>explanation level</strong> so the text fits a beginner or a club player.",
    "loading-preview": "Loading preview",
    "coach-alt": "CzechMate — AI coach in the app",
    "coach-h": "Your AI, under your control",
    "coach-p":
      "In settings you choose an <strong>assistant</strong>: cloud based on your account, or a local mode that fits school, club, or home rules. Offline or without a sign-in you still get <strong>basic offline hints</strong> from built-in chess tips.",
    "app-label": "CzechMate app",
    "app-title": "One client for board connection, learning, and analysis",
    "app-intro":
      "One app for Android and macOS: game overview, board connection over Bluetooth or network, learning, play, Stockfish analysis (with strength control), and the AI coach. No hopping between programs. In settings you can also <strong>update board firmware</strong> without a cable to a computer.",
    "app-video-title": "CzechMate — app interface",
    "hints-h": "Hints and learning modes",
    "hints-p":
      "Orientation in the game and control of move highlights on the board — the app extends what you already see on the LEDs.",
    "analysis-h": "Analysis and Stockfish",
    "analysis-p":
      "Move evaluations and continuation suggestions from an engine that outcalculates even a world champion — right in the app.",
    "coach-tile-h": "AI coach / chat",
    "coach-tile-p":
      "Talk through strategy, plans, and mistakes; an optional smart assistant based on your settings.",
    "connect-h": "Connect to the board",
    "connect-p":
      "Bluetooth or network within range of the board — the same game on the chessboard and on the screen.",
    "webui-h": "Board web UI",
    "webui-p":
      "From a browser over Wi‑Fi — learning and Stockfish games wherever the board has a network.",
    "ota-h": "Flash from the app",
    "ota-p":
      "Upload new firmware from the app with no programmer and no wires to the board. Watch progress on the LEDs.",
    "oss-h": "Open-source ecosystem",
    "oss-p":
      "Firmware and app sources are public: schools and clubs can adapt lessons or the client under the repository licenses.",
    "interest-label": "Community",
    "interest-title": "Want CzechMate? Let me know",
    "interest-intro":
      "Short feedback helps me plan development and see what matters most to players and schools. Your response stays with me alone.",
    "interest-h": "Interest survey",
    "interest-p":
      "A few questions about interest in the product, important features, age, and an optional comment. It takes a moment and helps me set priorities.",
    "interest-cta": "Open interest survey",
    "feat-close": "Close feature details",
    "dl-label": "Download",
    "dl-title": "Download CzechMate and start learning on a living board",
    "dl-intro":
      "Get the latest app for Android (APK), Mac with Apple Silicon (DMG), or Windows (EXE installer). Links go to GitHub Releases and offer a direct download of the current build for your platform. On Android you may need to allow installs from unknown sources if you are not using the Play Store. On Mac, open the DMG and drag the app into Applications. On Windows, SmartScreen may warn about an unsigned package on first run — continue only for files from this project’s official release. The Windows build connects to the board over Wi‑Fi (there is no Bluetooth scan in the desktop app).",
    "dl-choose": "Choose a platform",
    "android-p": "Phone or tablet — lessons and coach in your pocket.",
    "dl-apk": "Download APK",
    "macos-p": "Apple Silicon (arm64) — the app beside the board.",
    "dl-dmg": "Download DMG",
    soon: "Coming soon",
    "ios-p": "Release via TestFlight and then the App Store once Apple approval clears.",
    "ios-progress": "In progress",
    "win-p":
      "64-bit installer (Inno Setup). Board connection over HTTP on the local network — no BLE scan in this build.",
    "dl-exe": "Download installer",
    "trust-title": "Built in Czechia · open-source code",
    "trust-p":
      'CzechMate has <strong>open software</strong>: board firmware and the client app are on GitHub for download and modification under the repository license. I handle the hardware myself. Guides, schematics, and technical notes are in the <a href="./index.html">docs</a>. You can contribute translations, lesson texts, or code improvements for the community around the project.',
    "trust-gh": "GitHub repository",
    "footer-docs": "Technical docs",
    "footer-diagrams": "Diagrams",
    "footer-releases": "Releases",
    "footer-source": "Source code",
  };

  function preferredLang() {
    try {
      var saved = localStorage.getItem(STORAGE);
      if (saved === "cs" || saved === "en") return saved;
    } catch (e) {}
    var list =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || "cs"];
    var primary = String(list[0] || "cs").toLowerCase();
    if (primary === "en" || primary.indexOf("en-") === 0) return "en";
    return "cs";
  }

  function remember(el, attr, cacheAttr) {
    if (el.hasAttribute(cacheAttr)) return;
    el.setAttribute(cacheAttr, el.getAttribute(attr) || "");
  }

  function apply(lang) {
    lang = lang === "en" ? "en" : "cs";
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var html = el.hasAttribute("data-i18n-html");
      if (!el.hasAttribute("data-cs")) {
        el.setAttribute("data-cs", html ? el.innerHTML : el.textContent);
      }
      var value = lang === "en" ? EN[key] : el.getAttribute("data-cs");
      if (value == null) return;
      if (html) el.innerHTML = value;
      else el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      remember(el, "aria-label", "data-cs-aria");
      var key = el.getAttribute("data-i18n-aria");
      var value = lang === "en" ? EN[key] : el.getAttribute("data-cs-aria");
      if (value != null) el.setAttribute("aria-label", value);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      remember(el, "alt", "data-cs-alt");
      var key = el.getAttribute("data-i18n-alt");
      var value = lang === "en" ? EN[key] : el.getAttribute("data-cs-alt");
      if (value != null) el.setAttribute("alt", value);
    });

    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      remember(el, "title", "data-cs-title");
      var key = el.getAttribute("data-i18n-title");
      var value = lang === "en" ? EN[key] : el.getAttribute("data-cs-title");
      if (value != null) el.setAttribute("title", value);
    });

    document.querySelectorAll("[data-i18n-content]").forEach(function (el) {
      remember(el, "content", "data-cs-content");
      var key = el.getAttribute("data-i18n-content");
      var value = lang === "en" ? EN[key] : el.getAttribute("data-cs-content");
      if (value != null) el.setAttribute("content", value);
    });

    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-set-lang") === lang ? "true" : "false");
    });

    document.documentElement.classList.remove("i18n-pending");
    try {
      document.dispatchEvent(new CustomEvent("czm-lang", { detail: { lang: lang } }));
    } catch (e2) {}
  }

  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest ? ev.target.closest("[data-set-lang]") : null;
    if (!btn) return;
    var lang = btn.getAttribute("data-set-lang");
    if (lang !== "cs" && lang !== "en") return;
    try {
      localStorage.setItem(STORAGE, lang);
    } catch (e) {}
    apply(lang);
  });

  apply(preferredLang());
  window.CzmI18n = {
    apply: apply,
    lang: function () {
      return document.documentElement.lang === "en" ? "en" : "cs";
    },
  };
})();
