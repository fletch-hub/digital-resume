export class UX {
	constructor(analytics, animations) {
		this.analytics = analytics;
		this.animations = animations;

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
}
