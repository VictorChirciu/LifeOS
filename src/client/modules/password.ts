export function initPasswordToggle(): void {
  document
    .querySelectorAll<HTMLButtonElement>(".password-toggle")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = btn.previousElementSibling as HTMLInputElement;
        const img = btn.querySelector("img")!;
        if (input.type === "password") {
          input.type = "text";
          img.src = "/images/eye.png";
        } else {
          input.type = "password";
          img.src = "/images/hidden.png";
        }
      });
    });
}
