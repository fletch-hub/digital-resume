import gsap from "gsap";
import { handleToggle } from "./accordion.mjs";
import * as gtags from "./gtags.mjs";

export default async () => {
	const navMenuToggler = document.querySelector("#hamburgerBtn");
	const navMenu = document.querySelector("#navMenu");
	const navShade = document.querySelector("#navShade");
	const linkedInBtn = document.querySelector("#linkedInBtn");
	const reducedMotion = window.reducedMotion || false;

	const handleToggleMenu = () => {
		const tl = gsap.timeline();
		const duration = reducedMotion ? 0 : 0.5;

		if (navMenu.getAttribute("data-collapsed") === "true") {
			tl.set(navMenu, { display: "block" });
			tl.set(navShade, { display: "block", opacity: 0 }, "<");
			tl.to("#navBtnWrap", { opacity: 0.5, pointerEvents: "none" }, "<");
			tl.to(
				navMenu,
				{
					height: "auto",
					duration,
					ease: "power4.out",
				},
				"<",
			);
			tl.to(
				navShade,
				{
					opacity: 0.75,
					duration,
					ease: "power4.out",
				},
				"<",
			);
			navMenu.setAttribute("data-collapsed", "false");
		} else {
			tl.to(navMenu, {
				height: 0,
				duration,
				ease: "power4.out",
			});
			tl.to(
				navShade,
				{
					opacity: 0,
					duration,
					ease: "power4.out",
				},
				"<",
			);
			tl.to("#navBtnWrap", { opacity: 1, pointerEvents: "all" }, "<");
			tl.set(navMenu, { display: "none", delay: -0.3 });
			tl.set(navShade, { display: "none" }, "<");
			navMenu.setAttribute("data-collapsed", "true");
		}
	};

	navMenuToggler.addEventListener("click", handleToggleMenu);
	linkedInBtn.addEventListener("click", () => gtags.linkedIn());

	// close menu on click outside
	document.addEventListener("click", (e) => {
		if (e.target !== navMenuToggler && e.target !== navMenu) {
			if (navMenu.getAttribute("data-collapsed") === "false") {
				handleToggleMenu();
			}
		}
	});
	////

	const navLinks = document.querySelectorAll("[data-nav-link]");

	const handleNavLink = (e) => {
		const link = e.target;
		const navSelector = link.getAttribute("data-nav-link");
		const scrollToEl = document.querySelector(navSelector);
		gtags.navigated(navSelector);
		const scrollToElIsVisible = scrollToEl.getAttribute("data-collapsed") === "false";
		const caret = scrollToEl.querySelector("[id$='Caret']");

		if (scrollToEl) {
			if (!scrollToElIsVisible) {
				handleToggle(scrollToEl, caret);
			}

			const mainWrap = document.querySelector("#mainWrap");
			const linkY = link.getBoundingClientRect().top;
			const scrollToElY = scrollToEl.getBoundingClientRect().top;
			const deltaY = scrollToElY - linkY;

			const scrollUp = deltaY < 0;

			scrollToEl.classList.add("highlight");
			setTimeout(() => {
				scrollToEl.classList.remove("highlight");
			}, 10000);

			mainWrap.scrollBy({
				top: scrollUp ? deltaY - 70 : deltaY,
				left: 0,
				behavior: reducedMotion ? "instant" : "smooth",
			});
		}
	};

	navLinks.forEach((link) => {
		link.addEventListener("click", handleNavLink);
	});
};
