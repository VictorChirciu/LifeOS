const THEMES = ["stone", "snow", "zinc", "sand", "mint"] as const;
type Theme = (typeof THEMES)[number];

function initTheme(): void {
  const fromServer = document.body.dataset.theme as Theme | undefined;
  const fromStorage = localStorage.getItem("theme") as Theme | null;
  const theme = fromServer || fromStorage || "stone";

  if (THEMES.includes(theme as Theme)) {
    THEMES.forEach((t) => document.body.classList.remove(`theme-${t}`));
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
    markActiveTheme(theme as Theme);
  }

  setTimeout(ColorPicker, 0);
}

function applyTheme(name: Theme, save = true): void {
  THEMES.forEach((t) => document.body.classList.remove(`theme-${t}`));
  document.body.classList.add(`theme-${name}`);
  localStorage.setItem("theme", name);
  markActiveTheme(name);
  setTimeout(ColorPicker, 0);

  if (save) {
    fetch("/user/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: name }),
    });
  }
}

function markActiveTheme(name: Theme): void {
  document
    .querySelectorAll<HTMLButtonElement>("[data-theme]")
    .forEach((btn) => {
      const isActive = btn.dataset.theme === name;
      const checkImg = btn.querySelector<HTMLImageElement>('img[alt="Check"]');
      btn.classList.toggle("ring-2", isActive);
      btn.classList.toggle("ring-offset-1", isActive);
      btn.classList.toggle("ring-gray-400", isActive);
      btn.classList.toggle("scale-105", isActive);
      if (checkImg) checkImg.classList.toggle("hidden", !isActive);
    });
}

function ColorPicker(): void {
  const colorPicker = document.querySelector<HTMLInputElement>(
    'input[type="color"]',
  );
  if (!colorPicker) return;
  const styles = getComputedStyle(document.body);
  const accent = styles.getPropertyValue("--accent").trim();
  if (/^#([A-Fa-f0-9]{3,6})$/.test(accent)) colorPicker.value = accent;
}

function initBgToggle(): void {
  const checkbox = document.querySelector<HTMLInputElement>(
    'input[name="bgToggle"]',
  );
  if (!checkbox) return;
  const saved = localStorage.getItem("theme-flat") === "true";
  checkbox.checked = saved;
  applyFlatBg(saved);
  checkbox.addEventListener("change", () => {
    localStorage.setItem("theme-flat", String(checkbox.checked));
    applyFlatBg(checkbox.checked);
  });
}

function applyFlatBg(flat: boolean): void {
  document.body.classList.toggle("theme-flat", flat);
}

function initDarkMode(): void {
  const fromServer = document.body.dataset.dark === "true";
  const fromStorage = localStorage.getItem("dark-mode") === "true";
  const dark = fromServer || fromStorage;

  document.body.classList.add("no-transition");
  applyDarkMode(dark, false);
  requestAnimationFrame(() => document.body.classList.remove("no-transition"));

  const checkbox = document.querySelector<HTMLInputElement>(
    'input[name="darkMode"]',
  );
  if (!checkbox) return;
  checkbox.checked = dark;
  checkbox.addEventListener("change", () => {
    localStorage.setItem("dark-mode", String(checkbox.checked));
    applyDarkMode(checkbox.checked, true);
  });
}

function applyDarkMode(dark: boolean, save = true): void {
  document.body.classList.toggle("dark", dark);
  const logo = document.getElementById("logo") as HTMLImageElement | null;
  if (logo) logo.style.transform = dark ? "rotate(180deg)" : "rotate(0deg)";
  setTimeout(ColorPicker, 0);
  if (save) {
    fetch("/user/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ darkMode: dark }),
    });
  }
}

export { initTheme, applyTheme, initBgToggle, initDarkMode, ColorPicker };
