import "../hammer.min.js";

export class FullWrapper extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this._onClick = this._onClick.bind(this);

		this.gsap = null; // set externally
		this.hammer = null;
		this.fullWrapper = null;
	}

	static get observedAttributes() {
		return ["src", "alt"];
	}

	connectedCallback() {
		this.render();
		if (window.Hammer) {
			const wrapper = this.shadowRoot.querySelector(".fullWrapper");
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
		if (oldValue !== newValue) {
			this.render();
		}
	}

	render() {
		this._cleanup();

		const src = this.getAttribute("src") || "";
		const alt = this.getAttribute("alt") || "";

		this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; position: relative; cursor: pointer; }
                .fullWrapper { position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden; border-radius: 2rem; }
                img { display: block; height: 100%; width: auto; max-height: 100%; max-width: 100%; object-fit: contain; }
            </style>

            <div class="fullWrapper">
                <img src="${src}" alt="${alt}" />
            </div>
        `;

		this.fullWrapper = this.shadowRoot.querySelector(".fullWrapper");
		if (this.fullWrapper) {
			this.fullWrapper.addEventListener("click", this._onClick);
		}
	}

	_cleanup() {
		if (this.fullWrapper) {
			this.fullWrapper.removeEventListener("click", this._onClick);
		}
		if (this.hammer) {
			this.hammer.off("swipeleft");
			this.hammer.off("swiperight");
		}
	}

	_onClick(e) {
		e.stopPropagation();
		if (!this.classList.contains("active")) {
			const direction = this.classList.contains("left") ? "left" : "right";
			this._dispatchRequestScroll(direction);
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

if (!customElements.get("full-wrapper")) {
	customElements.define("full-wrapper", FullWrapper);
}
