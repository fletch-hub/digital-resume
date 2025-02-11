import gsap from "gsap";
export default (accordionArr = []) => {
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

      if (tray.getAttribute("data-collapsed") === "true") {
        tl.to(tray, {
          height: "auto",
          duration: 0.5,
          ease: "power2.inOut",
        });
        tl.to(caret, { rotate: 180, duration: 0.5 }, "<");
        tray.setAttribute("data-collapsed", false);
      } else {
        tl.to(tray, {
          height: "60px",
          duration: 0.5,
          ease: "power2.inOut",
        });
        tl.to(caret, { rotate: 0, duration: 0.5 }, "<");
        tray.setAttribute("data-collapsed", true);
      }
    };

    toggler.addEventListener("click", () => handleToggle());
  });
};
