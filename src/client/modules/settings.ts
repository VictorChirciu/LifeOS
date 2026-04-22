function initSettings(): void {
  initAvatarUpload();
  initEditButtons();
  document
    .getElementById("saveSettingsBtn")
    ?.addEventListener("click", saveSettings);
  document
    .getElementById("cancelSettingsBtn")
    ?.addEventListener("click", closeSettings);

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    const modal = document.getElementById("settingsModal");
    if (e.key === "Escape" && !modal?.classList.contains("hidden")) {
      closeSettings();
    }
  });
}

function closeSettings(): void {
  document.getElementById("settingsModal")?.classList.add("hidden");
}

function initAvatarUpload(): void {
  document.getElementById("fileInput")?.addEventListener("change", (e) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      (document.getElementById("avatarInput") as HTMLInputElement).value =
        base64;
      document.getElementById("avatarPreview")!.innerHTML =
        `<img src="${base64}" class="w-full h-full object-cover rounded-full" />`;
    };
    reader.readAsDataURL(file);
  });
}

function initEditButtons(): void {
  document
    .querySelectorAll<HTMLButtonElement>("[data-edit-toggle]")
    .forEach((btn) => {
      btn.addEventListener("click", () => toggleEdit(btn));
    });

  document
    .querySelector<HTMLButtonElement>("[data-password-toggle]")
    ?.addEventListener("click", (e) =>
      togglePasswordEdit(e.currentTarget as HTMLButtonElement),
    );
}

function toggleEdit(btn: HTMLButtonElement): void {
  const input = btn.previousElementSibling as HTMLInputElement;
  const isEditing = btn.textContent?.trim() === "✓";
  input.disabled = isEditing;
  input.classList.toggle("bg-gray-100", isEditing);
  input.classList.toggle("bg-white", !isEditing);
  if (!isEditing) input.focus();
  btn.textContent = isEditing ? "Editează" : "✓";
}

function togglePasswordEdit(btn: HTMLButtonElement): void {
  const input = btn.previousElementSibling!.querySelector(
    "input",
  ) as HTMLInputElement;
  const isEditing = btn.textContent?.trim() === "✓";
  input.disabled = isEditing;
  input.classList.toggle("bg-gray-100", isEditing);
  input.classList.toggle("bg-white", !isEditing);
  if (!isEditing) {
    input.value = "";
    input.focus();
  }
  btn.textContent = isEditing ? "Editează" : "✓";
}

async function saveSettings(): Promise<void> {
  const form = document.getElementById("settingsForm") as HTMLFormElement;
  if (!form) return;

  const disabledInputs =
    form.querySelectorAll<HTMLInputElement>("input:disabled");
  disabledInputs.forEach((i) => (i.disabled = false));
  const formData = new FormData(form);
  const rawdata = Object.fromEntries(formData.entries());
  disabledInputs.forEach((i) => (i.disabled = true));
  const data = {
    ...rawdata,
    darkMode: formData.get("darkMode") === "on",
    theme: formData.get("theme") || undefined,
  };
  if (!rawdata.password || String(rawdata.password).trim() === "")
    delete rawdata.password;

  const response = await fetch("/user/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    closeSettings();
    window.location.reload();
  } else {
    const err = await response.json();
    alert(err.message || "Eroare la salvare.");
  }
}

export { initSettings };
