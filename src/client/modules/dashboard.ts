const gradients: string[] = [
  "linear-gradient(to right, #0a2a88, #59cde9)",
  "linear-gradient(to right, #00c996, #003d4d)",
  "linear-gradient(to right, #3300fc, #95008a, #eb0000)",
  "linear-gradient(to right, #ef9393, #e17dc2, #998ee0, #43add0, #8bdeda)",
  "linear-gradient(to right, #fdcf58, #ff0000)",
  "linear-gradient(to right, #240b36, #c31432)",
  "linear-gradient(to right, #8f94fb, #4e54c8)",
  "linear-gradient(to right, #3c1053, #ad5389)",
];

function applyRandomGradient(): void {
  const randomIndex: number = Math.floor(Math.random() * gradients.length);
  const randomGradient: string =
    gradients[randomIndex] ?? "linear-gradient(to right, #0a2a88, #59cde9)";

  const progressBar = document.getElementById(
    "dayProgress",
  ) as HTMLElement | null;

  if (progressBar) {
    progressBar.style.background = randomGradient;
  }
}

export { applyRandomGradient };