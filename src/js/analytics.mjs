/* global gtag */

export class Analytics {
	// add a small delay to allow the event to be tracked before the link opens
	navtag(e, delay = 200) {
		const tagLabel = e.currentTarget.getAttribute("data-track");
		if (tagLabel) {
			gtag("event", tagLabel, {
				event_category: "User Interaction",
				event_label: "External Link Clicked",
			});
		}
		const href = e.currentTarget?.href || e.target?.href;
		if (href) {
			setTimeout(() => {
				window.open(href, "_blank");
			}, delay);
		}
	}

	navigated(navSelector) {
		gtag("event", `navMenu_${navSelector}`, {
			event_category: "User Interaction",
			event_label: "Page Navigation",
		});
	}

	shared() {
		gtag("event", "Share URL Copied", {
			event_category: "User Interaction",
			event_label: "Shared",
		});
	}

	infoOpened() {
		gtag("event", "infoOpened", {
			event_category: "User Interaction",
			event_label: "Info Opened",
		});
	}

	tabOpened(tabSelector) {
		gtag("event", `tabOpened_${tabSelector}`, {
			event_category: "User Interaction",
			event_label: "Tab Opened",
		});
	}

	toggledTheme() {
		if (window.themeToggled === "true") return;
		window.themeToggled = "true";
		gtag("event", "theme_toggled", {
			event_category: "User Interaction",
			event_label: "Theme Toggled",
		});
	}

	detectScheme() {
		const prefersDark =
			window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

		gtag("set", "user_properties", {
			color_scheme: prefersDark ? "dark" : "light",
		});
	}

	detectMotion() {
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		window.reducedMotion = reducedMotion.matches;
		reducedMotion.addEventListener("change", () => {
			window.reducedMotion = reducedMotion.matches;
		});

		gtag("set", "user_properties", {
			reduced_motion: window.reducedMotion ? "true" : "false",
		});
	}

	error(err, description) {
		gtag("event", description, {
			event_category: "Error",
			event_label: err,
		});
	}

	init() {
		this.detectScheme();
		this.detectMotion();
	}
}
