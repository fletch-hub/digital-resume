import "../hammer.min.js";

export class PhoneWrapper extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this._onTogglePlay = this._onTogglePlay.bind(this);

		this.gsap = null; // this will be set externally
		this.hammer = null;
	}

	static get observedAttributes() {
		return ["src"];
	}

	connectedCallback() {
		this.render();
		if (window.Hammer) {
			const wrapper = this.shadowRoot.querySelector(".phoneWrapper");
			if (wrapper) {
				this.hammer = new window.Hammer(wrapper);
				this.hammer.get("swipe").set({ direction: window.Hammer.DIRECTION_HORIZONTAL });

				this.hammer.on("swipeleft", () => {
					this._dispatchRequestScroll("right");
				});
				this.hammer.on("swiperight", () => {
					this._dispatchRequestScroll("left");
				});
			}
		}
	}

	disconnectedCallback() {
		this._cleanup();
		if (this.hammer) {
			this.hammer.destroy();
			this.hammer = null;
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "src" && oldValue !== newValue) {
			this.render();
		}
	}

	render() {
		const src = this.getAttribute("src") || "";
		this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; position: relative; }
                .playBtn { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; cursor: pointer; }
                button { font-family: inherit; border: none; background: transparent; color: white; opacity: 0.8; transition: opacity 0.3s; font-size: 5rem; }
                button:hover { opacity: 1; }
                video { width: 100%; height: auto; display: block; }
            </style>

			<div class="phoneWrapper">
				<div class="playBtn">
					<button>&#9658;</button>
				</div>
				<video muted playsinline>
					<source src="${src}" type="video/mp4">
					Your browser does not support the video tag.
				</video>
			</div>
			
        `;

		this.video = this.shadowRoot.querySelector("video");
		this.playBtn = this.shadowRoot.querySelector(".playBtn");
		this.playBtn.addEventListener("click", this._onTogglePlay);
		this.video.addEventListener("click", this._onTogglePlay);
	}

	_cleanup() {
		if (this.playBtn) this.playBtn.removeEventListener("click", this._onTogglePlay);
		if (this.video) this.video.removeEventListener("click", this._onTogglePlay);
		if (this.hammer) {
			this.hammer.off("swipeleft");
			this.hammer.off("swiperight");
		}
	}

	_onTogglePlay(e) {
		e.stopPropagation();
		if (!this.video) return;
		if (!this.classList.contains("active")) {
			// emit a custom event to notify parent components, dont prevent bubbling
			this._dispatchRequestScroll(this.classList.contains("left") ? "left" : "right");
		} else {
			if (this.video.paused) {
				this.video.play();
				this.playBtn.style.display = "none";
			} else {
				this.video.pause();
				this.playBtn.style.display = "flex";
			}
		}
	}

	_dispatchRequestScroll(direction) {
		this.dispatchEvent(
			new CustomEvent("requestScroll", {
				bubbles: true,
				composed: true,
				detail: { direction },
			}),
		);
	}

	pause() {
		if (this.video) {
			this.video.pause();
			this.playBtn.style.display = "flex";
		}
	}

	animateIn(opts = {}) {
		const duration = opts.duration || 0.5;
		const opacity = opts.opacity || 1;

		return new Promise((resolve) => {
			if (this.gsap) {
				this.gsap.from(this, { onComplete: resolve, duration, opacity, ...opts });
			} else {
				this.style.opacity = "0";
				this.style.transition = `all ${duration}s`;
				this.style.opacity = opacity.toString();
				setTimeout(resolve, duration * 1000);
			}
		});
	}

	animateOut(opts = {}) {
		const duration = opts.duration || 0.5;
		const opacity = opts.opacity || 0;

		return new Promise((resolve) => {
			if (this.gsap) {
				this.gsap.to(this, {
					onComplete: () => {
						this.remove();
						resolve();
					},
					duration,
					opacity,
					...opts,
				});
			} else {
				this.style.transition = `all ${duration}s`;
				this.style.opacity = "0";
				setTimeout(resolve, duration * 1000);
			}
		});
	}
}

if (!customElements.get("phone-wrapper")) {
	customElements.define("phone-wrapper", PhoneWrapper);
}
