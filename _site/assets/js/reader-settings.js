document.addEventListener("DOMContentLoaded", function () {
  /* ==========================================================
     ARTICLE READER SCRIPT — PROFESSIONAL MINIMALIST VERSION

     PURPOSE
     - Runs only on article / essay pages
     - Applies reader preferences cleanly
     - Stores preferences in localStorage
     - Controls:
       1) theme
       2) font family
       3) font size
       4) text color
       5) line spacing
     - Improves usability with:
       6) panel open / close
       7) Escape key close
       8) click-outside close
       9) sensible accessibility attributes
      10) reduced-motion respect
      11) smooth heading anchor support
      12) external-link safety
      13) image and table wrappers for article content
      14) copy-to-clipboard for code blocks
      15) reading progress bar if present

     IMPORTANT
     - This script does NOT create paragraph indentation by itself.
       Indentation remains controlled by SCSS.
     - This script adds classes and variables that SCSS can use.

     EXPECTED HTML
     - .essay-reader-page
     - #readerToggle
     - #readerPanel
     - #pageTheme
     - #fontFamily
     - #fontSize
     - #fontSizeValue
     - #fontColor
     - #lineSpacing

     OPTIONAL HTML
     - .reading-progress-bar
     - .essay-reader-content

     ========================================================== */

  /* ==========================================================
     1. PAGE GUARD
     Run only on essay/article pages
     ========================================================== */
  const page = document.querySelector(".essay-reader-page");
  if (!page) return;

  const content = page.querySelector(".essay-reader-content");

  /* ==========================================================
     2. UI ELEMENTS
     ========================================================== */
  const toggleBtn = document.getElementById("readerToggle");
  const panel = document.getElementById("readerPanel");

  const pageTheme = document.getElementById("pageTheme");
  const fontFamily = document.getElementById("fontFamily");
  const fontSize = document.getElementById("fontSize");
  const fontSizeValue = document.getElementById("fontSizeValue");
  const fontColor = document.getElementById("fontColor");
  const lineSpacing = document.getElementById("lineSpacing");

  const progressBar = document.querySelector(".reading-progress-bar");

  /* ==========================================================
     3. STORAGE
     MODIFY: storage key if desired
     ========================================================== */
  const STORAGE_KEY = "essayReaderPreferences";

  /* ==========================================================
     4. DEFAULT READER STATE
     MODIFY: default article reading appearance here
     ========================================================== */
  const defaults = {
    theme: "white",
    font: "ebgaramond",
    fontSize: "21",
    fontColor: "auto",
    spacing: "medium"
  };

  /* ==========================================================
     5. UTILITIES
     ========================================================== */
  function safelyParseJSON(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function getSavedPreferences() {
    const saved = safelyParseJSON(localStorage.getItem(STORAGE_KEY), null);
    return { ...defaults, ...(saved || {}) };
  }

  function savePreferences(prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (error) {
      /* silent fail */
    }
  }

  function removeClassByPrefix(element, prefix) {
    if (!element) return;
    [...element.classList].forEach((className) => {
      if (className.startsWith(prefix)) {
        element.classList.remove(className);
      }
    });
  }

  function debounce(callback, wait) {
    let timeoutId;
    return function (...args) {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => callback.apply(this, args), wait);
    };
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ==========================================================
     6. THEME / TEXT COLOR RULES
     MODIFY: automatic theme-to-text mapping here
     ========================================================== */
  function getAutomaticTextColor(theme) {
    if (theme === "white") return "black";
    if (theme === "cream") return "darkgray";
    if (theme === "darkblue") return "creamtext";
    if (theme === "black") return "creamtext";
    return "black";
  }

  function allowedFontColors(theme) {
    if (theme === "white" || theme === "cream") {
      return ["auto", "black", "darkgray"];
    }
    return ["auto", "white", "creamtext"];
  }

  function refreshFontColorOptions(theme, selectedValue) {
    if (!fontColor) return;

    const allowed = allowedFontColors(theme);

    [...fontColor.options].forEach((option) => {
      option.hidden = !allowed.includes(option.value);
      option.disabled = !allowed.includes(option.value);
    });

    if (!allowed.includes(selectedValue)) {
      fontColor.value = "auto";
    } else {
      fontColor.value = selectedValue;
    }
  }

  /* ==========================================================
     7. APPLY READER PREFERENCES
     MAIN VISUAL APPLICATION FUNCTION

     Applies:
     - theme-* class
     - font-* class
     - spacing-* class
     - text-* class
     - --reader-font-size CSS variable
     ========================================================== */
  function applyPreferences(prefs) {
    removeClassByPrefix(page, "theme-");
    removeClassByPrefix(page, "font-");
    removeClassByPrefix(page, "spacing-");
    removeClassByPrefix(page, "text-");

    page.classList.add(`theme-${prefs.theme}`);
    page.classList.add(`font-${prefs.font}`);
    page.classList.add(`spacing-${prefs.spacing}`);

    const actualTextColor =
      prefs.fontColor === "auto"
        ? getAutomaticTextColor(prefs.theme)
        : prefs.fontColor;

    page.classList.add(`text-${actualTextColor}`);
    page.style.setProperty("--reader-font-size", `${prefs.fontSize}px`);

    refreshFontColorOptions(prefs.theme, prefs.fontColor);

    if (fontSizeValue) {
      fontSizeValue.textContent = `${prefs.fontSize} px`;
    }
  }

  /* ==========================================================
     8. READ CURRENT CONTROL VALUES
     ========================================================== */
  function currentPreferences() {
    return {
      theme: pageTheme ? pageTheme.value : defaults.theme,
      font: fontFamily ? fontFamily.value : defaults.font,
      fontSize: fontSize ? fontSize.value : defaults.fontSize,
      fontColor: fontColor ? fontColor.value : defaults.fontColor,
      spacing: lineSpacing ? lineSpacing.value : defaults.spacing
    };
  }

  /* ==========================================================
     9. PANEL OPEN / CLOSE
     ========================================================== */
  function openPanel() {
    if (!panel || !toggleBtn) return;
    panel.removeAttribute("hidden");
    toggleBtn.setAttribute("aria-expanded", "true");
    page.classList.add("reader-panel-open");
  }

  function closePanel() {
    if (!panel || !toggleBtn) return;
    panel.setAttribute("hidden", "");
    toggleBtn.setAttribute("aria-expanded", "false");
    page.classList.remove("reader-panel-open");
  }

  function togglePanel() {
    if (!panel) return;
    if (panel.hasAttribute("hidden")) {
      openPanel();
    } else {
      closePanel();
    }
  }

  /* ==========================================================
     10. ACCESSIBILITY IMPROVEMENTS
     ========================================================== */
  function enhanceAccessibility() {
    if (toggleBtn && panel) {
      toggleBtn.setAttribute("aria-controls", "readerPanel");
      toggleBtn.setAttribute("aria-expanded", panel.hasAttribute("hidden") ? "false" : "true");
    }

    if (content) {
      content.setAttribute("tabindex", "-1");
    }
  }

  /* ==========================================================
     11. EXTERNAL LINKS
     Adds safe target/rel to external links only
     ========================================================== */
  function enhanceExternalLinks() {
    if (!content) return;

    const links = content.querySelectorAll('a[href]');
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#")) return;
      if (href.startsWith("mailto:")) return;
      if (href.startsWith("tel:")) return;

      const isExternal = /^https?:\/\//i.test(href) && !href.includes(window.location.hostname);
      if (isExternal) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  /* ==========================================================
     12. HEADING IDS + SMOOTH HASH NAVIGATION
     Useful for essays with sections
     ========================================================== */
  function slugify(text) {
    return String(text)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function enhanceHeadings() {
    if (!content) return;

    const headings = content.querySelectorAll("h2, h3, h4");
    headings.forEach((heading) => {
      if (!heading.id) {
        const slug = slugify(heading.textContent || "");
        if (slug) heading.id = slug;
      }
    });
  }

  function handleHashNavigation() {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    if (!target) return;

    const scrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
    target.scrollIntoView({ behavior: scrollBehavior, block: "start" });
  }

  /* ==========================================================
     13. IMAGE WRAPPERS
     Helps clean article layout if SCSS styles wrappers
     ========================================================== */
  function wrapImages() {
    if (!content) return;

    const images = content.querySelectorAll("img");
    images.forEach((img) => {
      if (img.closest("figure") || img.closest(".article-image-wrap")) return;

      const wrapper = document.createElement("figure");
      wrapper.className = "article-image-wrap";
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);

      const altText = (img.getAttribute("alt") || "").trim();
      if (altText) {
        const caption = document.createElement("figcaption");
        caption.className = "article-image-caption";
        caption.textContent = altText;
        wrapper.appendChild(caption);
      }
    });
  }

  /* ==========================================================
     14. TABLE WRAPPERS
     Helps tables scroll cleanly on mobile
     ========================================================== */
  function wrapTables() {
    if (!content) return;

    const tables = content.querySelectorAll("table");
    tables.forEach((table) => {
      if (table.parentElement && table.parentElement.classList.contains("article-table-wrap")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "article-table-wrap";
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  /* ==========================================================
     15. COPY BUTTONS FOR CODE BLOCKS
     Minimal but professional enhancement
     ========================================================== */
  function addCopyButtonsToCodeBlocks() {
    if (!content || !navigator.clipboard) return;

    const codeBlocks = content.querySelectorAll("pre > code");
    codeBlocks.forEach((code) => {
      const pre = code.parentElement;
      if (!pre || pre.parentElement?.classList.contains("code-block-wrap")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrap";

      const button = document.createElement("button");
      button.className = "code-copy-button";
      button.type = "button";
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy code to clipboard");

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(button);
      wrapper.appendChild(pre);

      button.addEventListener("click", async function () {
        try {
          await navigator.clipboard.writeText(code.textContent || "");
          const original = button.textContent;
          button.textContent = "Copied";
          window.setTimeout(() => {
            button.textContent = original;
          }, 1200);
        } catch (error) {
          const original = button.textContent;
          button.textContent = "Failed";
          window.setTimeout(() => {
            button.textContent = original;
          }, 1200);
        }
      });
    });
  }

  /* ==========================================================
     16. READING PROGRESS BAR
     Works only if .reading-progress-bar exists in HTML
     ========================================================== */
  function updateReadingProgress() {
    if (!progressBar || !content) return;

    const contentRect = content.getBoundingClientRect();
    const contentTop = window.scrollY + contentRect.top;
    const contentHeight = content.offsetHeight;
    const viewportHeight = window.innerHeight;

    const start = contentTop;
    const end = contentTop + contentHeight - viewportHeight;
    const current = window.scrollY;

    let progress = 0;

    if (end > start) {
      progress = ((current - start) / (end - start)) * 100;
    } else {
      progress = current > start ? 100 : 0;
    }

    progress = Math.max(0, Math.min(100, progress));
    progressBar.style.transform = `scaleX(${progress / 100})`;
    progressBar.setAttribute("aria-valuenow", String(Math.round(progress)));
  }

  const debouncedUpdateReadingProgress = debounce(updateReadingProgress, 10);

  /* ==========================================================
     17. PANEL EVENT BINDINGS
     - toggle button
     - escape key
     - click outside
     ========================================================== */
  function bindPanelEvents() {
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        togglePanel();
      });
    }

    if (panel) {
      panel.addEventListener("click", function (event) {
        event.stopPropagation();
      });
    }

    document.addEventListener("click", function (event) {
      if (!panel || !toggleBtn) return;
      if (panel.hasAttribute("hidden")) return;
      if (panel.contains(event.target)) return;
      if (toggleBtn.contains(event.target)) return;
      closePanel();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closePanel();
      }
    });
  }

  /* ==========================================================
     18. CONTROL EVENT BINDINGS
     Applies and saves preferences on input/change
     ========================================================== */
  function bindControlEvents() {
    [pageTheme, fontFamily, fontSize, fontColor, lineSpacing].forEach((control) => {
      if (!control) return;

      const handler = function () {
        const prefsNow = currentPreferences();
        applyPreferences(prefsNow);
        savePreferences(prefsNow);
      };

      control.addEventListener("input", handler);
      control.addEventListener("change", handler);
    });
  }

  /* ==========================================================
     19. INITIALIZATION
     ========================================================== */
  function initPreferences() {
    const prefs = getSavedPreferences();

    if (pageTheme) pageTheme.value = prefs.theme;
    if (fontFamily) fontFamily.value = prefs.font;
    if (fontSize) fontSize.value = prefs.fontSize;
    if (fontColor) fontColor.value = prefs.fontColor;
    if (lineSpacing) lineSpacing.value = prefs.spacing;

    applyPreferences(prefs);
  }

  function initMotionPreference() {
    if (prefersReducedMotion()) {
      page.classList.add("reduced-motion");
    } else {
      page.classList.remove("reduced-motion");
    }
  }

  function bindWindowEvents() {
    window.addEventListener("scroll", debouncedUpdateReadingProgress, { passive: true });
    window.addEventListener("resize", debouncedUpdateReadingProgress);

    window.addEventListener("hashchange", handleHashNavigation);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", initMotionPreference);
    } else if (typeof motionQuery.addListener === "function") {
      motionQuery.addListener(initMotionPreference);
    }
  }

  function initEnhancements() {
    enhanceAccessibility();
    enhanceExternalLinks();
    enhanceHeadings();
    wrapImages();
    wrapTables();
    addCopyButtonsToCodeBlocks();
    handleHashNavigation();
    updateReadingProgress();
    initMotionPreference();
  }

  /* ==========================================================
     20. RUN EVERYTHING
     ========================================================== */
  initPreferences();
  initEnhancements();
  bindPanelEvents();
  bindControlEvents();
  bindWindowEvents();
});