import gsap from "gsap";
export default async (titleId = "", titleArr = [""], delay = 1) => {
  const title = document.querySelector(titleId);

  const titleElsArr = [];

  if (!title) return console.error("Title element not found");

  const populateSingleTitle = async () => {
    return (title.innerHTML = titleArr[0]);
  };

  const handleCycleVert = () => {
    for (let i = 0; i < titleArr.length; i++) {
      const titleStr = titleArr[i + 1] || titleArr[0];
      if (title.innerHTML === titleArr[i] || title.innerHTML === "") {
        title.innerHTML = titleStr;
        break;
      }
    }
  };

  const animateHoriz = () => {
    const distance =
      parseFloat(
        window.getComputedStyle(titleElsArr[titleElsArr.length - 1]).width,
      ) * -1;
    const tl = gsap.timeline({
      onComplete: handleCycleHoriz,
    });
    tl.to(titleElsArr[0], {
      opacity: 0,
      x: distance,
      duration: 0.5,
      ease: "power4.inOut",
      onComplete: () => {
        titleElsArr[0].remove();
      },
    });
    tl.to(
      ".inactive",
      {
        opacity: 1,
        x: distance,
        duration: 0.5,
        ease: "power4.inOut",
      },
      "<",
    );
  };

  const animateVert = () => {
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0,
      onRepeat: handleCycleVert,
    });
    tl.fromTo(
      title,
      {
        opacity: 0,
        y: "20px",
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power4.inOut",
      },
    );
    tl.to(title, { y: "-20px", opacity: 0, duration: 0.25, delay });
  };

  await populateSingleTitle();
  animateVert();
};
