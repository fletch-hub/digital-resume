import gsap from "gsap";
export default async (titleId = "", titleArr = [""], delay = 1) => {
  const title = document.querySelector(titleId);

  if (!title) return console.error("Title element not found");

  const populateTitle = async () => {
    return (title.innerHTML = titleArr[0]);
  };

  const handleCycle = () => {
    for (let i = 0; i < titleArr.length; i++) {
      const titleStr = titleArr[i + 1] || titleArr[0];
      if (title.innerHTML === titleArr[i] || title.innerHTML === "") {
        title.innerHTML = titleStr;
        break;
      }
    }
  };

  const animate = () => {
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0,
      onRepeat: handleCycle,
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

  await populateTitle();
  animate();
};
