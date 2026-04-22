function validateForm(action: string): void {
  const form = document.querySelector<HTMLFormElement>(
    `form[action='${action}']`,
  );
  if (!form) return;

  form.addEventListener("submit", (e) => {
    const result =
      action === "/auth" ? validateAuth(form) : validateRegister(form);
    if (!result.valid) {
      e.preventDefault();
      showError(form, result.error);
    }
  });
}

function validateAuth(form: HTMLFormElement): {
  valid: boolean;
  error: string;
} {
  const email = form.querySelector<HTMLInputElement>("#email")!.value.trim();
  const password = form
    .querySelector<HTMLInputElement>("#password")!
    .value.trim();

  if (!email.includes("@")) return { valid: false, error: "Email invalid." };
  if (password.length < 6)
    return {
      valid: false,
      error: "Parola trebuie să aibă cel puțin 6 caractere.",
    };
  return { valid: true, error: "" };
}

function validateRegister(form: HTMLFormElement): {
  valid: boolean;
  error: string;
} {
  const username = form
    .querySelector<HTMLInputElement>("#username")!
    .value.trim();
  const email = form.querySelector<HTMLInputElement>("#email")!.value.trim();
  const password = form
    .querySelector<HTMLInputElement>("#password")!
    .value.trim();
  const birthdate = form.querySelector<HTMLInputElement>("#birthdate")!.value;
  const age = new Date().getFullYear() - new Date(birthdate).getFullYear();

  if (username.length < 3)
    return {
      valid: false,
      error: "Numele trebuie să aibă cel puțin 3 caractere.",
    };
  if (!email.includes("@")) return { valid: false, error: "Email invalid." };
  if (password.length < 6)
    return {
      valid: false,
      error: "Parola trebuie să aibă cel puțin 6 caractere.",
    };
  if (!birthdate)
    return { valid: false, error: "Introduceți data de naștere." };
  if (age < 5 || age > 100) return { valid: false, error: "Vârstă invalidă." };
  return { valid: true, error: "" };
}

function showError(form: HTMLFormElement, message: string): void {
  let error = form.querySelector<HTMLParagraphElement>(".client-error");
  if (!error) {
    error = document.createElement("p");
    error.className = "client-error";
    error.style.cssText =
      "color: #ef4444; font-size: 0.875rem; margin-bottom: 1rem; font-weight: 600;";
    form.querySelector("button[type='submit']")!.before(error);
  }
  error.textContent = message;
  setTimeout(() => {
    error?.remove();
  }, 5000);
}

export { validateForm };
