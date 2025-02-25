import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default () => {
	const reducedMotion = window.reducedMotion || false;

	gsap.registerPlugin(ScrollTrigger);

	const summarySection = document.querySelector("#summaryToggle");
	setTimeout(() => summarySection.click(), 100);

	const scrollEls = gsap.utils.toArray(
		".toggler, .job, .role, .highlight, .nested-col p, .portfolioItem, #coverLetter p",
	);

	const toolsetBoxes = gsap.utils.toArray(".toolsetBox");

	const scrollAnim = (el, opts = {}) => {
		gsap.fromTo(
			el,
			{
				y: 10,
				opacity: 0,
			},
			{
				y: 0,
				opacity: 1,
				stagger: 0.2,
				duration: 3,
				ease: "power4.inOut",
				scrollTrigger: {
					scroller: "#mainWrap",
					trigger: el,
					start: "top center",
					end: "bottom 90%",
					scrub: 3,
					...opts,
				},
			},
		);
	};

	if (!reducedMotion) {
		toolsetBoxes.forEach((box) => scrollAnim(box, { end: "+=300", scrub: 1 }));
		scrollEls.forEach((el) => scrollAnim(el));
	}
};
