import gsap from "gsap";

export default () => {
	const reducedMotion = window.reducedMotion || false;

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
				stagger: 0.3,
				duration: 3,
				ease: "power2.inOut",
				scrollTrigger: {
					scroller: "#mainWrap",
					trigger: el,
					start: "top 90%",
					end: "bottom 110%",
					scrub: 1,
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
