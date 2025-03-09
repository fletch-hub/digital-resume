import GSAP from "./_gsap.mjs";
import Analytics from "./_tags.mjs";

export default class Util {
	constructor() {
		this.gsap = new GSAP();
		this.analytics = new Analytics();
	}

	static async handleToggleModal(modalEl) {
		const navShade = document.querySelector("#navShade");
		const reducedMotion = this.reduceMotion;
		const tl = this.gsap.timeline();
		const duration = reducedMotion ? 0 : 0.5;

		if (modalEl.getAttribute("data-collapsed") === "true") {
			tl.set("nav", { opacity: 0.5, pointerEvents: "none" });
			tl.set(modalEl, { display: "grid" });
			tl.set(navShade, { display: "block" }, "<");
			tl.to(modalEl, {
				opacity: 1,
				duration,
				ease: "power4.out",
			});
			tl.to(
				navShade,
				{
					opacity: 0.75,
					duration,
					ease: "power4.out",
				},
				"<",
			);
			return modalEl.setAttribute("data-collapsed", "false");
		} else {
			tl.to(modalEl, {
				opacity: 0,
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
			tl.to("nav", { opacity: 1, pointerEvents: "all" }, "<");
			tl.set(modalEl, { display: "none", delay: -0.3 });
			tl.set(navShade, { display: "none", opacity: 0 }, "<");
			return modalEl.setAttribute("data-collapsed", "true");
		}
	}

	hideLoader() {
		const loadShade = document.querySelector("#loadShade");
		loadShade.style.display = "none";
	}

	darkMode() {
		const toggle = document.querySelector("#toggleIcon");
		const body = document.querySelector("body");

		let theme = localStorage.getItem("theme");

		if (!theme) {
			theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			localStorage.setItem("theme", theme);
		}

		if (theme === "dark") {
			toggle.checked = true;
			body.classList.add("dark");
		} else {
			toggle.checked = false;
		}

		const toggleTheme = () => {
			const isChecked = toggle.checked;

			if (isChecked) {
				body.classList.add("dark");
				localStorage.setItem("theme", "dark");
			} else {
				body.classList.remove("dark");
				localStorage.setItem("theme", "light");
			}
		};

		toggle.addEventListener("change", toggleTheme);
	}
}
