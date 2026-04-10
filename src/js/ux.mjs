import "./components/phoneWrapper.mjs";
import "./components/fullWrapper.mjs";

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
		this.setupAccordions();
		this.setupNav();
		this.setupModals();
		this.setupClipboard();
		this.setupContactForm();
		this.setupExternalLinks();

		this.setupFomoModal();
		this.setupMagazineModal();
		this.setupSurfaceModal();

		//open the summary tab on load
		const summarySection = document.querySelector("#summary");
		const summarySectionCaret = document.querySelector("#summaryCaret");
		const isCollapsed = summarySection.getAttribute("data-collapsed");
		setTimeout(
			() =>
				this.animations.toggleAccordion(summarySection, summarySectionCaret, isCollapsed, {
					tracking: false,
				}),
			100,
		);
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
		const linkedInBtn = document.querySelector("#linkedInBtn");
		const navBtnWrap = document.querySelector("#navBtnWrap");
		const reducedMotion = window.reducedMotion ?? false;

		navMenuToggler.addEventListener("click", () => {
			this.animations.toggleModal(navMenu, {
				inner: navMenu.querySelector("#navMenu"),
				dimTarget: navBtnWrap,
			});
		});

		linkedInBtn.addEventListener("click", () => {
			this.analytics.linkedIn();
		});

		document.addEventListener("click", (e) => {
			if (e.target !== navMenuToggler) {
				if (navMenu.getAttribute("data-collapsed") === "false") {
					this.animations.toggleModal(navMenu, {
						inner: navMenu.querySelector("#navMenu"),
						dimTarget: navBtnWrap,
					});
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

		const portfolioItemBanners = document.querySelectorAll(".portfolioItemBanner");
		portfolioItemBanners.forEach((banner) => {
			banner.addEventListener("click", () => {
				const modalId = banner.getAttribute("data-modal-content");
				if (!modalId) return;
				const modal = document.querySelector(`#${modalId}`);
				this.animations.toggleModal(modal);
				this.analytics.portfolioItemOpened(modalId);
			});
		});

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
				// pause any playing videos when a modal is closed
				modal.querySelectorAll("phone-wrapper").forEach((wrapper) => {
					if (typeof wrapper.pause === "function") {
						wrapper.pause();
					}
				});
			});
		});

		githubLinks.forEach((link) => {
			link.addEventListener("click", () => {
				this.analytics.github(link.href);
			});
		});

		const modalLinks = document.querySelectorAll("a[data-modal-content]");
		modalLinks.forEach((link) => {
			link.addEventListener("click", (event) => {
				event.preventDefault();
				const modalId = link.dataset.modalContent;
				const modalEl = document.getElementById(modalId);
				if (modalEl) {
					this.animations.toggleModal(modalEl);
				}
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

	setupFomoModal() {
		const videos = [
			{
				src: "/portfolio/social/aurora_10s_1.mp4",
				poster: "/portfolio/social/stills/aurora_10s_1000.jpg",
			},
			{
				src: "/portfolio/social/clouds_10s_1.mp4",
				poster: "/portfolio/social/stills/clouds_10s_1000.jpg",
			},
			{
				src: "/portfolio/social/heartbeat_10s_1.mp4",
				poster: "/portfolio/social/stills/heartbeat_10s_1000.jpg",
			},
			{
				src: "/portfolio/social/inky_15s_1.mp4",
				poster: "/portfolio/social/stills/inky_15s_1000.jpg",
			},
			{
				src: "/portfolio/social/crowd1_13s_1.mp4",
				poster: "/portfolio/social/stills/crowd1_13s_1000.jpg",
			},
		];
		const carouselInnerWrapper = document.querySelector("#fomoCarouselInner");
		const leftArrowBtn = document.querySelector("#fomoLeftArrow");
		const rightArrowBtn = document.querySelector("#fomoRightArrow");
		const muteBtn = document.querySelector("#fomoMuteBtn");

		this.isMuted = false;
		let isTransitioning = false;

		const updateMuteIcon = () => {
			muteBtn.innerHTML = this.isMuted ? "&#59215;" : "&#59239;";
		};

		const applyMuteToAll = () => {
			document.querySelectorAll("phone-wrapper").forEach((wrapper) => {
				if (typeof wrapper.setMuted === "function") {
					wrapper.setMuted(this.isMuted);
				}
			});
		};

		muteBtn.addEventListener("click", () => {
			this.isMuted = !this.isMuted;
			updateMuteIcon();
			applyMuteToAll();
		});

		const renderVideo = () => {
			const video = videos[this.activeCarouselIndex];
			const wrapper = document.createElement("phone-wrapper");
			wrapper.gsap = this.gsap;
			wrapper.analytics = this.analytics;
			wrapper.setAttribute("src", video.src);
			wrapper.setAttribute("poster", video.poster);
			wrapper.classList.add("active");
			wrapper.setMuted(this.isMuted);
			carouselInnerWrapper.appendChild(wrapper);
			return wrapper;
		};

		const renderOnDeckVideo = async (index, direction = "right") => {
			const video = videos[index];
			const wrapper = document.createElement("phone-wrapper");
			wrapper.gsap = this.gsap;
			wrapper.analytics = this.analytics;
			wrapper.setAttribute("src", video.src);
			wrapper.setAttribute("poster", video.poster);
			wrapper.classList.add(direction, "entering");
			wrapper.setMuted(this.isMuted);
			carouselInnerWrapper.appendChild(wrapper);
			await new Promise((resolve) => setTimeout(resolve, 20));
			wrapper.classList.remove("entering");
			return wrapper;
		};

		updateMuteIcon();
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

		// listen for custom requestScroll events emitted by the phone wrappers to trigger scrolls when a video is clicked
		document.addEventListener("requestScroll", async (e) => {
			const direction = e.detail.direction;
			await scrollOnClick(e, direction);
			const exitedVideo = carouselInnerWrapper.querySelector(".exiting");
			if (exitedVideo) exitedVideo.remove();
		});

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

	setupMagazineModal() {
		const magazinePages = [
			"/portfolio/magazine/1_afm_cover_apr14.webp",
			"/portfolio/magazine/2_afm_iei_apr14.webp",
			"/portfolio/magazine/3_afm_fashion_jun14_1.webp",
			"/portfolio/magazine/4_afm_fashion_jun14_2.webp",
			"/portfolio/magazine/5_afm_fashion_jun14_4.webp",
		];
		const carouselInnerWrapper = document.querySelector("#magazineCarouselInner");
		const leftArrowBtn = document.querySelector("#magazineLeftArrow");
		const rightArrowBtn = document.querySelector("#magazineRightArrow");

		let activeMagazineIndex = 0;
		let isTransitioning = false;

		const renderImage = (index) => {
			const wrapper = document.createElement("full-wrapper");
			wrapper.gsap = this.gsap;
			wrapper.analytics = this.analytics;
			wrapper.setAttribute("src", magazinePages[index]);
			wrapper.setAttribute("alt", `Magazine page ${index + 1}`);
			wrapper.classList.add("magazinePage", "active");
			carouselInnerWrapper.appendChild(wrapper);
			return wrapper;
		};

		const renderOnDeckImage = async (index, direction = "right") => {
			const wrapper = document.createElement("full-wrapper");
			wrapper.gsap = this.gsap;
			wrapper.analytics = this.analytics;
			wrapper.setAttribute("src", magazinePages[index]);
			wrapper.setAttribute("alt", `Magazine page ${index + 1}`);
			wrapper.classList.add("magazinePage", direction, "entering");
			carouselInnerWrapper.appendChild(wrapper);
			await new Promise((resolve) => setTimeout(resolve, 20));
			wrapper.classList.remove("entering");
			return wrapper;
		};

		const scrollOnClick = async (e, direction) => {
			e.stopPropagation();
			if (isTransitioning) return;
			isTransitioning = true;

			const currentlyActivePage = carouselInnerWrapper.querySelector(".magazinePage.active");
			const outgoingPage =
				direction === "left"
					? carouselInnerWrapper.querySelector(".magazinePage.right")
					: carouselInnerWrapper.querySelector(".magazinePage.left");
			const nextActivePage =
				direction === "left"
					? carouselInnerWrapper.querySelector(".magazinePage.left")
					: carouselInnerWrapper.querySelector(".magazinePage.right");

			if (outgoingPage) outgoingPage.classList.add("exiting");

			if (currentlyActivePage) {
				currentlyActivePage.classList.remove("active");
				currentlyActivePage.classList.add(direction === "left" ? "right" : "left");
			}

			if (nextActivePage) {
				nextActivePage.classList.remove(direction);
				nextActivePage.classList.add("active");
				this.analytics.portfolioInteraction(
					`magazine_page_${direction === "left" ? activeMagazineIndex - 1 : activeMagazineIndex + 1}`,
					"viewed",
				);
			}

			activeMagazineIndex = direction === "left" ? activeMagazineIndex - 1 : activeMagazineIndex + 1;
			if (activeMagazineIndex < 0) {
				activeMagazineIndex = magazinePages.length - 1;
			} else if (activeMagazineIndex >= magazinePages.length) {
				activeMagazineIndex = 0;
			}

			await renderOnDeckImage(
				direction === "left"
					? activeMagazineIndex - 1 < 0
						? magazinePages.length - 1
						: activeMagazineIndex - 1
					: activeMagazineIndex + 1 >= magazinePages.length
						? 0
						: activeMagazineIndex + 1,
				direction,
			);

			await new Promise((resolve) => setTimeout(resolve, 500));

			const exitedPage = carouselInnerWrapper.querySelector(".magazinePage.exiting");
			if (exitedPage) exitedPage.remove();
			isTransitioning = false;
		};

		renderImage(0);
		renderOnDeckImage(magazinePages.length - 1, "left");
		renderOnDeckImage(1, "right");

		document.addEventListener("requestScroll", async (e) => {
			const direction = e.detail.direction;
			await scrollOnClick(e, direction);
			const exitedPage = carouselInnerWrapper.querySelector(".magazinePage.exiting");
			if (exitedPage) exitedPage.remove();
		});

		leftArrowBtn.addEventListener("click", async (e) => {
			await scrollOnClick(e, "left");
			const exitedPage = carouselInnerWrapper.querySelector(".magazinePage.exiting");
			if (exitedPage) exitedPage.remove();
		});

		rightArrowBtn.addEventListener("click", async (e) => {
			await scrollOnClick(e, "right");
			const exitedPage = carouselInnerWrapper.querySelector(".magazinePage.exiting");
			if (exitedPage) exitedPage.remove();
		});
	}

	setupSurfaceModal() {
		const surfacePages = [
			"/portfolio/bd/surf_58.webp",
			"/portfolio/bd/surf_51.webp",
			"/portfolio/bd/surf_52.webp",
			"/portfolio/bd/surf_56.webp",
			"/portfolio/bd/surf_57.webp",
			"/portfolio/bd/surf_05.webp",
		];

		const carouselInnerWrapper = document.querySelector("#surfaceCarouselInner");
		const leftArrowBtn = document.querySelector("#surfaceLeftArrow");
		const rightArrowBtn = document.querySelector("#surfaceRightArrow");

		let activesurfaceIndex = 0;
		let isTransitioning = false;

		const renderImage = (index) => {
			const wrapper = document.createElement("full-wrapper");
			wrapper.gsap = this.gsap;
			wrapper.setAttribute("src", surfacePages[index]);
			wrapper.setAttribute("alt", `surface page ${index + 1}`);
			wrapper.classList.add("surfacePage", "active");
			carouselInnerWrapper.appendChild(wrapper);
			return wrapper;
		};

		const renderOnDeckImage = async (index, direction = "right") => {
			const wrapper = document.createElement("full-wrapper");
			wrapper.gsap = this.gsap;
			wrapper.setAttribute("src", surfacePages[index]);
			wrapper.setAttribute("alt", `surface page ${index + 1}`);
			wrapper.classList.add("surfacePage", direction, "entering");
			carouselInnerWrapper.appendChild(wrapper);
			await new Promise((resolve) => setTimeout(resolve, 20));
			wrapper.classList.remove("entering");
			return wrapper;
		};

		const scrollOnClick = async (e, direction) => {
			e.stopPropagation();
			if (isTransitioning) return;
			isTransitioning = true;

			const currentlyActivePage = carouselInnerWrapper.querySelector(".surfacePage.active");
			const outgoingPage =
				direction === "left"
					? carouselInnerWrapper.querySelector(".surfacePage.right")
					: carouselInnerWrapper.querySelector(".surfacePage.left");
			const nextActivePage =
				direction === "left"
					? carouselInnerWrapper.querySelector(".surfacePage.left")
					: carouselInnerWrapper.querySelector(".surfacePage.right");

			if (outgoingPage) outgoingPage.classList.add("exiting");

			if (currentlyActivePage) {
				currentlyActivePage.classList.remove("active");
				currentlyActivePage.classList.add(direction === "left" ? "right" : "left");
			}

			if (nextActivePage) {
				nextActivePage.classList.remove(direction);
				nextActivePage.classList.add("active");
				this.analytics.portfolioInteraction(
					`magazine_page_${(activesurfaceIndex = direction === "left" ? activesurfaceIndex - 1 : activesurfaceIndex + 1)}`,
					"viewed",
				);
			}

			activesurfaceIndex = direction === "left" ? activesurfaceIndex - 1 : activesurfaceIndex + 1;
			if (activesurfaceIndex < 0) {
				activesurfaceIndex = surfacePages.length - 1;
			} else if (activesurfaceIndex >= surfacePages.length) {
				activesurfaceIndex = 0;
			}

			await renderOnDeckImage(
				direction === "left"
					? activesurfaceIndex - 1 < 0
						? surfacePages.length - 1
						: activesurfaceIndex - 1
					: activesurfaceIndex + 1 >= surfacePages.length
						? 0
						: activesurfaceIndex + 1,
				direction,
			);

			await new Promise((resolve) => setTimeout(resolve, 500));

			const exitedPage = carouselInnerWrapper.querySelector(".surfacePage.exiting");
			if (exitedPage) exitedPage.remove();
			isTransitioning = false;
		};

		renderImage(0);
		renderOnDeckImage(surfacePages.length - 1, "left");
		renderOnDeckImage(1, "right");

		document.addEventListener("requestScroll", async (e) => {
			const direction = e.detail.direction;
			await scrollOnClick(e, direction);
			const exitedPage = carouselInnerWrapper.querySelector(".surfacePage.exiting");
			if (exitedPage) exitedPage.remove();
		});

		leftArrowBtn.addEventListener("click", async (e) => {
			await scrollOnClick(e, "left");
			const exitedPage = carouselInnerWrapper.querySelector(".surfacePage.exiting");
			if (exitedPage) exitedPage.remove();
		});

		rightArrowBtn.addEventListener("click", async (e) => {
			await scrollOnClick(e, "right");
			const exitedPage = carouselInnerWrapper.querySelector(".surfacePage.exiting");
			if (exitedPage) exitedPage.remove();
		});
	}
}
