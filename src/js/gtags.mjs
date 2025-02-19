export const navigated = (navSelector) => {
  gtag("event", `navMenu_${navSelector}`, {
    event_category: "User Interaction",
    event_label: "Page Navigation",
  });
};

export const shared = () => {
  gtag("event", "Share URL Copied", {
    event_category: "User Interaction",
    event_label: "Shared",
  });
};

export const tabOpened = (tabSelector) => {
  gtag("event", `tabOpened_${tabSelector}`, {
    event_category: "User Interaction",
    event_label: "Tab Opened",
  });
};

export const linkedIn = () => {
  gtag("event", "linkedin_clicked", {
    event_category: "User Interaction",
    event_label: "LinkedIn Clicked",
  });
};

export const github = () => {
  gtag("event", "github_clicked", {
    event_category: "User Interaction",
    event_label: "GitHub Clicked",
  });
};

export const toggledTheme = () => {
  if (window.themeToggled === "true") return;
  window.themeToggled = "true";
  gtag("event", "theme_toggled", {
    event_category: "User Interaction",
    event_label: "Theme Toggled",
  });
};

export const detectScheme = () => {
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  gtag("set", "user_properties", {
    color_scheme: prefersDark ? "dark" : "light",
  });
};

export const detectMotion = () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  window.reducedMotion = reducedMotion.matches;
  reducedMotion.addEventListener("change", () => {
    window.reducedMotion = reducedMotion.matches;
  });

  gtag("set", "user_properties", {
    reduced_motion: window.reducedMotion ? "true" : "false",
  });
};
