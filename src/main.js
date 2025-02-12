import accordions from "./js/accordion.mjs";
import cycleTitle from "./js/cycleTitle.mjs";
import nav from "./js/nav.mjs";
import modals from "./js/modals.mjs";

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
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  window.reducedMotion = reducedMotion.matches;
  reducedMotion.addEventListener("change", () => {
    window.reducedMotion = reducedMotion.matches;
  });

  accordions(accordionsArr);
  cycleTitle("#headerTitle", titlesArr, 1);
  nav();
  modals();
});
