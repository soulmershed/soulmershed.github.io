document.addEventListener("DOMContentLoaded", function () {
  const page = document.querySelector(".essay-reader-page");
  if (!page) return;

  const toggleBtn = document.getElementById("readerToggle");
  const panel = document.getElementById("readerPanel");

  const pageTheme = document.getElementById("pageTheme");
  const fontFamily = document.getElementById("fontFamily");
  const fontSize = document.getElementById("fontSize");
  const fontSizeValue = document.getElementById("fontSizeValue");
  const fontColor = document.getElementById("fontColor");
  const lineSpacing = document.getElementById("lineSpacing");

  const STORAGE_KEY = "essayReaderPreferences";

  const defaults = {
    theme: "white",
    font: "ebgaramond",
    fontSize: "20",
    fontColor: "auto",
    spacing: "medium"
  };

  function getSavedPreferences() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...defaults, ...saved };
    } catch (error) {
      return defaults;
    }
  }

  function savePreferences(prefs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }

  function removeClassByPrefix(element, prefix) {
    [...element.classList].forEach((className) => {
      if (className.startsWith(prefix)) {
        element.classList.remove(className);
      }
    });
  }

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
    const allowed = allowedFontColors(theme);

    [...fontColor.options].forEach((option) => {
      option.hidden = !allowed.includes(option.value);
    });

    if (!allowed.includes(selectedValue)) {
      fontColor.value = "auto";
    } else {
      fontColor.value = selectedValue;
    }
  }

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
    fontSizeValue.textContent = `${prefs.fontSize} px`;
  }

  function currentPreferences() {
    return {
      theme: pageTheme.value,
      font: fontFamily.value,
      fontSize: fontSize.value,
      fontColor: fontColor.value,
      spacing: lineSpacing.value
    };
  }

  const prefs = getSavedPreferences();

  pageTheme.value = prefs.theme;
  fontFamily.value = prefs.font;
  fontSize.value = prefs.fontSize;
  fontColor.value = prefs.fontColor;
  lineSpacing.value = prefs.spacing;

  applyPreferences(prefs);

  toggleBtn.addEventListener("click", function () {
    const isHidden = panel.hasAttribute("hidden");

    if (isHidden) {
      panel.removeAttribute("hidden");
      toggleBtn.setAttribute("aria-expanded", "true");
    } else {
      panel.setAttribute("hidden", "");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });

  [pageTheme, fontFamily, fontSize, fontColor, lineSpacing].forEach((control) => {
    control.addEventListener("input", function () {
      const prefsNow = currentPreferences();
      applyPreferences(prefsNow);
      savePreferences(prefsNow);
    });

    control.addEventListener("change", function () {
      const prefsNow = currentPreferences();
      applyPreferences(prefsNow);
      savePreferences(prefsNow);
    });
  });
});