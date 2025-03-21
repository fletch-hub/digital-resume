import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import accordions from "./js/accordion.mjs";
//import cycleTitle from "./js/cycleTitle.mjs";
import header from "./js/header.mjs";
import nav from "./js/nav.mjs";
import modals from "./js/modals.mjs";
import darkMode from "./js/darkMode.mjs";
import contact from "./js/contact.mjs";
import scrollEffects from "./js/scrollEffects.mjs";
import * as gtags from "./js/gtags.mjs";

const accordionsArr = [
	{
		trayId: "#coverLetter",
		toggleId: "#coverLetterToggle",
		caretId: "#coverLetterCaret",
	},
	{
		trayId: "#toolset",
		toggleId: "#toolsetToggle",
		caretId: "#toolsetCaret",
	},
	{
		trayId: "#experience",
		toggleId: "#experienceToggle",
		caretId: "#experienceCaret",
	},
	{
		trayId: "#summary",
		toggleId: "#summaryToggle",
		caretId: "#summaryCaret",
	},
	{
		trayId: "#portfolio",
		toggleId: "#portfolioToggle",
		caretId: "#portfolioCaret",
	},
];

// const titlesArr = [
// 	"Digital Maker",
// 	"Creative Director",
// 	"Frontend Developer",
// 	"Sr. Art Director",
// 	"Print / Packaging Designer",
// 	"UX / UI Designer",
// 	"Motion Designer",
// 	"Presentation Designer",
// 	"3D Modeler",
// ];

document.addEventListener("DOMContentLoaded", async () => {
	const loadShade = document.querySelector("#loadShade");
	loadShade.style.display = "none";

	gsap.registerPlugin(ScrollTrigger);

	gtags.detectMotion();
	gtags.detectScheme();

	header();

	darkMode();
	contact();
	accordions(ScrollTrigger, accordionsArr);
	//cycleTitle("#headerTitle", titlesArr, 1);
	nav();
	modals();
	scrollEffects();
});
