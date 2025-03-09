import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export class Animations {
	constructor() {
		this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ?? false;

		this.scrollEls = gsap.utils.toArray(
			".toggler, .job, .role, .highlight, .nested-col p, .portfolioItem, #coverLetter p",
		);

		this.collapsedAccordionHeight = null;
		this.setCollapsedAccordionHeight = this.setCollapsedAccordionHeight.bind(this);
		this.setCollapsedAccordionHeight();
		window.addEventListener("resize", this.setCollapsedAccordionHeight);

		this.outOfViewElements = new Set();
	}

	setCollapsedAccordionHeight() {
		const toggler = document.querySelector(".toggler");
		const togglerParent = toggler.parentElement;
		const togglerHeight = toggler.clientHeight;
		const parentPadding = parseInt(window.getComputedStyle(togglerParent).paddingTop) * 2;
		this.collapsedAccordionHeight = togglerHeight + parentPadding + "px";
		return this.collapsedAccordionHeight;
	}

	animateHeader() {
		const headerEl = document.querySelector("#headerBg");
		const headShot = document.querySelector("#headshot");

		const tl = gsap.timeline();
		const duration = this.reducedMotion ? 0 : 2;
		tl.fromTo(
			headerEl,
			{
				scaleX: 0,
				opacity: 1,

				transformOrigin: "left",
			},
			{
				duration,
				opacity: 1,
				scaleX: 1,
				ease: "power4.inOut",
			},
		);
		tl.fromTo(
			"header h1, header h4",
			{
				opacity: 0,
				y: 30,
			},
			{
				delay: 0.5,
				duration: 1.5,
				opacity: 1,
				y: 0,
				ease: "power2.out",
				stagger: 0.25,
			},
			"<",
		);
		tl.fromTo(
			headShot,
			{
				opacity: 0,
				y: 20,
			},
			{
				delay: 1,
				duration: 1.5,
				opacity: 1,
				y: 0,
				ease: "power2.out",
				stagger: 0.25,
			},
			"<",
		);
		tl.to(
			headerEl,
			{
				borderRadius: "1rem",
				duration: 1,
				ease: "power2.out",
			},
			"<",
		);
	}

	toggleNavMenu(navMenu, navShade, isClosed) {
		const innerMenu = navMenu.querySelector("#navMenu");
		const tl = gsap.timeline();
		const duration = this.reducedMotion ? 0 : 0.5;

		if (isClosed) {
			tl.set(navMenu, { display: "grid" });
			tl.set(navShade, { display: "block", opacity: 0 }, "<");
			tl.to("#navBtnWrap", { opacity: 0.5, pointerEvents: "none" }, "<");
			tl.to(
				innerMenu,
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
			tl.to(innerMenu, {
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
	}

	toggleAccordion(tray, caret, isClosed, opts = {}) {
		const reducedMotion = window.reducedMotion ?? false;

		const onTabOpened = opts.onTabOpened ?? null;

		const tl = gsap.timeline();

		const duration = reducedMotion ? 0 : 0.5;

		if (isClosed) {
			tl.to(tray, {
				height: "auto",
				duration,
				ease: "power2.inOut",
			});
			tl.to(caret, { rotate: 180, duration }, "<");
			tl.set(tray, { overflow: "visible" });
			tray.setAttribute("data-collapsed", false);
			if (onTabOpened) {
				onTabOpened(tray.id.toString());
			}
		} else {
			tl.set(tray, { overflow: "hidden" });
			tl.to(tray, {
				height: this.collapsedAccordionHeight,
				duration,
				ease: "power2.inOut",
			});
			tl.to(caret, { rotate: 0, duration }, "<");
			tray.setAttribute("data-collapsed", true);
		}
	}

	async toggleModal(modalEl) {
		const navShade = document.querySelector("#navShade");
		const reducedMotion = window.reducedMotion ?? false;
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
	}

	nestedPillAnimation(el, scrollOpts) {
		const pills = el.querySelectorAll(".pillWrap p, .app-icon-wrap img");
		const tl = gsap.timeline({
			scrollTrigger: {
				...scrollOpts,
				scrub: 3,
			},
		});
		tl.fromTo(
			pills,
			{ y: 20, opacity: 0 },
			{
				delay: 3,
				y: 0,
				opacity: 1,
				duration: 2,
				ease: "power2.inOut",
				stagger: 0.5,
			},
		);
		return tl;
	}

	mainScrollAnimation(el, opts = {}) {
		const nestedAnimation = opts.nestedAnimation || false;

		const scrollOpts = {
			scroller: "#mainWrap",
			trigger: el,
			start: "top 90%",
			end: "bottom 110%",
			scrub: 1,
			...opts,
		};

		const tl = gsap.timeline({
			scrollTrigger: scrollOpts,
		});

		tl.fromTo(
			el,
			{
				y: 10,
				opacity: 0,
			},
			{
				y: 0,
				opacity: 1,
				stagger: 0.3,
				duration: 3,
				ease: "power2.inOut",
			},
		);

		if (nestedAnimation) {
			tl.add(this.nestedPillAnimation(el, scrollOpts), "<");
		}
	}

	animateOnScroll() {
		if (this.reducedMotion) {
			return;
		}

		const toolsetBoxes = gsap.utils.toArray(".toolsetBox");
		toolsetBoxes.forEach((el) =>
			this.mainScrollAnimation(el, { end: "+=300", scrub: 1, nestedAnimation: true }),
		);
		this.scrollEls.forEach((el) => this.mainScrollAnimation(el));
	}

	isElementInViewport(el) {
		const rect = el.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}

	refreshScrollTrigger() {
		ScrollTrigger.refresh();
	}

	init() {
		gsap.registerPlugin(ScrollTrigger);
		this.animateHeader();
		this.animateOnScroll();
	}
}
