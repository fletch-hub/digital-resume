import gsap from "gsap";
export default async (titleId = "", titleArr = [""], delay = 1) => {
	const reducedMotion = window.reducedMotion ?? false;

	const title = document.querySelector(titleId);

	const titleElsArr = [];

	if (!title) return console.error("Title element not found");

	const populateHorizTitles = async () => {
		for (let i = 0; i < titleArr.length; i++) {
			const newTitleEl = document.createElement("p");
			newTitleEl.innerHTML = titleArr[i];
			newTitleEl.classList.add("title");
			title.appendChild(newTitleEl);
			titleElsArr.push(newTitleEl);
			if (i === 0) {
				newTitleEl.classList.add("active");
			} else {
				newTitleEl.classList.add("inactive");
			}
		}
	};

	const exitDown = (el) => {
		const tl = gsap.timeline();
		tl.to(el, {
			y: reducedMotion ? 0 : 20,
			opacity: 0,
			delay,
			duration: 0.5,
			ease: "power4.out",
		});
		tl.to(
			el.nextElementSibling,
			{
				opacity: 1,
			},
			"<",
		);
	};

	const getWidthOfFirstEl = (firstEl) => {
		const firstElMargin = parseInt(window.getComputedStyle(firstEl).marginRight);
		return firstEl.getBoundingClientRect().width + firstElMargin;
	};

	const animateTitles = () => {
		let firstEl = title.querySelector("p");
		let firstElWidth = getWidthOfFirstEl(firstEl);
		const rebind = () => {
			firstEl = title.querySelector("p");
			firstEl.classList.add("active");
			firstEl.classList.remove("inactive");
			firstElWidth = getWidthOfFirstEl(firstEl);
		};

		const tl = gsap.timeline({
			repeat: -1,
			onStart: () => {
				gsap.to(titleElsArr.slice(1), { opacity: 0.25 });
				gsap.set(firstEl, { opacity: 1 });

				firstElWidth = getWidthOfFirstEl(firstEl);
				exitDown(firstEl);
			},
			onRepeat: () => {
				tl.invalidate();
				rebind();
				exitDown(firstEl);
			},
		});
		tl.fromTo(
			titleElsArr,
			{ x: 0, y: 0 },
			{
				x: () => firstElWidth * -1,
				duration: reducedMotion ? 2.5 : 1.5,
				delay: delay - 0.25,
				ease: "power4.inOut",
				onComplete: () => {
					firstEl = title.querySelector("p");
					firstEl.classList.remove("active");
					firstEl.classList.add("inactive");
					firstEl.remove();
					gsap.set(firstEl, { opacity: 0.25 });
					title.appendChild(firstEl);
				},
			},
		);
	};

	await populateHorizTitles();
	setTimeout(() => animateTitles(), 1000);
};
