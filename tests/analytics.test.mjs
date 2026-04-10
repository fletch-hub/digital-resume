/// <reference types="vitest" />
/// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Analytics } from "../src/js/analytics.mjs";

describe("Analytics.observeViewport", () => {
	let originalIntersectionObserver;
	let originalMutationObserver;
	let gtagCalls;
	let intersectionObserverInstance;
	let mutationObserverInstance;

	beforeEach(() => {
		gtagCalls = [];
		global.gtag = vi.fn((...args) => {
			gtagCalls.push(args);
		});

		originalIntersectionObserver = global.IntersectionObserver;
		originalMutationObserver = global.MutationObserver;

		class FakeIntersectionObserver {
			constructor(callback) {
				this.callback = callback;
				intersectionObserverInstance = this;
			}

			observe() {}

			disconnect() {}

			trigger(entries) {
				this.callback(entries);
			}
		}

		class FakeMutationObserver {
			constructor(callback) {
				this.callback = callback;
				mutationObserverInstance = this;
			}

			observe() {}

			disconnect() {}

			trigger(mutations) {
				this.callback(mutations);
			}
		}

		global.IntersectionObserver = FakeIntersectionObserver;
		global.MutationObserver = FakeMutationObserver;

		document.body.innerHTML = `
      <section id="one" data-collapsed="false"></section>
      <section id="two" data-collapsed="true"></section>
      <section></section>
    `;
	});

	afterEach(() => {
		global.IntersectionObserver = originalIntersectionObserver;
		global.MutationObserver = originalMutationObserver;
		vi.restoreAllMocks();
		document.body.innerHTML = "";
	});

	it("tracks visible, non-collapsed sections and re-tracks when a visible section is expanded", () => {
		const analytics = new Analytics();
		analytics.observeViewport();

		const sections = Array.from(document.querySelectorAll("section"));

		intersectionObserverInstance.trigger([
			{ target: sections[0], isIntersecting: true },
			{ target: sections[1], isIntersecting: true },
			{ target: sections[2], isIntersecting: false },
		]);

		expect(gtagCalls).toEqual([
			["event", "section_viewed", { event_category: "Viewport Observation", event_label: "one" }],
		]);

		sections[1].dataset.collapsed = "false";
		mutationObserverInstance.trigger([
			{
				type: "attributes",
				attributeName: "data-collapsed",
				target: sections[1],
			},
		]);

		expect(gtagCalls).toContainEqual([
			"event",
			"section_viewed",
			{ event_category: "Viewport Observation", event_label: "two" },
		]);
	});
});
