import { handleToggleModal } from "./modals.mjs";
import * as gtags from "./gtags.mjs";

export default async () => {
	const contactForm = document.querySelector("#contactForm");
	contactForm.addEventListener("submit", handleSubmit);
};

const handleSubmit = async (e) => {
	e.preventDefault();

	const contactForm = e.target;
	const formData = new FormData(contactForm);

	try {
		await fetch("/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams(formData).toString(),
		});
		showSuccess();
		contactForm.reset();
	} catch (err) {
		showError(err);
	}
};

const showSuccess = () => {
	const contactModal = document.querySelector("#contactModal");
	const innerContactModal = contactModal.querySelector(".modalInner");
	const submittedAlertEl = document.createElement("div");
	submittedAlertEl.classList.add("modalAlert");
	submittedAlertEl.innerHTML = "<p>Submitted!<br/>Thanks for reaching out.</p>";
	innerContactModal.appendChild(submittedAlertEl);

	setTimeout(async () => {
		await handleToggleModal(contactModal);
		setTimeout(() => {
			innerContactModal.removeChild(submittedAlertEl);
		}, 1000);
	}, 3000);
};

const showError = (err) => {
	gtags.error(err, "Contact form failed to submit");
	const contactModal = document.querySelector("#contactModal");
	const innerContactModal = contactModal.querySelector(".modalInner");
	const submittedAlertEl = document.createElement("div");
	submittedAlertEl.classList.add("modalAlert");
	submittedAlertEl.innerHTML =
		"<p>There was an error submitting your message. I've been alerted and will investigate the problem. Please try again later.</p>";
	innerContactModal.appendChild(submittedAlertEl);

	setTimeout(async () => {
		await handleToggleModal(contactModal);
		setTimeout(() => {
			innerContactModal.removeChild(submittedAlertEl);
		}, 1000);
	}, 3000);
};
