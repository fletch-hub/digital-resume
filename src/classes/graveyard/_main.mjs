import Util from "./classes/_util.mjs";
import Contact from "./classes/_contact.mjs";

export default class Main extends Util {
	constructor() {
		super();
	}

	init() {
		document.addEventListener("DOMContentLoaded", async () => {
			this.hideLoader();

			this.gsap.header();
			this.darkMode();
			this.contact = new Contact();
		});
	}
}
