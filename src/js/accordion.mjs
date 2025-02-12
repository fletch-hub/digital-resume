import gsap from "gsap";
export default (accordionArr = []) => {
  const togglerLinks = document.querySelectorAll("[data-toggle]");

  const reducedMotion = window.reducedMotion || false;

  togglerLinks.forEach((link) => {
    const idToClick = link.getAttribute("data-toggle");
    const toggleEl = document.querySelector(idToClick);
    const idToScrollTo = link.getAttribute("data-scroll-to");
    const scrollToEl = document.querySelector(idToScrollTo);

    if (!toggleEl) {
      console.warn(`Element not found for selector: ${toggleToClick}`);
      return;
    }
    link.addEventListener("click", (e) => {
      if (e.target === link) {
        const mainWrap = document.querySelector("#mainWrap");
        const linkY = link.getBoundingClientRect().top;
        const scrollToElY = scrollToEl.getBoundingClientRect().top;
        const deltaY = scrollToElY - linkY;

        scrollToEl.classList.add("highlight");
        setTimeout(() => {
          scrollToEl.classList.remove("highlight");
        }, 20000);

        mainWrap.scrollBy({
          top: deltaY + 200,
          left: 0,
          behavior: reducedMotion ? "instant" : "smooth",
        });
      }
    });
  });

  accordionArr.map((accordion) => {
    const { trayId, toggleId, caretId } = accordion;

    const tray = document.querySelector(trayId);
    const toggler = document.querySelector(toggleId);
    const caret = document.querySelector(caretId);

    let collapsed = tray.getAttribute("data-collapsed");

    if (collapsed === "false") {
      caret.style.transform = "rotate(180deg)";
    } else {
      tray.style.height = "60px";
    }

    const handleToggle = () => {
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
      } else {
        tl.set(tray, { overflow: "hidden" });
        tl.to(tray, {
          height: "60px",
          duration,
          ease: "power2.inOut",
        });
        tl.to(caret, { rotate: 0, duration }, "<");
        tray.setAttribute("data-collapsed", true);
      }
    };

    toggler.addEventListener("click", () => handleToggle());
  });
};
