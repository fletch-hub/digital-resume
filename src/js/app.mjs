import { Analytics } from "./analytics.mjs";
import { Animations } from "./animations.mjs";
import { UX } from "./ux.mjs";

export class App {
	constructor() {
		this.analytics = new Analytics();
		this.animations = new Animations();
		this.ux = new UX(this.analytics, this.animations);
	}

	init() {
		const loadShade = document.querySelector("#loadShade");
		loadShade.style.display = "none";
		this.analytics.init();
		this.animations.init();
		this.ux.init();
	}
}
