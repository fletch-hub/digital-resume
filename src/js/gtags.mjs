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
