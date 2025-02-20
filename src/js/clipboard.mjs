import { handleToggleModal } from "./modals.mjs";
import * as gtags from "./gtags.mjs";

export default async (shareModal, innerShareModal, inputEl) => {
	const showSuccess = () => {
		gtags.shared();
		const copiedAlertEl = document.createElement("div");
		copiedAlertEl.classList.add("modalAlert");
		copiedAlertEl.innerHTML = "<p>Copied!</p>";
		innerShareModal.appendChild(copiedAlertEl);
		setTimeout(async () => {
			await handleToggleModal(shareModal);
			setTimeout(() => {
				innerShareModal.removeChild(copiedAlertEl);
			}, 1000);
		}, 3000);
	};

	const showError = (err) => {
		gtags.error(err, "Clipboard failed to copy");
		const copiedAlertEl = document.createElement("div");
		copiedAlertEl.classList.add("modalAlert");
		copiedAlertEl.innerHTML = "<p>Failed to copy to clipboard</p>";
		innerShareModal.appendChild(copiedAlertEl);
		setTimeout(async () => {
			await handleToggleModal(shareModal);
			setTimeout(() => {
				innerShareModal.removeChild(copiedAlertEl);
			}, 1000);
		}, 3000);
	};

	inputEl.select();
	inputEl.setSelectionRange(0, 99999); // For mobile devices

	try {
		await navigator.clipboard.writeText(inputEl.value);
		showSuccess();
	} catch (err) {
		showError(err);
	}
};
