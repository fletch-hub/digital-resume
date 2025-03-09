/* global gtag */

export default class Analytics {
	constructor() {
		this.themeToggled = false;
	}

	delayNavigation(e, callback, delay = 200) {
		if (e && e.preventDefault) {
			e.preventDefault();

			if (typeof callback === "function") {
				callback();
			}

			setTimeout(() => {
				// Restore default behavior by directly following the link
				if (e.target && e.target.href) {
					window.location.href = e.target.href;
				} else if (e.currentTarget && e.currentTarget.href) {
					window.location.href = e.currentTarget.href;
				}
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

	tabOpened(tabSelector) {
		gtag("event", `tabOpened_${tabSelector}`, {
			event_category: "User Interaction",
			event_label: "Tab Opened",
		});
	}

	linkedIn(e) {
		this.delayNavigation(
			e,
			() => {
				gtag("event", "linkedin_clicked", {
					event_category: "User Interaction",
					event_label: "LinkedIn Clicked",
				});
			},
			200,
		);
	}

	github(e) {
		this.delayNavigation(
			e,
			() => {
				gtag("event", "github_clicked", {
					event_category: "User Interaction",
					event_label: "GitHub Clicked",
				});
			},
			200,
		);
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
