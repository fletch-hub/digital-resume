import { PhoneWrapper } from "./components/phoneWrapper.mjs";

export class UX {
	constructor(analytics, animations) {
		this.analytics = analytics;
		this.animations = animations;

		this.gsap = animations.gsap;

		this.activeCarouselPhoneWrapperEl = null; // DOM element of the currently active phone wrapper in the FOMO modal carousel
		this.activeCarouselIndex = 0; // index of the currently active video in the FOMO modal carousel

		this.accordionsArr = [
			{ trayId: "#coverLetter", toggleId: "#coverLetterToggle", caretId: "#coverLetterCaret" },
			{ trayId: "#toolset", toggleId: "#toolsetToggle", caretId: "#toolsetCaret" },
			{ trayId: "#experience", toggleId: "#experienceToggle", caretId: "#experienceCaret" },
			{ trayId: "#summary", toggleId: "#summaryToggle", caretId: "#summaryCaret" },
			{ trayId: "#portfolio", toggleId: "#portfolioToggle", caretId: "#portfolioCaret" },
		];
	}

	init() {
		this.setupDarkModeToggle();
		//this.setupAccordions();
		this.setupNav();
		this.setupModals();
		this.setupClipboard();
		this.setupContactForm();
		this.setupExternalLinks();
		this.setupFomoModal();

		//open the summary tab on load
		// const summarySection = document.querySelector("#summary");
		// const summarySectionCaret = document.querySelector("#summaryCaret");
		// const isCollapsed = summarySection.getAttribute("data-collapsed");
		// setTimeout(
		// 	() =>
		// 		this.animations.toggleAccordion(summarySection, summarySectionCaret, isCollapsed, {
		// 			tracking: false,
		// 		}),
		// 	100,
		// );
	}

	setupDarkModeToggle() {
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
			body.classList.remove("dark");
		}

		toggle.addEventListener("change", () => {
			const isDark = toggle.checked;
			if (isDark) {
				body.classList.add("dark");
				localStorage.setItem("theme", "dark");
			} else {
				body.classList.remove("dark");
				localStorage.setItem("theme", "light");
			}

			this.analytics.toggledTheme();
		});
	}

	setupAccordions() {
		this.accordionsArr.forEach((acc) => {
			const tray = document.querySelector(acc.trayId);
			const toggler = document.querySelector(acc.toggleId);
			const caret = document.querySelector(acc.caretId);

			const collapsed = tray.getAttribute("data-collapsed");
			if (collapsed === "false") {
				caret.style.transform = "rotate(180deg)";
			} else {
				tray.style.height = this.animations.collapsedAccordionHeight;
			}

			toggler.addEventListener("click", () => {
				const isCollapsed = tray.getAttribute("data-collapsed") === "true";
				this.animations.toggleAccordion(tray, caret, isCollapsed, {
					onTabOpened: (trayId) => {
						this.analytics.tabOpened(trayId);
					},
				});
			});

			let resizeTimeout;
			const resizeObserver = new ResizeObserver(() => {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(() => {
					this.animations.refreshScrollTrigger();
				}, 300);
			});

			resizeObserver.observe(tray);
		});
	}

	setupNav() {
		const navMenuToggler = document.querySelector("#hamburgerBtn");
		const navMenu = document.querySelector("#menuWrap");
		const navShade = document.querySelector("#navShade");
		const linkedInBtn = document.querySelector("#linkedInBtn");
		const reducedMotion = window.reducedMotion ?? false;

		navMenuToggler.addEventListener("click", () => {
			const isClosed = navMenu.getAttribute("data-collapsed") === "true";
			this.animations.toggleNavMenu(navMenu, navShade, isClosed);
		});

		linkedInBtn.addEventListener("click", () => {
			this.analytics.linkedIn();
		});

		document.addEventListener("click", (e) => {
			if (e.target !== navMenuToggler) {
				const isClosed = navMenu.getAttribute("data-collapsed") === "true";
				if (!isClosed) {
					this.animations.toggleNavMenu(navMenu, navShade, isClosed);
				}
			}
		});

		const navLinks = document.querySelectorAll("[data-nav-link]");
		navLinks.forEach((link) => {
			link.addEventListener("click", (e) => {
				e.preventDefault();
				const navSelector = link.getAttribute("data-nav-link");
				const scrollToEl = document.querySelector(navSelector);

				const mainWrap = document.querySelector("#mainWrap");

				this.analytics.navigated(navSelector);

				const caret = scrollToEl.querySelector("[id$='Caret']");

				const isCollapsed = scrollToEl.getAttribute("data-collapsed") === "true";
				if (isCollapsed) {
					this.animations.toggleAccordion(scrollToEl, caret, isCollapsed);
				}

				// Add highlight to the target element
				scrollToEl.classList.add("highlighted");
				setTimeout(() => {
					scrollToEl.classList.remove("highlighted");
				}, 10000);

				const scrollToElY = scrollToEl.getBoundingClientRect().top;
				const nav = document.querySelector("nav");
				const headerHeight = nav.clientHeight + 20;

				const scrollPosition = mainWrap.scrollTop + scrollToElY - headerHeight;

				mainWrap.scrollTo({
					top: scrollPosition,
					left: 0,
					behavior: reducedMotion ? "instant" : "smooth",
				});
			});
		});
	}

	setupModals() {
		const shareBtn = document.querySelector("#shareBtn");
		const shareModal = document.querySelector("#shareModal");

		const contactBtn = document.querySelector("#contactBtn");
		const contactModal = document.querySelector("#contactModal");

		const closeModalButtons = document.querySelectorAll(".closeModalBtn");

		const infoBtn = document.querySelector("#infoBtn");
		const infoModal = document.querySelector("#infoModal");
		const githubLinks = infoModal.querySelectorAll(".githubLink");

		const modalWraps = document.querySelectorAll(".modalWrap");

		modalWraps.forEach((modalWrap) => {
			// Close modal if clicked outside of the modal
			modalWrap.addEventListener("click", (e) => {
				if (
					e.target.localName !== "input" &&
					e.target.localName !== "button" &&
					e.target.localName !== "textarea" &&
					!e.target.classList.contains("modalInner") &&
					!e.target.parentElement.classList.contains("modalInner")
				) {
					this.animations.toggleModal(modalWrap);
				}
			});
		});

		shareBtn.addEventListener("click", () => {
			this.animations.toggleModal(shareModal);
		});

		contactBtn.addEventListener("click", () => {
			this.animations.toggleModal(contactModal);
		});

		infoBtn.addEventListener("click", () => {
			this.animations.toggleModal(infoModal);
			this.analytics.infoOpened();
		});

		closeModalButtons.forEach((btn) => {
			btn.addEventListener("click", () => {
				const modal = btn.closest(".modalWrap");
				this.animations.toggleModal(modal);
			});
		});

		githubLinks.forEach((link) => {
			link.addEventListener("click", () => {
				this.analytics.github(link.href);
			});
		});
	}

	showModalMessage(outerModal, innerModal, message, callback) {
		const alertEl = document.createElement("div");
		alertEl.classList.add("modalAlert");
		alertEl.innerHTML = message;
		innerModal.appendChild(alertEl);
		setTimeout(async () => {
			await this.animations.toggleModal(outerModal);
			setTimeout(() => {
				innerModal.removeChild(alertEl);
			}, 1000);
		}, 3000);
		if (callback && typeof callback === "function") {
			callback();
		}
	}

	async copyToClipboard(shareModal, innerShareModal, inputEl) {
		const url = inputEl.value;
		inputEl.select();
		inputEl.setSelectionRange(0, 99999);

		try {
			await navigator.clipboard.writeText(url);
			this.showModalMessage(shareModal, innerShareModal, "<p>Copied!</p>", () => {
				this.analytics.shared();
			});
		} catch (err) {
			this.showModalMessage(shareModal, innerShareModal, "<p>Failed to copy to clipboard</p>", () => {
				this.analytics.error(err, "Clipboard failed to copy");
			});
		}
	}

	setupClipboard() {
		const shareModal = document.querySelector("#shareModal");
		const innerShareModal = shareModal.querySelector(".modalInner");
		const copyBtn = shareModal.querySelector("#copyLink");
		const urlInput = shareModal.querySelector("#shareLink");

		copyBtn.addEventListener("click", () => {
			this.copyToClipboard(shareModal, innerShareModal, urlInput);
		});
	}

	setupContactForm() {
		const contactModal = document.querySelector("#contactModal");
		const innerContactModal = contactModal.querySelector(".modalInner");
		const contactForm = document.querySelector("#contactForm");
		contactForm.addEventListener("submit", async (e) => {
			e.preventDefault();

			const formData = new FormData(contactForm);
			try {
				await fetch("/", {
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: new URLSearchParams(formData).toString(),
				});
				this.showModalMessage(
					contactModal,
					innerContactModal,
					"<p>Submitted!<br/>Thanks for reaching out.</p>",
				);
				contactForm.reset();
			} catch (err) {
				this.showModalMessage(
					contactModal,
					innerContactModal,
					"<p>There was an error submitting your message. I've been alerted and will investigate the problem. Please try again later.</p>",
					() => {
						this.analytics.error(err, "Contact form failed to submit");
					},
				);
			}
		});
	}

	setupExternalLinks() {
		const externalLinks = document.querySelectorAll("a[href^='http']");
		externalLinks.forEach((link) => {
			link.addEventListener("click", (e) => {
				e.preventDefault();
				this.analytics.navtag(e);
			});
		});
	}

	// setupFomoCarousel() {
	// 	const carouselInnerWrapper = document.querySelector("#fomoCarouselInner");
	// 	const playButtons = carouselInnerWrapper.querySelectorAll(".playBtn");
	// 	const videos = carouselInnerWrapper.querySelectorAll("video");

	// 	const numberOfPhones = videos.length;
	// 	let currentIndex = 0;

	// 	const leftArrowBtn = document.querySelector("#fomoLeftArrow");
	// 	const rightArrowBtn = document.querySelector("#fomoRightArrow");

	// 	const phoneWrappers = Array.from(carouselInnerWrapper.querySelectorAll(".phoneWrapper"));
	// 	const firstPhoneWrapper = phoneWrappers[0];
	// 	firstPhoneWrapper.classList.add("active");

	// 	// measurement vars – updated by updateMetrics()
	// 	let widthOfPhoneWrapper;
	// 	let phoneWrapperGap;
	// 	let widthOfMainCarouselWrapper;
	// 	let centreOffset;

	// 	// recompute anything that can change on resize
	// 	const updateMetrics = async () => {
	// 		await new Promise((resolve) => setTimeout(resolve, 250));
	// 		// use bounding‑rect so we keep sub‑pixel values
	// 		widthOfPhoneWrapper = parseFloat(getComputedStyle(firstPhoneWrapper).width);
	// 		phoneWrapperGap = parseFloat(getComputedStyle(carouselInnerWrapper).gap) || 0;
	// 		widthOfMainCarouselWrapper = parseFloat(
	// 			getComputedStyle(carouselInnerWrapper.parentElement).width,
	// 		);
	// 		centreOffset = (widthOfMainCarouselWrapper - widthOfPhoneWrapper) / 2;
	// 	};

	// 	const scrollToIndex = async (index) => {
	// 		await updateMetrics(); // make sure the maths use current dimensions
	// 		const xForIndex = (index) => centreOffset - index * (widthOfPhoneWrapper + phoneWrapperGap);
	// 		this.gsap.to(carouselInnerWrapper, {
	// 			x: xForIndex(index),
	// 			duration: 1,
	// 			ease: "power4.inOut",
	// 		});
	// 	};

	// 	scrollToIndex(currentIndex); // position on load

	// 	const pauseOtherVideos = () => {
	// 		videos.forEach((video, idx) => {
	// 			video.pause();
	// 			playButtons[idx].style.display = "flex";
	// 		});
	// 	};

	// 	const onResize = () => {
	// 		scrollToIndex(currentIndex);
	// 	};

	// 	window.addEventListener("resize", onResize);

	// 	const scrollOnClick = (direction) => {
	// 		currentIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
	// 		if (currentIndex < 0) {
	// 			currentIndex = numberOfPhones - 1;
	// 		} else if (currentIndex >= numberOfPhones) {
	// 			currentIndex = 0;
	// 		}

	// 		phoneWrappers.forEach((wrapper, idx) => {
	// 			wrapper.classList.toggle("active", idx === currentIndex);
	// 		});

	// 		scrollToIndex(currentIndex);
	// 		pauseOtherVideos();
	// 	};

	// 	videos.forEach((video, index) => {
	// 		video.addEventListener("click", () => {
	// 			const playBtn = playButtons[index];
	// 			if (video.paused) {
	// 				video.play();
	// 				playBtn.style.display = "none";
	// 			} else {
	// 				video.pause();
	// 				playBtn.style.display = "flex";
	// 			}
	// 		});
	// 	});

	// 	leftArrowBtn.addEventListener("click", () => scrollOnClick("left"));
	// 	rightArrowBtn.addEventListener("click", () => scrollOnClick("right"));
	// }

	setupFomoModal() {
		const videos = [
			"/portfolio/social/aurora_10s_1.mp4",
			"/portfolio/social/clouds_10s_1.mp4",
			"/portfolio/social/heartbeat_10s_1.mp4",
			"/portfolio/social/inky_15s_1.mp4",
			"/portfolio/social/crowd1_13s_1.mp4",
		];
		const carouselInnerWrapper = document.querySelector("#fomoCarouselInner");
		const leftArrowBtn = document.querySelector("#fomoLeftArrow");
		const rightArrowBtn = document.querySelector("#fomoRightArrow");

		let isTransitioning = false;

		const renderVideo = () => {
			const wrapper = document.createElement("phone-wrapper");
			wrapper.gsap = this.gsap;
			wrapper.setAttribute("src", videos[this.activeCarouselIndex]);
			wrapper.classList.add("active");
			carouselInnerWrapper.appendChild(wrapper);
			return wrapper;
		};

		const renderOnDeckVideo = async (index, direction = "right") => {
			const wrapper = document.createElement("phone-wrapper");
			wrapper.gsap = this.gsap;
			wrapper.setAttribute("src", videos[index]);
			wrapper.classList.add(direction, "entering");
			carouselInnerWrapper.appendChild(wrapper);
			await new Promise((resolve) => setTimeout(resolve, 50));
			wrapper.classList.remove("entering");
			return wrapper;
		};

		renderVideo();
		renderOnDeckVideo(
			this.activeCarouselIndex - 1 < 0 ? videos.length - 1 : this.activeCarouselIndex - 1,
			"left",
		);
		renderOnDeckVideo(
			this.activeCarouselIndex + 1 >= videos.length ? 0 : this.activeCarouselIndex + 1,
			"right",
		);

		const scrollOnClick = async (e, direction) => {
			e.stopPropagation();
			if (isTransitioning) return;
			isTransitioning = true;

			const currentlyActiveVideo = carouselInnerWrapper.querySelector(".active");
			if (currentlyActiveVideo) currentlyActiveVideo.pause();
			const outgoingVideo =
				direction === "left"
					? carouselInnerWrapper.querySelector(".right")
					: carouselInnerWrapper.querySelector(".left");
			const nextActiveVideo =
				direction === "left"
					? carouselInnerWrapper.querySelector(".left")
					: carouselInnerWrapper.querySelector(".right");

			outgoingVideo.classList.add("exiting");

			currentlyActiveVideo.classList.remove("active");
			direction === "left"
				? currentlyActiveVideo.classList.add("right")
				: currentlyActiveVideo.classList.add("left");

			nextActiveVideo.classList.remove(direction);
			nextActiveVideo.classList.add("active");

			this.activeCarouselIndex =
				direction === "left" ? this.activeCarouselIndex - 1 : this.activeCarouselIndex + 1;
			if (this.activeCarouselIndex < 0) {
				this.activeCarouselIndex = videos.length - 1;
			} else if (this.activeCarouselIndex >= videos.length) {
				this.activeCarouselIndex = 0;
			}

			await renderOnDeckVideo(
				direction === "left"
					? this.activeCarouselIndex - 1 < 0
						? videos.length - 1
						: this.activeCarouselIndex - 1
					: this.activeCarouselIndex + 1 >= videos.length
						? 0
						: this.activeCarouselIndex + 1,
				direction,
			);

			// give time for the exit animation to play before removing the element from the DOM
			await new Promise((resolve) => setTimeout(resolve, 500));

			isTransitioning = false;
		};

		leftArrowBtn.addEventListener("click", async (e) => {
			await scrollOnClick(e, "left");
			const exitedVideo = carouselInnerWrapper.querySelector(".exiting");
			if (exitedVideo) exitedVideo.remove();
		});
		rightArrowBtn.addEventListener("click", async (e) => {
			await scrollOnClick(e, "right");
			const exitedVideo = carouselInnerWrapper.querySelector(".exiting");
			if (exitedVideo) exitedVideo.remove();
		});
	}
}
