import gsap from "gsap";
export default async (titleId = "", titleArr = [""], delay = 1) => {
  const title = document.querySelector(titleId);

  const titleElsArr = [];

  if (!title) return console.error("Title element not found");

  const populateHorizTitles = async () => {
    //create a new <p> element for each titleStr and append it to the title element
    for (let i = 0; i < titleArr.length; i++) {
      const newTitleEl = document.createElement("p");
      newTitleEl.innerHTML = titleArr[i];
      newTitleEl.classList.add("title");
      title.appendChild(newTitleEl);
      titleElsArr.push(newTitleEl);
      if (i === 0) {
        newTitleEl.classList.add("active");
      }
    }
  };

  const getWidthOfFirstEl = (firstEl) => {
    return firstEl.getBoundingClientRect().width;
  };

  const animateTitles = () => {
    let firstEl = title.querySelector("p");
    firstEl.classList.add("active");
    let firstElWidth = getWidthOfFirstEl(firstEl);
    const tl = gsap.timeline({
      repeat: -1,
      onRepeat: () => {
        tl.invalidate();
        firstEl = title.querySelector("p");
        firstElWidth = getWidthOfFirstEl(firstEl);
      },
    });
    //tl.set(firstEl, { width: firstElWidth });
    tl.fromTo(
      titleElsArr,
      { x: 0 },
      {
        x: () => (firstElWidth + 15) * -1,
        duration: 1,
        ease: "power4.inOut",
        onComplete: () => {
          const firstEl = title.querySelector("p");
          firstEl.classList.remove("active");
          firstEl.classList.add("inactive");
          firstEl.remove();
          title.appendChild(firstEl);
        },
      },
    );
  };

  await populateHorizTitles();
  animateTitles();
};
