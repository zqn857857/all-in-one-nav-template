(function () {
  "use strict";

  const STORAGE_THEME = "nav-theme";
  const STORAGE_CATEGORY = "nav-category";
  const STORAGE_LANG = "nav-lang";

  const LANG_MAP = { zh: "zh-CN", en: "en", ja: "ja", ko: "ko", ru: "ru" };

  const I18N = {
    zh: {
      title: "资源导航站",
      subtitle: "精选优质网站，一站直达",
      searchPlaceholder: "搜索网站...",
      all: "全部",
      allSites: "全部网站",
      searchResult: (q) => `搜索「${q}」`,
      siteCount: (n) => `共 ${n} 个`,
      empty: "没有找到匹配的网站",
      footer: "Copyright © 2026 资源导航站 · 数据驱动 · Cloudflare Pages",
      navLabel: "分类导航",
      clearSearch: "清除搜索",
      toggleTheme: "切换深色模式",
      langLabel: "语言",
      loadError: "加载 data.json 失败，请检查文件是否存在",
      categories: {
        ai: "AI工具",
        vpn: "网络安全VPN",
        dev: "开发工具",
        cloud: "云服务",
        design: "设计资源",
        learn: "学习教程",
        video: "视频娱乐",
        download: "下载工具",
      },
    },
    en: {
      title: "Resource Hub",
      subtitle: "Curated sites, one click away",
      searchPlaceholder: "Search sites...",
      all: "All",
      allSites: "All Sites",
      searchResult: (q) => `Search "${q}"`,
      siteCount: (n) => `${n} sites`,
      empty: "No matching sites found",
      footer: "Copyright © 2026 Resource Hub · Data-driven · Cloudflare Pages",
      navLabel: "Categories",
      clearSearch: "Clear search",
      toggleTheme: "Toggle dark mode",
      langLabel: "Language",
      loadError: "Failed to load data.json. Please check if the file exists.",
      categories: {
        ai: "AI Tools",
        vpn: "VPN & Network Security",
        dev: "Dev Tools",
        cloud: "Cloud Services",
        design: "Design Resources",
        learn: "Learning",
        video: "Video & Entertainment",
        download: "Download Tools",
      },
    },
    ja: {
      title: "リソースナビ",
      subtitle: "厳選サイトをワンクリックで",
      searchPlaceholder: "サイトを検索...",
      all: "すべて",
      allSites: "すべてのサイト",
      searchResult: (q) => `「${q}」を検索`,
      siteCount: (n) => `${n} 件`,
      empty: "一致するサイトが見つかりません",
      footer: "Copyright © 2026 リソースナビ · データ駆動 · Cloudflare Pages",
      navLabel: "カテゴリ",
      clearSearch: "検索をクリア",
      toggleTheme: "ダークモード切替",
      langLabel: "言語",
      loadError: "data.json の読み込みに失敗しました。ファイルを確認してください。",
      categories: {
        ai: "AIツール",
        vpn: "VPN・ネットワークセキュリティ",
        dev: "開発ツール",
        cloud: "クラウドサービス",
        design: "デザインリソース",
        learn: "学習チュートリアル",
        video: "動画・エンタメ",
        download: "ダウンロードツール",
      },
    },
    ko: {
      title: "리소스 네비",
      subtitle: "엄선된 사이트, 원클릭 접속",
      searchPlaceholder: "사이트 검색...",
      all: "전체",
      allSites: "전체 사이트",
      searchResult: (q) => `"${q}" 검색`,
      siteCount: (n) => `${n}개`,
      empty: "일치하는 사이트가 없습니다",
      footer: "Copyright © 2026 리소스 네비 · 데이터 기반 · Cloudflare Pages",
      navLabel: "카테고리",
      clearSearch: "검색 지우기",
      toggleTheme: "다크 모드 전환",
      langLabel: "언어",
      loadError: "data.json을 불러오지 못했습니다. 파일을 확인해 주세요.",
      categories: {
        ai: "AI 도구",
        vpn: "VPN & 네트워크 보안",
        dev: "개발 도구",
        cloud: "클라우드 서비스",
        design: "디자인 리소스",
        learn: "학습 튜토리얼",
        video: "영상 & 엔터테인먼트",
        download: "다운로드 도구",
      },
    },
    ru: {
      title: "Навигатор ресурсов",
      subtitle: "Лучшие сайты — в один клик",
      searchPlaceholder: "Поиск сайтов...",
      all: "Все",
      allSites: "Все сайты",
      searchResult: (q) => `Поиск «${q}»`,
      siteCount: (n) => `${n} сайтов`,
      empty: "Сайты не найдены",
      footer: "Copyright © 2026 Навигатор ресурсов · На основе данных · Cloudflare Pages",
      navLabel: "Категории",
      clearSearch: "Очистить поиск",
      toggleTheme: "Переключить тёмную тему",
      langLabel: "Язык",
      loadError: "Не удалось загрузить data.json. Проверьте наличие файла.",
      categories: {
        ai: "ИИ-инструменты",
        vpn: "VPN и сетевая безопасность",
        dev: "Инструменты разработки",
        cloud: "Облачные сервисы",
        design: "Дизайн-ресурсы",
        learn: "Обучение",
        video: "Видео и развлечения",
        download: "Инструменты загрузки",
      },
    },
  };

  let data = null;
  let activeCategory = "all";
  let searchQuery = "";
  let currentLang = "zh";

  const $ = (sel) => document.querySelector(sel);

  const els = {
    siteTitle: $("#siteTitle"),
    siteSubtitle: $("#siteSubtitle"),
    sidebarNav: $("#sidebarNav"),
    searchInput: $("#searchInput"),
    searchClear: $("#searchClear"),
    themeBtn: $("#themeBtn"),
    langSelect: $("#langSelect"),
    categoryTitle: $("#categoryTitle"),
    siteCount: $("#siteCount"),
    siteGrid: $("#siteGrid"),
    emptyState: $("#emptyState"),
    emptyText: $("#emptyText"),
    footerText: $("#footerText"),
  };

  function t() {
    return I18N[currentLang] || I18N.zh;
  }

  function getCategoryName(id) {
    return t().categories[id] || id;
  }

  /* ---- Language ---- */
  function getPreferredLang() {
    const saved = localStorage.getItem(STORAGE_LANG);
    if (saved && I18N[saved]) return saved;
    const browser = (navigator.language || "zh").slice(0, 2);
    return I18N[browser] ? browser : "zh";
  }

  function applyLang(lang) {
    currentLang = I18N[lang] ? lang : "zh";
    localStorage.setItem(STORAGE_LANG, currentLang);
    document.documentElement.lang = LANG_MAP[currentLang];
    els.langSelect.value = currentLang;
    applyUiText();
    render();
  }

  function applyUiText() {
    const i18n = t();
    document.title = i18n.title;
    els.siteTitle.textContent = i18n.title;
    els.siteSubtitle.textContent = i18n.subtitle;
    els.searchInput.placeholder = i18n.searchPlaceholder;
    els.searchClear.setAttribute("aria-label", i18n.clearSearch);
    els.themeBtn.setAttribute("aria-label", i18n.toggleTheme);
    els.langSelect.setAttribute("aria-label", i18n.langLabel);
    els.sidebarNav.setAttribute("aria-label", i18n.navLabel);
    els.emptyText.textContent = i18n.empty;
    els.footerText.textContent = i18n.footer;
  }

  /* ---- Theme ---- */
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_THEME);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_THEME, theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  }

  /* ---- Favicon ---- */
  const FAVICON_DEFAULT = "assets/default-favicon.svg";
  // 本地图标命名规范: assets/icons/{域名}.png 或 .ico 或 .svg (如 assets/icons/github.com.png)
  // 添加新站点时需同时在 assets/icons/ 目录下添加对应图标文件
  // 备用API: favicon.im (Cloudflare CDN)、fav.dog、faviconkit.net (国内外均可访问)

  function getDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  }

  function getRootDomain(domain) {
    // 对于推广链接，提取实际品牌域名
    if (domain.includes("sjv.io") || domain.includes("nordvpn")) {
      return "nordvpn.com";
    }
    return domain.replace(/^www\./, "");
  }

  function getFaviconSources(url, customIcon) {
    if (customIcon) return [customIcon, FAVICON_DEFAULT];

    const domain = getDomain(url);
    if (!domain) return [FAVICON_DEFAULT];

    const rootDomain = getRootDomain(domain);
    const sources = [
      `assets/icons/${domain}.png`,
      `assets/icons/${domain}.ico`,
      `assets/icons/${domain}.svg`,
      `assets/icons/${rootDomain}.png`,
      `assets/icons/${rootDomain}.ico`,
      `assets/icons/${rootDomain}.svg`,
      `https://favicon.im/${domain}`,
      `https://fav.dog/${domain}`,
      `https://ico.faviconkit.net/favicon/${domain}`,
      FAVICON_DEFAULT,
    ];

    return [...new Set(sources)];
  }

  function loadFavicon(img, sources) {
    let index = 0;

    function tryNext() {
      if (index >= sources.length) {
        img.onerror = null;
        img.src = FAVICON_DEFAULT;
        return;
      }
      img.src = sources[index++];
    }

    img.onerror = tryNext;
    tryNext();
  }

  function initFavicons(container) {
    container.querySelectorAll(".site-favicon[data-sources]").forEach((img) => {
      try {
        loadFavicon(img, JSON.parse(img.dataset.sources));
      } catch {
        img.src = FAVICON_DEFAULT;
      }
    });
  }

  function displayUrl(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  }

  function getSiteDesc(site) {
    if (site.desc && typeof site.desc === "object") {
      return site.desc[currentLang] || site.desc.zh || site.desc.en || "";
    }
    return site.desc || "";
  }

  function getSiteSearchText(site) {
    const parts = [site.name, getDomain(site.url)];
    if (site.desc && typeof site.desc === "object") {
      parts.push(...Object.values(site.desc));
    } else if (site.desc) {
      parts.push(site.desc);
    }
    return parts.join(" ").toLowerCase();
  }

  /* ---- Data ---- */
  function getAllSites() {
    if (!data?.categories) return [];
    return data.categories.flatMap((cat) =>
      cat.sites.map((site) => ({ ...site, categoryId: cat.id, categoryIcon: cat.icon }))
    );
  }

  function getFilteredSites() {
    let sites = getAllSites();

    if (activeCategory !== "all") {
      sites = sites.filter((s) => s.categoryId === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      sites = sites.filter((s) => getSiteSearchText(s).includes(q));
    }

    return sites;
  }

  function getCategoryLabel() {
    const i18n = t();
    if (searchQuery) return i18n.searchResult(searchQuery);
    if (activeCategory === "all") return i18n.allSites;
    const cat = data.categories.find((c) => c.id === activeCategory);
    return cat ? `${cat.icon} ${getCategoryName(cat.id)}` : i18n.allSites;
  }

  /* ---- Render ---- */
  function renderNav() {
    const i18n = t();
    const total = getAllSites().length;
    const allItem = `
      <button class="nav-item${activeCategory === "all" ? " active" : ""}" data-id="all">
        <span class="nav-icon">🏠</span>
        <span>${i18n.all}</span>
        <span class="nav-count">${total}</span>
      </button>`;

    const items = data.categories
      .map(
        (cat) => `
      <button class="nav-item${activeCategory === cat.id ? " active" : ""}" data-id="${cat.id}">
        <span class="nav-icon">${cat.icon}</span>
        <span>${getCategoryName(cat.id)}</span>
        <span class="nav-count">${cat.sites.length}</span>
      </button>`
      )
      .join("");

    els.sidebarNav.innerHTML = allItem + items;

    els.sidebarNav.querySelectorAll(".nav-item").forEach((btn) => {
      btn.addEventListener("click", () => setCategory(btn.dataset.id));
    });
  }

  function renderCards() {
    const i18n = t();
    const sites = getFilteredSites();
    els.categoryTitle.textContent = getCategoryLabel();
    els.siteCount.textContent = sites.length ? i18n.siteCount(sites.length) : "";

    if (sites.length === 0) {
      els.siteGrid.innerHTML = "";
      els.emptyState.hidden = false;
      return;
    }

    els.emptyState.hidden = true;

    els.siteGrid.innerHTML = sites
      .map(
        (site, i) => `
      <a class="site-card" href="${escapeHtml(site.url)}" target="_blank" rel="noopener noreferrer"
         style="animation-delay:${Math.min(i * 40, 400)}ms" title="${escapeHtml(site.name)}">
        <img class="site-favicon" src="${FAVICON_DEFAULT}"
             data-sources='${escapeHtml(JSON.stringify(getFaviconSources(site.url, site.icon)))}'
             alt="" width="40" height="40" loading="lazy">
        <div class="site-info">
          <div class="site-name">${escapeHtml(site.name)}</div>
          <div class="site-desc">${escapeHtml(getSiteDesc(site))}</div>
          <div class="site-url">${escapeHtml(displayUrl(site.url))}</div>
        </div>
      </a>`
      )
      .join("");

    initFavicons(els.siteGrid);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function render() {
    if (!data) return;
    renderNav();
    renderCards();
  }

  /* ---- Actions ---- */
  function setCategory(id) {
    activeCategory = id;
    localStorage.setItem(STORAGE_CATEGORY, id);
    render();
  }

  function setSearch(query) {
    searchQuery = query.trim();
    els.searchClear.hidden = !searchQuery;
    renderCards();
  }

  /* ---- Init ---- */
  function bindEvents() {
    els.themeBtn.addEventListener("click", toggleTheme);
    els.langSelect.addEventListener("change", (e) => applyLang(e.target.value));

    els.searchInput.addEventListener("input", (e) => setSearch(e.target.value));
    els.searchClear.addEventListener("click", () => {
      els.searchInput.value = "";
      setSearch("");
      els.searchInput.focus();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.activeElement === els.searchInput) {
        els.searchInput.value = "";
        setSearch("");
        els.searchInput.blur();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        els.searchInput.focus();
      }
    });
  }

  async function loadData() {
    try {
      const res = await fetch("data.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();

      const saved = localStorage.getItem(STORAGE_CATEGORY);
      if (saved && (saved === "all" || data.categories.some((c) => c.id === saved))) {
        activeCategory = saved;
      }

      applyUiText();
      render();
    } catch (err) {
      els.siteGrid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon">⚠️</div>
          <p>${escapeHtml(t().loadError)}</p>
          <p style="margin-top:8px;font-size:13px;color:var(--text-muted)">${escapeHtml(err.message)}</p>
        </div>`;
    }
  }

  applyTheme(getPreferredTheme());
  applyLang(getPreferredLang());
  bindEvents();
  loadData();
})();
