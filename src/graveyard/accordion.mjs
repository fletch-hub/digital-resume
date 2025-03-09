import gsap from "gsap";
import * as gtags from "./gtags.mjs";

const collapsedTogglerHeight = "90px";

export default (ScrollTrigger, accordionArr = []) => {
	// animate the summary section on load, don't tag it
	const summarySection = document.querySelector("#summary");
	const summarySectionCaret = document.querySelector("#summaryCaret");
	setTimeout(() => handleToggle(summarySection, summarySectionCaret, { tracking: false }), 100);

	accordionArr.map((accordion) => {
		const { trayId, toggleId, caretId } = accordion;

		const tray = document.querySelector(trayId);
		const toggler = document.querySelector(toggleId);
		const caret = document.querySelector(caretId);

		const collapsed = tray.getAttribute("data-collapsed");

		if (collapsed === "false") {
			caret.style.transform = "rotate(180deg)";
		} else {
			tray.style.height = collapsedTogglerHeight;
		}

		toggler.addEventListener("click", () => handleToggle(tray, caret));

		// refresh the ScrollTrigger when the tray is resized so the heights get recalculated

		// debounce it so it doesn't interfere with the scrollBy calculations during navigation from the nav menu

		let resizeTimeout;
		const resizeObserver = new ResizeObserver(() => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				ScrollTrigger.refresh();
			}, 300);
		});

		resizeObserver.observe(tray);
	});
};

export const handleToggle = (tray, caret, opts = {}) => {
	const reducedMotion = window.reducedMotion ?? false;

	const tracking = opts.tracking ?? true;

	const tl = gsap.timeline();

	const duration = reducedMotion ? 0 : 0.5;

	if (tray.getAttribute("data-collapsed") === "true") {
		tl.to(tray, {
			height: "auto",
			duration,
			ease: "power2.inOut",
		});
		tl.to(caret, { rotate: 180, duration }, "<");
		tl.set(tray, { overflow: "visible" });
		tray.setAttribute("data-collapsed", false);
		if (tracking) {
			gtags.tabOpened(tray.id.toString());
		}
	} else {
		tl.set(tray, { overflow: "hidden" });
		tl.to(tray, {
			height: collapsedTogglerHeight,
			duration,
			ease: "power2.inOut",
		});
		tl.to(caret, { rotate: 0, duration }, "<");
		tray.setAttribute("data-collapsed", true);
	}
};
