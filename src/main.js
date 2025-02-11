import accordions from "./js/accordion.mjs";
import cycleTitle from "./js/cycleTitle.mjs";

const accordionsArr = [
  {
    trayId: "#coverLetter",
    toggleId: "#coverLetterToggle",
    caretId: "#coverLetterCaret",
  },
  {
    trayId: "#toolset",
    toggleId: "#toolsetToggle",
    caretId: "#toolsetCaret",
  },
  {
    trayId: "#experience",
    toggleId: "#experienceToggle",
    caretId: "#experienceCaret",
  },
  {
    trayId: "#summary",
    toggleId: "#summaryToggle",
    caretId: "#summaryCaret",
  },
  {
    trayId: "#portfolio",
    toggleId: "#portfolioToggle",
    caretId: "#portfolioCaret",
  },
];

const titlesArr = [
  "Digital Maker",
  "Creative Director",
  "Frontend Developer",
  "Sr. Art Director",
  "Print / CPG Designer",
  "UX / UI Designer",
  "Motion Designer",
  "Video Editor",
  "3D Modeler",
];

document.addEventListener("DOMContentLoaded", async () => {
  accordions(accordionsArr);
  cycleTitle("#headerTitle", titlesArr, 2);
});
