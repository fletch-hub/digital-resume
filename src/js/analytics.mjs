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

	observeViewport() {
		const sections = document.querySelectorAll("section");
		if (!sections.length) return;

		const visibleSections = new WeakMap();

		const sectionViewed = (target) => {
			const sectionId = target.id || "no-id";
			if (sectionId !== "no-id" && target.dataset.collapsed === "true") return;

			gtag("event", "section_viewed", {
				event_category: "Viewport Observation",
				event_label: sectionId,
			});
		};

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					visibleSections.set(entry.target, entry.isIntersecting);

					if (!entry.isIntersecting) return;
					sectionViewed(entry.target);
				});
			},
			{
				threshold: 0.25,
			},
		);

		const mutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "attributes" && mutation.attributeName === "data-collapsed") {
					const target = mutation.target;
					const isVisible = visibleSections.get(target);
					if (isVisible && target.dataset.collapsed !== "true") {
						sectionViewed(target);
					}
				}
			});
		});

		sections.forEach((section) => {
			observer.observe(section);
			mutationObserver.observe(section, {
				attributes: true,
				attributeFilter: ["data-collapsed"],
			});
		});
	}

	urlParams() {
		const params = new URLSearchParams(window.location.search);
		const trafficSource = params.get("src");
		if (trafficSource) {
			gtag("event", "traffic_source", {
				event_category: "User Interaction",
				event_label: trafficSource,
			});
		}
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
		this.urlParams();
		this.observeViewport();
	}
}
