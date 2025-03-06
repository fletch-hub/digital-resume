import gsap from "gsap";

export default () => {
	const reducedMotion = window.reducedMotion ?? false;

	const scrollEls = gsap.utils.toArray(
		".toggler, .job, .role, .highlight, .nested-col p, .portfolioItem, #coverLetter p",
	);

	const toolsetBoxes = gsap.utils.toArray(".toolsetBox");

	//
	const nestedPillAnimation = (el, scrollTrigger) => {
		const pills = el.querySelectorAll(".pillWrap p, .app-icon-wrap img");

		const tl = gsap.timeline({
			scrollTrigger: {
				...scrollTrigger,
				scrub: 3,
			},
		});
		tl.fromTo(
			pills,
			{ y: 20, opacity: 0 },
			{
				delay: 3,
				y: 0,
				opacity: 1,
				duration: 2,
				ease: "power2.inOut",
				stagger: 0.5,
			},
		);
		return tl;
	};
	//

	const scrollAnim = (el, opts = {}) => {
		const nestedAnimation = opts.nestedAnimation || false;

		const scrollTrigger = {
			scroller: "#mainWrap",
			trigger: el,
			start: "top 90%",
			end: "bottom 110%",
			scrub: 1,
			...opts,
		};

		const tl = gsap.timeline({
			scrollTrigger,
		});

		tl.fromTo(
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
			},
		);

		if (nestedAnimation) {
			tl.add(nestedPillAnimation(el, scrollTrigger), "<");
		}
	};

	if (!reducedMotion) {
		toolsetBoxes.forEach((box) => scrollAnim(box, { end: "+=300", scrub: 1, nestedAnimation: true }));
		scrollEls.forEach((el) => scrollAnim(el));
	}
};
