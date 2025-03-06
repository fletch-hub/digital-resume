import gsap from "gsap";

export default () => {
	const reducedMotion = window.reducedMotion ?? false;

	const headerEl = document.querySelector("#headerBg");
	const headShot = document.querySelector("#headshot");

	const tl = gsap.timeline();
	const duration = reducedMotion ? 0 : 2;
	tl.fromTo(
		headerEl,
		{
			scaleX: 0,
			opacity: 1,
			transformOrigin: "left",
		},
		{
			duration,
			opacity: 1,
			scaleX: 1,
			ease: "power4.inOut",
		},
	);
	tl.fromTo(
		"header h1, header h4",
		{
			opacity: 0,
			y: 30,
		},
		{
			duration: 1.5,
			opacity: 1,
			y: 0,
			ease: "power2.out",
			stagger: 0.25,
		},
		"<",
	);
	tl.fromTo(
		headShot,
		{
			opacity: 0,
			y: 20,
		},
		{
			delay: 1,
			duration: 1.5,
			opacity: 1,
			y: 0,
			ease: "power2.out",
			stagger: 0.25,
		},
		"<",
	);
};
