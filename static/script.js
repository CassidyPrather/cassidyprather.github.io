const spinner = document.querySelector("[data-spinner]");
const spinButton = document.querySelector("[data-spin-button]");

let currentSpin = 0;

spinButton?.addEventListener("click", () => {
  currentSpin += 90 + Math.floor(Math.random() * 4) * 90;
  spinner?.style.setProperty("--spin", `${currentSpin}deg`);
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  const value = button.getAttribute("data-copy");
  const label = button.querySelector("[data-copy-text]");
  const original = label?.textContent ?? "";
  if (!value) return;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(value);
      button.classList.add("is-copied");
      if (label) label.textContent = `Copied: ${value}`;
      setTimeout(() => {
        button.classList.remove("is-copied");
        if (label) label.textContent = original;
      }, 1800);
    } catch {
      if (label) label.textContent = value;
    }
  });
});
