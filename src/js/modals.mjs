import gsap from "gsap";
import * as gtags from "./gtags.mjs";

import copyToClipboard from "./clipboard.mjs";

export const handleToggleModal = async (modalEl) => {
	const navShade = document.querySelector("#navShade");
	const reducedMotion = window.reducedMotion || false;
	const tl = gsap.timeline();
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
};

export default async () => {
	const shareBtn = document.querySelector("#shareBtn");
	const shareModal = document.querySelector("#shareModal");
	const innerShareModal = shareModal.querySelector(".modalInner");
	const copyBtn = shareModal.querySelector("#copyLink");
	const urlInput = shareModal.querySelector("#shareLink");

	const contactBtn = document.querySelector("#contactBtn");
	const contactModal = document.querySelector("#contactModal");

	const closeModalButtons = document.querySelectorAll(".closeModalBtn");

	const infoBtn = document.querySelector("#infoBtn");
	const infoModal = document.querySelector("#infoModal");
	const githubLinks = infoModal.querySelectorAll(".githubLink");

	const modalWraps = document.querySelectorAll(".modalWrap");

	modalWraps.forEach((modalWrap) => {
		modalWrap.addEventListener("click", (e) => {
			if (
				e.target.localName !== "input" &&
				e.target.localName !== "button" &&
				e.target.localName !== "textarea" &&
				!e.target.classList.contains("modalInner") &&
				!e.target.parentElement.classList.contains("modalInner")
			) {
				handleToggleModal(modalWrap);
			}
		});
	});

	shareBtn.addEventListener("click", () => {
		handleToggleModal(shareModal);
	});
	infoBtn.addEventListener("click", () => {
		handleToggleModal(infoModal);
	});

	copyBtn.addEventListener("click", () => copyToClipboard(shareModal, innerShareModal, urlInput));
	contactBtn.addEventListener("click", () => handleToggleModal(contactModal));

	githubLinks.forEach((link) => {
		link.addEventListener("click", () => gtags.github());
	});

	closeModalButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			const modalEl = btn.closest(".modalWrap");
			handleToggleModal(modalEl);
		});
	});
};
