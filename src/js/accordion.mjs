import gsap from "gsap";
import * as gtags from "./gtags.mjs";
export default (accordionArr = []) => {
  const reducedMotion = window.reducedMotion || false;

  accordionArr.map((accordion) => {
    const { trayId, toggleId, caretId } = accordion;

    const tray = document.querySelector(trayId);
    const toggler = document.querySelector(toggleId);
    const caret = document.querySelector(caretId);

    let collapsed = tray.getAttribute("data-collapsed");

    if (collapsed === "false") {
      caret.style.transform = "rotate(180deg)";
    } else {
      tray.style.height = "80px";
    }

    toggler.addEventListener("click", () => handleToggle(tray, caret));
  });
};

export const handleToggle = (tray, caret) => {
  console.log("clicked");
  const tl = gsap.timeline();

  const duration = reducedMotion ? 0 : 0.5;

  if (tray.getAttribute("data-collapsed") === "true") {
    tl.to(tray, {
      height: "auto",
      duration,
      ease: "power2.inOut",
    });
    tl.to(caret, { rotate: 180, duration }, "<");
    tl.set(tray, { overflow: "visible" });
    tray.setAttribute("data-collapsed", false);
    gtags.tabOpened(tray.id.toString());
  } else {
    tl.set(tray, { overflow: "hidden" });
    tl.to(tray, {
      height: "80px",
      duration,
      ease: "power2.inOut",
    });
    tl.to(caret, { rotate: 0, duration }, "<");
    tray.setAttribute("data-collapsed", true);
  }
};
