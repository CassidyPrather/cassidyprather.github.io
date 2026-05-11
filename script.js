const spinner = document.querySelector("[data-spinner]");
const spinButton = document.querySelector("[data-spin-button]");

let currentSpin = 0;

spinButton?.addEventListener("click", () => {
  currentSpin += 90 + Math.floor(Math.random() * 4) * 90;
  spinner?.style.setProperty("--spin", `${currentSpin}deg`);
});
