export default () => {
	const toggle = document.querySelector("#toggleIcon");
	const body = document.querySelector("body");

	let theme = localStorage.getItem("theme");

	if (!theme) {
		theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		localStorage.setItem("theme", theme);
	}

	if (theme === "dark") {
		toggle.checked = true;
		body.classList.add("dark");
	} else {
		toggle.checked = false;
	}

	const toggleTheme = () => {
		let isChecked = toggle.checked;

		if (isChecked) {
			body.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			body.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

	toggle.addEventListener("change", toggleTheme);
};
