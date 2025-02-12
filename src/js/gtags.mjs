export const navigated = (navSelector) => {
  gtag("event", navSelector, {
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
  gtag("event", tabSelector, {
    event_category: "User Interaction",
    event_label: "Tab Opened",
  });
};

export const linkedIn = () => {
  gtag("event", "Clicked", {
    event_category: "User Interaction",
    event_label: "LinkedIn Clicked",
  });
};
