import gsap from "gsap";
import * as gtags from "./gtags.mjs";
export default async () => {
  const navShade = document.querySelector("#navShade");
  const shareBtn = document.querySelector("#shareBtn");
  const contactBtn = document.querySelector("#contactBtn");
  const shareModal = document.querySelector("#shareModal");
  const innerShareModal = shareModal.querySelector(".modalInner");

  const copyBtn = shareModal.querySelector("#copyLink");
  const urlInput = shareModal.querySelector("#shareLink");

  const contactModal = document.querySelector("#contactModal");
  const innerContactModal = contactModal.querySelector(".modalInner");
  const formSubmitBtn = contactModal.querySelector("button[type='submit']");

  const reducedMotion = window.reducedMotion || false;

  const handleToggleModal = async (modalEl) => {
    const tl = gsap.timeline();
    const duration = reducedMotion ? 0 : 0.5;

    if (modalEl.getAttribute("data-collapsed") === "true") {
      tl.set("nav", { opacity: 0.5, pointerEvents: "none" });
      tl.set(modalEl, { display: "grid" });
      tl.set(navShade, { display: "block" }, "<");
      tl.to(modalEl, {
        opacity: 1,
        duration,
        ease: "power4.out",
      });
      tl.to(
        navShade,
        {
          opacity: 0.75,
          duration,
          ease: "power4.out",
        },
        "<",
      );
      return modalEl.setAttribute("data-collapsed", "false");
    } else {
      tl.to(modalEl, {
        opacity: 0,
        duration,
        ease: "power4.out",
      });
      tl.to(
        navShade,
        {
          opacity: 0,
          duration,
          ease: "power4.out",
        },
        "<",
      );
      tl.to("nav", { opacity: 1, pointerEvents: "all" }, "<");
      tl.set(modalEl, { display: "none", delay: -0.3 });
      tl.set(navShade, { display: "none", opacity: 0 }, "<");
      return modalEl.setAttribute("data-collapsed", "true");
    }
  };

  const modalWraps = document.querySelectorAll(".modalWrap");

  modalWraps.forEach((modalWrap) => {
    modalWrap.addEventListener("click", async (e) => {
      if (
        e.target.localName !== "input" &&
        e.target.localName !== "button" &&
        e.target.localName !== "textarea" &&
        !e.target.classList.contains("modalInner") &&
        !e.target.parentElement.classList.contains("modalInner")
      ) {
        await handleToggleModal(modalWrap);
      }
    });
  });

  shareBtn.addEventListener("click", () => {
    handleToggleModal(shareModal);
  });
  copyBtn.addEventListener("click", () =>
    copyToClipboard(shareModal, innerShareModal, urlInput, handleToggleModal),
  );
  contactBtn.addEventListener("click", () => handleToggleModal(contactModal));
  formSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    submitForm(contactModal, innerContactModal, handleToggleModal);
  });
};

const submitForm = async (contactModal, innerContactModal, callback) => {
  const submittedAlertEl = document.createElement("div");
  submittedAlertEl.classList.add("modalAlert");
  submittedAlertEl.innerHTML = "<p>Submitted!<br/>Thanks for reaching out.</p>";
  innerContactModal.appendChild(submittedAlertEl);
  setTimeout(async () => {
    const contactForm = document.querySelector("#contactForm");
    contactForm.submit();
    callback(formEl);
    innerContactModal.removeChild(copiedAlertEl);
  }, 1000);
};

const copyToClipboard = async (
  shareModal,
  innerShareModal,
  inputEl,
  callback,
) => {
  inputEl.select();
  inputEl.setSelectionRange(0, 99999); // For mobile devices

  try {
    gtags.shared();
    const copiedAlertEl = document.createElement("div");
    copiedAlertEl.classList.add("modalAlert");
    copiedAlertEl.innerHTML = "<p>Copied!</p>";
    await navigator.clipboard.writeText(inputEl.value);
    innerShareModal.appendChild(copiedAlertEl);
    setTimeout(async () => {
      callback(shareModal);
      innerShareModal.removeChild(copiedAlertEl);
    }, 1000);
  } catch (err) {
    alert("Failed to copy to clipboard");
    console.error(err);
  }
};
