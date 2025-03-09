import Util from "./_util.mjs";

export default class Contact extends Util {
	constructor() {
		super();
		this.contactForm = document.querySelector("#contactForm");
		this.contactForm.addEventListener("submit", this.handleSubmit);
	}

	async handleSubmit(e) {
		e.preventDefault();

		const contactForm = e.target;
		const formData = new FormData(contactForm);

		try {
			await fetch("/", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams(formData).toString(),
			});
			this.showSuccess();
			contactForm.reset();
		} catch (err) {
			this.showError(err);
		}
	}

	showSuccess() {
		const contactModal = document.querySelector("#contactModal");
		const innerContactModal = contactModal.querySelector(".modalInner");
		const submittedAlertEl = document.createElement("div");
		submittedAlertEl.classList.add("modalAlert");
		submittedAlertEl.innerHTML = "<p>Submitted!<br/>Thanks for reaching out.</p>";
		innerContactModal.appendChild(submittedAlertEl);

		setTimeout(async () => {
			await this.handleToggleModal(contactModal);
			setTimeout(() => {
				innerContactModal.removeChild(submittedAlertEl);
			}, 1000);
		}, 3000);
	}

	showError(err) {
		this.analytics.error(err, "Contact form failed to submit");
		const contactModal = document.querySelector("#contactModal");
		const innerContactModal = contactModal.querySelector(".modalInner");
		const submittedAlertEl = document.createElement("div");
		submittedAlertEl.classList.add("modalAlert");
		submittedAlertEl.innerHTML =
			"<p>There was an error submitting your message. I've been alerted and will investigate the problem. Please try again later.</p>";
		innerContactModal.appendChild(submittedAlertEl);

		setTimeout(async () => {
			await this.handleToggleModal(contactModal);
			setTimeout(() => {
				innerContactModal.removeChild(submittedAlertEl);
			}, 1000);
		}, 3000);
	}
}
